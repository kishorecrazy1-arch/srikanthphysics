/**
 * Enhanced TypeScript types for question system
 */

export type QuestionType = 'MCQ' | 'FRQ' | 'Graph' | 'Diagram';
export type DifficultyLevel = 'Foundation' | 'Intermediate' | 'Advanced';
export type SourceAPI = 'GPT-4o' | 'Claude-3.5';

export interface Question {
  id: string;
  subtopic_id: string;
  question_type: QuestionType;
  difficulty_level: DifficultyLevel;
  content: QuestionContent;
  solution: Solution;
  metadata: QuestionMetadata;
  created_at: string;
  source_api: SourceAPI;
}

export interface QuestionContent {
  text: string;
  options?: Record<string, string>;
  scenario: string;
  formulas: string[];
}

export interface Solution {
  steps: string[];
  final_answer: string;
  rubric?: RubricItem[];
  misconceptions: Record<string, string>;
}

export interface RubricItem {
  part: string;
  points: number;
  criteria: string;
}

export interface QuestionMetadata {
  bloom_taxonomy: string;
  time_estimate: number;
  topic_tags: string[];
  difficulty_score: number;
  student_success_rate: number;
}

export interface APIUsageLog {
  id: string;
  service: 'openai' | 'anthropic';
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  status: 'success' | 'failed' | 'cached';
  created_at: string;
}

export interface QuestionCache {
  id: string;
  cache_key: string;
  question_data: Question[];
  expires_at: string;
  created_at: string;
}

export interface CostAnalysis {
  total_cost: number;
  total_tokens: number;
  cost_by_service: Record<string, number>;
  cost_by_model: Record<string, number>;
  daily_breakdown: Array<{ date: string; cost: number }>;
  recommendations: string[];
}






















