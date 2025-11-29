-- Add missing ai_generated column to questions table
-- Run this in Supabase SQL Editor

ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false;

-- Update existing questions to mark them appropriately
-- (AI-generated questions will have source_api set, sample questions won't)
UPDATE public.questions 
SET ai_generated = true 
WHERE source_api IS NOT NULL AND source_api IN ('GPT-4o', 'Claude-3.5');

-- Verify column was added
SELECT 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'questions' 
  AND column_name = 'ai_generated';




