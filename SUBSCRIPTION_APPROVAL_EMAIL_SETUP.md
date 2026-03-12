# 📧 Subscription Approval Email Setup Guide

## Overview
When a user requests subscription access, an email is automatically sent to `srikanthsacademyforphysics@gmail.com` with an **approval link** that you can click to instantly approve their subscription.

---

## ✅ What's Been Implemented

1. **Automatic Approval Request**: When a user without a subscription tries to access the platform, an approval request is automatically sent
2. **Approval Link**: Each email includes a unique approval link with the user's ID
3. **One-Click Approval**: Clicking the link instantly approves the user's subscription (1 year access)

---

## 🔧 Step 1: Configure n8n Workflow

### Update Your n8n Workflow to Include Approval Link

1. **Open your n8n workflow** for subscription approvals
2. **Add/Update Gmail Node** after receiving the webhook

### Email Template with Approval Button

Use this HTML template in your Gmail node:

```html
<h2>🎓 New Subscription Approval Request</h2>

<p><strong>Student Information:</strong></p>
<ul>
  <li><strong>Name:</strong> {{ $json.name }}</li>
  <li><strong>Email:</strong> {{ $json.email }}</li>
  <li><strong>Phone:</strong> {{ $json.phone || 'Not provided' }}</li>
  <li><strong>Grade:</strong> {{ $json.grade || 'Not provided' }}</li>
  <li><strong>Course Type:</strong> {{ $json.courseType || 'Not provided' }}</li>
  <li><strong>Country Code:</strong> {{ $json.countryCode || 'Not provided' }}</li>
</ul>

<hr>

<p><strong>Submission Details:</strong></p>
<ul>
  <li><strong>User ID:</strong> {{ $json.userId }}</li>
  <li><strong>Submitted:</strong> {{ $json.timestamp }}</li>
</ul>

<hr>

<div style="text-align: center; margin: 30px 0;">
  <a href="{{ $json.approvalUrl }}" 
     style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
    ✅ Approve Subscription
  </a>
</div>

<p style="color: #666; font-size: 12px;">
  Click the button above to instantly approve this user's subscription. They will receive 1 year of access to Srikanth's Academy platform.
</p>

<p style="color: #666; font-size: 12px; margin-top: 20px;">
  Approval Link: <a href="{{ $json.approvalUrl }}">{{ $json.approvalUrl }}</a>
</p>
```

---

## 📋 Email Configuration in n8n

### Gmail Node Settings:

1. **Operation**: `Send Email`
2. **To**: `srikanthsacademyforphysics@gmail.com`
3. **Subject**: `Subscription Approval Request: {{ $json.name }}`
4. **Email Type**: `HTML`
5. **Message**: Use the HTML template above

---

## 🔗 How the Approval Link Works

1. **User requests subscription** → Approval email sent to you
2. **You click "Approve Subscription" button** → Opens approval page
3. **System automatically**:
   - Updates user's `subscription_status` to `'paid'`
   - Sets `subscription_expires_at` to 1 year from now
   - Records `payment_date` and `payment_method` as 'manual_approval'
4. **User can now sign in** and access all platform features

---

## 🧪 Testing

### Test the Approval Flow:

1. **Create a test user** (or use existing user without subscription)
2. **Try to access protected content** (e.g., `/dashboard`)
3. **Check email** at `srikanthsacademyforphysics@gmail.com`
4. **Click approval link** in the email
5. **Verify** user can now access the platform

---

## 📝 Approval Link Format

The approval link will look like:
```
https://your-domain.com/approve-subscription?userId=USER_ID_HERE
```

**Example:**
```
https://srikanthsacademy.com/approve-subscription?userId=123e4567-e89b-12d3-a456-426614174000
```

---

## 🔐 Security Notes

- The approval link contains the user's ID (UUID)
- Only users with valid IDs can be approved
- Approval is instant - no confirmation needed
- Each approval grants 1 year of access

---

## ✅ Checklist

- [ ] n8n workflow receives subscription approval requests
- [ ] Gmail node configured with approval link template
- [ ] Approval link uses `{{ $json.approvalUrl }}` from payload
- [ ] Test email received with approval button
- [ ] Clicking approval button successfully approves user
- [ ] Approved user can access platform features

---

## 🎯 Current Status

✅ **Implemented:**
- Automatic approval request when subscription needed
- Approval page at `/approve-subscription`
- Approval link included in webhook payload
- One-click subscription approval

⏳ **To Do:**
- Configure n8n workflow with approval link in email
- Test end-to-end approval flow

---

## 📞 Support

If the approval link doesn't work:
1. Check that `VITE_APP_URL` is set in environment variables (or it will use current domain)
2. Verify the user ID in the link matches a user in Supabase
3. Check browser console for any errors
4. Ensure Supabase permissions allow updating `user_profiles` table

