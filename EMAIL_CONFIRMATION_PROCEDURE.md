# 📧 Email Confirmation Procedure - Complete Guide

## 🎯 Overview

Email confirmation is required for users to access the dashboard. This guide explains:
- How email confirmation works
- What users receive
- Step-by-step procedure
- Troubleshooting

---

## 📨 What Users Will Receive

### When Email Confirmation is Sent

**Automatic email sent when:**
1. ✅ User signs up for the first time
2. ✅ User requests to resend confirmation email
3. ✅ User signs in but email is not confirmed

### Email Details

**From:** Supabase (noreply@supabase.co or configured sender)
**Subject:** "Confirm your signup" or "Confirm your email"
**Content:** Contains a confirmation link

**What the email looks like:**
```
Subject: Confirm your signup

Hi there!

Click the link below to confirm your email address:

[Confirm Email] → https://your-project.supabase.co/auth/v1/verify?token=...

If you didn't sign up, you can safely ignore this email.

Thanks!
```

---

## 🔄 Complete Email Confirmation Procedure

### Step 1: User Signs Up or Signs In

**Scenario A: New User Signs Up**
```
1. User fills signup form
   ↓
2. Clicks "Create Account"
   ↓
3. Supabase automatically sends confirmation email
   ↓
4. User is redirected to demo page (can explore)
   ↓
5. When user tries to access dashboard → Needs email confirmation
```

**Scenario B: Existing User Signs In**
```
1. User enters email + password
   ↓
2. Clicks "Sign In"
   ↓
3. Login successful
   ↓
4. System checks: Email confirmed?
   ├─ YES → Continue to dashboard (if approved)
   └─ NO → Show "Email Confirmation Required" page
```

---

### Step 2: User Receives Confirmation Email

**What happens:**
- ✅ Email sent automatically by Supabase
- ✅ Sent to the email address user provided
- ✅ Usually arrives within 1-2 minutes
- ✅ Contains a secure confirmation link

**Where to check:**
- 📧 **Inbox** - Check main inbox folder
- 📧 **Spam/Junk** - Sometimes goes to spam folder
- 📧 **Promotions** - Check Gmail promotions tab

---

### Step 3: User Clicks Confirmation Link

**What the link looks like:**
```
https://your-project.supabase.co/auth/v1/verify?token=abc123xyz...
```

**What happens when clicked:**
1. ✅ User's email is marked as confirmed in Supabase
2. ✅ `email_confirmed_at` field is set in database
3. ✅ User can now proceed to dashboard (if approved)

**After clicking:**
- User is redirected to a confirmation success page
- Or redirected back to your app
- Email is now confirmed ✅

---

### Step 4: User Signs In Again

**After email confirmation:**
```
1. User signs in with email + password
   ↓
2. System checks: Email confirmed? ✅ YES
   ↓
3. System checks: Subscription approved?
   ├─ YES → Dashboard access ✅
   └─ NO → Shows "Approval Required" page
```

---

## 📋 Step-by-Step User Instructions

### For Users: How to Confirm Email

**Step 1:** Check Your Email
- Open your email inbox
- Look for email from "Supabase" or "Srikanth's Academy"
- Subject: "Confirm your signup" or similar
- **Check spam folder if not in inbox**

**Step 2:** Click the Confirmation Link
- Open the email
- Click the "Confirm Email" button or link
- Link will open in your browser

**Step 3:** Email Confirmed
- You'll see a success message
- Your email is now confirmed ✅

**Step 4:** Sign In Again
- Go back to login page
- Sign in with your email + password
- You should now be able to access dashboard (if approved)

---

## 🔄 Resend Confirmation Email

If user didn't receive the email:

**Option 1: From "Email Confirmation Required" Page**
1. User sees "Email Confirmation Required" page
2. Clicks "Resend Confirmation Email" button
3. New confirmation email is sent

**Option 2: From Login Page**
- User can request resend from login page (if feature exists)

