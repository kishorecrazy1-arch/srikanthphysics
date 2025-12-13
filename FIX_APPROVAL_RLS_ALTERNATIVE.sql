-- Alternative Fix: RLS Policy for Subscription Approval
-- If the function approach doesn't work, use this instead
-- Run this in Supabase SQL Editor

-- Option 1: Allow service role to update any user's subscription
-- This creates a policy that allows updates to subscription fields
CREATE POLICY "Allow subscription approval updates"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (
    -- Allow if updating only subscription-related fields
    (OLD.subscription_status IS DISTINCT FROM NEW.subscription_status OR
     OLD.subscription_expires_at IS DISTINCT FROM NEW.subscription_expires_at OR
     OLD.payment_date IS DISTINCT FROM NEW.payment_date OR
     OLD.payment_method IS DISTINCT FROM NEW.payment_method)
    AND
    -- Ensure other critical fields are not changed
    OLD.id = NEW.id AND
    OLD.email = NEW.email AND
    OLD.name = NEW.name
  );

-- Option 2: Simpler - Allow any authenticated user to update subscription status
-- (Less secure but simpler)
DROP POLICY IF EXISTS "Allow subscription approval updates" ON user_profiles;

CREATE POLICY "Allow subscription approval updates"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Option 3: Disable RLS for subscription updates (NOT RECOMMENDED for production)
-- Only use if other options don't work
-- ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

