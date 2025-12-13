# 📊 Setup: Save Demo Leads to Google Sheet

This guide will help you set up n8n to automatically save all demo form submissions to a Google Sheet in Srikanth Academy's Google Drive.

---

## ✅ Step 1: Create Google Sheet

1. **Go to Google Sheets**: https://sheets.google.com
2. **Create a new spreadsheet** named: `Srikanth_Academy_Demo_Leads`
3. **Add headers in Row 1** (copy exactly as shown):
   ```
   Timestamp | Name | Email | Phone | Grade | Board | City | Country | UTM Source | UTM Medium | UTM Campaign | Referrer
   ```
4. **Note the Sheet ID** from the URL:
   - URL looks like: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the `SPREADSHEET_ID` part (you'll need this later)

---

## ✅ Step 2: Set Up Google Service Account

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create a new project** (or use existing):
   - Click "Select a project" → "New Project"
   - Name: `Srikanth Academy`
   - Click "Create"

3. **Enable Google Sheets API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. **Create Service Account**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - **Service account name**: `n8n-sheets-integration`
   - Click "Create and Continue"
   - Skip role assignment → Click "Done"

5. **Create Key**:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - Download the JSON file (keep it secure - you'll need this for n8n!)

6. **Share Google Sheet with Service Account**:
   - Open your Google Sheet (`Srikanth_Academy_Demo_Leads`)
   - Click "Share" button (top right)
   - Add the **Service Account Email** (found in the JSON file as `client_email`)
   - Give it **"Editor"** permissions
   - Click "Send"

---

## ✅ Step 3: Set Up n8n Workflow

### 3.1 Create Workflow

1. **Log in to n8n** (cloud or self-hosted)
2. **Create new workflow**:
   - Click "Workflows" → "Add Workflow"
   - Name: `Srikanth Academy Demo Leads`

### 3.2 Add Webhook Node

1. **Add Webhook node**:
   - Click "+" to add node
   - Search for "Webhook"
   - Select "Webhook" node

2. **Configure Webhook**:
   - **HTTP Method**: `POST`
   - **Path**: `demo-leads` (or any path you prefer)
   - **Response Mode**: `Respond to Webhook`
   - **Response Code**: `200`
   - **Response Body**: `JSON`
   - **Response Data**:
     ```json
     {
       "success": true,
       "message": "Lead captured successfully"
     }
     ```

3. **Get Webhook URL**:
   - Click "Execute Node" (or save workflow)
   - Copy the **Webhook URL** (looks like: `https://your-n8n.com/webhook/demo-leads`)
   - **Save this URL** - you'll add it to Vercel in Step 5!

### 3.3 Add Code Node (Normalize Data)

1. **Add Code node** after Webhook:
   - Click "+" after Webhook node
   - Search for "Code"
   - Select "Code" node

2. **Configure Code**:
   - **Mode**: `Run Once for All Items`
   - **Language**: `JavaScript`
   - **Code**:
     ```javascript
     const data = $input.item.json;
     
     return [{
       json: {
         timestamp: data.timestamp || new Date().toISOString(),
         name: data.name || '',
         email: data.email || '',
         phone: data.phone || '',
         grade: data.grade || '',
         board: data.board || '',
         city: data.city || '',
         country: data.country || '',
         utm_source: data.utm?.source || '',
         utm_medium: data.utm?.medium || '',
         utm_campaign: data.utm?.campaign || '',
         referrer: data.referrer || ''
       }
     }];
     ```

### 3.4 Add Google Sheets Node

1. **Add Google Sheets node** after Code node:
   - Click "+" after Code node
   - Search for "Google Sheets"
   - Select "Google Sheets" node

2. **Configure Authentication**:
   - **Authentication**: `Service Account`
   - **Service Account Email**: (from JSON file, the `client_email` field)
   - **Private Key**: (from JSON file, copy the entire `private_key` value - it's a long string)

3. **Configure Operation**:
   - **Operation**: `Append Row`
   - **Spreadsheet ID**: Paste the `SPREADSHEET_ID` from Step 1
   - **Sheet Name**: `Sheet1` (or your sheet name)
   - **Columns**: Select "Define Below"
   - **Column Mapping** (one per line):
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

### 3.5 Activate Workflow

1. **Save Workflow**:
   - Click "Save" button
   - Name: `Srikanth Academy Demo Leads`

2. **Activate Workflow**:
   - Toggle **"Active"** switch to ON (top right)
   - Workflow is now live!

---

## ✅ Step 4: Test the Workflow

1. **Test in n8n**:
   - Click "Execute Workflow" button
   - Send test data to Webhook node
   - Check if data flows through to Google Sheets

2. **Test with curl** (optional):
   ```bash
   curl -X POST https://your-n8n.com/webhook/demo-leads \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "phone": "+1234567890",
       "grade": "11",
       "board": "CBSE",
       "city": "Mumbai",
       "country": "India",
       "utm": {
         "source": "google",
         "medium": "cpc",
         "campaign": "test"
       }
     }'
   ```
3. **Check Google Sheet** - you should see a new row!

---

## ✅ Step 5: Add Webhook URL to Vercel

**Important**: You need to add the webhook URL to Vercel environment variables so it works in production!

1. **Go to Vercel Dashboard**:
   - Visit: https://vercel.com
   - Select your project: `srikanthphysics`

2. **Add Environment Variable**:
   - Go to **Settings** → **Environment Variables**
   - Click **"Add New"**
   - **Name**: `VITE_N8N_WEBHOOK_URL`
   - **Value**: Paste your webhook URL (from Step 3.2)
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

3. **Redeploy**:
   - Go to **Deployments** tab
   - Click the "..." menu on the latest deployment
   - Click **"Redeploy"**
   - This will pick up the new environment variable

---

## ✅ Step 6: Test from Your Website

1. **Go to your website**: `https://your-domain.com/demo`
2. **Fill out the demo form** with test data
3. **Submit**
4. **Check Google Sheet** - you should see a new row with the submission!

---

## 🔧 Troubleshooting

### Webhook not receiving data
- ✅ Check workflow is **Active** (toggle ON in n8n)
- ✅ Check webhook URL is correct in Vercel environment variables
- ✅ Check Vercel deployment was redeployed after adding environment variable
- ✅ Check n8n logs for errors

### Google Sheets not updating
- ✅ Verify Service Account email has **Editor** access to the sheet
- ✅ Check Google Sheets API is enabled in Google Cloud Console
- ✅ Verify Spreadsheet ID is correct in n8n Google Sheets node
- ✅ Check column names match exactly (case-sensitive)
- ✅ Verify Private Key is correct (from JSON file)

### Data not formatted correctly
- ✅ Check Code node is mapping fields correctly
- ✅ Verify Google Sheets node column mapping matches sheet headers
- ✅ Check n8n execution logs for errors

---

## 📋 Quick Checklist

- [ ] Google Sheet created with headers
- [ ] Google Service Account created
- [ ] Google Sheets API enabled
- [ ] Service Account JSON key downloaded
- [ ] Sheet shared with service account email
- [ ] n8n workflow created
- [ ] Webhook node configured
- [ ] Code node configured
- [ ] Google Sheets node configured
- [ ] Workflow activated
- [ ] Webhook URL added to Vercel environment variables
- [ ] Vercel redeployed
- [ ] Test submission successful

---

## 🎉 You're Done!

Now when users fill out the demo form on your website, their details will automatically appear in your Google Sheet via n8n!

**Next Steps:**
- Monitor the Google Sheet for new leads
- Set up email notifications in n8n (optional)
- Set up team notifications via Slack/Telegram (optional)

---

## 📞 Need Help?

- **n8n Documentation**: https://docs.n8n.io/
- **Google Sheets API**: https://developers.google.com/sheets/api
- **Check n8n execution logs** for detailed errors

