# ⚡ Quick Fix: Enable Google Sign-In

## The Problem
When clicking "Continue with Google", you see:
```json
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

**This means Google OAuth is not enabled in your Supabase project.**

---

## ✅ Quick Solution (5 Minutes)

### Step 1: Enable Google in Supabase (2 minutes)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in and select your project

2. **Enable Google Provider**
   - Click **"Authentication"** in left sidebar
   - Click **"Providers"**
   - Find **"Google"** in the list
   - Toggle the switch to **ON** (enable it)

3. **You'll see a form** asking for:
   - Client ID
   - Client Secret

### Step 2: Get Google OAuth Credentials (3 minutes)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create/Select Project**
   - Click "Select a project" → "New Project"
   - Name: "Srikanth Academy"
   - Click "Create"

3. **Enable Google Identity Services API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Identity Services API"
   - Click "Enable"

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - If asked, configure OAuth consent screen:
     - App name: "Srikanth's Academy"
     - Support email: Your email
     - Click "Save and Continue" through all steps
   - Back to OAuth client:
     - Application type: **"Web application"**
     - Name: "Srikanth Academy"
     - **Authorized redirect URIs**: Add this (replace with your Supabase URL):
       ```
       https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback
       ```
     - Click "Create"

5. **Copy Credentials**
   - Copy the **Client ID**
   - Copy the **Client Secret**

### Step 3: Add to Supabase

1. **Go back to Supabase**
   - Authentication → Providers → Google
   - Paste **Client ID**
   - Paste **Client Secret**
   - Click **"Save"**

### Step 4: Test

1. Go to your app
2. Click "Continue with Google"
3. You should see Google's sign-in popup! ✅

---

## 🔍 Find Your Supabase URL

Your Supabase URL is in your `.env` file:
```
VITE_SUPABASE_URL=https://ubivreetpsledaqffuvn.supabase.co
```

The redirect URI should be:
```
https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback
```

---

## ⚠️ Important Notes

- **Redirect URI must match exactly** - Copy it exactly as shown above
- **Save in Supabase** - Don't forget to click "Save" after adding credentials
- **Wait a few seconds** - Sometimes it takes a moment to activate

---

## 🆘 Still Not Working?

1. **Check Supabase Dashboard**
   - Make sure Google provider toggle is **ON** (green)
   - Verify Client ID and Secret are saved

2. **Check Google Cloud Console**
   - Verify redirect URI is exactly: `https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback`
   - Make sure OAuth consent screen is configured

3. **Clear Browser Cache**
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

4. **Check Error Message**
   - If you see "Redirect URI mismatch", the redirect URI in Google Cloud Console is wrong
   - If you see "Invalid client", the Client ID/Secret are wrong

---

## 📝 Alternative: Use Email Sign-In

If you don't want to set up Google OAuth right now, users can still:
- ✅ Sign up with email and password
- ✅ Sign in with email and password

The Google button is optional - email authentication works perfectly!

---

## 🎯 Summary

**The fix:** Enable Google OAuth in Supabase Dashboard and add Google Cloud credentials.

**Time needed:** ~5 minutes

**Difficulty:** Easy (just follow the steps above)

