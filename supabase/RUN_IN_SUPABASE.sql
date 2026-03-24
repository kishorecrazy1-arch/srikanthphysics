/* =============================================================================
   Srikanth Physics - paste ENTIRE file into Supabase SQL Editor and Run
   Re-runnable: pre-drops policies if their tables exist (fixes ERROR 42710 duplicate policy)
   Skips: 20251103194903 (sample questions use old topic UUIDs)
============================================================================= */

DO $policypre$
BEGIN
  IF to_regclass('public.user_profiles') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
  END IF;
  IF to_regclass('public.topic_mastery') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own topic mastery" ON topic_mastery;
    DROP POLICY IF EXISTS "Users can insert own topic mastery" ON topic_mastery;
    DROP POLICY IF EXISTS "Users can update own topic mastery" ON topic_mastery;
  END IF;
  IF to_regclass('public.quiz_sessions') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own quiz sessions" ON quiz_sessions;
    DROP POLICY IF EXISTS "Users can insert own quiz sessions" ON quiz_sessions;
    DROP POLICY IF EXISTS "Users can update own quiz sessions" ON quiz_sessions;
  END IF;
  IF to_regclass('public.quiz_answers') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own quiz answers" ON quiz_answers;
    DROP POLICY IF EXISTS "Users can insert own quiz answers" ON quiz_answers;
  END IF;
  IF to_regclass('public.badges') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own badges" ON badges;
    DROP POLICY IF EXISTS "Users can insert own badges" ON badges;
  END IF;
  IF to_regclass('public.schedule_items') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own schedule" ON schedule_items;
    DROP POLICY IF EXISTS "Users can insert own schedule" ON schedule_items;
    DROP POLICY IF EXISTS "Users can update own schedule" ON schedule_items;
    DROP POLICY IF EXISTS "Users can delete own schedule" ON schedule_items;
  END IF;
  IF to_regclass('public.topics') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Anyone can view topics" ON topics;
  END IF;
  IF to_regclass('public.topic_progress') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own progress" ON topic_progress;
    DROP POLICY IF EXISTS "Users can insert own progress" ON topic_progress;
    DROP POLICY IF EXISTS "Users can update own progress" ON topic_progress;
  END IF;
  IF to_regclass('public.questions') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Authenticated users can view questions" ON questions;
  END IF;
  IF to_regclass('public.homework') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Authenticated users can view homework" ON homework;
    DROP POLICY IF EXISTS "Authenticated users can insert homework" ON homework;
  END IF;
  IF to_regclass('public.user_answers') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Users can view own answers" ON user_answers;
    DROP POLICY IF EXISTS "Users can insert own answers" ON user_answers;
  END IF;
  IF to_regclass('public.subtopics') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Anyone can view subtopics" ON subtopics;
  END IF;
END $policypre$;

