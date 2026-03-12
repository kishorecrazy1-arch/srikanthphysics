-- ============================================
-- COMPLETE FIX: Use Database Trigger for Profile Creation
-- ============================================
-- This approach automatically creates the profile when a user signs up
-- Run this ENTIRE script in Supabase SQL Editor

-- ============================================
-- STEP 1: Create a function to handle profile creation
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    name,
    email,
    country_code,
    phone_number,
    grade,
    course_type,
    current_streak,
    longest_streak,
    total_questions,
    correct_answers,
    skill_level
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'country_code', '+1'),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    COALESCE((NEW.raw_user_meta_data->>'grade')::integer, 11),
    COALESCE(NEW.raw_user_meta_data->>'course_type', 'ap_physics_1'),
    0,
    0,
    0,
    0,
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STEP 2: Create trigger that fires after user creation
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 3: Update RLS policies to allow the trigger function
-- ============================================
-- The trigger function runs with SECURITY DEFINER, so it bypasses RLS
-- But we still need proper policies for manual inserts/updates

-- Ensure INSERT policy allows authenticated users
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure SELECT policy exists
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Ensure UPDATE policy exists
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- ALTERNATIVE: If trigger doesn't work, try this simpler approach
-- ============================================
-- Make sure the INSERT happens with proper authentication context

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;

-- ============================================
-- Verify everything is set up
-- ============================================
SELECT 
  policyname,
  cmd,
  roles,
  CASE 
    WHEN cmd = 'SELECT' THEN qual
    WHEN cmd = 'INSERT' THEN with_check
    WHEN cmd = 'UPDATE' THEN with_check
  END as policy_condition
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd;

-- Check if trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_schema = 'auth';

