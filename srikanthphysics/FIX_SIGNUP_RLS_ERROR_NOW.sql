-- Fix RLS Policy Error for Signup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
-- Replace YOUR_PROJECT_ID with your actual Supabase project ID

-- Step 1: Drop existing INSERT policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON user_profiles;

-- Step 2: Create the correct INSERT policy
-- This allows authenticated users to insert their own profile during signup
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Step 3: Ensure SELECT policy exists (for viewing profile)
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

-- Step 4: Ensure UPDATE policy exists (for updating profile)
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

-- Step 5: Verify the policies are correct
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
ORDER BY cmd;

-- Expected output:
-- SELECT: "Users can view own profile" with "(auth.uid() = id)"
-- INSERT: "Users can insert own profile" with "(auth.uid() = id)"
-- UPDATE: "Users can update own profile" with "(auth.uid() = id)"

