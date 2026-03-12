/*
  # Add Phone Number Fields to User Profiles

  1. Changes
    - Add `country_code` column to `user_profiles` table (text, default '+91')
    - Add `phone_number` column to `user_profiles` table (text, not null)
    
  2. Notes
    - Uses IF NOT EXISTS to prevent errors if columns already exist
    - Phone number is required for user registration
    - Country code defaults to India (+91) but can be changed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'country_code'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN country_code text DEFAULT '+91';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN phone_number text NOT NULL DEFAULT '';
  END IF;
END $$;