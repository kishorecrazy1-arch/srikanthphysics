# 🔐 Sign In & Dashboard Access Guide

## Who Can Sign In?

✅ **Anyone can sign in** - Login is NOT restricted
- Users just need a valid email and password
- No approval needed to login
- No email confirmation needed to login

---

## Who Gets Dashboard Access?

❌ **Dashboard access IS restricted** - Users need to pass these checks:

### Step 1: ✅ Email Confirmation Required
- User must confirm their email address
- Email confirmation link is sent by Supabase when user signs up
- Until email is confirmed → User sees "Email Confirmation Required" page

### Step 2: ✅ Subscription Approval Required
After email is confirmed, user needs approval:

**Approved users get dashboard access:**
- ✅ `subscription_status = 'paid'` (approved by admin)
- ✅ `subscription_status = 'trial'` (with valid expiry date)
- ✅ Test mode enabled (bypasses all checks)

**Not approved users see:**
- ❌ "Approval Required" page
- ❌ Cannot access dashboard

---

## 📋 Complete User Journey

### Scenario 1: New User (First Time)

```
1. User signs up with email + password
   ↓
2. Account created in Supabase
   ↓
3. User profile created (subscription_status = 'free' by default)
   ↓
4. Auto sign-in happens
   ↓
5. Redirects to /demo page (can explore demo features)
   ↓
6. User tries to access /dashboard
   ↓
7. System checks:
   ├─ Email confirmed? NO → Shows "Email Confirmation Required"
   └─ Email confirmed? YES → Checks subscription
       ├─ Approved? NO → Shows "Approval Required"
       └─ Approved? YES → Dashboard access ✅
```

### Scenario 2: Existing User Signs In

```
1. User goes to /login page
   ↓
2. Enters email + password
   ↓
3. Clicks "Sign In"
   ↓
4. Credentials validated → Login successful
   ↓
5. System checks:
   ├─ Email confirmed? NO → Shows "Email Confirmation Required"
   └─ Email confirmed? YES → Checks subscription
       ├─ Approved? NO → Shows "Approval Required"
       └─ Approved? YES → Dashboard access ✅
```

---

## 🔍 Access Control Logic

The system checks access in this order (from `ProtectedRoute.tsx`):

```typescript
1. Is user logged in?
   ├─ NO → Redirect to /login
   └─ YES → Continue

2. Is test mode enabled?
   ├─ YES → Grant full access (skip all checks)
   └─ NO → Continue

3. Is email confirmed?
   ├─ NO → Show "Email Confirmation Required" page
   └─ YES → Continue

4. Is user approved?
   ├─ NO → Show "Approval Required" page
   └─ YES → Grant dashboard access ✅
```

---

## ✅ How to Approve Users (For Admin)

### Option 1: Using Approval Link

When a user requests approval, an approval link is generated:
```
https://your-domain.com/approve-subscription?userId=USER_ID
```

**Steps:**
1. Click the approval link
2. User's subscription_status automatically set to 'paid'
3. User gets immediate dashboard access

### Option 2: Manual Approval via Supabase

1. Go to Supabase Dashboard
2. Open `user_profiles` table
3. Find the user
4. Update their record:
   ```sql
   UPDATE user_profiles
   SET 
     subscription_status = 'paid',
     subscription_expires_at = (NOW() + INTERVAL '1 year'),
     payment_date = NOW(),
     payment_method = 'manual_approval'
   WHERE id = 'USER_ID_HERE';
   ```

### Option 3: Direct Database Update

In Supabase SQL Editor:
```sql
-- Approve specific user
UPDATE user_profiles
SET subscription_status = 'paid'
WHERE email = 'user@example.com';

-- Approve all users (use carefully!)
UPDATE user_profiles
SET subscription_status = 'paid';
```

---

## 🎯 Subscription Status Values

| Status | Dashboard Access | Description |
|--------|-----------------|-------------|
| `'free'` | ❌ No | Default for new users (not approved) |
| `'paid'` | ✅ Yes | Approved by admin |
| `'trial'` | ✅ Yes* | Trial access (if not expired) |
| `'expired'` | ❌ No | Trial/Subscription expired |

*Trial users get access only if `subscription_expires_at` is in the future.

---

## 🧪 Test Mode (Bypass All Checks)

For testing purposes, you can enable test mode:

**Enable:**
```javascript
localStorage.setItem('testMode', 'true');
```

**Disable:**
```javascript
localStorage.removeItem('testMode');
```

**What test mode does:**
- ✅ Bypasses email confirmation check
- ✅ Bypasses subscription approval check
- ✅ Grants full dashboard access immediately
- ✅ Allows testing all features without approval

---

## 📧 Email Confirmation Process

1. **When user signs up:**
   - Supabase automatically sends confirmation email
   - User must click the link in email
   - Email sent from: Supabase (configured in Supabase dashboard)

2. **If email not confirmed:**
   - User can still login
   - But cannot access dashboard
   - Sees "Email Confirmation Required" page

3. **Resend confirmation email:**
   - User can request new confirmation link
   - From "Email Confirmation Required" page

---

## 🔐 Summary

### ✅ Can Sign In:
- **Anyone** with valid email + password
- No restrictions on login

### ✅ Gets Dashboard Access:
- Email confirmed ✅
- Subscription approved (`subscription_status = 'paid'` or valid trial) ✅
- OR test mode enabled ✅

### ❌ Cannot Access Dashboard:
- Email not confirmed ❌
- Not approved (subscription_status = 'free') ❌
- Subscription expired ❌

---

## 🆘 Quick Help

**User can't access dashboard?**
1. Check if email is confirmed
2. Check `subscription_status` in database
3. Update to `'paid'` if needed

**Need to approve user quickly?**
- Use approval link from console/logs
- Or update database directly via Supabase

**Testing?**
- Enable test mode: `localStorage.setItem('testMode', 'true')`
- Disable after testing: `localStorage.removeItem('testMode')`
