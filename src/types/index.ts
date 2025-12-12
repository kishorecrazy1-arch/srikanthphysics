export type CourseType =
  | 'ap_physics_1'
  | 'ap_physics_2'
  | 'ap_physics_c_mechanics'
  | 'ap_physics_c_em'
  | 'ib_physics'
  | 'aqa_physics'
  | 'igcse'
  | 'iit_jee'
  | 'neet'
  | 'imat'
  | 'cbse'
  | 'icse'
  | 'quantum_mechanics';

export type QuizType = 'morning_pulse' | 'homework' | 'challenge';

export type QuizStatus = 'pending' | 'in_progress' | 'completed';

export type SubscriptionStatus = 'free' | 'paid' | 'trial' | 'expired';

export interface User {
  id: string;
  name: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  grade: number;
  courseType: CourseType;
  currentStreak: number;
  longestStreak: number;
  totalQuestions: number;
  correctAnswers: number;
  skillLevel: number;
  createdAt: string;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionExpiresAt?: string;
  paymentDate?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  topic: string;
  difficulty: number;
  questionText: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation: string;
  keyConcept: string;
}

export interface TopicMastery {
  topic: string;
  mastery: number;
  questionsAttempted: number;
  questionsCorrect: number;
  lastPracticed: string;
}

export interface DailyQuiz {
  date: string;
  type: QuizType;
  status: QuizStatus;
  questionIds: number[];
  score: number | null;
  timeSpent: number;
}

export interface QuizAnswer {
  questionId: number;
  selectedAnswer: string;
  confidence: number;
  timeSpent: number;
  isCorrect: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  topic: string;
  reminderEnabled: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  score: number;
  streak: number;
}
