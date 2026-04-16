/** Multi-syllabus daily engine — catalog + generation contracts (mirrors FastAPI + `dqe_*` tables). */

export type SyllabusKind = 'ap' | 'iit_jee' | 'cbse' | 'neet' | 'foundation';

export type DqeSyllabus = {
  id: string;
  slug: string;
  name: string;
  kind: SyllabusKind;
  display_order: number;
  created_at?: string;
};

export type DqeSubject = {
  id: string;
  syllabus_id: string;
  name: string;
  slug: string;
  display_order: number;
  created_at?: string;
};

export type DqeTopic = {
  id: string;
  subject_id: string;
  name: string;
  slug: string;
  display_order: number;
  created_at?: string;
};

export type DqeSubtopic = {
  id: string;
  topic_id: string;
  name: string;
  slug: string;
  display_order: number;
  created_at?: string;
};

export type DailyDifficulty = 'easy' | 'medium' | 'hard';

export type GenerateDailyBody = {
  subtopic_id: string;
  difficulty: DailyDifficulty;
  count: number;
  for_date?: string;
};

export type McqOptionRow = { id: string; text: string; isCorrect: boolean };

export type DqeQuestionRow = {
  id: string;
  syllabus_id: string;
  subject_id: string | null;
  topic_id: string | null;
  subtopic_id: string | null;
  difficulty: DailyDifficulty;
  question_text: string;
  options: McqOptionRow[] | unknown;
  correct_answer: string;
  explanation: unknown;
  concept_tag: string | null;
  generated_for_date: string | null;
  ai_provider: string | null;
  created_at?: string;
};
