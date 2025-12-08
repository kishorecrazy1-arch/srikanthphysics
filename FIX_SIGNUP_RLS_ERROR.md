# 🔴 Fix: "new row violates row-level security policy for table user_profiles"

## Problem
When signing up, you're getting this error:
```
new row violates row-level security policy for table "user_profiles"
```

This happens because the Row Level Security (RLS) policy is blocking the insert operation during signup.

---

## ✅ Quick Fix (2 Steps)

### Step 1: Run SQL in Supabase Dashboard

1. Go to your Supabase Dashboard:
   **https://supabase.com/dashboard/project/ubivreetpsledaqffuvn/sql/new**

2. Copy and paste this SQL:

```sql
-- Fix RLS Policy for user_profiles table
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
```

3. Click **"Run"** (or press Ctrl+Enter)

4. You should see: ✅ "Success. No rows returned"

### Step 2: Try Signing Up Again

1. Go back to your app
2. Fill out the signup form
3. Click "Create Account"
4. It should work now! ✅

---

## 🔍 Why This Happened

The RLS policy for inserting into `user_profiles` either:
- Didn't exist
- Was incorrectly configured
- Was blocking the insert even though the user ID matched

The fix ensures that authenticated users can insert their own profile row where `id = auth.uid()`.

---

## 🧪 Verify It's Fixed

After running the SQL, you can verify the policy exists:

```sql
SELECT 
  policyname,
  cmd,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'
AND cmd = 'INSERT';
```

You should see:
- **policyname**: "Users can insert own profile"
- **cmd**: "INSERT"
- **with_check**: "(auth.uid() = id)"

---

## 📋 Complete Policy Check

To see all policies on `user_profiles`:

```sql
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_profiles'
ORDER BY cmd;
```

You should have:
1. ✅ **SELECT** policy - "Users can view own profile"
2. ✅ **INSERT** policy - "Users can insert own profile" 
3. ✅ **UPDATE** policy - "Users can update own profile"

---

## 🚨 If It Still Doesn't Work

### Check 1: Email Confirmation
If you have "Confirm email" enabled in Supabase:
- Go to **Authentication** → **Providers** → **Supabase Auth**
- Toggle **"Confirm email"** to **OFF** (for development)
- Click **"Save changes"**

### Check 2: Table Structure
Make sure the `user_profiles` table has these columns:
- `id` (uuid, primary key)
- `name` (text)
- `email` (text)
- `country_code` (text)
- `phone_number` (text)
- `grade` (integer)
- `course_type` (text)

### Check 3: RLS is Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_profiles';
```

`rowsecurity` should be `true`.

---

## ✅ After Fix

Once fixed, users can:
- ✅ Sign up with email/password
- ✅ Have their profile automatically created
- ✅ Sign in immediately
- ✅ Access all features

---

## 📝 Full SQL Script

If you want to run the complete fix (including creating missing policies), use the file `FIX_USER_PROFILES_RLS.sql` in your project root.

---

## 🆘 Still Having Issues?

1. **Check browser console** (F12) for detailed error messages
2. **Check Supabase logs**: Dashboard → Logs → API
3. **Verify user was created**: Dashboard → Authentication → Users
4. **Check if profile exists**: Dashboard → Table Editor → user_profiles



