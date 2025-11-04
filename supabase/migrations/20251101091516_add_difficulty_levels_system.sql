/*
  # Add Difficulty Levels System
  
  1. Changes
    - Update questions table to use level-based difficulty (level_1, level_2, level_3)
    - Add difficulty_level column to user_answers for tracking
    - Add level progress tracking to topic_progress
    - Create indexes for efficient level-based queries
    
  2. Difficulty Levels
    - level_1: Foundation concepts, basic problems
    - level_2: Intermediate application, multi-step problems
    - level_3: Advanced concepts, complex problem-solving
    
  3. Migration Notes
    - Safely converts existing 'easy', 'medium', 'hard' to level_1, level_2, level_3
    - Preserves all existing data
*/

DO $$ 
BEGIN
  -- Add new difficulty level column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'questions' AND column_name = 'difficulty_level'
  ) THEN
    ALTER TABLE questions ADD COLUMN difficulty_level text;
  END IF;
END $$;

-- Migrate existing difficulty values to levels
UPDATE questions 
SET difficulty_level = CASE 
  WHEN difficulty = 'easy' THEN 'level_1'
  WHEN difficulty = 'medium' THEN 'level_2'
  WHEN difficulty = 'hard' THEN 'level_3'
  ELSE 'level_1'
END
WHERE difficulty_level IS NULL;

-- Add level progress columns to topic_progress if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'topic_progress' AND column_name = 'level_1_completed'
  ) THEN
    ALTER TABLE topic_progress ADD COLUMN level_1_completed integer DEFAULT 0;
    ALTER TABLE topic_progress ADD COLUMN level_1_correct integer DEFAULT 0;
    ALTER TABLE topic_progress ADD COLUMN level_2_completed integer DEFAULT 0;
    ALTER TABLE topic_progress ADD COLUMN level_2_correct integer DEFAULT 0;
    ALTER TABLE topic_progress ADD COLUMN level_3_completed integer DEFAULT 0;
    ALTER TABLE topic_progress ADD COLUMN level_3_correct integer DEFAULT 0;
  END IF;
END $$;

-- Add difficulty_level to user_answers if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_answers' AND column_name = 'difficulty_level'
  ) THEN
    ALTER TABLE user_answers ADD COLUMN difficulty_level text;
  END IF;
END $$;

-- Create indexes for efficient level-based queries
CREATE INDEX IF NOT EXISTS idx_questions_difficulty_level ON questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_questions_topic_level ON questions(topic_id, difficulty_level);
CREATE INDEX IF NOT EXISTS idx_user_answers_level ON user_answers(difficulty_level);

-- Add check constraint for valid difficulty levels
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'questions_difficulty_level_check'
  ) THEN
    ALTER TABLE questions 
    ADD CONSTRAINT questions_difficulty_level_check 
    CHECK (difficulty_level IN ('level_1', 'level_2', 'level_3'));
  END IF;
END $$;