**Option 3: Manual Resend (Admin)**
In Supabase Dashboard:
1. Go to Authentication → Users
2. Find the user
3. Click "Send confirmation email"

---

## ⚙️ How It Works Technically

### Email Confirmation Flow

```
1. User signs up/signs in
   ↓
2. Supabase checks: email_confirmed_at = null?
   ├─ YES → Send confirmation email
   └─ NO → Email already confirmed
   ↓
3. Email sent via Supabase email service
   ↓
4. User clicks link in email
   ↓
5. Supabase verifies token
   ↓
6. Sets email_confirmed_at = current timestamp
   ↓
7. Email confirmed ✅
```

### Database Field

**Table:** `auth.users` (Supabase managed)
**Field:** `email_confirmed_at`
- `null` = Email not confirmed ❌
- `timestamp` = Email confirmed ✅

---

## 🔧 Configuration (For Admin)

### Where Email Settings Are Configured

**Supabase Dashboard:**
1. Go to **Authentication** → **Email Templates**
2. You can customize:
   - Email subject
   - Email content
   - Sender name
   - Confirmation link format

### Custom SMTP (Optional)

To send emails from `srikanthsacademyforphysics@gmail.com`:

1. **Set up SMTP in Supabase:**
   - Go to Authentication → SMTP Settings
   - Configure Gmail SMTP:
     - Host: `smtp.gmail.com`
     - Port: `587`
     - Username: `srikanthsacademyforphysics@gmail.com`
     - Password: App password (not regular password)

2. **Create Gmail App Password:**
   - Go to Google Account → Security
   - Enable 2-Step Verification
   - Generate App Password
   - Use that password in Supabase SMTP settings

---

## 🚨 Troubleshooting

### Issue 1: User Didn't Receive Email

**Solutions:**
1. ✅ Check spam/junk folder
2. ✅ Check email address is correct
3. ✅ Click "Resend Confirmation Email"
4. ✅ Wait a few minutes (sometimes delayed)
5. ✅ Check Supabase email logs

### Issue 2: Confirmation Link Expired

**Solutions:**
1. ✅ Request new confirmation email
2. ✅ Links usually expire after 24 hours
3. ✅ Admin can manually confirm in Supabase

### Issue 3: Email Already Confirmed But Still Shows Error

**Solutions:**
1. ✅ Sign out and sign in again
2. ✅ Clear browser cache
3. ✅ Check `email_confirmed_at` in Supabase database

### Issue 4: Email Sent But User Can't Click Link

**Solutions:**
1. ✅ Copy link and paste in browser
2. ✅ Try different browser
3. ✅ Check if link is not broken

---

## ✅ Verification Checklist

**For Users:**
- [ ] Received confirmation email
- [ ] Clicked confirmation link
- [ ] Saw success message
- [ ] Signed in again
- [ ] Can access dashboard (if approved)

**For Admin:**
- [ ] Email templates configured in Supabase
- [ ] SMTP settings correct (if using custom)
- [ ] Email delivery working
- [ ] Users receiving emails successfully

---

## 📝 Summary

**Email Confirmation Process:**
1. ✅ User signs up/signs in
2. ✅ Supabase sends confirmation email automatically
3. ✅ User receives email (check inbox/spam)
4. ✅ User clicks confirmation link
5. ✅ Email confirmed ✅
6. ✅ User signs in again → Can access dashboard (if approved)

**Key Points:**
- Email is sent **automatically** by Supabase
- User must **click the link** in email
- After confirmation, user can **sign in** and access dashboard
- Email confirmation is **required** for dashboard access

---

## 🆘 Need Help?

**For Users:**
- Check spam folder
- Click "Resend Confirmation Email"
- Contact: srikanthsacademyforphysics@gmail.com

**For Admin:**
- Check Supabase Dashboard → Authentication → Email Templates
- Check email delivery logs
- Verify SMTP settings (if using custom)
