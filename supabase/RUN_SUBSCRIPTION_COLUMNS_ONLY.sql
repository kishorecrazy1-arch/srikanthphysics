/* Run this ONLY if full schema + policies already exist and you only need subscription columns.
   (Use when RUN_IN_SUPABASE.sql failed at duplicate policy but base tables are OK.)
*/

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subscription_expires_at timestamptz;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS payment_date timestamptz;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS payment_amount numeric(10,2);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS payment_method text;
