# 🔧 Troubleshoot: Email Notifications Not Working

## Problem
Demo form submissions are being saved to Google Sheet, but emails are not being sent to `srikanthsacademyforphysics@gmail.com`.

---

## ✅ Quick Check: Is Email Node Added?

Your n8n workflow should have **4 nodes** in this order:

1. ✅ **Webhook** - Receives form data
2. ✅ **Code** (Normalize Lead Data) - Processes data
3. ✅ **Google Sheets** (Append to Google Sheets) - Saves to sheet
4. ❌ **Gmail/SMTP** - **THIS IS MISSING!** - Sends email

---

## 🔧 Solution: Add Email Node to Your Workflow

### Step 1: Open Your n8n Workflow
- Go to: https://manasapadavala.app.n8n.cloud/workflow/Mbd8YfxUlm5NnRwV
- Make sure workflow is **Active** (toggle should be ON/green)

### Step 2: Add Gmail Node
1. Click **"+"** after the "Append to Google Sheets" node
2. Search for **"Gmail"**
3. Select **"Gmail"** node

### Step 3: Configure Gmail Node

1. **Authentication**:
   - Click **"Connect Account"** or **"Create New Credential"**
   - Choose **OAuth2** authentication
   - Sign in with any Gmail account (can be different from srikanthsacademyforphysics@gmail.com)
   - Authorize n8n to send emails

2. **Email Settings**:
   - **Operation**: `Send Email`
   - **To**: `srikanthsacademyforphysics@gmail.com`
   - **Subject**: `New Demo Lead: {{ $json.name }}`
   - **Email Type**: `HTML`
   - **Message**:
     ```html
     <h2>🎓 New Demo Lead Submission</h2>
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
     ```

### Step 4: Save and Activate
1. Click **"Save"** button
2. Make sure workflow is **Active** (toggle ON)
3. Test by submitting the demo form

---

## 🔍 Verify Your Workflow Structure

Your workflow should look like this:

```
Webhook (Receive Form Data)
    ↓
Code (Normalize Lead Data)
    ↓
Google Sheets (Append Row)
    ↓
Gmail (Send Email) ← ADD THIS!
```

---

## ✅ Test Checklist

1. [ ] Gmail node is added after Google Sheets node
2. [ ] Gmail authentication is connected
3. [ ] Email "To" field is set to: `srikanthsacademyforphysics@gmail.com`
4. [ ] Email subject includes: `{{ $json.name }}`
5. [ ] Workflow is **Active** (toggle ON)
6. [ ] Test form submission
7. [ ] Check email inbox (including spam folder)

---

## 🚨 Common Issues

### Issue 1: No Email Node
**Symptom**: Data saves to Google Sheet but no email received
**Solution**: Add Gmail node as described above

### Issue 2: Gmail Authentication Failed
**Symptom**: Error in n8n execution logs
**Solution**: 
- Re-authenticate Gmail
- Make sure you grant all permissions
- Try using a different Gmail account

### Issue 3: Email in Spam
**Symptom**: Email not in inbox
**Solution**: 
- Check spam/junk folder
- Mark as "Not Spam" if found
- Use proper HTML email template

### Issue 4: Wrong Email Address
**Symptom**: Emails going to wrong address
**Solution**: 
- Double-check "To" field in Gmail node
- Should be: `srikanthsacademyforphysics@gmail.com`

---

## 📧 Alternative: Use SMTP Instead of Gmail

If Gmail OAuth doesn't work, use SMTP:

1. **Add SMTP node** instead of Gmail
2. **Configure**:
   - **Host**: `smtp.gmail.com`
   - **Port**: `587`
   - **Secure**: `TLS`
   - **User**: `srikanthsacademyforphysics@gmail.com`
   - **Password**: Use Gmail App Password (not regular password)
     - Go to: Google Account → Security → 2-Step Verification → App Passwords
     - Generate app password for "Mail"
3. **Email Settings**:
   - **From**: `srikanthsacademyforphysics@gmail.com`
   - **To**: `srikanthsacademyforphysics@gmail.com`
   - **Subject**: `New Demo Lead: {{ $json.name }}`
   - **Message**: (Same HTML as above)

---

## 🎯 Quick Fix Summary

**The most likely issue**: Your n8n workflow is missing the Gmail/Email node.

**To fix**:
1. Open your n8n workflow
2. Add Gmail node after Google Sheets node
3. Configure to send to `srikanthsacademyforphysics@gmail.com`
4. Save and activate workflow
5. Test!

---

## 📞 Still Not Working?

1. **Check n8n Execution Logs**:
   - Go to n8n workflow
   - Click "Executions" tab
   - Check latest execution for errors

2. **Verify Webhook is Receiving Data**:
   - Check if Google Sheet is updating (if yes, webhook works)
   - If sheet updates but no email, email node is missing/not configured

3. **Test Email Node Manually**:
   - In n8n, click "Execute Workflow"
   - Send test data through the workflow
   - Check if email node executes successfully

