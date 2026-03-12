# 🔧 Fix: Website Not Sending to Webhook (But Direct Test Works)

## Problem
- ✅ Direct POST to `https://manasapadavala.app.n8n.cloud/webhook/demo-booking` works and sends email
- ❌ Website form submission doesn't send email

**This means:** The webhook URL in Vercel is either missing or incorrect!

---

## ✅ Solution: Update Vercel Environment Variable

### Step 1: Get the Correct Webhook URL
You already know it works:
```
https://manasapadavala.app.n8n.cloud/webhook/demo-booking
```

### Step 2: Update in Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com
   - Log in and select project: **`srikanthphysics`**

2. **Go to Environment Variables:**
   - Click **Settings** (top navigation)
   - Click **Environment Variables** (left sidebar)

3. **Find or Add `VITE_N8N_WEBHOOK_URL`:**
   - If it exists: Click **Edit**
   - If it doesn't exist: Click **Add New**

4. **Set the Value:**
   - **Name**: `VITE_N8N_WEBHOOK_URL`
   - **Value**: `https://manasapadavala.app.n8n.cloud/webhook/demo-booking`
   - **Environment**: Select **ALL THREE**:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **Save**

### Step 3: Redeploy (IMPORTANT!)

1. **Go to Deployments tab**
2. **Find the latest deployment**
3. **Click the "..." (three dots) menu**
4. **Click "Redeploy"**
5. **Wait for deployment to complete** (1-2 minutes)

**⚠️ CRITICAL:** You MUST redeploy after updating environment variables, otherwise the change won't take effect!

---

## ✅ Step 4: Verify It's Working

1. **Open your website** in browser
2. **Open Developer Tools** (F12)
3. **Go to Console tab**
4. **Submit the demo form**
5. **Look for:**
   - ✅ No error messages
   - ✅ Check Network tab for POST request to webhook URL
   - ✅ Status should be 200 OK

---

## Quick Test After Redeploy

1. Submit the demo form on your website
2. Check your email - should receive notification
3. Check n8n executions - should see new execution

---

## Why This Happens

When you test directly with Postman, you're calling the webhook URL directly. But when the website submits the form, it reads the webhook URL from the environment variable `VITE_N8N_WEBHOOK_URL`. If this variable is:
- Not set in Vercel
- Set to wrong URL
- Not redeployed after update

Then the website won't send to the correct webhook!
