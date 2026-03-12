# 🔗 Add n8n Webhook URL to Vercel

## Quick Steps

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Log in and select your project: `srikanthphysics`

2. **Add Environment Variable**
   - Click on **Settings** (top navigation)
   - Click **Environment Variables** (left sidebar)
   - Click **"Add New"** button

3. **Enter the Details**
   - **Name**: `VITE_N8N_WEBHOOK_URL`
   - **Value**: Paste your n8n webhook URL (from your workflow)
   - **Environment**: Select **all three**:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Click **"Save"**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click the **"..."** (three dots) menu on the latest deployment
   - Click **"Redeploy"**
   - Wait for deployment to complete

5. **Test**
   - Go to your website: `https://your-domain.com/demo`
   - Fill out the demo form
   - Submit
   - Check your Google Sheet - you should see the new row!

---

## Your Webhook URL Format

Your n8n webhook URL should look like:
```
https://manasapadavala.app.n8n.cloud/webhook/your-path
```

Or if you're using a custom domain:
```
https://your-n8n-domain.com/webhook/your-path
```

---

## Important Notes

- ✅ The environment variable name must be exactly: `VITE_N8N_WEBHOOK_URL`
- ✅ Make sure to select all environments (Production, Preview, Development)
- ✅ You must redeploy after adding the environment variable
- ✅ The webhook URL should be the full URL from your n8n workflow

---

## Troubleshooting

**If submissions aren't appearing in Google Sheet:**
1. Check that your n8n workflow is **Active** (toggle should be ON)
2. Verify the webhook URL is correct in Vercel
3. Check n8n execution logs to see if data is being received
4. Verify your Google Sheet is shared with the service account email

