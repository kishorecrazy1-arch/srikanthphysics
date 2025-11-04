export interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
  subtopics: string[];
  total_questions: number;
  display_order: number;
  color: string;
  created_at: string;
}

export interface TopicProgress {
  id: string;
  user_id: string;
  topic_id: string;
  mastery: number;
  questions_completed: number;
  questions_correct: number;
  last_practiced: string | null;
  streak_days: number;
  updated_at: string;
}

export interface Question {
  id: string;
  topic_id: string;
  segment_type: 'basics' | 'homework' | 'practice';
  question_text: string;
  options: QuestionOption[];
  difficulty: 'easy' | 'medium' | 'hard';
  question_type: 'conceptual' | 'calculation' | 'application';
  subtopic: string | null;
  explanation: QuestionExplanation | null;
  image_url: string | null;
  time_limit: number;
  ai_generated: boolean;
  generated_date: string | null;
  homework_id: string | null;
  created_at: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionExplanation {
  steps: ExplanationStep[];
  keyConcept: string;
  relatedFormulas?: string[];
}

export interface ExplanationStep {
  title: string;
  content: string;
}

export interface Homework {
  id: string;
  topic_id: string;
  title: string;
  uploaded_by: string | null;
  due_date: string | null;
  pdf_url: string | null;
  extracted_text: string | null;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
}

export interface UserAnswer {
  id: string;
  user_id: string;
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
  time_spent: number;
  answered_at: string;
}

export interface TopicWithProgress extends Topic {
  progress?: TopicProgress;
  status: 'mastered' | 'in-progress' | 'not-started';
}
