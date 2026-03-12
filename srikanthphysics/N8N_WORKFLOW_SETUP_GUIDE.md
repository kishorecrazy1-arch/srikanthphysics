# 🔄 n8n Workflow Setup Guide

## Step-by-Step: Create Your n8n Workflow

---

## ✅ Prerequisites

- n8n instance running (cloud or self-hosted)
- Google Sheets account (for storing leads)
- Google Cloud Service Account (for Sheets API access)

---

## 📋 Step 1: Create New Workflow in n8n

1. **Log in to n8n**
   - Go to your n8n instance (e.g., `https://n8n.yourdomain.com`)
   - Click **"Workflows"** → **"Add Workflow"**

2. **Name your workflow**
   - Name: `Demo Booking Leads` (or your product name)
   - Description: `Captures demo form submissions and sends to Google Sheets`

---

## 📋 Step 2: Add Webhook Node

1. **Add Webhook node**
   - Click **"+"** to add node
   - Search for **"Webhook"**
   - Select **"Webhook"** node

2. **Configure Webhook**
   - **HTTP Method:** `POST`
   - **Path:** `demo-booking` (or your custom path)
   - **Response Mode:** `Respond to Webhook`
   - **Response Code:** `200`
   - **Response Body:** Select `JSON`
   - **Response Data:**
     ```json
     {
       "received": true,
       "message": "Lead captured successfully"
     }
     ```

3. **Get Webhook URL**
   - Click **"Execute Node"** (or save workflow)
   - Copy the **Webhook URL** (looks like: `https://your-n8n.com/webhook/demo-booking`)
   - **This is your `VITE_N8N_WEBHOOK_URL`** - add it to `.env`!

---

## 📋 Step 2.5: Add Product Configuration (Optional)

Add a **Set** node after the Webhook to configure product-specific variables:

1. **Add Set node**
   - Click **"+"** after Webhook node
   - Search for **"Set"** → Select **"Set"**

2. **Configure Product Variables**
   Add these fields (adjust values for your product):
   - **productName**: `Your Product Name`
   - **productEmail**: `support@yourproduct.com`
   - **productPhone**: `+1-555-0100`
   - **teamEmail**: `team@yourproduct.com`
   - **productWebsite**: `https://yourproduct.com`

   These variables will be available in subsequent nodes and email templates.

---

## 📋 Step 3: Add Function Node (Normalize Data)

1. **Add Function node**
   - Click **"+"** after Webhook node
   - Search for **"Code"** → Select **"Code"**

2. **Configure Function**
   - **Mode:** `Run Once for All Items`
   - **Language:** `JavaScript`
   - **Code:**
   ```javascript
   // Normalize the incoming data
   const items = $input.all();
   
   return items.map(item => {
     const d = item.json;
     
     return {
       json: {
         timestamp: d.timestamp || new Date().toISOString(),
         name: d.name || '',
         email: d.email || '',
         phone: d.phone || '',
         grade: d.grade || '',
         board: d.board || '',
         city: d.city || '',
         country: d.country || '',
         utm_source: d.utm?.source || '',
         utm_medium: d.utm?.medium || '',
         utm_campaign: d.utm?.campaign || '',
         referrer: d.referrer || ''
       }
     };
   });
   ```

---

## 📋 Step 4: Create Google Sheet

1. **Create Spreadsheet**
   - Go to Google Sheets
   - Create new spreadsheet: **"Srikanth_Academy_Leads"**
   - Rename first sheet to: **"AP_Physics_Demo"**

2. **Add Headers** (Row 1):
   ```
   timestamp | name | email | phone | grade | board | city | country | utm_source | utm_medium | utm_campaign | referrer
   ```

3. **Share with Service Account**
   - Click **"Share"** button
   - Add your Google Service Account email
   - Give **"Editor"** permissions

---

## 📋 Step 5: Set Up Google Sheets Authentication

### Option A: Using Service Account (Recommended)

1. **Create Service Account**
   - Go to Google Cloud Console
   - **APIs & Services** → **Credentials**
   - Click **"Create Credentials"** → **"Service Account"**
   - Name: `n8n-sheets-access`
   - Click **"Create and Continue"**
   - Skip role assignment → **"Done"**

2. **Create Key**
   - Click on the service account
   - Go to **"Keys"** tab
   - Click **"Add Key"** → **"Create new key"**
   - Select **JSON**
   - Download the JSON file

3. **Enable Google Sheets API**
   - Go to **APIs & Services** → **Library**
   - Search for **"Google Sheets API"**
   - Click **"Enable"**

### Option B: Using OAuth (Alternative)

1. **Create OAuth Credentials**
   - Follow Google OAuth setup (similar to what you did for Supabase)
   - Use OAuth credentials in n8n

---

## 📋 Step 6: Add Google Sheets Node

1. **Add Google Sheets node**
   - Click **"+"** after Function node
   - Search for **"Google Sheets"**
   - Select **"Google Sheets"** node

