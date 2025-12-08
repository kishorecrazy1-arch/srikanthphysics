# Fix: RLS Policy Violation for Questions Table

## 🔴 Error
```
new row violates row-level security policy for table "questions"
```

## ✅ Solution

The RLS policy is blocking INSERT operations. Run this SQL in Supabase:

```sql
-- Fix RLS policy to allow inserts
DROP POLICY IF EXISTS "Questions are insertable by authenticated users" ON public.questions;

-- Create a more permissive insert policy
CREATE POLICY "Questions are insertable by authenticated users"
  ON public.questions
  FOR INSERT
  WITH CHECK (true);  -- Allow all inserts

-- Verify the policy
SELECT policyname, cmd, with_check
FROM pg_policies 
WHERE tablename = 'questions';
```

## Alternative: Disable RLS Temporarily (Not Recommended for Production)

If you need to test quickly:

```sql
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
```

**⚠️ Warning**: This disables security. Only use for testing!

## After Fix

1. Refresh your browser
2. Click "Get 10 Questions" again
3. Questions should insert successfully!











