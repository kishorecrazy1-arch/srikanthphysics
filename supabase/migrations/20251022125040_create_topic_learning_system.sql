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
