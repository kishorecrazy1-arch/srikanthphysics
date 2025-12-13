# ✅ Add Webhook URL to Vercel - Step by Step

## Your Webhook URL
```
https://manasapadavala.app.n8n.cloud/webhook/ap-physics-demo
```

---

## Steps to Add to Vercel

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com
- Log in to your account
- Click on your project: **`srikanthphysics`**

### 2. Navigate to Environment Variables
- Click **"Settings"** in the top navigation
- Click **"Environment Variables"** in the left sidebar

### 3. Add the Environment Variable
- Click the **"Add New"** button
- Fill in:
  - **Key/Name**: `VITE_N8N_WEBHOOK_URL`
  - **Value**: `https://manasapadavala.app.n8n.cloud/webhook/ap-physics-demo`
  - **Environment**: Select **ALL THREE**:
    - ✅ Production
    - ✅ Preview
    - ✅ Development
- Click **"Save"**

### 4. Redeploy Your Application
- Go to **"Deployments"** tab (top navigation)
- Find your latest deployment
- Click the **"..."** (three dots) menu on the right
- Click **"Redeploy"**
- Wait for deployment to complete (usually 1-2 minutes)

### 5. Test It!
- Visit your website: `https://your-domain.com/demo`
- Fill out the demo form with test data
- Submit the form
- Check your Google Sheet - you should see a new row!
- Check n8n workflow executions - you should see a new execution

---

## ✅ Verification Checklist

- [ ] Environment variable added to Vercel
- [ ] All environments selected (Production, Preview, Development)
- [ ] Deployment redeployed
- [ ] Tested form submission
- [ ] Verified data appears in Google Sheet
- [ ] Verified execution appears in n8n

---

## 🎉 You're All Set!

Once you've completed these steps, all demo form submissions will automatically:
1. ✅ Be sent to your n8n workflow
2. ✅ Be saved to your Google Sheet
3. ✅ Trigger any other actions in your workflow (like email confirmations)

---

## 🔧 Troubleshooting

**If data isn't appearing in Google Sheet:**
- Check that your n8n workflow is **Active** (toggle should be ON/green)
- Check n8n execution logs to see if data is being received
- Verify your Google Sheet is shared with the service account email
- Check the "Append to Google Sheets" node configuration in n8n

**If form shows error:**
- Verify the environment variable name is exactly: `VITE_N8N_WEBHOOK_URL`
- Make sure you redeployed after adding the variable
- Check browser console for any errors

