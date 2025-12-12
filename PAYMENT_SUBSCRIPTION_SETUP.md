# 💳 Payment & Subscription Setup Guide

## Overview
This guide explains how the payment/subscription system works and how to mark users as paid subscribers.

---

## ✅ What's Been Implemented

### 1. **Navigation Flow**
- **"Sign In"** button → Routes to `/login` (for paying users)
- **"Get Started"** button → Routes to `/demo` (free demo for leads)

### 2. **Subscription Check System**
- Added subscription status fields to `user_profiles` table
- `ProtectedRoute` now checks if user has paid subscription
- Shows `PaymentRequired` page if user hasn't paid
- Test mode bypasses payment check

### 3. **Database Schema**
Added columns to `user_profiles`:
- `subscription_status` (free | paid | trial | expired)
- `subscription_expires_at` (timestamp)
- `payment_date` (timestamp)
- `payment_amount` (numeric)
- `payment_method` (text)

---

## 🔧 Step 1: Add Subscription Fields to Database

Run this SQL in Supabase SQL Editor:

```sql
-- Add subscription status column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free' 
CHECK (subscription_status IN ('free', 'paid', 'trial', 'expired'));

-- Add subscription expiry date
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS subscription_expires_at timestamptz;

-- Add payment date
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS payment_date timestamptz;

-- Add payment amount (optional)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS payment_amount numeric(10,2);

-- Add payment method (optional)
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS payment_method text;
```

---

## 💰 Step 2: Mark User as Paid (Manual Method)

### Option A: Via Supabase Dashboard

1. Go to **Table Editor** → `user_profiles`
2. Find the user you want to mark as paid
3. Update these fields:
   - `subscription_status`: `paid`
   - `subscription_expires_at`: Set expiry date (e.g., `2025-12-31 23:59:59`)
   - `payment_date`: Today's date
   - `payment_amount`: Amount paid (optional)
   - `payment_method`: Payment method (optional)

### Option B: Via SQL

```sql
-- Mark user as paid (replace USER_ID with actual user ID)
UPDATE user_profiles
SET 
  subscription_status = 'paid',
  subscription_expires_at = '2025-12-31 23:59:59+00',
  payment_date = NOW(),
  payment_amount = 99.00,
  payment_method = 'Stripe'
WHERE id = 'USER_ID_HERE';
```

---

## 🔄 Step 3: Set Up Payment Integration (Future)

### Option 1: Stripe Integration

1. **Create Stripe Account**: https://stripe.com
2. **Get API Keys**: Dashboard → Developers → API keys
3. **Add to `.env`**:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
4. **Create Payment Page**: `/payment` route
5. **Webhook**: Handle payment success → Update `subscription_status` to `paid`

### Option 2: Razorpay Integration (India)

1. **Create Razorpay Account**: https://razorpay.com
2. **Get API Keys**: Dashboard → Settings → API Keys
3. **Add to `.env`**:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_...
   ```
4. **Create Payment Page**: `/payment` route
5. **Webhook**: Handle payment success → Update `subscription_status` to `paid`

### Option 3: Manual Payment (Current)

1. User fills demo form → Goes to n8n → Google Sheets
2. You receive payment manually
3. Update `subscription_status` in Supabase
4. User can then sign in and access the platform

---

## 📋 User Flow

### Free Demo Flow:
1. User clicks **"Get Started"** → Goes to `/demo`
2. Fills demo form → Data sent to n8n → Google Sheets
3. You contact them → They pay → You mark as paid

### Paid User Flow:
1. User clicks **"Sign In"** → Goes to `/login`
2. Signs in with email/password
3. System checks `subscription_status`
4. If `paid` → Access granted ✅
5. If `free` → Shows `PaymentRequired` page ❌

---

## 🧪 Testing

### Test Paid User:
1. **Mark a test user as paid**:
   ```sql
   UPDATE user_profiles
   SET subscription_status = 'paid',
       subscription_expires_at = '2026-12-31 23:59:59+00'
   WHERE email = 'test@example.com';
   ```
2. **Sign in** with that user
3. **Should access** dashboard and all features

### Test Free User:
1. **Sign up** a new user (defaults to `free`)
2. **Sign in** with that user
3. **Should see** `PaymentRequired` page

---

## 🔐 Subscription Status Values

- **`free`**: Default - No access to platform
- **`paid`**: Active subscription - Full access
- **`trial`**: Trial period - Access until `subscription_expires_at`
- **`expired`**: Subscription expired - No access

---

## 📝 Quick Reference

### Check User Subscription:
```sql
SELECT 
  name,
  email,
  subscription_status,
  subscription_expires_at,
  payment_date
FROM user_profiles
WHERE email = 'user@example.com';
```

### Mark User as Paid:
```sql
UPDATE user_profiles
SET subscription_status = 'paid',
    subscription_expires_at = '2025-12-31 23:59:59+00',
    payment_date = NOW()
WHERE email = 'user@example.com';
```

### Check All Paid Users:
```sql
SELECT name, email, subscription_status, subscription_expires_at
FROM user_profiles
WHERE subscription_status = 'paid';
```

---

## ✅ Checklist

- [ ] Run SQL to add subscription fields
- [ ] Test marking a user as paid
- [ ] Test free user sees PaymentRequired page
- [ ] Test paid user can access platform
- [ ] Set up payment gateway (Stripe/Razorpay) - Future
- [ ] Create payment page - Future
- [ ] Set up webhook to auto-update subscription - Future

---

## 🎯 Current Status

✅ **Implemented:**
- Subscription status check
- PaymentRequired page
- Navigation routing (Sign In → Login, Get Started → Demo)
- Database schema ready for subscription fields

⏳ **To Do:**
- Payment gateway integration
- Payment page
- Webhook to auto-update subscription
- Email notifications for payment

---

## 🆘 Troubleshooting

### User can't access after payment:
- Check `subscription_status` is set to `paid`
- Check `subscription_expires_at` is in the future
- Verify user is signed in correctly

### PaymentRequired page not showing:
- Check `ProtectedRoute` is wrapping protected routes
- Verify `subscription_status` is not `paid`
- Check browser console for errors

---

**Ready to test!** Mark a user as paid and try signing in to verify everything works! 🚀

