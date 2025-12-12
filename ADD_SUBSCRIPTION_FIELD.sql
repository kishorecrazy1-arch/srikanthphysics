-- Add subscription/payment status to user_profiles table
-- Run this in Supabase SQL Editor

-- Step 1: Add subscription status column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free' CHECK (subscription_status IN ('free', 'paid', 'trial', 'expired'));

-- Step 2: Add subscription expiry date
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_expires_at timestamptz;

-- Step 3: Add payment date
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS payment_date timestamptz;

-- Step 4: Add payment amount (optional - for tracking)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS payment_amount numeric(10,2);

-- Step 5: Add payment method (optional)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS payment_method text;

-- Step 6: Verify columns were added
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
AND column_name IN ('subscription_status', 'subscription_expires_at', 'payment_date', 'payment_amount', 'payment_method')
ORDER BY column_name;

