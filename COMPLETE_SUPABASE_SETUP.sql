-- ============================================================================
-- COMPLETE SUPABASE SETUP SQL
-- Copy and paste this entire file into Supabase SQL Editor and run it
-- ============================================================================
-- This script sets up:
-- 1. Topics and Subtopics (8 AP Physics 1 units with all subtopics)
-- 2. Questions table with enhanced structure
-- 3. API usage logs for cost tracking
-- 4. Question cache for performance
-- 5. User answers table
-- 6. Views and functions
-- 7. RLS policies and permissions
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE TOPICS AND SUBTOPICS
-- ============================================================================

-- Create topics table
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  subtopics JSONB DEFAULT '[]'::jsonb,
  total_questions INTEGER DEFAULT 0,
  display_order INTEGER,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subtopics table
CREATE TABLE IF NOT EXISTS public.subtopics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on topics
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtopics ENABLE ROW LEVEL SECURITY;

-- Create policies for topics (public read access)
DROP POLICY IF EXISTS "Topics are viewable by everyone" ON public.topics;
CREATE POLICY "Topics are viewable by everyone"
  ON public.topics
  FOR SELECT
  USING (true);

-- Create policies for subtopics (public read access)
DROP POLICY IF EXISTS "Subtopics are viewable by everyone" ON public.subtopics;
CREATE POLICY "Subtopics are viewable by everyone"
  ON public.subtopics
  FOR SELECT
  USING (true);

-- Insert AP Physics 1 Topics (8 Units)
INSERT INTO public.topics (name, icon, description, display_order, color) VALUES
('Kinematics', '📏', 'Motion, velocity, acceleration, graphs', 1, '#3b82f6'),
('Force and Translational Dynamics', '⚖️', 'Forces, Newton''s laws, free-body diagrams', 2, '#8b5cf6'),
('Work, Energy, and Power', '⚡', 'Kinetic energy, potential energy, conservation, power', 3, '#10b981'),
('Linear Momentum', '🚀', 'Linear momentum, collisions, impulse', 4, '#f59e0b'),
('Torque and Rotational Dynamics', '🔄', 'Rotational motion, torque, rotational inertia', 5, '#ef4444'),
('Energy and Momentum of Rotating Systems', '🌌', 'Rotational energy, angular momentum, conservation', 6, '#ec4899'),
('Oscillations', '📊', 'Simple harmonic motion, frequency, period', 7, '#06b6d4'),
('Fluids', '💧', 'Pressure, density, fluids and Newton''s laws, conservation', 8, '#14b8a6')
ON CONFLICT DO NOTHING;

-- Insert Subtopics for Unit 1: Kinematics
INSERT INTO public.subtopics (topic_id, name, display_order)
SELECT id, 'Scalars and Vectors in One Dimension', 1 FROM public.topics WHERE name = 'Kinematics'
UNION ALL
SELECT id, 'Displacement, Velocity, and Acceleration', 2 FROM public.topics WHERE name = 'Kinematics'
UNION ALL
SELECT id, 'Representing Motion', 3 FROM public.topics WHERE name = 'Kinematics'
UNION ALL
SELECT id, 'Reference Frames and Relative Motion', 4 FROM public.topics WHERE name = 'Kinematics'
UNION ALL
SELECT id, 'Vectors and Motion in Two Dimensions', 5 FROM public.topics WHERE name = 'Kinematics';

-- Insert Subtopics for Unit 2: Force and Translational Dynamics
INSERT INTO public.subtopics (topic_id, name, display_order)
SELECT id, 'Systems and Center of Mass', 1 FROM public.topics WHERE name = 'Force and Translational Dynamics'
UNION ALL
SELECT id, 'Forces and Free-Body Diagrams', 2 FROM public.topics WHERE name = 'Force and Translational Dynamics'
UNION ALL
SELECT id, 'Newton''s Third Law', 3 FROM public.topics WHERE name = 'Force and Translational Dynamics'
UNION ALL
SELECT id, 'Newton''s First Law', 4 FROM public.topics WHERE name = 'Force and Translational Dynamics'
UNION ALL
SELECT id, 'Newton''s Second Law', 5 FROM public.topics WHERE name = 'Force and Translational Dynamics'
UNION ALL
SELECT id, 'Gravitational Force', 6 FROM public.topics WHERE name = 'Force and Translational Dynamics'
UNION ALL
SELECT id, 'Kinetic and Static Friction', 7 FROM public.topics WHERE name = 'Force and Translational Dynamics'
UNION ALL
SELECT id, 'Spring Forces', 8 FROM public.topics WHERE name = 'Force and Translational Dynamics'
UNION ALL
SELECT id, 'Circular Motion', 9 FROM public.topics WHERE name = 'Force and Translational Dynamics';

