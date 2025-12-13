-- Create user_answers table if it doesn't exist
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL,
  selected_answer VARCHAR(255) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent INTEGER DEFAULT 0,
  time_spent_seconds INTEGER,
  confidence_score NUMERIC(3,2),
  attempt_number INTEGER DEFAULT 1,
  answered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_answers_user_id ON public.user_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_question_id ON public.user_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_answered_at ON public.user_answers(answered_at);

-- Enable RLS
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own answers" ON public.user_answers;
CREATE POLICY "Users can view their own answers"
  ON public.user_answers
  FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can insert their own answers" ON public.user_answers;
CREATE POLICY "Users can insert their own answers"
  ON public.user_answers
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    OR auth.role() = 'service_role'
    OR auth.role() = 'anon'  -- Allow anonymous for test mode
  );

DROP POLICY IF EXISTS "Users can update their own answers" ON public.user_answers;
CREATE POLICY "Users can update their own answers"
  ON public.user_answers
  FOR UPDATE
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.user_answers TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_answers TO service_role;

-- Verify table was created
SELECT 
  'user_answers table created successfully!' as status,
  COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'user_answers';























