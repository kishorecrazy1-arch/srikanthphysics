-- Fix RLS Policy for Subscription Approval
-- This allows admin to approve subscriptions via the approval link
-- Run this in Supabase SQL Editor

-- Step 1: Create a function to approve subscriptions (bypasses RLS)
CREATE OR REPLACE FUNCTION approve_user_subscription(user_id_to_approve UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE user_profiles
  SET 
    subscription_status = 'paid',
    subscription_expires_at = (NOW() + INTERVAL '1 year'),
    payment_date = NOW(),
    payment_method = 'manual_approval'
  WHERE id = user_id_to_approve;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with ID % not found', user_id_to_approve;
  END IF;
END;
$$;

-- Step 2: Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION approve_user_subscription(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION approve_user_subscription(UUID) TO anon;

-- Step 3: Verify the function was created
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'approve_user_subscription';

-- Step 4: Test the function (optional - replace with actual user ID)
-- SELECT approve_user_subscription('USER_ID_HERE');

