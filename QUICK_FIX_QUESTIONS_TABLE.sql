-- QUICK FIX: Create questions table if missing
-- Run this in Supabase SQL Editor to fix the error

-- Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID,
  subtopic_id UUID,
  question_type VARCHAR(50) NOT NULL DEFAULT 'MCQ',
  difficulty_level VARCHAR(20) NOT NULL DEFAULT 'Intermediate',
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer VARCHAR(1),
  solution_steps TEXT[] NOT NULL DEFAULT '{}'::text[],
  misconceptions JSONB DEFAULT '{}'::jsonb,
  formulas_used TEXT[] DEFAULT '{}'::text[],
  bloom_taxonomy VARCHAR(50),
  source_api VARCHAR(20),
  used_count INTEGER DEFAULT 0,
  avg_student_score NUMERIC(5,2) DEFAULT 0,
  segment_type VARCHAR(50),
  generated_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign keys if tables exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'topics') THEN
    ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS fk_questions_topic;
    ALTER TABLE public.questions
    ADD CONSTRAINT fk_questions_topic FOREIGN KEY (topic_id) REFERENCES public.topics(id) ON DELETE CASCADE;
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subtopics') THEN
    ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS fk_questions_subtopic;
    ALTER TABLE public.questions
    ADD CONSTRAINT fk_questions_subtopic FOREIGN KEY (subtopic_id) REFERENCES public.subtopics(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_questions_subtopic ON public.questions(subtopic_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_questions_type ON public.questions(question_type);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_generated_date ON public.questions(generated_date);
CREATE INDEX IF NOT EXISTS idx_questions_segment_type ON public.questions(segment_type);

-- Enable RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON public.questions;
CREATE POLICY "Questions are viewable by everyone"
  ON public.questions
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Questions are insertable by authenticated users" ON public.questions;
CREATE POLICY "Questions are insertable by authenticated users"
  ON public.questions
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Grant permissions
GRANT SELECT ON public.questions TO anon, authenticated;
GRANT INSERT ON public.questions TO authenticated;

-- Verify table was created
SELECT 
  'Questions table created successfully!' as status,
  COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'questions';