/*
  # AP Physics Learning Platform Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `grade` (integer)
      - `course_type` (text)
      - `target_exam_date` (date)
      - `preferred_study_time` (text)
      - `current_streak` (integer, default 0)
      - `longest_streak` (integer, default 0)
      - `total_questions` (integer, default 0)
      - `correct_answers` (integer, default 0)
      - `skill_level` (integer, default 0)
      - `created_at` (timestamptz)
      - `last_active` (timestamptz)

    - `topic_mastery`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `topic` (text)
      - `mastery` (integer, 0-100)
      - `questions_attempted` (integer, default 0)
      - `questions_correct` (integer, default 0)
      - `last_practiced` (timestamptz)

    - `quiz_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `quiz_type` (text - morning_pulse, homework, challenge)
      - `status` (text - pending, in_progress, completed)
      - `score` (integer)
      - `total_questions` (integer)
      - `time_spent` (integer, seconds)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz)

    - `quiz_answers`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references quiz_sessions)
      - `question_id` (integer)
      - `selected_answer` (text)
      - `confidence` (integer, 1-5)
      - `time_spent` (integer, seconds)
      - `is_correct` (boolean)
      - `created_at` (timestamptz)

    - `badges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `badge_name` (text)
      - `earned_at` (timestamptz)

    - `schedule_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `day` (text)
      - `time` (text)
      - `topic` (text)
      - `reminder_enabled` (boolean, default false)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  grade integer NOT NULL,
  course_type text NOT NULL,
  target_exam_date date NOT NULL,
  preferred_study_time text NOT NULL,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  total_questions integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  skill_level integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS topic_mastery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  topic text NOT NULL,
  mastery integer DEFAULT 0 CHECK (mastery >= 0 AND mastery <= 100),
  questions_attempted integer DEFAULT 0,
  questions_correct integer DEFAULT 0,
  last_practiced timestamptz DEFAULT now(),
  UNIQUE(user_id, topic)
);

ALTER TABLE topic_mastery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own topic mastery"
  ON topic_mastery FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own topic mastery"
  ON topic_mastery FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own topic mastery"
  ON topic_mastery FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS quiz_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  quiz_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  score integer DEFAULT 0,
  total_questions integer DEFAULT 0,
  time_spent integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz sessions"
  ON quiz_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz sessions"
  ON quiz_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz sessions"
  ON quiz_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
  question_id integer NOT NULL,
  selected_answer text NOT NULL,
  confidence integer DEFAULT 3 CHECK (confidence >= 1 AND confidence <= 5),
  time_spent integer DEFAULT 0,
  is_correct boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz answers"
  ON quiz_answers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quiz_sessions
      WHERE quiz_sessions.id = quiz_answers.session_id
      AND quiz_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own quiz answers"
  ON quiz_answers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_sessions
      WHERE quiz_sessions.id = session_id
      AND quiz_sessions.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_name text NOT NULL,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_name)
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS schedule_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  day text NOT NULL,
  time text NOT NULL,
  topic text NOT NULL,
  reminder_enabled boolean DEFAULT false
);

ALTER TABLE schedule_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own schedule"
  ON schedule_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedule"
  ON schedule_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedule"
  ON schedule_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedule"
  ON schedule_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

/*
  # AP Physics Topic-Based Learning System

  1. New Tables
    - `topics`
      - `id` (uuid, primary key)
      - `name` (text) - Topic name like "Kinematics"
      - `icon` (text) - Emoji icon
      - `description` (text)
      - `subtopics` (jsonb) - Array of subtopic names
      - `total_questions` (integer)
      - `display_order` (integer)
      - `color` (text) - Color code for UI
      - `created_at` (timestamptz)
      
    - `topic_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `topic_id` (uuid, foreign key to topics)
      - `mastery` (integer) - Percentage 0-100
      - `questions_completed` (integer)
      - `questions_correct` (integer)
      - `last_practiced` (timestamptz)
      - `streak_days` (integer)
      - `updated_at` (timestamptz)
      
    - `questions`
      - `id` (uuid, primary key)
      - `topic_id` (uuid, foreign key to topics)
      - `segment_type` (text) - 'basics', 'homework', 'practice'
      - `question_text` (text)
      - `options` (jsonb) - Array of {id, text, isCorrect}
      - `difficulty` (text) - 'easy', 'medium', 'hard'
      - `question_type` (text) - 'conceptual', 'calculation', 'application'
      - `subtopic` (text)
      - `explanation` (jsonb) - {steps, keyConcept, relatedFormulas}
      - `image_url` (text)
      - `time_limit` (integer) - seconds
      - `ai_generated` (boolean)
      - `generated_date` (date) - For daily basics questions
      - `homework_id` (uuid, nullable)
      - `created_at` (timestamptz)
      
    - `homework`
      - `id` (uuid, primary key)
      - `topic_id` (uuid, foreign key to topics)
      - `title` (text)
      - `uploaded_by` (uuid, foreign key to auth.users)
      - `due_date` (timestamptz)
      - `pdf_url` (text)
      - `extracted_text` (text)
      - `status` (text) - 'active', 'completed', 'archived'
      - `created_at` (timestamptz)
      
    - `user_answers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `question_id` (uuid, foreign key to questions)
      - `selected_answer` (text)
      - `is_correct` (boolean)
      - `time_spent` (integer) - seconds
      - `answered_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can read topics (public)
    - Users can read/write their own progress and answers
    - Only authenticated users can access homework and questions
*/

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  description text NOT NULL,
  subtopics jsonb DEFAULT '[]'::jsonb,
  total_questions integer DEFAULT 0,
  display_order integer NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create topic_progress table
