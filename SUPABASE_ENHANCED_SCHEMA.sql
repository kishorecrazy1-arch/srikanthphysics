-- Enhanced Database Schema for Question Generation System
-- Run this in your Supabase SQL Editor

-- Enhanced Questions table with detailed structure
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  subtopic_id UUID REFERENCES public.subtopics(id) ON DELETE CASCADE,
  question_type VARCHAR(50) NOT NULL, -- 'MCQ', 'FRQ', 'Graph', 'Diagram'
  difficulty_level VARCHAR(20) NOT NULL, -- 'Foundation', 'Intermediate', 'Advanced'
  question_text TEXT NOT NULL,
  options JSONB, -- For MCQ: {"A": "...", "B": "...", "C": "...", "D": "..."}
  correct_answer VARCHAR(1),
  solution_steps TEXT[] NOT NULL,
  misconceptions JSONB DEFAULT '{}'::jsonb,
  formulas_used TEXT[] DEFAULT '{}'::text[],
  bloom_taxonomy VARCHAR(50),
  source_api VARCHAR(20), -- 'GPT-4o', 'Claude-3.5'
  used_count INTEGER DEFAULT 0,
  avg_student_score NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_subtopic ON public.questions(subtopic_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_questions_type ON public.questions(question_type);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic_id);

-- Question generation logs (for cost tracking & analytics)
CREATE TABLE IF NOT EXISTS public.api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service VARCHAR(50) NOT NULL, -- 'openai', 'anthropic'
  model VARCHAR(50) NOT NULL,
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  cost NUMERIC(10,4) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'success', 'failed', 'cached'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for API usage logs
CREATE INDEX IF NOT EXISTS idx_api_logs_user ON public.api_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_service ON public.api_usage_logs(service);
CREATE INDEX IF NOT EXISTS idx_api_logs_date ON public.api_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_api_logs_status ON public.api_usage_logs(status);

-- Caching layer for generated questions
CREATE TABLE IF NOT EXISTS public.question_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key VARCHAR(255) UNIQUE NOT NULL,
  question_data JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for cache lookups
CREATE INDEX IF NOT EXISTS idx_cache_key ON public.question_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON public.question_cache(expires_at);

-- Enhanced user_answers table (if not exists, add missing columns)
ALTER TABLE public.user_answers
ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER,
ADD COLUMN IF NOT EXISTS confidence_score NUMERIC(3,2),
ADD COLUMN IF NOT EXISTS attempt_number INTEGER DEFAULT 1;

-- Create view for question performance analysis
CREATE OR REPLACE VIEW public.question_performance_analysis AS
SELECT
  q.id,
  q.subtopic_id,
  q.difficulty_level,
  q.question_type,
  COUNT(ua.id) as attempts,
  AVG(CASE WHEN ua.is_correct THEN 1.0 ELSE 0.0 END) * 100 as success_rate,
  AVG(ua.time_spent_seconds) as avg_time_seconds,
  q.avg_student_score,
  q.used_count,
  q.source_api
FROM public.questions q
LEFT JOIN public.user_answers ua ON q.id = ua.question_id
GROUP BY q.id, q.subtopic_id, q.difficulty_level, q.question_type, q.avg_student_score, q.used_count, q.source_api;

-- Enable RLS on new tables
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for questions (public read, authenticated write)
DROP POLICY IF EXISTS "Questions are viewable by everyone" ON public.questions;
CREATE POLICY "Questions are viewable by everyone"
  ON public.questions
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Questions are insertable by authenticated users" ON public.questions;
CREATE POLICY "Questions are insertable by authenticated users"
  ON public.questions
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for API usage logs (users can only see their own)
DROP POLICY IF EXISTS "API logs viewable by owner" ON public.api_usage_logs;
CREATE POLICY "API logs viewable by owner"
  ON public.api_usage_logs
  FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "API logs insertable by authenticated" ON public.api_usage_logs;
CREATE POLICY "API logs insertable by authenticated"
  ON public.api_usage_logs
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- RLS Policies for question cache (public read)
DROP POLICY IF EXISTS "Cache viewable by everyone" ON public.question_cache;
CREATE POLICY "Cache viewable by everyone"
  ON public.question_cache
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Cache insertable by authenticated" ON public.question_cache;
CREATE POLICY "Cache insertable by authenticated"
  ON public.question_cache
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Function to automatically update last_updated timestamp
CREATE OR REPLACE FUNCTION update_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_updated on question changes
DROP TRIGGER IF EXISTS trigger_update_questions_updated_at ON public.questions;
CREATE TRIGGER trigger_update_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION update_questions_updated_at();

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.question_cache
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to clean cache (requires pg_cron extension)
-- SELECT cron.schedule('clean-cache', '0 2 * * *', 'SELECT clean_expired_cache();');

-- Grant permissions
GRANT SELECT ON public.questions TO anon, authenticated;
GRANT INSERT ON public.questions TO authenticated;
GRANT SELECT ON public.question_performance_analysis TO anon, authenticated;
GRANT SELECT, INSERT ON public.api_usage_logs TO authenticated;
GRANT SELECT, INSERT ON public.question_cache TO authenticated;

-- Verify the setup
SELECT 
  'Tables created successfully' as status,
  COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('questions', 'api_usage_logs', 'question_cache');

