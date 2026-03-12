-- Fix RLS Policy for user_profiles table to allow signup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ubivreetpsledaqffuvn/sql/new

-- Step 1: Check current policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- Step 2: Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Step 3: Create a new insert policy that allows users to insert their own profile
-- This policy allows authenticated users to insert a row where the id matches their auth.uid()
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Step 4: Verify the policy was created
SELECT 
  policyname,
  cmd,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'
AND cmd = 'INSERT';

-- Expected result: Should show the policy with with_check = '(auth.uid() = id)'

-- Step 5: Also ensure SELECT and UPDATE policies exist
-- Check if they exist, if not create them

-- SELECT policy (users can view their own profile)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON user_profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

-- UPDATE policy (users can update their own profile)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON user_profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Step 6: Verify all policies are in place
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN cmd = 'SELECT' THEN qual
    WHEN cmd = 'INSERT' THEN with_check
    WHEN cmd = 'UPDATE' THEN with_check
  END as policy_condition
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- Expected results:
-- SELECT: "Users can view own profile" with condition "(auth.uid() = id)"
-- INSERT: "Users can insert own profile" with condition "(auth.uid() = id)"
-- UPDATE: "Users can update own profile" with condition "(auth.uid() = id)"



