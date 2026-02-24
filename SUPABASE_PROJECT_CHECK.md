# 🔍 How to Check and Fix Supabase Project Connection

## The Problem
You're getting `DNS_PROBE_FINISHED_NXDOMAIN` error, which means the Supabase project URL cannot be resolved. This usually means:
- ❌ Project is paused
- ❌ Project doesn't exist
- ❌ Wrong project URL

## ✅ Step-by-Step Fix

### Step 1: Go to Supabase Dashboard
1. Visit: **https://supabase.com/dashboard**
2. Sign in with your account
3. Look for your project in the list

### Step 2: Check Project Status
1. Click on your project
2. Check if you see:
   - ✅ **"Active"** status → Project is running
   - ⚠️ **"Paused"** status → Click "Restore" or "Resume"
   - ❌ **No project found** → You need to create a new project

### Step 3: Get Correct Configuration
If project is active, go to:
1. **Settings** → **API** (in left sidebar)
2. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)

### Step 4: Update Your .env File
Copy the values from Step 3 and update your `.env` file:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

**Important:** 
- Replace `YOUR_PROJECT_ID` with your actual project ID
- Replace `YOUR_ANON_KEY_HERE` with your actual anon key
- Make sure there are NO spaces around the `=` sign

### Step 5: Restart Dev Server
1. Stop the dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. Hard refresh browser: `Ctrl+Shift+R`

## 🚨 If Project is Paused

1. Click **"Restore project"** or **"Resume"** button
2. Wait 2-3 minutes for project to become active
3. Then follow Step 3-5 above

## 🆕 If You Need to Create New Project

1. In Supabase Dashboard, click **"New Project"**
2. Fill in:
   - **Name**: Srikanth's Academy
   - **Database Password**: (choose a strong password)
   - **Region**: Choose closest to you
3. Click **"Create new project"**
4. Wait for project to be created (2-3 minutes)
5. Go to **Settings** → **API** to get URL and anon key
6. Update your `.env` file with new values

## ✅ Verify It's Working

After updating, test the connection:
1. Open browser console (F12)
2. Look for: `✅ Supabase client initialized`
3. Try signing in - should work now!

## 📞 Still Having Issues?

1. **Check the exact error** in browser console
2. **Verify project URL** matches exactly what's in Supabase dashboard
3. **Make sure project is Active** (not paused)
4. **Restart dev server** after updating `.env`
