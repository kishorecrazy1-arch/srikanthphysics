-- Fix RLS policy to allow inserts for questions table
-- Run this in Supabase SQL Editor

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Questions are insertable by authenticated users" ON public.questions;

-- Create a new insert policy with WITH CHECK (true) to allow all inserts
-- This is necessary because the current policy has NULL with_check, which blocks inserts
CREATE POLICY "Questions are insertable by authenticated users"
  ON public.questions
  FOR INSERT
  WITH CHECK (true);  -- Allow all inserts (for development)

-- Verify the policy was updated correctly
SELECT 
  policyname,
  cmd,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'questions'
ORDER BY policyname;

-- Expected result:
-- INSERT policy should show: with_check = 'true'
-- SELECT policy should show: qual = 'true'
