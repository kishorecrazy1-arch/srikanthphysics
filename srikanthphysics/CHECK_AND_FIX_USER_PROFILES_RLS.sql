-- Check and Fix RLS Policy for user_profiles table
-- Run this in Supabase SQL Editor

-- Step 1: Check current policies on user_profiles table
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;

-- Step 2: Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'user_profiles';

-- Step 3: Fix INSERT policy (if it doesn't exist or is incorrect)
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Create the correct INSERT policy
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Step 4: Ensure SELECT policy exists
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

-- Step 5: Ensure UPDATE policy exists
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

-- Step 6: Verify all policies are correct
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
ORDER BY 
  CASE cmd 
    WHEN 'SELECT' THEN 1
    WHEN 'INSERT' THEN 2
    WHEN 'UPDATE' THEN 3
  END;

-- Expected Results:
-- ✅ SELECT: "Users can view own profile" | condition: "(auth.uid() = id)"
-- ✅ INSERT: "Users can insert own profile" | condition: "(auth.uid() = id)"
-- ✅ UPDATE: "Users can update own profile" | condition: "(auth.uid() = id)"



