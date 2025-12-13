# 🔐 Login Process Explained

## What Happens When You Log In

### 1️⃣ **"Credentials are validated with Supabase"**

**What it means:**
- When you enter your email and password and click "Sign In"
- The app sends your credentials to **Supabase** (the authentication service)
- Supabase checks if:
  - ✅ Your email exists in their system
  - ✅ Your password is correct
  - ✅ Your account is active

**Think of it like:** A security guard checking your ID card at the entrance.

---

### 2️⃣ **"Your user profile is fetched from the database"**

**What it means:**
- After your credentials are validated, the app asks Supabase: "Give me this user's information"
- Supabase looks in the database and returns:
  - Your name
  - Your email
  - Your grade
  - Your course selection
  - Your progress (streak, questions answered, etc.)
  - Your subscription status

**Think of it like:** After the security guard verifies your ID, they look up your file and give you your information.

---

### 3️⃣ **"Session is created"**

**What it means:**
- Supabase creates a **session token** (like a temporary pass)
- This token is stored in your browser
- As long as you have this token, you stay logged in
- You don't need to enter your password again until you log out
- The token expires after some time (for security)

**Think of it like:** Getting a wristband at an event that lets you come and go without showing your ticket again.

---

## 📧 About Email Confirmation

### **Important:** Email confirmation is NOT sent from `srikanthsacademyforphysics@gmail.com`

**How it actually works:**

1. **Who sends the email?**
   - Supabase sends the confirmation email automatically
   - It comes from Supabase's email service (usually `noreply@supabase.co` or similar)
   - **NOT** from `srikanthsacademyforphysics@gmail.com`

2. **What is `srikanthsacademyforphysics@gmail.com`?**
   - This is just a **contact/support email** mentioned in the messages
   - It's shown to users so they know who to contact if they have issues
   - It's **NOT** the email that sends confirmations

3. **Where does the confirmation email come from?**
   - Supabase Dashboard → Authentication → Email Templates
   - You can customize the sender name and email there
   - By default, it comes from Supabase's email service

4. **What the user sees:**
   - The confirmation email will say something like "Confirm your email for Srikanth's Academy"
   - But it's sent by Supabase's email system
   - The user clicks the link in that email to confirm

---

## 🔄 Complete Login Flow

```
1. User enters email + password
   ↓
2. App sends to Supabase: "Validate these credentials"
   ↓
3. Supabase checks: ✅ Email exists, ✅ Password correct
   ↓
4. Supabase creates session token
   ↓
5. App asks: "Get this user's profile data"
   ↓
6. Supabase returns: Name, grade, course, progress, etc.
   ↓
7. App checks: Is email confirmed? Is subscription active?
   ↓
8. If all good → Show Dashboard
   If email not confirmed → Show Email Confirmation page
   If no subscription → Show Payment page
```

---

## ⚙️ Can You Change Email Confirmation Settings?

**Yes!** You can configure this in Supabase Dashboard:

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. You can:
   - Change the sender email (if you have a custom domain)
   - Customize the email content
   - Change the confirmation link format
   - Disable email confirmation (not recommended for security)

**Note:** To send emails from `srikanthsacademyforphysics@gmail.com`, you would need to:
- Set up a custom SMTP server
- Configure it in Supabase Dashboard → Authentication → SMTP Settings
- This requires additional setup and may have costs

---

## 📝 Summary

- **Credentials validation** = Supabase checks if your email/password are correct
- **Profile fetched** = App gets your user data from the database
- **Session created** = You get a temporary login token
- **Email confirmation** = Sent by Supabase (not from srikanthsacademyforphysics@gmail.com)
- **srikanthsacademyforphysics@gmail.com** = Just a contact email, not the sender

The email confirmation system is automatic and handled by Supabase. You don't need to manually approve anything through the srikanthsacademyforphysics@gmail.com email address.

