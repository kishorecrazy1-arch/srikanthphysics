-- FIX 1: Add missing ai_generated column
-- Run this in Supabase SQL Editor

ALTER TABLE public.questions 
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false;

-- Verify column was added (should return 1 row)
SELECT 
  'Column added successfully!' as status,
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'questions' 
  AND column_name = 'ai_generated';




