CREATE TABLE IF NOT EXISTS topic_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  mastery integer DEFAULT 0 CHECK (mastery >= 0 AND mastery <= 100),
  questions_completed integer DEFAULT 0,
  questions_correct integer DEFAULT 0,
  last_practiced timestamptz,
  streak_days integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  segment_type text NOT NULL CHECK (segment_type IN ('basics', 'homework', 'practice')),
  question_text text NOT NULL,
  options jsonb NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_type text NOT NULL CHECK (question_type IN ('conceptual', 'calculation', 'application')),
  subtopic text,
  explanation jsonb,
  image_url text,
  time_limit integer DEFAULT 120,
  ai_generated boolean DEFAULT false,
  generated_date date,
  homework_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Create homework table
CREATE TABLE IF NOT EXISTS homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date timestamptz,
  pdf_url text,
  extracted_text text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at timestamptz DEFAULT now()
);

-- Create user_answers table
CREATE TABLE IF NOT EXISTS user_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  selected_answer text NOT NULL,
  is_correct boolean NOT NULL,
  time_spent integer DEFAULT 0,
  answered_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

-- Topics policies (public read)
CREATE POLICY "Anyone can view topics"
  ON topics FOR SELECT
  TO authenticated
  USING (true);

-- Topic progress policies
CREATE POLICY "Users can view own progress"
  ON topic_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON topic_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON topic_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Questions policies
CREATE POLICY "Authenticated users can view questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

-- Homework policies
CREATE POLICY "Authenticated users can view homework"
  ON homework FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert homework"
  ON homework FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- User answers policies
CREATE POLICY "Users can view own answers"
  ON user_answers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers"
  ON user_answers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert 7 AP Physics topics