-- Insert Subtopics for Unit 3: Work, Energy, and Power
INSERT INTO public.subtopics (topic_id, name, display_order)
SELECT id, 'Translational Kinetic Energy', 1 FROM public.topics WHERE name = 'Work, Energy, and Power'
UNION ALL
SELECT id, 'Work', 2 FROM public.topics WHERE name = 'Work, Energy, and Power'
UNION ALL
SELECT id, 'Potential Energy', 3 FROM public.topics WHERE name = 'Work, Energy, and Power'
UNION ALL
SELECT id, 'Conservation of Energy', 4 FROM public.topics WHERE name = 'Work, Energy, and Power'
UNION ALL
SELECT id, 'Power', 5 FROM public.topics WHERE name = 'Work, Energy, and Power';

-- Insert Subtopics for Unit 4: Linear Momentum
INSERT INTO public.subtopics (topic_id, name, display_order)
SELECT id, 'Linear Momentum', 1 FROM public.topics WHERE name = 'Linear Momentum'
UNION ALL
SELECT id, 'Change in Momentum and Impulse', 2 FROM public.topics WHERE name = 'Linear Momentum'
UNION ALL
SELECT id, 'Conservation of Linear Momentum', 3 FROM public.topics WHERE name = 'Linear Momentum'
UNION ALL
SELECT id, 'Elastic and Inelastic Collisions', 4 FROM public.topics WHERE name = 'Linear Momentum';

-- Insert Subtopics for Unit 5: Torque and Rotational Dynamics
INSERT INTO public.subtopics (topic_id, name, display_order)
SELECT id, 'Rotational Kinematics', 1 FROM public.topics WHERE name = 'Torque and Rotational Dynamics'
UNION ALL
SELECT id, 'Connecting Linear and Rotational Motion', 2 FROM public.topics WHERE name = 'Torque and Rotational Dynamics'
UNION ALL
SELECT id, 'Torque', 3 FROM public.topics WHERE name = 'Torque and Rotational Dynamics'
UNION ALL
SELECT id, 'Rotational Inertia', 4 FROM public.topics WHERE name = 'Torque and Rotational Dynamics'
UNION ALL
SELECT id, 'Rotational Equilibrium and Newton''s First Law in Rotational Form', 5 FROM public.topics WHERE name = 'Torque and Rotational Dynamics'
UNION ALL
SELECT id, 'Newton''s Second Law in Rotational Form', 6 FROM public.topics WHERE name = 'Torque and Rotational Dynamics';

-- Insert Subtopics for Unit 6: Energy and Momentum of Rotating Systems
INSERT INTO public.subtopics (topic_id, name, display_order)
SELECT id, 'Rotational Kinetic Energy', 1 FROM public.topics WHERE name = 'Energy and Momentum of Rotating Systems'
UNION ALL
SELECT id, 'Torque and Work', 2 FROM public.topics WHERE name = 'Energy and Momentum of Rotating Systems'
UNION ALL
SELECT id, 'Angular Momentum and Angular Impulse', 3 FROM public.topics WHERE name = 'Energy and Momentum of Rotating Systems'
UNION ALL
SELECT id, 'Conservation of Angular Momentum', 4 FROM public.topics WHERE name = 'Energy and Momentum of Rotating Systems'
UNION ALL
SELECT id, 'Rolling', 5 FROM public.topics WHERE name = 'Energy and Momentum of Rotating Systems'
UNION ALL
SELECT id, 'Motion of Orbiting Satellites', 6 FROM public.topics WHERE name = 'Energy and Momentum of Rotating Systems';

-- Insert Subtopics for Unit 7: Oscillations
INSERT INTO public.subtopics (topic_id, name, display_order)
SELECT id, 'Defining Simple Harmonic Motion (SHM)', 1 FROM public.topics WHERE name = 'Oscillations'
UNION ALL
SELECT id, 'Frequency and Period of SHM', 2 FROM public.topics WHERE name = 'Oscillations'
UNION ALL
SELECT id, 'Representing and Analyzing SHM', 3 FROM public.topics WHERE name = 'Oscillations'
UNION ALL
SELECT id, 'Energy of Simple Harmonic Oscillators', 4 FROM public.topics WHERE name = 'Oscillations';

-- Insert Subtopics for Unit 8: Fluids
INSERT INTO public.subtopics (topic_id, name, display_order)
SELECT id, 'Internal Structure and Density', 1 FROM public.topics WHERE name = 'Fluids'
UNION ALL
SELECT id, 'Pressure', 2 FROM public.topics WHERE name = 'Fluids'
UNION ALL
SELECT id, 'Fluids and Newton''s Laws', 3 FROM public.topics WHERE name = 'Fluids'
UNION ALL
SELECT id, 'Fluids and Conservation Laws', 4 FROM public.topics WHERE name = 'Fluids';

-- ============================================================================
-- PART 2: CREATE USER_ANSWERS TABLE
-- ============================================================================

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

