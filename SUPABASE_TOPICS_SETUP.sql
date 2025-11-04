-- AP Physics 1 Topics Setup
-- Run this in your Supabase SQL Editor to create topics and subtopics

-- First, create the topics table if it doesn't exist
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

-- Create subtopics table if it doesn't exist
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

-- Create policies for topics (all authenticated users can read)
DROP POLICY IF EXISTS "Topics are viewable by authenticated users" ON public.topics;
CREATE POLICY "Topics are viewable by authenticated users"
  ON public.topics
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create policies for subtopics (all authenticated users can read)
DROP POLICY IF EXISTS "Subtopics are viewable by authenticated users" ON public.subtopics;
CREATE POLICY "Subtopics are viewable by authenticated users"
  ON public.subtopics
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Clear existing topics (optional - remove if you want to keep existing data)
-- DELETE FROM public.subtopics;
-- DELETE FROM public.topics;

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

-- Update topics with question counts (only if questions table exists)
-- This will safely skip if questions table doesn't exist yet
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

-- Set default counts to 0 for all topics
UPDATE public.topics
SET total_questions = 0
WHERE total_questions IS NULL;

-- Verify the setup
SELECT 
  t.name as topic_name,
  t.display_order,
  COUNT(s.id) as subtopic_count
FROM public.topics t
LEFT JOIN public.subtopics s ON s.topic_id = t.id
GROUP BY t.id, t.name, t.display_order
ORDER BY t.display_order;
