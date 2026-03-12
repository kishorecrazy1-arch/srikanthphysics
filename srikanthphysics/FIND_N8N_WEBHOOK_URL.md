# 🔍 How to Find Your n8n Webhook URL

## Steps to Get the Webhook URL

1. **Open Your n8n Workflow**
   - Go to: https://manasapadavala.app.n8n.cloud/workflow/XmafvLhS28STAmPo
   - Make sure the workflow is **Active** (toggle should be ON/green)

2. **Click on the "Webhook - Receive Form Data" Node**
   - This is the first node in your workflow (the one with the red/pink icon)

3. **Look for the Webhook URL**
   - In the node settings, you should see a section showing the webhook URL
   - It will look something like:
     ```
     https://manasapadavala.app.n8n.cloud/webhook/[some-path]
     ```
   - OR it might show as:
     ```
     https://manasapadavala.app.n8n.cloud/webhook/[workflow-id]/[path]
     ```

4. **Copy the Full Webhook URL**
   - Copy the entire URL (including `https://`)
   - This is what you'll add to Vercel

---

## Alternative: Check Webhook Node Settings

If you can't see the URL directly:

1. **Click on the "Webhook - Receive Form Data" node**
2. **Check the node configuration panel** (usually on the right side)
3. **Look for fields like:**
   - "Webhook URL" or "Production URL"
   - "Path" (this is part of the URL)
4. **The full URL format is:**
   ```
   https://manasapadavala.app.n8n.cloud/webhook/[path-from-node]
   ```

---

## What the URL Should Look Like

Based on your n8n instance, the webhook URL should be one of these formats:

**Format 1:**
```
https://manasapadavala.app.n8n.cloud/webhook/demo-leads
```

**Format 2:**
```
https://manasapadavala.app.n8n.cloud/webhook/XmafvLhS28STAmPo/demo-booking
```

**Format 3:**
```
https://manasapadavala.app.n8n.cloud/webhook/[custom-path]
```

---

## Once You Have the URL

1. **Copy the webhook URL**
2. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
3. **Add:**
   - **Name**: `VITE_N8N_WEBHOOK_URL`
   - **Value**: Paste your webhook URL
   - **Environment**: Select all (Production, Preview, Development)
4. **Save and Redeploy**

---

## Still Can't Find It?

If you can't find the webhook URL in the node:

1. **Click "Execute workflow"** button in n8n
2. **The webhook URL might appear** in the execution panel
3. **Or check the n8n documentation** for your specific n8n version

---

## Quick Test

Once you have the URL, you can test it with curl:

```bash
curl -X POST https://manasapadavala.app.n8n.cloud/webhook/[your-path] \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'
```

If it works, you should see the execution in n8n and data in your Google Sheet!

