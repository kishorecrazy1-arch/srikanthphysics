# 💳 Razorpay Integration Setup Guide

## Overview
This guide explains how to set up Razorpay payment gateway for Srikanth's Academy.

---

## ✅ What's Been Implemented

### 1. **Payment Pages**
- **`/payment`** - Subscription plan selection and payment page
- **`/payment/success`** - Payment success confirmation page

### 2. **Payment Service**
- `razorpayService.ts` - Handles Razorpay Checkout integration
- Loads Razorpay script dynamically
- Handles payment initiation and callbacks

### 3. **Subscription Plans**
- **Monthly**: ₹999 (1 month)
- **Quarterly**: ₹2,499 (3 months) - 17% OFF
- **Yearly**: ₹7,999 (12 months) - 33% OFF

### 4. **Automatic Subscription Update**
- After successful payment, user's `subscription_status` is updated to `'paid'`
- Subscription expiry date is set based on plan duration
- Payment details are saved to database

---

## 🔧 Step 1: Get Razorpay API Keys

1. **Login to Razorpay Dashboard**: https://dashboard.razorpay.com
2. **Go to Settings** → **API Keys**
3. **Copy your Key ID** (starts with `rzp_test_` for test mode or `rzp_live_` for production)
4. **Copy your Key Secret** (keep this secret - only for backend use)

---

## 🔧 Step 2: Add Environment Variables

Add to your `.env` file:

```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

**Important**: 
- Use `rzp_test_...` for testing
- Use `rzp_live_...` for production
- Never commit `.env` file to Git

---

## 🔧 Step 3: Run Database Migration

Make sure you've run the subscription fields migration:

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

-- Add payment amount
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS payment_amount numeric(10,2);

-- Add payment method
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS payment_method text;
```

---

## 🧪 Step 4: Test Payment Flow

### Test Mode (Razorpay Test Cards)

1. **Go to** `/payment` page
2. **Select a plan** (e.g., Quarterly)
3. **Click "Pay Securely with Razorpay"**
4. **Use test card**:
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date (e.g., `12/25`)
   - CVV: `123`
   - Name: Any name
5. **Complete payment**
6. **Verify**:
   - Redirects to `/payment/success`
   - User's subscription status updated to `paid`
   - User can now access dashboard

### Test Cards (Razorpay)

| Card Number | Scenario |
|------------|----------|
| `4111 1111 1111 1111` | Success |
| `4000 0000 0000 0002` | Failure |
| `4000 0000 0000 9995` | 3D Secure |

---

## 🔄 Payment Flow

```
1. User clicks "Subscribe Now" on PaymentRequired page
   ↓
2. User selects subscription plan on /payment page
   ↓
3. User clicks "Pay Securely with Razorpay"
   ↓
4. Razorpay Checkout modal opens
   ↓
5. User enters payment details
   ↓
6. Payment processed by Razorpay
   ↓
7. On success:
   - Payment handler called
   - Subscription status updated to 'paid'
   - Expiry date set based on plan
   - Payment details saved
   - User redirected to /payment/success
   ↓
8. User can now access dashboard and all features
```

---

## 🔐 Security Notes

### Current Implementation (Frontend Only)
- ✅ Payment initiation handled securely via Razorpay Checkout
- ⚠️ Payment verification should be done on backend (recommended)
- ⚠️ Order creation should be done on backend (optional)

### Recommended Backend Implementation

For production, you should:

1. **Create Orders on Backend**:
   ```javascript
   // Backend API: /api/create-razorpay-order
   const Razorpay = require('razorpay');
   const razorpay = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
     key_secret: process.env.RAZORPAY_KEY_SECRET,
   });
   
   const order = await razorpay.orders.create({
     amount: amount * 100, // in paise
     currency: 'INR',
     receipt: receiptId,
   });
   ```

2. **Verify Payments on Backend**:
   ```javascript
   // Backend API: /api/verify-razorpay-payment
   const crypto = require('crypto');
   
   const generatedSignature = crypto
     .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
     .update(orderId + '|' + paymentId)
     .digest('hex');
   
   const isValid = generatedSignature === signature;
   ```

3. **Set Up Webhooks** (Optional):
   - Go to Razorpay Dashboard → Settings → Webhooks
   - Add webhook URL: `https://your-domain.com/api/razorpay-webhook`
   - Listen for `payment.captured` event
   - Update subscription status automatically

---

## 📋 User Flow

### Free User → Paid User:
1. User signs up → `subscription_status = 'free'`
2. User tries to access dashboard → Sees `PaymentRequired` page
3. User clicks "Subscribe Now" → Goes to `/payment`
4. User selects plan and pays → Payment processed
5. Subscription updated → `subscription_status = 'paid'`
6. User redirected to success page → Can now access dashboard

### Paid User:
- Can access all features
- Subscription expires based on plan duration
- After expiry → `subscription_status = 'expired'` → Shows `PaymentRequired` page again

---

## 🛠️ Troubleshooting

### Payment Modal Not Opening
- Check if `VITE_RAZORPAY_KEY_ID` is set in `.env`
- Check browser console for errors
- Verify Razorpay script is loading

### Payment Success But Subscription Not Updated
- Check Supabase logs for errors
- Verify user is authenticated
- Check `user_profiles` table permissions

### Test Payment Failing
- Use correct test card numbers
- Check Razorpay dashboard for payment logs
- Verify API key is correct

---

## 📊 Monitoring Payments

### Razorpay Dashboard
- Go to https://dashboard.razorpay.com
- View all payments under **Payments** section
- Check payment status, amount, customer details

### Database
```sql
-- View all paid users
SELECT 
  name,
  email,
  subscription_status,
  subscription_expires_at,
  payment_amount,
  payment_date
FROM user_profiles
WHERE subscription_status = 'paid'
ORDER BY payment_date DESC;

-- View payment summary
SELECT 
  subscription_status,
  COUNT(*) as count,
  SUM(payment_amount) as total_revenue
FROM user_profiles
WHERE payment_amount IS NOT NULL
GROUP BY subscription_status;
```

---

## ✅ Checklist

- [ ] Get Razorpay API keys from dashboard
- [ ] Add `VITE_RAZORPAY_KEY_ID` to `.env`
- [ ] Run database migration for subscription fields
- [ ] Test payment with test card
- [ ] Verify subscription status updates correctly
- [ ] Test payment success flow
- [ ] Set up backend verification (recommended for production)
- [ ] Set up webhooks (optional)

---

## 🎯 Next Steps

1. **Test the payment flow** with test cards
2. **Switch to production keys** when ready
3. **Set up backend verification** for security
4. **Monitor payments** in Razorpay dashboard
5. **Set up email notifications** for payment confirmations

---

**Ready to accept payments!** 🚀

For support, check Razorpay documentation: https://razorpay.com/docs/

