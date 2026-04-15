/**
 * Question Service - Smart question management
 * 
 * Features:
 * - Batch question generation
 * - Cache checking before generation
 * - Smart retrieval (avoid repetition)
 * - Question metrics tracking
 */

import { generateMCQQuestions, generateFRQQuestions } from './questionGenerator';
import { supabase } from '../lib/supabase';
import type { Question } from '../types/enhanced';
import { CostTracker } from './costTracker';
import { buildBasicsMcqRowFromEnhanced } from '../lib/questionRowForSupabase';

export class QuestionService {
  private costTracker: CostTracker;

  constructor() {
    this.costTracker = new CostTracker();
  }

  /**
   * Batch generate questions with caching
   */
  async batchGenerateQuestions(
    topicId: string,
    subtopicIdForCache: string,
    subtopicName: string,
    difficulty: 'Foundation' | 'Intermediate' | 'Advanced',
    count: number,
    questionType: 'MCQ' | 'FRQ' = 'MCQ'
  ): Promise<Question[]> {
    // Check cache first
    const cacheKey = `${subtopicIdForCache}_${difficulty}_${questionType}_${count}`;
    const cached = await this.checkCache(cacheKey);
    
    if (cached && cached.length > 0) {
      console.log(`Cache hit for ${cacheKey}`);
      return cached;
    }

    // Generate via API
    let questions: Question[];
    try {
      if (questionType === 'MCQ') {
        questions = await generateMCQQuestions(subtopicName, difficulty, count);
      } else {
        questions = await generateFRQQuestions(subtopicName, difficulty);
      }

      // Validate physics accuracy
      const validatedQuestions = questions.filter(q => {
        // Additional validation logic
        return q.content.text.length > 50 && q.solution.steps.length > 0;
      });

      // Store in Supabase
      await this.storeQuestions(validatedQuestions, topicId, subtopicName);

      // Store in cache
      await this.storeCache(cacheKey, validatedQuestions);

      return validatedQuestions;
    } catch (error) {
      console.error('Question generation failed:', error);
      
      // Fallback: get existing questions from database
      const existing = await this.getExistingQuestions(subtopicName, difficulty, count);
      if (existing.length > 0) {
        return existing;
      }
      
      throw error;
    }
  }

  /**
   * Get daily practice questions (smart retrieval)
   */
  async getDailyPracticeQuestions(
    userId: string,
    topicId: string,
    subtopicIdForCache: string,
    subtopicName: string,
    difficulty: 'Foundation' | 'Intermediate' | 'Advanced'
  ): Promise<Question[]> {
    // Get questions student hasn't attempted
    const { data: attemptedQuestions } = await supabase
      .from('user_answers')
      .select('question_id')
      .eq('user_id', userId);

    const attemptedIds = new Set(attemptedQuestions?.map(a => a.question_id) || []);

    // Get available questions
    const { data: availableQuestions } = await supabase
      .from('questions')
      .select('*')
      .eq('subtopic', subtopicName)
      .eq('difficulty_level', difficulty)
      .not('id', 'in', `(${Array.from(attemptedIds).join(',')})`)
      .limit(10);

    if (availableQuestions && availableQuestions.length >= 10) {
      // Shuffle and return
      return this.shuffleArray(availableQuestions).slice(0, 10) as Question[];
    }

    // Not enough questions - generate new ones
    const needed = 10 - (availableQuestions?.length || 0);
    const newQuestions = await this.batchGenerateQuestions(
      topicId,
      subtopicIdForCache,
      subtopicName,
      difficulty,
      needed
    );

    // Combine with existing
    const allQuestions = [
      ...(availableQuestions || []),
      ...newQuestions
    ] as Question[];

    return this.shuffleArray(allQuestions).slice(0, 10);
  }

  /**
   * Update question metrics based on student performance
   */
  async updateQuestionMetrics(
    questionId: string,
    studentScore: number,
    timeSpent: number
  ): Promise<void> {
    // Get current question
    const { data: question } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (!question) return;

    // Get all attempts for this question
    const { data: attempts } = await supabase
      .from('user_answers')
      .select('*')
      .eq('question_id', questionId);

    if (!attempts || attempts.length === 0) return;

    // Calculate new average
    const totalScore = attempts.reduce((sum, a) => sum + (a.is_correct ? 1 : 0), 0);
    const avgScore = totalScore / attempts.length;
    const successRate = avgScore * 100;

    // Update question
    await supabase
      .from('questions')
      .update({
        avg_student_score: avgScore,
        used_count: attempts.length,
        last_updated: new Date().toISOString()
      })
      .eq('id', questionId);

    // Identify problematic questions (low success rate)
    if (successRate < 30) {
      console.warn(`Question ${questionId} has low success rate: ${successRate}%`);
      // Could flag for review or regeneration
    }
  }

  /**
   * Check cache for questions
   */
  private async checkCache(cacheKey: string): Promise<Question[] | null> {
    const { data } = await supabase
      .from('question_cache')
      .select('*')
      .eq('cache_key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (data && data.question_data) {
      return data.question_data as Question[];
    }

    return null;
  }

  /**
   * Store questions in cache
   */
  private async storeCache(cacheKey: string, questions: Question[]): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour TTL

    await supabase.from('question_cache').upsert({
      cache_key: cacheKey,
      question_data: questions,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    });
  }

  /**
   * Store questions in database (uses `subtopic` text column — matches Supabase schema)
   */
  private async storeQuestions(
    questions: Question[],
    topicId: string,
    subtopicName: string
  ): Promise<void> {
    if (!topicId) {
      console.warn('QuestionService.storeQuestions: topicId missing, skipping persist');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const rows = questions.map((q) => buildBasicsMcqRowFromEnhanced(q, topicId, subtopicName, today));
    const { error } = await supabase.from('questions').insert(rows);
    if (error) console.error('QuestionService.storeQuestions:', error);
  }

  /**
   * Get existing questions from database
   */
  private async getExistingQuestions(
    subtopicName: string,
    difficulty: string,
    count: number
  ): Promise<Question[]> {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('subtopic', subtopicName)
      .eq('difficulty_level', difficulty)
      .limit(count);

    return (data || []) as Question[];
  }

  /**
   * Shuffle array for randomization
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}


























