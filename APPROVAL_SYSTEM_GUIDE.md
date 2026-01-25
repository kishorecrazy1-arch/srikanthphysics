# 🔐 Dashboard Access Approval System

## Overview
Dashboard access is now restricted to users who have been **approved by Srikanth Academy**. Users can login, but they need approval before accessing the dashboard and all protected features.

---

## 🔄 User Flow

### 1. **User Signs In**
- User enters email and password
- System authenticates the user
- User is logged in successfully

### 2. **Email Confirmation Check**
- If email is **not confirmed** → Shows `EmailConfirmationRequired` page
- User must confirm email before proceeding

### 3. **Approval Status Check**
- If email is **confirmed** but user is **not approved** → Shows `ApprovalRequired` page
- User sees message: "Your account is pending approval from Srikanth's Academy"
- Approval request is automatically sent to n8n webhook

### 4. **Dashboard Access**
- User is **approved** (subscription_status = 'paid') → Full dashboard access granted ✅
- All protected routes are accessible

---

## ✅ How Approval Works

### For Users:
1. User signs in successfully
2. If not approved, they see the "Approval Required" page
3. Approval request is automatically sent to Srikanth Academy
4. User waits for admin approval
5. Once approved, user can access dashboard

### For Admins (Srikanth Academy):
1. Admin receives notification via n8n workflow (email/Google Sheets)
2. Admin can approve user in two ways:

   **Option A: Using Approval Link**
   - Click the approval link from the notification
   - Link format: `https://your-domain.com/approve-subscription?userId=USER_ID`
   - User gets immediate access

   **Option B: Manual Approval via Supabase**
   ```sql
   UPDATE user_profiles
   SET 
     subscription_status = 'paid',
     subscription_expires_at = (NOW() + INTERVAL '1 year'),
     payment_date = NOW(),
     payment_method = 'manual_approval'
   WHERE id = 'USER_ID_HERE';
   ```

---

## 🔧 Technical Details

### Approval Status Check
The system checks approval status in `ProtectedRoute` component:

```typescript
// User is approved if subscription_status is 'paid'
const isApproved = user.subscriptionStatus === 'paid' || 
  (user.subscriptionStatus === 'trial' && 
   user.subscriptionExpiresAt && 
   new Date(user.subscriptionExpiresAt) > new Date());

// If not approved, show ApprovalRequired page
if (!isApproved) {
  return <ApprovalRequired />;
}
```

### Database Field
- **Field:** `subscription_status` in `user_profiles` table
- **Values:**
  - `'free'` - Not approved (default for new users)
  - `'paid'` - Approved by admin ✅
  - `'trial'` - Trial access (also allows dashboard access if not expired)
  - `'expired'` - Subscription expired

---

## 📧 n8n Workflow Integration

### Sign-Up Workflow
When a user signs up:
1. n8n receives signup notification via `VITE_N8N_SIGNUP_WEBHOOK_URL`
2. Email sent to `srikanthsacademyforphysics@gmail.com`
3. Admin can review and approve the user

### Sign-In Workflow
When a user signs in:
1. n8n receives signin notification via `VITE_N8N_SIGNIN_WEBHOOK_URL`
2. Email sent to `srikanthsacademyforphysics@gmail.com`
3. If user is not approved, admin can approve them

### Approval Request
When a user tries to access dashboard without approval:
1. `ApprovalRequired` page automatically sends approval request
2. Approval URL is generated: `https://your-domain.com/approve-subscription?userId=USER_ID`
3. This URL can be shared with admin for quick approval

---

## 🎯 Key Points

1. **Login is NOT restricted** - Users can always sign in
2. **Dashboard access IS restricted** - Only approved users can access
3. **Approval = subscription_status = 'paid'** - This is set by admin
4. **Automatic approval request** - Sent when user tries to access dashboard
5. **n8n workflows** - Handle notifications to admin

---

## 🔐 Security

- Users cannot approve themselves
- Only admins can set `subscription_status = 'paid'`
- Approval links contain secure UUID (user ID)
- RLS policies protect user_profiles table

---

## 📝 Testing

### Test User Flow:
1. Create a new account (signup)
2. Sign in with the account
3. Try to access `/dashboard`
4. Should see "Approval Required" page
5. Admin approves via approval link or Supabase
6. User refreshes page → Should now access dashboard ✅

### Test Approval:
1. Get approval URL from ApprovalRequired page
2. Click the approval link (or use Supabase SQL)
3. User's `subscription_status` should be set to `'paid'`
4. User can now access dashboard

---

## ✅ Summary

**Before:** Users could access dashboard after email confirmation
**Now:** Users need approval from Srikanth Academy (subscription_status = 'paid') to access dashboard

**Flow:**
```
Login → Email Confirmed → Approval Required → Admin Approves → Dashboard Access ✅
```

---

## 🆘 Troubleshooting

### User stuck on "Approval Required" page:
- Check if `subscription_status` is set to `'paid'` in Supabase
- Verify user ID is correct
- Check browser console for errors

### Approval link not working:
- Run `FIX_APPROVAL_RLS.sql` in Supabase SQL Editor
- Verify the function `approve_user_subscription` exists
- Check Supabase logs for errors

### n8n notifications not received:
- Verify `VITE_N8N_SIGNUP_WEBHOOK_URL` and `VITE_N8N_SIGNIN_WEBHOOK_URL` are set
- Check n8n workflow is active
- Verify webhook URL is correct

---

## 📞 Contact

For questions about approval system:
- Email: srikanthsacademyforphysics@gmail.com
- Check n8n workflows for user notifications

