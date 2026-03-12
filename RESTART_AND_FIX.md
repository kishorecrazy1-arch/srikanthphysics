# 🔧 Quick Fix: Restart Dev Server to Fix "Failed to fetch"

## The Problem
Your `.env` file has the correct configuration, but the dev server needs to be restarted to load it.

## ✅ Simple 3-Step Fix

### Step 1: Stop the Dev Server
1. Find your terminal/command prompt where `npm run dev` is running
2. Press `Ctrl+C` to stop it
3. Wait until it says the server stopped

### Step 2: Start the Dev Server Again
Run this command:
```bash
npm run dev
```

Wait for it to show:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5175/
```

### Step 3: Refresh Your Browser
1. Go back to your browser
2. Press `Ctrl+Shift+R` (hard refresh)
3. Or close and reopen the tab

## ✅ Check if It's Fixed

After restarting:
1. Open browser console (F12)
2. Look for: `✅ Supabase client initialized`
3. Check if topics page loads without error

## 🚨 If Still Not Working

### Check 1: Verify .env File Location
Make sure `.env` is in the root folder (same folder as `package.json`):
```
srikanthphysics/
  ├── .env          ← Must be here!
  ├── package.json
  ├── src/
  └── ...
```

### Check 2: Verify Supabase Project
1. Open: https://supabase.com/dashboard/project/ubivreetpsledaqffuvn
2. Make sure project is **Active** (not paused)
3. Go to Settings → API
4. Verify URL and anon key match your `.env` file

### Check 3: Check Database Tables
In Supabase Dashboard → SQL Editor, run:
```sql
SELECT COUNT(*) FROM topics;
```
If this returns 0 or an error, you need to create the topics table.

## 📞 Still Need Help?

1. Check browser console (F12) for error messages
2. Check Network tab for failed requests
3. Share the error message you see

---

**99% of the time, restarting the dev server fixes this!** 🚀

