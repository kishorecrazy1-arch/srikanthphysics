-- ============================================
-- COMPLETE FIX FOR RLS SIGNUP ERROR
-- ============================================
-- This script will completely fix the "new row violates row-level security policy" error
-- Run this ENTIRE script in Supabase SQL Editor

-- ============================================
-- STEP 1: Check current RLS status
-- ============================================
SELECT 
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'user_profiles';

-- ============================================
-- STEP 2: Check existing policies
-- ============================================
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd;

-- ============================================
-- STEP 3: Drop ALL existing policies on user_profiles
-- ============================================
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- ============================================
-- STEP 4: Ensure RLS is enabled
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: Create SELECT policy (users can view their own profile)
-- ============================================
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- ============================================
-- STEP 6: Create INSERT policy (users can insert their own profile during signup)
-- ============================================
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================
-- STEP 7: Create UPDATE policy (users can update their own profile)
-- ============================================
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- STEP 8: Create DELETE policy (users can delete their own profile)
-- ============================================
CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ============================================
-- STEP 9: Verify all policies are created correctly
-- ============================================
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN cmd = 'SELECT' THEN qual
    WHEN cmd = 'INSERT' THEN with_check
    WHEN cmd = 'UPDATE' THEN with_check
    WHEN cmd = 'DELETE' THEN qual
  END as policy_condition
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY 
  CASE cmd 
    WHEN 'SELECT' THEN 1
    WHEN 'INSERT' THEN 2
    WHEN 'UPDATE' THEN 3
    WHEN 'DELETE' THEN 4
  END;

-- ============================================
-- EXPECTED OUTPUT:
-- ============================================
-- You should see 4 policies:
-- 1. SELECT: "Users can view own profile" with condition "(auth.uid() = id)"
-- 2. INSERT: "Users can insert own profile" with condition "(auth.uid() = id)"
-- 3. UPDATE: "Users can update own profile" with condition "(auth.uid() = id)"
-- 4. DELETE: "Users can delete own profile" with condition "(auth.uid() = id)"
-- ============================================