INSERT INTO topics (name, icon, description, subtopics, total_questions, display_order, color) VALUES
  (
    'Kinematics',
    '📏',
    'Motion, velocity, acceleration, graphs',
    '["Displacement & Velocity", "Acceleration", "Free Fall", "Projectile Motion", "Motion Graphs", "Relative Motion", "1D Motion", "2D Motion"]'::jsonb,
    120,
    1,
    '#10b981'
  ),
  (
    'Newton''s Laws & Forces',
    '⚡',
    'F=ma, free body diagrams, friction',
    '["Newton''s First Law", "Newton''s Second Law", "Newton''s Third Law", "Free Body Diagrams", "Friction", "Normal Force", "Tension", "Applied Forces", "Inclined Planes", "Connected Objects"]'::jsonb,
    150,
    2,
    '#f59e0b'
  ),
  (
    'Work, Energy & Power',
    '🔋',
    'Kinetic, potential, conservation',
    '["Work", "Kinetic Energy", "Potential Energy", "Conservation of Energy", "Power", "Work-Energy Theorem", "Springs", "Energy Diagrams", "Non-conservative Forces"]'::jsonb,
    130,
    3,
    '#3b82f6'
  ),
  (
    'Momentum & Collisions',
    '💥',
    'Linear momentum, impulse, collisions',
    '["Linear Momentum", "Impulse", "Conservation of Momentum", "Elastic Collisions", "Inelastic Collisions", "Center of Mass", "2D Collisions"]'::jsonb,
    100,
    4,
    '#ef4444'
  ),
  (
    'Circular Motion & Gravitation',
    '🌍',
    'Centripetal force, orbits, satellites',
    '["Uniform Circular Motion", "Centripetal Acceleration", "Centripetal Force", "Vertical Circles", "Universal Gravitation", "Orbital Motion", "Kepler''s Laws", "Gravitational Potential Energy"]'::jsonb,
    110,
    5,
    '#8b5cf6'
  ),
  (
    'Rotational Motion',
    '🔄',
    'Torque, angular momentum, inertia',
    '["Angular Kinematics", "Rotational Inertia", "Torque", "Angular Momentum", "Conservation of Angular Momentum", "Rolling Motion", "Rotational Energy", "Rotational Dynamics", "Equilibrium"]'::jsonb,
    140,
    6,
    '#ec4899'
  ),
  (
    'Oscillations & Waves',
    '🌊',
    'Simple harmonic motion, wave properties',
    '["Simple Harmonic Motion", "Mass-Spring Systems", "Pendulums", "Energy in SHM", "Wave Properties", "Wave Speed", "Standing Waves", "Interference"]'::jsonb,
    120,
    7,
    '#06b6d4'
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_topic_progress_user ON topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_topic ON topic_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_segment ON questions(segment_type);
CREATE INDEX IF NOT EXISTS idx_questions_date ON questions(generated_date);
CREATE INDEX IF NOT EXISTS idx_homework_topic ON homework(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_user ON user_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_answers_question ON user_answers(question_id);

/*
  # Add Phone Number Fields to User Profiles

  1. Changes
    - Add `country_code` column to `user_profiles` table (text, default '+91')
    - Add `phone_number` column to `user_profiles` table (text, not null)
    
  2. Notes
    - Uses IF NOT EXISTS to prevent errors if columns already exist
    - Phone number is required for user registration
    - Country code defaults to India (+91) but can be changed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'country_code'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN country_code text DEFAULT '+91';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN phone_number text NOT NULL DEFAULT '';
  END IF;
END $$;

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

/*
  # Add Subtopics Table

  1. New Tables
    - `subtopics`
      - `id` (uuid, primary key)
      - `topic_id` (uuid, foreign key to topics)
      - `name` (text, not null)
      - `description` (text)
      - `display_order` (integer, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `subtopics` table
    - Add policy for all users to read subtopics

  3. Changes
    - Creates a subtopics table to store sub-topics for each main topic
    - Each subtopic belongs to a parent topic via topic_id
    - Display order controls the order of subtopics in the UI
*/

CREATE TABLE IF NOT EXISTS subtopics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subtopics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subtopics"
  ON subtopics
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_subtopics_topic_id ON subtopics(topic_id);
CREATE INDEX IF NOT EXISTS idx_subtopics_display_order ON subtopics(display_order);

/*
  # Populate AP Physics Subtopics

  1. Inserts
    - Adds all subtopics for 8 AP Physics units
    - Each subtopic is linked to its parent topic
    - Display order maintains the sequence within each unit

  2. Units Covered
    - Unit 1: Kinematics (5 subtopics)
    - Unit 2: Force and Translational Dynamics (9 subtopics)
    - Unit 3: Work, Energy, and Power (5 subtopics)
    - Unit 4: Linear Momentum (4 subtopics)
    - Unit 5: Torque and Rotational Dynamics (6 subtopics)
    - Unit 6: Energy and Momentum of Rotating Systems (6 subtopics)
    - Unit 7: Oscillations (4 subtopics)
    - Unit 8: Fluids (4 subtopics)
*/

DO $$
DECLARE
  kinematics_id uuid;
  forces_id uuid;
  energy_id uuid;
  momentum_id uuid;
  rotation_id uuid;
  rotating_systems_id uuid;
  oscillations_id uuid;
  fluids_id uuid;
BEGIN
  SELECT id INTO kinematics_id FROM topics WHERE name = 'Kinematics' AND display_order = 1 LIMIT 1;
  SELECT id INTO forces_id FROM topics WHERE name LIKE '%Force%' OR name LIKE '%Newton%' AND display_order = 2 LIMIT 1;
  SELECT id INTO energy_id FROM topics WHERE name LIKE '%Energy%' OR name LIKE '%Work%' AND display_order = 3 LIMIT 1;
  SELECT id INTO momentum_id FROM topics WHERE name LIKE '%Momentum%' AND display_order = 4 LIMIT 1;
  SELECT id INTO rotation_id FROM topics WHERE name LIKE '%Rotation%' OR name LIKE '%Torque%' AND display_order = 6 LIMIT 1;
  SELECT id INTO oscillations_id FROM topics WHERE name LIKE '%Oscillation%' OR name LIKE '%Wave%' AND display_order = 7 LIMIT 1;

  IF kinematics_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (kinematics_id, 'Scalars and Vectors in One Dimension', 'Understanding scalar and vector quantities in one-dimensional motion', 1),
      (kinematics_id, 'Displacement, Velocity, and Acceleration', 'Key kinematic variables and their relationships', 2),
      (kinematics_id, 'Representing Motion', 'Graphs and equations to represent motion', 3),
      (kinematics_id, 'Reference Frames and Relative Motion', 'Understanding motion from different perspectives', 4),
      (kinematics_id, 'Vectors and Motion in Two Dimensions', 'Projectile motion and 2D vector analysis', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  IF forces_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (forces_id, 'Systems and Center of Mass', 'Understanding systems of particles and center of mass', 1),
      (forces_id, 'Forces and Free-Body Diagrams', 'Identifying forces and drawing free-body diagrams', 2),
      (forces_id, 'Newton''s Third Law', 'Action-reaction pairs and their applications', 3),
      (forces_id, 'Newton''s First Law', 'Inertia and equilibrium', 4),
      (forces_id, 'Newton''s Second Law', 'Force, mass, and acceleration relationships', 5),
      (forces_id, 'Gravitational Force', 'Universal gravitation and weight', 6),
      (forces_id, 'Kinetic and Static Friction', 'Friction forces and their effects', 7),
      (forces_id, 'Spring Forces', 'Hooke''s Law and elastic forces', 8),
      (forces_id, 'Circular Motion', 'Centripetal force and circular dynamics', 9)
    ON CONFLICT DO NOTHING;
  END IF;

  IF energy_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (energy_id, 'Translational Kinetic Energy', 'Energy of motion in translation', 1),
      (energy_id, 'Work', 'Work done by forces and work-energy theorem', 2),
      (energy_id, 'Potential Energy', 'Gravitational and elastic potential energy', 3),
      (energy_id, 'Conservation of Energy', 'Energy conservation in closed systems', 4),
      (energy_id, 'Power', 'Rate of energy transfer and work', 5)
    ON CONFLICT DO NOTHING;
  END IF;

  IF momentum_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (momentum_id, 'Linear Momentum', 'Momentum and its relation to force', 1),
      (momentum_id, 'Change in Momentum and Impulse', 'Impulse-momentum theorem', 2),
      (momentum_id, 'Conservation of Linear Momentum', 'Momentum conservation in collisions', 3),
      (momentum_id, 'Elastic and Inelastic Collisions', 'Types of collisions and energy conservation', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  IF rotation_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (rotation_id, 'Rotational Kinematics', 'Angular displacement, velocity, and acceleration', 1),
      (rotation_id, 'Connecting Linear and Rotational Motion', 'Relationships between linear and angular quantities', 2),
      (rotation_id, 'Torque', 'Rotational force and moment arm', 3),
      (rotation_id, 'Rotational Inertia', 'Moment of inertia and its calculation', 4),
      (rotation_id, 'Rotational Equilibrium and Newton''s First Law in Rotational Form', 'Static equilibrium for rotating objects', 5),
      (rotation_id, 'Newton''s Second Law in Rotational Form', 'Torque and angular acceleration', 6)
    ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO rotating_systems_id FROM topics WHERE name LIKE '%Rotation%' AND display_order >= 6 LIMIT 1 OFFSET 1;
  IF rotating_systems_id IS NULL THEN
    rotating_systems_id := rotation_id;
  END IF;

  IF rotating_systems_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (rotating_systems_id, 'Rotational Kinetic Energy', 'Energy of rotating objects', 7),
      (rotating_systems_id, 'Torque and Work', 'Work done by torque', 8),
      (rotating_systems_id, 'Angular Momentum and Angular Impulse', 'Angular momentum and its change', 9),
      (rotating_systems_id, 'Conservation of Angular Momentum', 'Angular momentum conservation', 10),
      (rotating_systems_id, 'Rolling', 'Combined translational and rotational motion', 11),
      (rotating_systems_id, 'Motion of Orbiting Satellites', 'Orbital mechanics and satellite motion', 12)
    ON CONFLICT DO NOTHING;
  END IF;

  IF oscillations_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (oscillations_id, 'Defining Simple Harmonic Motion (SHM)', 'Characteristics of SHM', 1),
      (oscillations_id, 'Frequency and Period of SHM', 'Time-related properties of oscillations', 2),
      (oscillations_id, 'Representing and Analyzing SHM', 'Mathematical and graphical representations', 3),
      (oscillations_id, 'Energy of Simple Harmonic Oscillators', 'Energy transformations in SHM', 4)
    ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO fluids_id FROM topics WHERE name LIKE '%Fluid%' LIMIT 1;
  IF fluids_id IS NULL THEN
    SELECT id INTO fluids_id FROM topics ORDER BY display_order DESC LIMIT 1;
  END IF;

  IF fluids_id IS NOT NULL AND fluids_id != oscillations_id THEN
    INSERT INTO subtopics (topic_id, name, description, display_order) VALUES
      (fluids_id, 'Internal Structure and Density', 'Matter structure and density calculations', 1),
      (fluids_id, 'Pressure', 'Fluid pressure and its applications', 2),
      (fluids_id, 'Fluids and Newton''s Laws', 'Forces in fluids', 3),
      (fluids_id, 'Fluids and Conservation Laws', 'Bernoulli''s equation and continuity', 4)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;


/* Circular Motion & Gravitation subtopics (no hardcoded topic UUID) */
DO $$
DECLARE
  grav_id uuid;
BEGIN
  SELECT id INTO grav_id FROM topics
    WHERE name ILIKE '%Circular Motion%Gravitation%'
       OR name ILIKE '%Gravitation%'
    ORDER BY display_order
    LIMIT 1;
  IF grav_id IS NOT NULL THEN
    INSERT INTO subtopics (topic_id, name, description, display_order)
    SELECT grav_id, v.name, v.description, v.ord
    FROM (VALUES
      ('Uniform Circular Motion'::text, 'Motion in a circle at constant speed'::text, 1),
      ('Centripetal Force and Acceleration', 'Forces causing circular motion', 2),
      ('Universal Gravitation', 'Newton''s Law of Universal Gravitation', 3),
      ('Orbital Motion', 'Planets, moons, and orbital mechanics', 4),
      ('Gravitational Potential Energy', 'Energy in gravitational fields', 5),
      ('Satellites and Kepler''s Laws', 'Satellite motion and Kepler''s three laws', 6)
    ) AS v(name, description, ord)
    WHERE NOT EXISTS (
      SELECT 1 FROM subtopics s WHERE s.topic_id = grav_id AND s.name = v.name
    );
  END IF;
END $$;

/* Subscription columns (auth / profile) */
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_expires_at timestamptz;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS payment_date timestamptz;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS payment_amount numeric(10,2);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS payment_method text;
