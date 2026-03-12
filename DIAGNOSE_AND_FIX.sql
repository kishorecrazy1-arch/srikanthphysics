-- ============================================================================
-- DIAGNOSE AND FIX: Topics Not Loading
-- ============================================================================
-- Run this in Supabase SQL Editor to diagnose and fix the issue
-- ============================================================================

-- STEP 1: Check if tables exist
SELECT 
  'Table Check' as step,
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('topics', 'subtopics')
ORDER BY table_name;

-- STEP 2: Check if topics table has data
SELECT 
  'Topics Count' as step,
  COUNT(*) as count,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ HAS DATA'
    ELSE '❌ EMPTY'
  END as status
FROM public.topics;

-- STEP 3: Check RLS policies
SELECT 
  'RLS Policy Check' as step,
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN policyname IS NOT NULL THEN '✅ POLICY EXISTS'
    ELSE '❌ NO POLICY'
  END as status
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('topics', 'subtopics')
  AND cmd = 'SELECT';

-- ============================================================================
-- FIX: Create tables if they don't exist
-- ============================================================================

-- Create topics table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  color TEXT DEFAULT '#3b82f6',
  total_questions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subtopics table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.subtopics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FIX: Enable RLS and create policies
-- ============================================================================

-- Enable RLS on topics
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Topics are viewable by everyone" ON public.topics;
DROP POLICY IF EXISTS "Public read access for topics" ON public.topics;

-- Create public read policy for topics (ALLOWS ALL USERS)
CREATE POLICY "Topics are viewable by everyone"
  ON public.topics
  FOR SELECT
  USING (true);

-- Enable RLS on subtopics
ALTER TABLE public.subtopics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Subtopics are viewable by everyone" ON public.subtopics;
DROP POLICY IF EXISTS "Public read access for subtopics" ON public.subtopics;

-- Create public read policy for subtopics (ALLOWS ALL USERS)
CREATE POLICY "Subtopics are viewable by everyone"
  ON public.subtopics
  FOR SELECT
  USING (true);

-- ============================================================================
-- FIX: Insert topics if table is empty
-- ============================================================================

-- Insert topics (only if they don't exist)
INSERT INTO public.topics (name, icon, description, display_order, color) 
VALUES
  ('Kinematics', '📏', 'Motion, velocity, acceleration, graphs', 1, '#3b82f6'),
  ('Force and Translational Dynamics', '⚖️', 'Forces, Newton''s laws, free-body diagrams', 2, '#8b5cf6'),
  ('Work, Energy, and Power', '⚡', 'Kinetic energy, potential energy, conservation, power', 3, '#10b981'),
  ('Linear Momentum', '🚀', 'Linear momentum, collisions, impulse', 4, '#f59e0b'),
  ('Torque and Rotational Dynamics', '🔄', 'Rotational motion, torque, rotational inertia', 5, '#ef4444'),
  ('Energy and Momentum of Rotating Systems', '🌌', 'Rotational energy, angular momentum, conservation', 6, '#ec4899'),
  ('Oscillations', '📊', 'Simple harmonic motion, frequency, period', 7, '#06b6d4'),
  ('Fluids', '💧', 'Pressure, density, fluids and Newton''s laws, conservation', 8, '#14b8a6')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFY: Check final status
-- ============================================================================

SELECT 
  'FINAL STATUS' as step,
  (SELECT COUNT(*) FROM public.topics) as topics_count,
  (SELECT COUNT(*) FROM public.subtopics) as subtopics_count,
  CASE 
    WHEN (SELECT COUNT(*) FROM public.topics) > 0 THEN '✅ READY'
    ELSE '❌ NEEDS SETUP'
  END as status;

-- List all topics
SELECT 
  id,
  name,
  display_order,
  color
FROM public.topics
ORDER BY display_order;

-- ============================================================================
-- ✅ SETUP COMPLETE!
-- ============================================================================
-- After running this:
-- 1. Go back to your app
-- 2. Hard refresh (Ctrl+Shift+R)
-- 3. Topics should now load!
-- ============================================================================

