# 📧 n8n Email Notification Setup

This guide shows you how to add email notifications to your n8n workflow so you receive an email at **srikanthsacademyforphysics@gmail.com** whenever a student submits the demo form.

---

## ✅ Option 1: Using Gmail Node (Recommended)

### Step 1: Add Gmail Node

1. **In your n8n workflow**, click "+" after the "Append to Google Sheets" node
2. **Search for "Gmail"**
3. **Select "Gmail" node**

### Step 2: Authenticate Gmail

1. **Click "Connect Account"** or "Create New Credential"
2. **Choose Authentication Method**: `OAuth2` (recommended)
3. **Follow n8n's OAuth flow**:
   - You'll be redirected to Google to authorize n8n
   - Grant permissions to send emails on your behalf
   - Return to n8n

**Note**: You can use any Gmail account that has permission to send emails. The emails will be sent FROM that account TO srikanthsacademyforphysics@gmail.com

### Step 3: Configure Email

1. **Operation**: `Send Email`
2. **To**: `srikanthsacademyforphysics@gmail.com`
3. **Subject**: `New Demo Lead: {{ $json.name }}`
4. **Email Type**: `HTML`
5. **Message** (HTML):
   ```html
   <h2>🎓 New Demo Lead Submission</h2>
   
   <p><strong>Student Information:</strong></p>
   <ul>
     <li><strong>Name:</strong> {{ $json.name }}</li>
     <li><strong>Email:</strong> {{ $json.email }}</li>
     <li><strong>Phone:</strong> {{ $json.phone || 'Not provided' }}</li>
     <li><strong>Grade:</strong> {{ $json.grade || 'Not provided' }}</li>
     <li><strong>Board/Curriculum:</strong> {{ $json.board || 'Not provided' }}</li>
     <li><strong>City:</strong> {{ $json.city || 'Not provided' }}</li>
     <li><strong>Country:</strong> {{ $json.country || 'Not provided' }}</li>
   </ul>
   
   <hr>
   
   <p><strong>Submission Details:</strong></p>
   <ul>
     <li><strong>Submitted:</strong> {{ $json.timestamp }}</li>
     <li><strong>UTM Source:</strong> {{ $json.utm_source || 'N/A' }}</li>
     <li><strong>UTM Medium:</strong> {{ $json.utm_medium || 'N/A' }}</li>
     <li><strong>UTM Campaign:</strong> {{ $json.utm_campaign || 'N/A' }}</li>
     <li><strong>Referrer:</strong> {{ $json.referrer || 'Direct' }}</li>
   </ul>
   
   <p style="margin-top: 20px; color: #666;">
     This lead has been automatically saved to your Google Sheet.
   </p>
   ```

### Step 4: Test

1. **Click "Execute Workflow"** in n8n
2. **Send test data** through the webhook
3. **Check your email** at srikanthsacademyforphysics@gmail.com
4. **Verify** you received the notification email

---

## ✅ Option 2: Using SMTP Email Node

If you prefer to use SMTP (e.g., for custom email providers):

### Step 1: Add SMTP Email Node

1. **Click "+" after Google Sheets node**
2. **Search for "SMTP Email"**
3. **Select "SMTP Email" node**

### Step 2: Configure SMTP

1. **SMTP Host**: (e.g., `smtp.gmail.com` for Gmail)
2. **SMTP Port**: `587` (TLS) or `465` (SSL)
3. **User**: Your email address
4. **Password**: Your email password or app password
5. **Secure**: `TLS` or `SSL`

### Step 3: Configure Email

1. **From**: Your email address
2. **To**: `srikanthsacademyforphysics@gmail.com`
3. **Subject**: `New Demo Lead: {{ $json.name }}`
4. **Email Type**: `HTML`
5. **Message**: (Same HTML as above)

---

## ✅ Option 3: Using Gmail API with Service Account

If you want to send emails from srikanthsacademyforphysics@gmail.com directly:

1. **Set up Gmail API** in Google Cloud Console
2. **Create Service Account** with Gmail API access
3. **Use Gmail node** with Service Account authentication
4. **Configure** to send from srikanthsacademyforphysics@gmail.com

---

## 🔧 Troubleshooting

### Email not sending
- ✅ Check Gmail authentication is connected
- ✅ Verify email address is correct: `srikanthsacademyforphysics@gmail.com`
- ✅ Check n8n execution logs for errors
- ✅ Verify Gmail API permissions are granted

### Gmail OAuth not working
- ✅ Make sure you're logged into the correct Google account
- ✅ Grant all requested permissions
- ✅ Check if 2FA is enabled (may need app password for SMTP)

### SMTP not working
- ✅ Verify SMTP host and port are correct
- ✅ Check if app password is required (for Gmail with 2FA)
- ✅ Test SMTP settings in a separate email client first

---

## 📋 Final Workflow Structure

Your complete workflow should look like:

```
Webhook (Receive Form Data)
    ↓
Code (Normalize Data)
    ↓
Google Sheets (Append Row)
    ↓
Gmail (Send Email to srikanthsacademyforphysics@gmail.com)
```

---

## ✅ Test Checklist

- [ ] Gmail node added to workflow
- [ ] Gmail authentication configured
- [ ] Email recipient set to: srikanthsacademyforphysics@gmail.com
- [ ] Email template configured
- [ ] Workflow tested with sample data
- [ ] Email received successfully
- [ ] Workflow activated

---

## 🎉 Done!

Now every time a student submits the demo form:
1. ✅ Data is saved to Google Sheet
2. ✅ You receive an email at srikanthsacademyforphysics@gmail.com

You'll never miss a lead! 🚀

