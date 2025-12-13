# 📧 Add Email Notification to n8n Workflow

## Overview
Update your existing n8n workflow to send email notifications to `srikanthsacademyforphysics@gmail.com` whenever a student submits the demo form.

---

## ✅ Step 1: Add Email Node to Your Workflow

1. **Open your n8n workflow**
   - Go to: https://manasapadavala.app.n8n.cloud/workflow/Mbd8YfxUlm5NnRwV
   - Make sure workflow is **Active**

2. **Add Email Node**
   - Click **"+"** after the "Append to Google Sheets" node
   - Search for **"Gmail"** or **"SMTP"**
   - Select **"Gmail"** (if using Gmail) or **"SMTP"** (for any email service)

---

## ✅ Step 2: Configure Gmail Node (Recommended)

### Option A: Using Gmail OAuth

1. **Click on the Gmail node**
2. **Operation**: Select `Send Email`
3. **Authentication**:
   - Click **"Connect my account"** or **"Create new credential"**
   - Sign in with your Gmail account (srikanthsacademyforphysics@gmail.com)
   - Authorize n8n to access Gmail
4. **Email Configuration**:
   - **To**: `srikanthsacademyforphysics@gmail.com`
   - **Subject**: `New Demo Lead: {{ $json.name }}`
   - **Email Type**: `HTML`
   - **Message**:
     ```html
     <h2>New Demo Lead Submission</h2>
     <p><strong>Name:</strong> {{ $json.name }}</p>
     <p><strong>Email:</strong> {{ $json.email }}</p>
     <p><strong>Phone:</strong> {{ $json.phone || 'Not provided' }}</p>
     <p><strong>Grade:</strong> {{ $json.grade || 'Not provided' }}</p>
     <p><strong>Board/Curriculum:</strong> {{ $json.board || 'Not provided' }}</p>
     <p><strong>City:</strong> {{ $json.city || 'Not provided' }}</p>
     <p><strong>Country:</strong> {{ $json.country || 'Not provided' }}</p>
     <hr>
     <p><strong>Submitted:</strong> {{ $json.timestamp }}</p>
     <p><strong>UTM Source:</strong> {{ $json.utm_source || 'Not provided' }}</p>
     <p><strong>UTM Campaign:</strong> {{ $json.utm_campaign || 'Not provided' }}</p>
     <p><strong>Referrer:</strong> {{ $json.referrer || 'Not provided' }}</p>
     ```

---

## ✅ Step 3: Configure SMTP Node (Alternative)

If you prefer SMTP or don't want to use Gmail OAuth:

1. **Add SMTP node** instead of Gmail
2. **Configure SMTP**:
   - **Host**: `smtp.gmail.com` (for Gmail)
   - **Port**: `587`
   - **Secure**: `TLS`
   - **User**: `srikanthsacademyforphysics@gmail.com`
   - **Password**: Use an **App Password** (not your regular password)
     - Go to Google Account → Security → 2-Step Verification → App Passwords
     - Generate an app password for "Mail"
     - Use that password here
3. **Email Configuration**:
   - **From**: `srikanthsacademyforphysics@gmail.com`
   - **To**: `srikanthsacademyforphysics@gmail.com`
   - **Subject**: `New Demo Lead: {{ $json.name }}`
   - **Email Type**: `HTML`
   - **Message**: (Same as above)

---

## ✅ Step 4: Connect the Nodes

Your workflow should now look like:

```
Webhook - Receive Form Data
    ↓
Normalize Lead Data
    ↓
Append to Google Sheets
    ↓
Send Email (Gmail/SMTP) ← NEW!
```

---

## ✅ Step 5: Test the Workflow

1. **Save the workflow**
2. **Test with a form submission**:
   - Go to your website: `https://your-domain.com/demo`
   - Fill out and submit the form
3. **Check**:
   - ✅ Google Sheet should have new row
   - ✅ Email should arrive at srikanthsacademyforphysics@gmail.com

---

## 📧 Email Template (Full Version)

For a more detailed email, use this template:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
    .field { margin: 10px 0; }
    .label { font-weight: bold; color: #667eea; }
    .value { color: #333; }
    .divider { border-top: 2px solid #eee; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🎓 New Demo Lead - Srikanth's Academy</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Name:</span>
        <span class="value">{{ $json.name }}</span>
      </div>
      <div class="field">
        <span class="label">Email:</span>
        <span class="value">{{ $json.email }}</span>
      </div>
      <div class="field">
        <span class="label">Phone:</span>
        <span class="value">{{ $json.phone || 'Not provided' }}</span>
      </div>
      <div class="field">
        <span class="label">Grade:</span>
        <span class="value">{{ $json.grade || 'Not provided' }}</span>
      </div>
      <div class="field">
        <span class="label">Board/Curriculum:</span>
        <span class="value">{{ $json.board || 'Not provided' }}</span>
      </div>
      <div class="field">
        <span class="label">City:</span>
        <span class="value">{{ $json.city || 'Not provided' }}</span>
      </div>
      <div class="field">
        <span class="label">Country:</span>
        <span class="value">{{ $json.country || 'Not provided' }}</span>
      </div>
      
      <div class="divider"></div>
      
      <div class="field">
        <span class="label">Submitted:</span>
        <span class="value">{{ $json.timestamp }}</span>
      </div>
      <div class="field">
        <span class="label">UTM Source:</span>
        <span class="value">{{ $json.utm_source || 'Not provided' }}</span>
      </div>
      <div class="field">
        <span class="label">UTM Medium:</span>
        <span class="value">{{ $json.utm_medium || 'Not provided' }}</span>
      </div>
      <div class="field">
        <span class="label">UTM Campaign:</span>
        <span class="value">{{ $json.utm_campaign || 'Not provided' }}</span>
      </div>
      <div class="field">
        <span class="label">Referrer:</span>
        <span class="value">{{ $json.referrer || 'Not provided' }}</span>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## 🔧 Troubleshooting

### Email not sending
- ✅ Check Gmail/SMTP authentication is correct
- ✅ Verify email address: `srikanthsacademyforphysics@gmail.com`
- ✅ Check n8n execution logs for errors
- ✅ For Gmail, make sure you're using App Password (not regular password)

### Email going to spam
- ✅ Use a proper email template (HTML)
- ✅ Include clear subject line
- ✅ Make sure "From" address matches authenticated account

---

## ✅ Final Workflow Structure

```
Webhook (POST /webhook/ap-physics-demo)
    ↓
Code (Normalize Lead Data)
    ↓
Google Sheets (Append Row)
    ↓
Gmail/SMTP (Send Email to srikanthsacademyforphysics@gmail.com)
```

---

## 🎉 You're Done!

Now every demo form submission will:
1. ✅ Be saved to Google Sheet
2. ✅ Send email notification to srikanthsacademyforphysics@gmail.com

Both actions happen automatically via your n8n workflow!

