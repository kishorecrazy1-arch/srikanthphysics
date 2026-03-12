# 🔐 How to Enable Google OAuth in Supabase

## Current Issue
When clicking "Continue with Google", you're seeing:
```json
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

This means Google OAuth is not enabled in your Supabase project.

---

## ✅ Step-by-Step Solution

### Step 1: Go to Supabase Dashboard

1. Open your browser and go to: **https://supabase.com/dashboard**
2. Sign in to your Supabase account
3. Select your project (the one with URL: `ubivreetpsledaqffuvn.supabase.co`)

### Step 2: Navigate to Authentication Settings

1. In the left sidebar, click **"Authentication"**
2. Click **"Providers"** (or go directly to: Authentication → Providers)

### Step 3: Enable Google Provider

1. Find **"Google"** in the list of providers
2. Click the toggle switch to **Enable** it
3. You'll see a form asking for Google OAuth credentials

### Step 4: Get Google OAuth Credentials

You need to create OAuth credentials in Google Cloud Console:

#### A. Go to Google Cloud Console
1. Visit: **https://console.cloud.google.com/**
2. Sign in with your Google account
3. Create a new project (or select an existing one):
   - Click "Select a project" at the top
   - Click "New Project"
   - Enter a name (e.g., "Srikanth Academy")
   - Click "Create"

#### B. Enable Google+ API
1. In Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"Google Identity Services API"**
3. Click on it and click **"Enable"**

#### C. Create OAuth 2.0 Credentials
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. If prompted, configure the OAuth consent screen:
   - Choose **"External"** (unless you have a Google Workspace)
   - Fill in:
     - App name: "Srikanth's Academy"
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue" through the steps
5. Back to creating OAuth client:
   - Application type: Select **"Web application"**
   - Name: "Srikanth Academy Web Client"
   - Authorized redirect URIs: Add this URL:
     ```
     https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback
     ```
   - Click **"Create"**
6. **Copy the Client ID and Client Secret** (you'll need these!)

### Step 5: Add Credentials to Supabase

1. Go back to Supabase Dashboard → Authentication → Providers → Google
2. Paste your **Client ID** in the "Client ID" field
3. Paste your **Client Secret** in the "Client Secret" field
4. Click **"Save"**

### Step 6: Test It!

1. Go back to your app
2. Click "Continue with Google" button
3. You should now see Google's sign-in popup instead of an error!

---

## 🎯 Quick Checklist

- [ ] Enabled Google provider in Supabase Dashboard
- [ ] Created Google Cloud Console project
- [ ] Enabled Google+ API or Google Identity Services API
- [ ] Created OAuth 2.0 credentials (Web application)
- [ ] Added redirect URI: `https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback`
- [ ] Copied Client ID and Client Secret
- [ ] Added credentials to Supabase
- [ ] Saved configuration
- [ ] Tested "Continue with Google" button

---

## 🔍 Troubleshooting

### Error: "Redirect URI mismatch"
**Solution:** Make sure the redirect URI in Google Cloud Console exactly matches:
```
https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback
```

### Error: "Invalid client"
**Solution:** 
- Double-check that Client ID and Client Secret are correct
- Make sure there are no extra spaces when copying/pasting
- Verify the OAuth consent screen is configured

### Still seeing "provider is not enabled"
**Solution:**
- Make sure you clicked "Save" in Supabase after adding credentials
- Refresh your browser page
- Clear browser cache (Ctrl+Shift+R)

---

## 📝 Alternative: Use Email Sign-Up Instead

If you don't want to set up Google OAuth right now, users can still sign up using:
- **Email and password** (already working)
- The form on the signup page

The Google/Apple buttons are optional - email sign-up works perfectly fine!

---

## 🆘 Need Help?

If you're stuck:
1. Check Supabase documentation: https://supabase.com/docs/guides/auth/social-login/auth-google
2. Verify your Supabase project is active (not paused)
3. Make sure you have the correct permissions in your Supabase project



