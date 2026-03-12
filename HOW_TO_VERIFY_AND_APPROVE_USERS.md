# 🔐 How to Verify and Approve Users for Sign In

## Quick Summary

✅ **Anyone can sign in** - Login is NOT restricted
❌ **Dashboard access IS restricted** - Users need approval to access dashboard

---

## 📋 Step-by-Step Guide

### Step 1: User Signs In

Users can sign in with email and password. They will be authenticated successfully.

**After sign-in, the system checks:**

1. **Email Confirmed?**
   - ❌ NO → Shows "Email Confirmation Required" page
   - ✅ YES → Proceeds to approval check

2. **User Approved?**
   - ❌ NO → Shows "Approval Required" page
   - ✅ YES → Dashboard access granted ✅

---

## ✅ Method 1: Approve via Approval Link (Easiest)

When a user requests approval, they get an approval URL like:
```
https://your-domain.com/approve-subscription?userId=USER_ID_HERE
```

**Steps:**
1. User visits the approval link (or you receive it via email)
2. Click the link - it automatically approves the user
3. User gets immediate dashboard access

---

## ✅ Method 2: Approve via Supabase Dashboard (Visual)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Open `user_profiles` table**
   - Go to "Table Editor" → `user_profiles`

3. **Find the user**
   - Search by email or user ID
   - Click on the user row

4. **Update subscription status:**
   - Change `subscription_status` from `'free'` to `'paid'`
   - Optionally set:
     - `subscription_expires_at`: Future date (e.g., 1 year from now)
     - `payment_date`: Current date
     - `payment_method`: `'manual_approval'`

5. **Save changes**
   - User gets immediate dashboard access ✅

---

## ✅ Method 3: Approve via SQL Query (Fast for multiple users)

### Approve Specific User by Email

```sql
UPDATE user_profiles
SET 
  subscription_status = 'paid',
  subscription_expires_at = (NOW() + INTERVAL '1 year'),
  payment_date = NOW(),
  payment_method = 'manual_approval'
WHERE email = 'user@example.com';
```

### Approve Specific User by ID

```sql
UPDATE user_profiles
SET 
  subscription_status = 'paid',
  subscription_expires_at = (NOW() + INTERVAL '1 year'),
  payment_date = NOW(),
  payment_method = 'manual_approval'
WHERE id = 'USER_ID_HERE';
```

### Approve All Users (Use Carefully!)

```sql
UPDATE user_profiles
SET 
  subscription_status = 'paid',
  subscription_expires_at = (NOW() + INTERVAL '1 year'),
  payment_date = NOW(),
  payment_method = 'manual_approval';
```

---

## 🔍 How to Find User ID

### Option 1: From Approval URL
If you have an approval link:
```
https://your-domain.com/approve-subscription?userId=123abc-456def-789ghi
                                                      ^^^^^^^^^^^^^^^^^^^
                                                      This is the USER_ID
```

### Option 2: From Supabase Dashboard
1. Go to Supabase → Table Editor → `user_profiles`
2. Find user by email
3. Copy the `id` column value

### Option 3: Via SQL Query
```sql
SELECT id, email, name, subscription_status 
FROM user_profiles 
WHERE email = 'user@example.com';
```

---

## 📊 Subscription Status Values

| Status | Dashboard Access | How to Set |
|--------|-----------------|------------|
| `'free'` | ❌ No | Default for new users |
| `'paid'` | ✅ Yes | Set by admin (approval) |
| `'trial'` | ✅ Yes* | If expiry date is valid |
| `'expired'` | ❌ No | Trial period ended |

*Trial users can access dashboard if `subscription_expires_at` is in the future

---

## 🚀 Quick Approval Workflow

### For Single User:
```
1. User signs in → Sees "Approval Required" page
2. User clicks "Request Approval" → Approval URL generated
3. Admin receives notification (via n8n/email)
4. Admin clicks approval link OR updates in Supabase
5. User refreshes → Dashboard access granted ✅
```

### For Multiple Users:
```sql
-- Approve all users who signed up today
UPDATE user_profiles
SET subscription_status = 'paid'
WHERE created_at >= CURRENT_DATE
AND subscription_status = 'free';
```

---

## 🔐 Test Mode (Bypass All Checks)

For testing purposes, you can enable test mode:

1. **In Browser Console:**
   ```javascript
   localStorage.setItem('testMode', 'true');
   ```

2. **Refresh the page**
   - All users get full access (bypasses approval checks)
   - Useful for development/testing

3. **Disable test mode:**
   ```javascript
   localStorage.removeItem('testMode');
   ```

---

## 📧 Email Confirmation

Before approval, users must confirm their email:

1. **User signs up** → Email confirmation link sent by Supabase
2. **User clicks link in email** → Email confirmed
3. **User can now be approved** → Admin can grant access

**Note:** If email is not confirmed, user sees "Email Confirmation Required" page instead of approval page.

---

## 🎯 Approval Checklist

Before approving a user, verify:
- [ ] User has confirmed their email
- [ ] User ID or email is correct
- [ ] Subscription status is currently `'free'`
- [ ] You have admin access to Supabase

After approving:
- [ ] User can sign in successfully
- [ ] User can access `/dashboard`
- [ ] User can access all protected routes
- [ ] Subscription status shows as `'paid'` in database

---

## 🆘 Troubleshooting

### "Approval Failed" Error
1. Check RLS policies - Run `FIX_APPROVAL_RLS.sql` in Supabase
2. Verify user ID is correct
3. Check Supabase logs for detailed errors

### User Still Can't Access Dashboard
1. Verify `subscription_status = 'paid'` in database
2. Check if email is confirmed
3. Have user sign out and sign in again
4. Clear browser cache

### Can't Update Subscription Status
1. Check RLS policies allow updates
2. Verify you have admin/service role key
3. Use Supabase SQL Editor (bypasses RLS)

---

## 📝 Summary

**To give a user dashboard access:**
1. ✅ They must confirm their email (automatic via Supabase)
2. ✅ Set their `subscription_status` to `'paid'` in Supabase
3. ✅ User refreshes/signs in → Dashboard access granted!

**Methods to approve:**
- 🔗 Approval link (easiest)
- 📊 Supabase Dashboard (visual)
- 💻 SQL Query (fast for multiple users)

---

**That's it! Users with `subscription_status = 'paid'` get full dashboard access! 🎉**