-- ============================================================================
-- PART 3: CREATE QUESTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID,
  subtopic_id UUID,
  question_type VARCHAR(50) NOT NULL, -- 'MCQ', 'FRQ', 'Graph', 'Diagram'
  difficulty_level VARCHAR(20) NOT NULL, -- 'Foundation', 'Intermediate', 'Advanced'
  question_text TEXT NOT NULL,
  options JSONB, -- For MCQ: {"A": "...", "B": "...", "C": "...", "D": "..."}
  correct_answer VARCHAR(1),
  solution_steps TEXT[] NOT NULL DEFAULT '{}'::text[],
  misconceptions JSONB DEFAULT '{}'::jsonb,
  formulas_used TEXT[] DEFAULT '{}'::text[],
  bloom_taxonomy VARCHAR(50),
  source_api VARCHAR(20), -- 'GPT-4o', 'Claude-3.5'
  used_count INTEGER DEFAULT 0,
  avg_student_score NUMERIC(5,2) DEFAULT 0,
  segment_type VARCHAR(50),
  generated_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints
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
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Foreign key constraints handled';
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_subtopic ON public.questions(subtopic_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_questions_type ON public.questions(question_type);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_generated_date ON public.questions(generated_date);
CREATE INDEX IF NOT EXISTS idx_questions_segment_type ON public.questions(segment_type);

-- ============================================================================
-- PART 4: CREATE API USAGE LOGS TABLE
-- ============================================================================

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

-- ============================================================================
-- PART 5: CREATE QUESTION CACHE TABLE
-- ============================================================================

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

-- ============================================================================
-- PART 6: CREATE VIEWS
-- ============================================================================

-- Create view for question performance analysis
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_answers') THEN
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
  ELSE
    CREATE OR REPLACE VIEW public.question_performance_analysis AS
    SELECT
      q.id,
      q.subtopic_id,
      q.difficulty_level,
      q.question_type,
      0 as attempts,
      0 as success_rate,
      0 as avg_time_seconds,
      q.avg_student_score,
      q.used_count,
      q.source_api
    FROM public.questions q;
  END IF;
END $$;

-- ============================================================================
-- PART 7: ENABLE RLS AND CREATE POLICIES
-- ============================================================================

-- Enable RLS on all tables
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

-- RLS Policies for API usage logs
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

-- RLS Policies for question cache
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

-- ============================================================================
-- PART 8: CREATE FUNCTIONS AND TRIGGERS
-- ============================================================================

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

-- ============================================================================
-- PART 9: GRANT PERMISSIONS
-- ============================================================================

DO $$
BEGIN
  GRANT SELECT ON public.questions TO anon, authenticated;
  GRANT INSERT ON public.questions TO authenticated;
  
  IF EXISTS (SELECT FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'question_performance_analysis') THEN
    GRANT SELECT ON public.question_performance_analysis TO anon, authenticated;
  END IF;
  
  GRANT SELECT, INSERT ON public.api_usage_logs TO authenticated;
  GRANT SELECT, INSERT ON public.question_cache TO authenticated;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_answers') THEN
    GRANT SELECT, INSERT ON public.user_answers TO authenticated;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Some grants handled';
END $$;

-- ============================================================================
-- PART 10: UPDATE TOPICS WITH QUESTION COUNTS
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'questions') THEN
    UPDATE public.topics t
    SET total_questions = (
      SELECT COUNT(*) 
      FROM public.questions q 
      WHERE q.topic_id = t.id
    )
    WHERE EXISTS (SELECT 1 FROM public.questions WHERE topic_id = t.id);
  END IF;
END $$;

UPDATE public.topics
SET total_questions = 0
WHERE total_questions IS NULL;

-- ============================================================================
-- PART 11: VERIFICATION
-- ============================================================================

-- Verify topics and subtopics
SELECT 
  'Topics and Subtopics Setup' as section,
  COUNT(DISTINCT t.id) as topics_count,
  COUNT(s.id) as subtopics_count
FROM public.topics t
LEFT JOIN public.subtopics s ON s.topic_id = t.id;

-- Verify tables
SELECT 
  'Tables Created' as section,
  COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('topics', 'subtopics', 'questions', 'user_answers', 'api_usage_logs', 'question_cache');

-- Show all topics with subtopic counts
SELECT 
  t.name as topic_name,
  t.display_order,
  COUNT(s.id) as subtopic_count,
  t.color
FROM public.topics t
LEFT JOIN public.subtopics s ON s.topic_id = t.id
GROUP BY t.id, t.name, t.display_order, t.color
ORDER BY t.display_order;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- You should see:
-- 1. Topics and Subtopics Setup: 8 topics, ~40 subtopics
-- 2. Tables Created: 6 tables
-- 3. List of all topics with subtopic counts
-- ============================================================================























