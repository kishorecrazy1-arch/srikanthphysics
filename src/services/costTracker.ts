/**
 * Cost Tracker Service
 * 
 * Features:
 * - Monitor API spending per user, per day, per month
 * - Generate cost reports
 * - Identify optimization opportunities
 * - Alert on threshold exceeded
 */

import { supabase } from '../lib/supabase';
import type { CostAnalysis, APIUsageLog } from '../types/enhanced';

export class CostTracker {
  private readonly DAILY_THRESHOLD = 50; // $50 per day
  private readonly MONTHLY_THRESHOLD = 1000; // $1000 per month

  /**
   * Track API call for cost monitoring
   */
  async trackAPICall(
    service: 'openai' | 'anthropic',
    model: string,
    tokens: { input_tokens: number; output_tokens: number },
    userId?: string
  ): Promise<void> {
    // Calculate cost based on model
    const cost = this.calculateCost(service, model, tokens);

    // Store in database
    try {
      await supabase.from('api_usage_logs').insert({
        service,
        model,
        input_tokens: tokens.input_tokens,
        output_tokens: tokens.output_tokens,
        cost,
        status: 'success',
        created_at: new Date().toISOString(),
        user_id: userId || null
      });

      // Check thresholds
      await this.checkThresholds(userId);
    } catch (error) {
      console.error('Failed to track API call:', error);
    }
  }

  /**
   * Calculate cost based on model and tokens
   */
  private calculateCost(
    service: 'openai' | 'anthropic',
    model: string,
    tokens: { input_tokens: number; output_tokens: number }
  ): number {
    // Pricing per 1M tokens (as of 2024)
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-4o': { input: 2.50, output: 10.00 },
      'gpt-4-turbo': { input: 10.00, output: 30.00 },
      'claude-3-5-sonnet': { input: 3.00, output: 15.00 },
      'claude-3-opus': { input: 15.00, output: 75.00 }
    };

    const modelPricing = pricing[model] || { input: 0, output: 0 };
    const inputCost = (tokens.input_tokens / 1_000_000) * modelPricing.input;
    const outputCost = (tokens.output_tokens / 1_000_000) * modelPricing.output;
    
    return inputCost + outputCost;
  }

  /**
   * Check if spending exceeds thresholds
   */
  private async checkThresholds(userId?: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);

    // Check daily spending
    const { data: dailyLogs } = await supabase
      .from('api_usage_logs')
      .select('cost')
      .gte('created_at', today)
      .eq('user_id', userId || null);

    const dailyCost = dailyLogs?.reduce((sum, log) => sum + log.cost, 0) || 0;
    
    if (dailyCost > this.DAILY_THRESHOLD) {
      console.warn(`⚠️ Daily spending threshold exceeded: $${dailyCost.toFixed(2)}`);
      // Could send alert/notification here
    }

    // Check monthly spending
    const { data: monthlyLogs } = await supabase
      .from('api_usage_logs')
      .select('cost')
      .gte('created_at', `${thisMonth}-01`)
      .lt('created_at', `${thisMonth}-32`)
      .eq('user_id', userId || null);

    const monthlyCost = monthlyLogs?.reduce((sum, log) => sum + log.cost, 0) || 0;
    
    if (monthlyCost > this.MONTHLY_THRESHOLD) {
      console.warn(`⚠️ Monthly spending threshold exceeded: $${monthlyCost.toFixed(2)}`);
      // Could send alert/notification here
    }
  }

  /**
   * Generate comprehensive cost analysis report
   */
  async generateCostReport(userId?: string, startDate?: string, endDate?: string): Promise<CostAnalysis> {
    let query = supabase
      .from('api_usage_logs')
      .select('*')
      .eq('status', 'success');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: logs } = await query;

    if (!logs || logs.length === 0) {
      return {
        total_cost: 0,
        total_tokens: 0,
        cost_by_service: {},
        cost_by_model: {},
        daily_breakdown: [],
        recommendations: []
      };
    }

    // Calculate totals
    const totalCost = logs.reduce((sum, log) => sum + log.cost, 0);
    const totalTokens = logs.reduce((sum, log) => sum + log.input_tokens + log.output_tokens, 0);

    // Cost by service
    const costByService: Record<string, number> = {};
    logs.forEach(log => {
      costByService[log.service] = (costByService[log.service] || 0) + log.cost;
    });

    // Cost by model
    const costByModel: Record<string, number> = {};
    logs.forEach(log => {
      costByModel[log.model] = (costByModel[log.model] || 0) + log.cost;
    });

    // Daily breakdown
    const dailyBreakdown: Record<string, number> = {};
    logs.forEach(log => {
      const date = log.created_at.split('T')[0];
      dailyBreakdown[date] = (dailyBreakdown[date] || 0) + log.cost;
    });

    const dailyBreakdownArray = Object.entries(dailyBreakdown).map(([date, cost]) => ({
      date,
      cost
    }));

    // Generate recommendations
    const recommendations = this.generateRecommendations(logs, totalCost, costByService, costByModel);

    return {
      total_cost: totalCost,
      total_tokens: totalTokens,
      cost_by_service: costByService,
      cost_by_model: costByModel,
      daily_breakdown: dailyBreakdownArray,
      recommendations
    };
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(
    logs: APIUsageLog[],
    totalCost: number,
    costByService: Record<string, number>,
    costByModel: Record<string, number>
  ): string[] {
    const recommendations: string[] = [];

    // Check cache effectiveness
    const cachedCount = logs.filter(l => l.status === 'cached').length;
    const cacheRate = cachedCount / logs.length;
    
    if (cacheRate < 0.3) {
      recommendations.push('Consider increasing cache TTL to reduce API calls');
    }

    // Check model usage
    const expensiveModels = Object.entries(costByModel)
      .filter(([_, cost]) => cost > totalCost * 0.3)
      .map(([model]) => model);

    if (expensiveModels.length > 0) {
      recommendations.push(`Consider using cheaper models for simple questions: ${expensiveModels.join(', ')}`);
    }

    // Check service distribution
    const openaiCost = costByService['openai'] || 0;
    const anthropicCost = costByService['anthropic'] || 0;
    
    if (openaiCost > anthropicCost * 2) {
      recommendations.push('Consider using Claude for MCQ generation to balance costs');
    }

    // Check for high-cost days
    const avgDailyCost = totalCost / 30;
    if (avgDailyCost > 20) {
      recommendations.push('Daily spending is high - consider implementing rate limiting');
    }

    return recommendations;
  }

  /**
   * Get API usage stats
   */
  async getUsageStats(userId?: string, days: number = 30): Promise<{
    totalCost: number;
    totalTokens: number;
    avgDailyCost: number;
    topModels: Array<{ model: string; cost: number }>;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const report = await this.generateCostReport(userId, startDate.toISOString());
    
    return {
      totalCost: report.total_cost,
      totalTokens: report.total_tokens,
      avgDailyCost: report.total_cost / days,
      topModels: Object.entries(report.cost_by_model)
        .map(([model, cost]) => ({ model, cost }))
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 5)
    };
  }
}

























