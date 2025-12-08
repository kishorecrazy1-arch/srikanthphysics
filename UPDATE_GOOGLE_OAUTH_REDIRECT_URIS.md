# 🔄 How to Update Google OAuth Redirect URIs

## Current Setup
Your app runs on **port 5175** (not 3000), so you need to update the redirect URIs in Google Cloud Console.

---

## ✅ Step-by-Step: Update Redirect URIs

### Step 1: Go to Google Cloud Console

1. Visit: **https://console.cloud.google.com/**
2. Select your project (or create one if you haven't)
3. Go to **APIs & Services** → **Credentials**

### Step 2: Find Your OAuth 2.0 Client

1. Look for **"OAuth 2.0 Client IDs"** in the credentials list
2. Find the client named **"Supabase Auth"** (or whatever you named it)
3. Click on it to edit

### Step 3: Update Authorized Redirect URIs

In the **"Authorized redirect URIs"** section, you should have:

#### Required URIs (Add Both):

```
https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback
http://localhost:5175/auth/callback
```

**Important Notes:**
- ✅ The first URI is your **Supabase callback** (required)
- ✅ The second URI is your **local development** server (port 5175)
- ❌ Remove `http://localhost:3000/auth/callback` if it exists (wrong port)

### Step 4: Add Production URI (When Deployed)

If your app is deployed, also add your production URL:

```
https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback
http://localhost:5175/auth/callback
https://your-production-domain.com/auth/callback
```

**Examples:**
- Vercel: `https://yourapp.vercel.app/auth/callback`
- Netlify: `https://yourapp.netlify.app/auth/callback`
- Custom domain: `https://yourapp.com/auth/callback`

### Step 5: Save Changes

1. Click **"Save"** at the bottom
2. Wait for the changes to apply (usually instant)

---

## 📋 Complete List of Redirect URIs

For your current setup, add these **exact URIs**:

```
https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback
http://localhost:5175/auth/callback
```

**Copy these URIs:**
```
https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback
http://localhost:5175/auth/callback
```

---

## 🔍 Verify Your Setup

### Check 1: Port Number
Your Vite config shows:
```typescript
server: {
  port: 5175,
}
```
So use `localhost:5175`, not `localhost:3000`.

### Check 2: Supabase Project
Your Supabase project is: `ubivreetpsledaqffuvn`
So the callback URL is: `https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback`

---

## 🚨 Common Mistakes to Avoid

❌ **Wrong:** `http://localhost:3000/auth/callback` (wrong port)
✅ **Correct:** `http://localhost:5175/auth/callback` (your actual port)

❌ **Wrong:** `https://ubivreetpsledaqffuvn.supabase.co/auth/callback` (missing `/v1`)
✅ **Correct:** `https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback` (with `/v1`)

❌ **Wrong:** `http://localhost:5175` (missing `/auth/callback`)
✅ **Correct:** `http://localhost:5175/auth/callback` (full path)

---

## ✅ After Updating

1. **Save** the changes in Google Cloud Console
2. **Wait 1-2 minutes** for changes to propagate
3. **Test** by clicking "Continue with Google" in your app
4. You should now be redirected properly!

---

## 🧪 Test It

1. Go to your app: `http://localhost:5175`
2. Click **"Sign Up"** or **"Sign In"**
3. Click **"Continue with Google"**
4. You should see Google's sign-in popup
5. After signing in, you should be redirected back to your app

---

## 📝 Quick Reference

**Your Supabase Project:** `ubivreetpsledaqffuvn`
**Your Local Dev URL:** `http://localhost:5175`
**Supabase Callback:** `https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback`
**Local Callback:** `http://localhost:5175/auth/callback`

---

## 🆘 If It Still Doesn't Work

1. **Check the exact error** in browser console (F12)
2. **Verify URIs match exactly** (no typos, correct ports)
3. **Wait a few minutes** after saving (Google needs time to update)
4. **Clear browser cache** and try again
5. **Check Supabase Dashboard** → Authentication → Providers → Google (make sure it's enabled)



