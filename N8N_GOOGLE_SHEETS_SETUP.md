# 📊 n8n → Google Sheets Integration Guide

## Overview
This guide shows you how to set up n8n to receive demo form submissions and automatically add them to a Google Sheet.

---

## ✅ Step 1: Create Google Sheet

1. **Go to Google Sheets**: https://sheets.google.com
2. **Create a new spreadsheet** named: `Srikanth_Academy_Demo_Leads`
3. **Add headers in Row 1**:
   ```
   Timestamp | Name | Email | Phone | Grade | Board | City | Country | UTM Source | UTM Medium | UTM Campaign | Referrer
   ```
4. **Share the sheet** with your Google Service Account email (you'll get this in Step 2)

---

## ✅ Step 2: Set Up Google Service Account

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create a new project** (or use existing): `Srikanth Academy`
3. **Enable Google Sheets API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. **Create Service Account**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name: `n8n-sheets-integration`
   - Click "Create and Continue"
   - Skip role assignment → "Done"
5. **Create Key**:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - Download the JSON file (keep it secure!)

---

## ✅ Step 3: Set Up n8n Workflow

### 3.1 Create Webhook Node

1. **Open n8n** (cloud or self-hosted)
2. **Create new workflow**: `Demo Leads to Google Sheets`
3. **Add Webhook node**:
   - **HTTP Method**: `POST`
   - **Path**: `demo-leads` (or any path you prefer)
   - **Response Mode**: `Respond to Webhook`
   - **Response Code**: `200`
   - **Response Body**: JSON
   - **Response Data**:
     ```json
     {
       "success": true,
       "message": "Lead captured successfully"
     }
     ```
4. **Copy the Webhook URL** (looks like: `https://your-n8n.com/webhook/demo-leads`)
   - **This is your `VITE_N8N_WEBHOOK_URL`** - add it to `.env`!

### 3.2 Add Function Node (Optional - Normalize Data)

1. **Add Code node** after Webhook
2. **Mode**: `Run Once for All Items`
3. **Code**:
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

### 3.3 Add Google Sheets Node

1. **Add Google Sheets node** after Function node
2. **Operation**: `Append Row`
3. **Authentication**:
   - **Authentication Method**: `Service Account`
   - **Service Account Email**: (from Step 2, service account email)
   - **Private Key**: (from downloaded JSON file, copy the `private_key` value)
4. **Spreadsheet**: Select your sheet `Srikanth_Academy_Demo_Leads`
5. **Sheet**: `Sheet1` (or your sheet name)
6. **Columns**:
   ```
   Timestamp | Name | Email | Phone | Grade | Board | City | Country | UTM Source | UTM Medium | UTM Campaign | Referrer
   ```
7. **Values** (map from previous node):
   ```
   {{ $json.timestamp }} | {{ $json.name }} | {{ $json.email }} | {{ $json.phone }} | {{ $json.grade }} | {{ $json.board }} | {{ $json.city }} | {{ $json.country }} | {{ $json.utm_source }} | {{ $json.utm_medium }} | {{ $json.utm_campaign }} | {{ $json.referrer }}
   ```

### 3.4 Activate Workflow

1. **Click "Save"**
2. **Toggle "Active"** switch (top right)
3. **Test the workflow**:
   - Use the webhook URL in Postman or curl:
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
4. **Check Google Sheet** - you should see a new row!

---

## ✅ Step 4: Add Webhook URL to Your App

1. **Create/Update `.env` file** in your project root:
   ```env
   VITE_N8N_WEBHOOK_URL=https://your-n8n.com/webhook/demo-leads
   ```

2. **Restart your dev server**:
   ```bash
   npm run dev
   ```

---

## 📋 Data Format Sent to n8n

The demo form sends this JSON payload:

```json
{
  "source": "ap-physics-demo",
  "timestamp": "2024-12-12T14:30:00.000Z",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "grade": "11",
  "board": "CBSE",
  "city": "Mumbai",
  "country": "India",
  "utm": {
    "source": "google",
    "medium": "cpc",
    "campaign": "ap-physics-2024"
  },
  "referrer": "https://google.com"
}
```

---

## 🧪 Testing

1. **Go to your app**: `http://localhost:5175/demo`
2. **Fill out the demo form**
3. **Submit**
4. **Check n8n workflow** - should show execution
5. **Check Google Sheet** - should have new row

---

## 🔧 Troubleshooting

### Issue: Webhook not receiving data
- **Check**: Is workflow active?
- **Check**: Is webhook URL correct in `.env`?
- **Check**: Restart dev server after adding `.env` variable

### Issue: Google Sheets not updating
- **Check**: Service account has access to sheet
- **Check**: Sheet name matches in n8n node
- **Check**: Column names match exactly
- **Check**: Private key is correct (from JSON file)

### Issue: Data not formatted correctly
- **Check**: Function node is mapping fields correctly
- **Check**: Google Sheets node column mapping

---

## 📝 Quick Reference

- **Webhook URL**: `https://your-n8n.com/webhook/demo-leads`
- **Google Sheet**: `Srikanth_Academy_Demo_Leads`
- **Environment Variable**: `VITE_N8N_WEBHOOK_URL`
- **Form Route**: `/demo`
- **Success Route**: `/demo/success`

---

## ✅ Checklist

- [ ] Google Sheet created with headers
- [ ] Google Service Account created
- [ ] Google Sheets API enabled
- [ ] Service Account JSON key downloaded
- [ ] Sheet shared with service account email
- [ ] n8n workflow created
- [ ] Webhook node configured
- [ ] Google Sheets node configured
- [ ] Workflow activated
- [ ] Webhook URL added to `.env`
- [ ] Dev server restarted
- [ ] Test submission successful

---

## 🎉 You're Done!

Now when users fill out the demo form, their details will automatically appear in your Google Sheet via n8n!

