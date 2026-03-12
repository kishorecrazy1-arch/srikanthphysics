# Quick Fix: "TypeError: Failed to fetch" Error

## 🔴 Current Error
You're seeing: `TypeError: Failed to fetch` when trying to load topics.

## ✅ Step-by-Step Fix

### Step 1: Restart Dev Server (IMPORTANT!)
Environment variables from `.env` are only loaded when the dev server starts.

1. **Stop the current dev server:**
   - Find the terminal window running `npm run dev`
   - Press `Ctrl+C` to stop it

2. **Start the dev server again:**
   ```bash
   npm run dev
   ```

3. **Wait for it to fully start:**
   - You should see: `VITE v5.x.x ready in XXX ms`
   - Note the local URL (usually `http://localhost:5175`)

### Step 2: Clear Browser Cache
1. **Hard refresh the page:**
   - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - OR press `Ctrl+F5`

2. **Or clear cache:**
   - Open DevTools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

### Step 3: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for these messages:
   - ✅ `✅ Supabase client initialized` - Good!
   - ✅ `📍 Supabase URL: https://...` - Good!
   - ❌ `❌ Missing Supabase environment variables` - Problem!

### Step 4: Verify .env File
Your `.env` file should be in the project root and contain:
```env
VITE_SUPABASE_URL=https://ubivreetpsledaqffuvn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** 
- File must be named exactly `.env` (not `.env.txt`)
- Must be in the root folder (same as `package.json`)
- Must start with `VITE_` prefix

### Step 5: Test Supabase Connection
Open browser console (F12) and run:
```javascript
// Check if Supabase is configured
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

## 🚨 Common Issues & Solutions

### Issue 1: Still seeing "Failed to fetch"
**Solution:**
1. Verify Supabase URL is accessible - try opening it in browser:
   - `https://ubivreetpsledaqffuvn.supabase.co/rest/v1/`
   - Should show a JSON response or error (not "can't connect")

2. Check if Supabase project is active:
   - Go to: https://supabase.com/dashboard/project/ubivreetpsledaqffuvn
   - Verify project is not paused

### Issue 2: Environment variables not loading
**Solution:**
1. Make sure `.env` file is in the root folder
2. Check file name is exactly `.env` (not `.env.txt` or `.env.local`)
3. Restart dev server after creating/modifying `.env`
4. Check there are no spaces around the `=` sign in `.env`

### Issue 3: CORS Error
**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Add your localhost URL to allowed origins:
   - `http://localhost:5175`
   - `http://127.0.0.1:5175`

## 📝 Verification Checklist

After restarting, check:
- [ ] Dev server restarted successfully
- [ ] Browser console shows "✅ Supabase client initialized"
- [ ] No error messages in console
- [ ] Topics page loads without error
- [ ] Can see topics list (or "0 Topics Available" if no data)

## 🔍 Still Not Working?

1. **Check Network Tab:**
   - Open DevTools → Network tab
   - Refresh page
   - Look for failed requests to Supabase
   - Check status code and error message

2. **Check Supabase Dashboard:**
   - Verify project is active
   - Check API settings
   - Verify anon key matches `.env` file

3. **Try Different Browser:**
   - Test in incognito/private mode
   - Try Chrome, Firefox, or Edge

---

**Most common fix: Simply restart the dev server!** 🔄

