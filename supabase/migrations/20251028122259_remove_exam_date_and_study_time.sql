/*
  # Remove Target Exam Date and Preferred Study Time Fields

  1. Changes
    - Remove `target_exam_date` column from `user_profiles` table
    - Remove `preferred_study_time` column from `user_profiles` table
    
  2. Notes
    - Uses IF EXISTS to prevent errors if columns don't exist
    - These fields are no longer needed in the simplified signup flow
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'target_exam_date'
  ) THEN
    ALTER TABLE user_profiles DROP COLUMN target_exam_date;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'preferred_study_time'
  ) THEN
    ALTER TABLE user_profiles DROP COLUMN preferred_study_time;
  END IF;
END $$;