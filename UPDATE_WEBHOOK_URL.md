# 🔄 Update Webhook URL for Demo Workflow

## New Workflow

**Workflow URL:** https://manasapadavala.app.n8n.cloud/workflow/XmafvLhS28STAmPo

---

## 📋 Step 1: Get the Webhook URL

1. **Open the workflow:**
   - Go to: https://manasapadavala.app.n8n.cloud/workflow/XmafvLhS28STAmPo
   - Make sure the workflow is **Active** (toggle should be ON/green)

2. **Click on the Webhook node** (first node in the workflow)

3. **Find the Webhook URL:**
   - Look for "Production URL" or "Webhook URL" in the node settings
   - It will look like one of these formats:
     ```
     https://manasapadavala.app.n8n.cloud/webhook/demo-booking
     ```
     OR
     ```
     https://manasapadavala.app.n8n.cloud/webhook/XmafvLhS28STAmPo/demo-booking
     ```

4. **Copy the full webhook URL** (including `https://`)

---

## 📋 Step 2: Update Local Environment (.env)

1. **Open your `.env` file** in the project root

2. **Update or add the webhook URL:**
   ```env
   VITE_N8N_WEBHOOK_URL=https://manasapadavala.app.n8n.cloud/webhook/[your-path-from-step-1]
   ```

3. **Restart your dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

---

## 📋 Step 3: Update Vercel Environment Variables

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com
   - Log in and select your project: `srikanthphysics`

2. **Navigate to Environment Variables:**
   - Click **Settings** → **Environment Variables**

3. **Update the Variable:**
   - Find `VITE_N8N_WEBHOOK_URL`
   - Click **Edit** (or delete and recreate)
   - **Value**: Paste your webhook URL from Step 1
   - **Environment**: Select **ALL THREE**:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **Save**

4. **Redeploy:**
   - Go to **Deployments** tab
   - Click **"..."** menu on latest deployment
   - Click **"Redeploy"**
   - Wait for deployment to complete

---

## ✅ Step 4: Test the Webhook

1. **Test locally:**
   - Go to: http://localhost:5175/demo
   - Fill out the demo form
   - Submit
   - Check browser console (F12) → Network tab
   - Should see POST request to your webhook URL
   - Should return `200 OK`

2. **Check n8n workflow:**
   - Go to: https://manasapadavala.app.n8n.cloud/workflow/XmafvLhS28STAmPo
   - Check **Executions** tab
   - Should see a new execution with your test data

3. **Test in production:**
   - Visit your live website: `https://your-domain.com/demo`
   - Submit a test form
   - Verify data appears in Google Sheets (if configured)
   - Verify emails are sent (if configured)

---

## 🔍 Common Webhook URL Formats

Based on your n8n setup, the webhook URL might be:

**Format 1 (Simple Path):**
```
https://manasapadavala.app.n8n.cloud/webhook/demo-booking
```

**Format 2 (With Workflow ID):**
```
https://manasapadavala.app.n8n.cloud/webhook/XmafvLhS28STAmPo/demo-booking
```

**Format 3 (Custom Path):**
```
https://manasapadavala.app.n8n.cloud/webhook/[your-custom-path]
```

**Important:** Use the exact URL shown in your Webhook node settings!

---

## 🆘 Troubleshooting

### Webhook URL not working
- ✅ Verify workflow is **Active** (toggle ON/green)
- ✅ Check webhook path matches exactly (case-sensitive)
- ✅ Ensure webhook node is configured for POST requests
- ✅ Check n8n execution logs for errors

### Environment variable not updating
- ✅ Restart dev server after updating `.env`
- ✅ Redeploy Vercel after updating environment variables
- ✅ Clear browser cache and hard refresh

### Form submits but no data in n8n
- ✅ Check browser console for webhook errors
- ✅ Verify webhook URL is correct in `.env` and Vercel
- ✅ Check n8n workflow execution logs
- ✅ Ensure webhook node is receiving POST requests

---

## ✅ Checklist

- [ ] Workflow is Active in n8n
- [ ] Webhook URL copied from Webhook node
- [ ] `.env` file updated with new webhook URL
- [ ] Dev server restarted
- [ ] Vercel environment variable updated
- [ ] Vercel deployment redeployed
- [ ] Tested locally (form submission works)
- [ ] Tested in production (form submission works)
- [ ] Verified data appears in n8n executions
- [ ] Verified emails are sent (if configured)
- [ ] Verified Google Sheets updated (if configured)

---

## 📚 Related Files

- `VERIFY_DEMO_WORKFLOW.md` - Complete workflow verification guide
- `FIND_N8N_WEBHOOK_URL.md` - Detailed webhook URL finding guide
- `VERCEL_ENV_SETUP.md` - Vercel environment setup guide
- `PRODUCT_WORKFLOW_CONFIGURATION.md` - Product configuration guide

---

## 🎉 Done!

Your webhook URL is now updated and ready to receive demo form submissions!
