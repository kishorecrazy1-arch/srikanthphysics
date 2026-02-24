# 🔧 Fix: Demo Form Emails Not Reaching Srikanth's Academy

## Problem
Demo form submissions are being sent to n8n webhook, but emails are not being received at `srikanthsacademyforphysics@gmail.com`.

## ✅ Step 1: Verify Webhook is Being Called

1. **Open browser console** (F12) when submitting the demo form
2. **Go to Network tab**
3. **Submit the form**
4. **Look for a request to**: `webhook/demo-booking`
5. **Check the response**:
   - ✅ Status `200 OK` = Webhook is working
   - ❌ Status `404` or `500` = Webhook URL is wrong or workflow is inactive

## ✅ Step 2: Check Your n8n Workflow

### Go to Your n8n Dashboard
1. Visit: https://manasapadavala.app.n8n.cloud
2. Find your **"Demo Booking"** workflow
3. Make sure it's **Active** (toggle should be ON/green)

### Verify Workflow Structure

Your workflow should have these nodes in order:

```
1. Webhook (Receives form data)
   ↓
2. Code/Function (Optional - Normalize data)
   ↓
3. Google Sheets (Save to spreadsheet) ✅
   ↓
4. Gmail/SMTP (Send email) ❌ CHECK THIS!
```

## ✅ Step 3: Add/Configure Email Node

### Option A: Using Gmail Node (Recommended)

1. **Add Gmail Node**:
   - Click **"+"** after your Google Sheets node
   - Search for **"Gmail"**
   - Select **"Gmail"** node

2. **Configure Authentication**:
   - Click **"Connect Account"** or **"Create New Credential"**
   - Choose **OAuth2** authentication
   - Sign in with a Gmail account (can be any Gmail account)
   - Authorize n8n to send emails

3. **Configure Email Settings**:
   - **Operation**: `Send Email`
   - **To**: `srikanthsacademyforphysics@gmail.com`
   - **Subject**: `New Demo Lead: {{ $json.name }}`
   - **Email Type**: `HTML`
   - **Message**: (See template below)

### Option B: Using SMTP Node

1. **Add SMTP Node**:
   - Click **"+"** after your Google Sheets node
   - Search for **"SMTP"**
   - Select **"SMTP"** node

2. **Configure SMTP Settings**:
   - **Host**: `smtp.gmail.com`
   - **Port**: `587`
   - **Secure**: `TLS`
   - **User**: `srikanthsacademyforphysics@gmail.com`
   - **Password**: Use an **App Password** (not your regular password)
     - Go to: https://myaccount.google.com/apppasswords
     - Generate an app password for "Mail"
     - Use that password here

3. **Configure Email**:
   - **From**: `srikanthsacademyforphysics@gmail.com`
   - **To**: `srikanthsacademyforphysics@gmail.com`
   - **Subject**: `New Demo Lead: {{ $json.name }}`
   - **Email Type**: `HTML`
   - **Message**: (See template below)

## ✅ Step 4: Email Template

Use this HTML template for the email body:

```html
<h2>🎓 New Demo Lead Received!</h2>

<div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h3 style="color: #1e40af; margin-bottom: 15px;">Student Information</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px; font-weight: bold; color: #1e3a8a;">Name:</td>
      <td style="padding: 8px; color: #1e40af;">{{ $json.name }}</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold; color: #1e3a8a;">Email:</td>
      <td style="padding: 8px; color: #1e40af;">{{ $json.email }}</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold; color: #1e3a8a;">Phone:</td>
      <td style="padding: 8px; color: #1e40af;">{{ $json.phone || 'Not provided' }}</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold; color: #1e3a8a;">Grade:</td>
      <td style="padding: 8px; color: #1e40af;">{{ $json.grade || 'Not provided' }}</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold; color: #1e3a8a;">Course:</td>
      <td style="padding: 8px; color: #1e40af;">{{ $json.board || 'Not provided' }}</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold; color: #1e3a8a;">City:</td>
      <td style="padding: 8px; color: #1e40af;">{{ $json.city || 'Not provided' }}</td>
    </tr>
    <tr>
      <td style="padding: 8px; font-weight: bold; color: #1e3a8a;">Country:</td>
      <td style="padding: 8px; color: #1e40af;">{{ $json.country || 'Not provided' }}</td>
    </tr>
  </table>
</div>

<div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
  <p style="color: #92400e; margin: 0;">
    <strong>⏰ Action Required:</strong> Please contact this student within 24 hours to schedule their free demo session.
  </p>
</div>

<p style="color: #666; font-size: 12px; margin-top: 20px;">
  This is an automated notification from Srikanth's Academy demo booking form.
</p>
```

## ✅ Step 5: Test the Workflow

1. **Save your workflow** in n8n
2. **Make sure workflow is Active** (toggle ON)
3. **Submit a test demo form** from your website
4. **Check n8n execution logs**:
   - Click on your workflow
   - Go to "Executions" tab
   - Look for the latest execution
   - Check if email node executed successfully
   - If there's an error, click on it to see details

5. **Check email inbox**:
   - Check `srikanthsacademyforphysics@gmail.com` inbox
   - Also check **Spam/Junk folder**
   - Email should arrive within 1-2 minutes

## 🔧 Troubleshooting

### Email node shows error in n8n
- ✅ Check Gmail/SMTP authentication is correct
- ✅ Verify email address: `srikanthsacademyforphysics@gmail.com`
- ✅ For Gmail, make sure you're using App Password (not regular password)
- ✅ Check n8n execution logs for specific error messages

### Email going to spam
- ✅ Use a proper HTML email template (provided above)
- ✅ Include clear subject line
- ✅ Make sure "From" address matches authenticated account

### Webhook not receiving data
- ✅ Check webhook URL in `.env`: `VITE_N8N_WEBHOOK_URL`
- ✅ Verify webhook URL matches n8n workflow webhook node
- ✅ Make sure workflow is Active in n8n

### Form submits but no email
- ✅ Check n8n workflow execution logs
- ✅ Verify email node is connected after Google Sheets node
- ✅ Make sure email node is configured correctly
- ✅ Check if email node has any error messages

## 📋 Quick Checklist

- [ ] Webhook URL is configured in `.env`
- [ ] n8n workflow is **Active**
- [ ] Email node (Gmail/SMTP) is added to workflow
- [ ] Email node is connected after Google Sheets node
- [ ] Email authentication is configured
- [ ] Email "To" field is set to `srikanthsacademyforphysics@gmail.com`
- [ ] Email template is configured
- [ ] Test form submission works
- [ ] Check email inbox and spam folder

## 🎉 Once Fixed

After configuring the email node, every demo form submission will:
1. ✅ Be saved to Google Sheet
2. ✅ Send email notification to `srikanthsacademyforphysics@gmail.com`
3. ✅ Include all student details in the email

Both actions happen automatically via your n8n workflow!