2. **Configure Authentication**
   - **Authentication:** `Service Account` (or `OAuth2` if using OAuth)
   - **Service Account Email:** Your service account email
   - **Private Key:** Paste private key from JSON file (or upload JSON)

3. **Configure Operation**
   - **Operation:** `Append Row`
   - **Spreadsheet ID:** Get from Google Sheets URL
     - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
     - Copy the `SPREADSHEET_ID` part
   - **Sheet Name:** `AP_Physics_Demo`
   - **Columns:** Select **"Define Below"**
   - **Column Mapping:**
     ```
     timestamp → {{ $json.timestamp }}
     name → {{ $json.name }}
     email → {{ $json.email }}
     phone → {{ $json.phone }}
     grade → {{ $json.grade }}
     board → {{ $json.board }}
     city → {{ $json.city }}
     country → {{ $json.country }}
     utm_source → {{ $json.utm_source }}
     utm_medium → {{ $json.utm_medium }}
     utm_campaign → {{ $json.utm_campaign }}
     referrer → {{ $json.referrer }}
     ```

---

## 📋 Step 7: Add Optional Email Notification

1. **Add Gmail/SMTP node**
   - Click **"+"** after Google Sheets node
   - Search for **"Gmail"** or **"SMTP"**
   - Configure to send confirmation email to lead

2. **Email Template:**
   ```
   To: {{ $json.email }}
   Subject: AP Physics Free Demo – You're In!
   Body: 
   Hi {{ $json.name }},
   
   Thanks for signing up for a free AP Physics demo!
   
   We'll contact you within 24 hours at {{ $json.email }}.
   
   Meanwhile, check out our resources:
   - Download Syllabus: [link]
   - Watch Success Stories: [link]
   
   Best regards,
   Srikanth's Academy Team
   ```

---

## 📋 Step 8: Activate Workflow

1. **Save Workflow**
   - Click **"Save"** button
   - Give it a name: `AP Physics Demo Leads`

2. **Activate Workflow**
   - Toggle **"Active"** switch to ON (top right)
   - Workflow is now live and listening for webhooks!

---

## 🧪 Step 9: Test the Workflow

### Test 1: Manual Test in n8n

1. **Click "Execute Workflow"** button
2. **Send test data** to Webhook node
3. **Check** if data flows through to Google Sheets

### Test 2: Test from Your App

1. **Add webhook URL to `.env`:**
   ```env
   VITE_N8N_WEBHOOK_URL=https://your-n8n.com/webhook/ap-physics-demo
   ```

2. **Restart dev server:**
   ```bash
   npm run dev
   ```

3. **Go to:** `http://localhost:5175/demo`
4. **Fill form** and submit
5. **Check n8n** → Should see execution in workflow
6. **Check Google Sheets** → Should see new row added

---

## ✅ Verification Checklist

- [ ] Webhook node configured and active
- [ ] Webhook URL copied to `.env` file
- [ ] Function node normalizes data correctly
- [ ] Google Sheets API enabled
- [ ] Service Account created and key downloaded
- [ ] Google Sheet created with correct headers
- [ ] Sheet shared with service account
- [ ] Google Sheets node configured correctly
- [ ] Workflow activated
- [ ] Test submission works end-to-end

---

## 🚨 Troubleshooting

### Webhook not receiving data
- Check webhook URL is correct in `.env`
- Verify workflow is **Active** (toggle ON)
- Check n8n logs for errors
- Verify webhook path matches: `ap-physics-demo`

### Google Sheets not updating
- Verify Service Account has access to sheet
- Check Google Sheets API is enabled
- Verify column mapping matches sheet headers
- Check n8n execution logs for errors

### Data not flowing
- Check Function node output
- Verify data format matches expected structure
- Check each node's execution status

---

## 📊 Expected Workflow Structure

```
Webhook (POST)
    ↓
Function (Normalize Data)
    ↓
Google Sheets (Append Row)
    ↓
[Optional] Gmail (Send Confirmation)
    ↓
[Optional] Telegram/Slack (Notify Team)
```

---

## 🎯 Quick Start Commands

1. **Get Webhook URL:**
   - Create workflow → Add Webhook node → Copy URL

2. **Add to `.env`:**
   ```env
   VITE_N8N_WEBHOOK_URL=<your-webhook-url>
   ```

3. **Test:**
   ```bash
   npm run dev
   # Visit http://localhost:5175/demo
   # Submit form
   # Check Google Sheets for new row
   ```

---

## 📝 Next Steps After Setup

1. ✅ Create workflow in n8n
2. ✅ Get webhook URL
3. ✅ Add to `.env` file
4. ✅ Test form submission
5. ✅ Verify data in Google Sheets
6. ✅ Set up email notifications (optional)
7. ✅ Set up team notifications (optional)

---

## 🆘 Need Help?

- **n8n Documentation:** https://docs.n8n.io/
- **Google Sheets API:** https://developers.google.com/sheets/api
- **Check workflow execution logs** in n8n for detailed errors

---

**Ready to create the workflow?** Follow the steps above, and you'll have leads flowing into Google Sheets in no time! 🚀

