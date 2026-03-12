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
