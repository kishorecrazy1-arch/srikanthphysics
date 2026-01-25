# 🔐 n8n Workflow Setup for Sign-In Notifications

## Overview
This guide shows you how to create an n8n workflow to receive email notifications at **srikanthsacademyforphysics@gmail.com** whenever a user signs in to the platform.

---

## ✅ Step 1: Create New Workflow in n8n

1. **Log in to n8n**
   - Go to your n8n instance (e.g., `https://manasapadavala.app.n8n.cloud`)
   - Click **"Workflows"** → **"Add Workflow"**

2. **Name your workflow**
   - Name: `User Sign-In Notifications`
   - Description: `Sends email notification when users sign in to Srikanth's Academy`

---

## ✅ Step 2: Add Webhook Node

1. **Add Webhook node**
   - Click **"+"** to add node
   - Search for **"Webhook"**
   - Select **"Webhook"** node

2. **Configure Webhook**
   - **HTTP Method:** `POST`
   - **Path:** `user-signin` (or any path you prefer)
   - **Response Mode:** `Respond to Webhook`
   - **Response Code:** `200`
   - **Response Body:** Select `JSON`
   - **Response Data:**
     ```json
     {
       "success": true,
       "message": "Sign-in notification received"
     }
     ```

3. **Get Webhook URL**
   - Click **"Execute Node"** (or save workflow)
   - Copy the **Webhook URL** (looks like: `https://your-n8n.com/webhook/user-signin`)
   - **This is your `VITE_N8N_SIGNIN_WEBHOOK_URL`** - add it to your `.env` file!

---

## ✅ Step 3: Add Code Node (Optional - Normalize Data)

1. **Add Code node** (optional, for data processing)
   - Click **"+"** after Webhook node
   - Search for **"Code"** → Select **"Code"**

2. **Configure Code Node**
   - **Mode:** `Run Once for All Items`
   - **Language:** `JavaScript`
   - **Code:**
   ```javascript
   // Normalize sign-in data
   const items = $input.all();
   
   return items.map(item => {
     const d = item.json;
     
     return {
       json: {
         source: d.source || 'user-signin',
         timestamp: d.timestamp || new Date().toISOString(),
         name: d.name || '',
         email: d.email || '',
         userId: d.userId || '',
         lastSignIn: d.lastSignIn || '',
         referrer: d.referrer || ''
       }
     };
   });
   ```

---

## ✅ Step 4: Add Gmail Node (Send Email)

1. **Add Gmail node**
   - Click **"+"** after Code node (or Webhook if you skipped Code)
   - Search for **"Gmail"**
   - Select **"Gmail"** node

2. **Authenticate Gmail**
   - Click **"Connect Account"** or **"Create New Credential"**
   - Choose **OAuth2** authentication
   - Sign in with your Gmail account
   - Authorize n8n to send emails

3. **Configure Email**
   - **Operation:** `Send Email`
   - **To:** `srikanthsacademyforphysics@gmail.com`
   - **Subject:** `User Sign-In: {{ $json.name }} ({{ $json.email }})`
   - **Email Type:** `HTML`
   - **Message** (HTML):
   ```html
   <h2>🔐 User Sign-In Notification</h2>
   
   <p><strong>User Information:</strong></p>
   <ul>
     <li><strong>Name:</strong> {{ $json.name }}</li>
     <li><strong>Email:</strong> {{ $json.email }}</li>
     <li><strong>User ID:</strong> {{ $json.userId }}</li>
     <li><strong>Last Sign-In:</strong> {{ $json.lastSignIn || 'N/A' }}</li>
   </ul>
   
   <hr>
   
   <p><strong>Sign-In Details:</strong></p>
   <ul>
     <li><strong>Signed In At:</strong> {{ $json.timestamp }}</li>
     <li><strong>Source:</strong> {{ $json.source }}</li>
     <li><strong>Referrer:</strong> {{ $json.referrer || 'Direct' }}</li>
   </ul>
   
   <hr>
   
   <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f0f9ff; border: 2px solid #2563eb; border-radius: 8px;">
     <h3 style="color: #1e40af; margin-bottom: 15px;">⚡ Quick Action: Approve User</h3>
     <p style="color: #1e3a8a; margin-bottom: 20px;">Click the button below to instantly approve this user and grant them dashboard access:</p>
     <a href="{{ $json.approvalUrl }}" 
        style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
       ✅ Approve User & Grant Dashboard Access
     </a>
     <p style="color: #64748b; font-size: 12px; margin-top: 15px;">
       Approval Link: <a href="{{ $json.approvalUrl }}" style="color: #2563eb; word-break: break-all;">{{ $json.approvalUrl }}</a>
     </p>
   </div>
   
   <p style="margin-top: 20px; color: #666;">
     This is an automated notification when a user signs in to Srikanth's Academy platform.
   </p>
   ```

---

## ✅ Step 5: Add Google Sheets Node (Optional - Log Sign-Ins)

1. **Add Google Sheets node** (optional, to log sign-ins)
   - Click **"+"** after Gmail node
   - Search for **"Google Sheets"**
   - Select **"Google Sheets"** node

2. **Authenticate Google Sheets**
   - Click **"Connect Account"** or **"Create New Credential"**
   - Use Service Account (recommended) or OAuth2
   - Follow n8n's authentication flow

3. **Configure Google Sheets**
   - **Operation:** `Append`
   - **Spreadsheet ID:** Your Google Sheet ID
   - **Sheet Name:** `Sign-Ins` (or create a new sheet)
   - **Columns:**
     - `Timestamp`
     - `Name`
     - `Email`
     - `User ID`
     - `Last Sign-In`
     - `Referrer`

4. **Map Data**
   - **Timestamp:** `{{ $json.timestamp }}`
   - **Name:** `{{ $json.name }}`
   - **Email:** `{{ $json.email }}`
   - **User ID:** `{{ $json.userId }}`
   - **Last Sign-In:** `{{ $json.lastSignIn }}`
   - **Referrer:** `{{ $json.referrer }}`

---

## ✅ Step 6: Activate Workflow

1. **Save the workflow**
   - Click **"Save"** in the top right

2. **Activate the workflow**
   - Toggle the **"Active"** switch to ON (green)
   - The workflow is now live and will receive sign-in notifications

---

## 🔧 Step 7: Add Environment Variable

Since you've created **separate workflows** for sign-in and sign-up, you need to add the sign-in webhook URL to your `.env` file:

1. **Add to your `.env` file:**
   ```env
   # Existing signup webhook (you already have this)
   VITE_N8N_SIGNUP_WEBHOOK_URL=https://your-n8n.com/webhook/user-signup
   
   # New sign-in webhook (add this)
   VITE_N8N_SIGNIN_WEBHOOK_URL=https://your-n8n.com/webhook/user-signin
   ```

2. **Get your sign-in webhook URL:**
   - Go to your sign-in workflow in n8n
   - Click on the **Webhook node**
   - Copy the **Webhook URL** (it should look like: `https://your-n8n.com/webhook/user-signin`)
   - Paste it as the value for `VITE_N8N_SIGNIN_WEBHOOK_URL`

3. **Restart your dev server** after adding the environment variable:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

**Note:** 
- The code will use `VITE_N8N_SIGNIN_WEBHOOK_URL` for sign-in notifications
- The code will use `VITE_N8N_SIGNUP_WEBHOOK_URL` for signup notifications
- If either is not set, it will fall back to `VITE_N8N_WEBHOOK_URL` (if you have that set)

---

## 📋 Complete Workflow Structure

Your n8n workflow should look like this:

```
Webhook (Receive Sign-In Data)
    ↓
Code (Normalize Data) [Optional]
    ↓
Gmail (Send Email to srikanthsacademyforphysics@gmail.com)
    ↓
Google Sheets (Log Sign-Ins) [Optional]
```

---

## 📧 Email Template Preview

The email sent will look like:

**Subject:** User Sign-In: John Doe (john@example.com)

**Body:**
- User Information (Name, Email, User ID, Last Sign-In)
- Sign-In Details (Timestamp, Source, Referrer)

---

## ✅ Testing

1. **Test the workflow:**
   - Go to your app
   - Sign in with a test account
   - Check your email at `srikanthsacademyforphysics@gmail.com`
   - Verify you received the sign-in notification

2. **Check n8n execution logs:**
   - Go to your n8n workflow
   - Click **"Executions"** tab
   - Verify the webhook was called successfully

---

## 🔧 Troubleshooting

### Email not sending
- ✅ Check Gmail authentication is connected
- ✅ Verify email address is correct: `srikanthsacademyforphysics@gmail.com`
- ✅ Check n8n execution logs for errors
- ✅ Verify workflow is **Active**

### Webhook not receiving data
- ✅ Check `VITE_N8N_SIGNIN_WEBHOOK_URL` is set in `.env`
- ✅ Restart dev server after adding environment variable
- ✅ Verify webhook URL is correct in n8n
- ✅ Check browser console for webhook errors

### Google Sheets not updating
- ✅ Verify Google Sheets authentication
- ✅ Check spreadsheet ID is correct
- ✅ Ensure sheet name matches exactly
- ✅ Verify column headers match

---

## 📝 Quick Reference

### Webhook Payload Structure:
```json
{
  "source": "user-signin",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "name": "John Doe",
  "email": "john@example.com",
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "lastSignIn": "2024-01-14T08:00:00.000Z",
  "referrer": "https://example.com",
  "approvalUrl": "https://your-domain.com/approve-subscription?userId=123e4567-e89b-12d3-a456-426614174000"
}
```

### Environment Variables:
- `VITE_N8N_SIGNIN_WEBHOOK_URL` - Dedicated sign-in webhook (recommended)
- `VITE_N8N_WEBHOOK_URL` - Fallback to existing webhook

---

## ✅ Checklist

- [ ] Sign-in n8n workflow created (separate from signup workflow)
- [ ] Webhook node configured
- [ ] Gmail node added and authenticated
- [ ] Email template configured
- [ ] Google Sheets node added (optional)
- [ ] Sign-in workflow activated
- [ ] Sign-in webhook URL copied from n8n
- [ ] `VITE_N8N_SIGNIN_WEBHOOK_URL` added to `.env` file
- [ ] Dev server restarted
- [ ] Test sign-in completed
- [ ] Email received successfully at `srikanthsacademyforphysics@gmail.com`

---

## 🎉 Done!

Now whenever a user signs in to Srikanth's Academy:
1. ✅ Sign-in notification is sent to n8n webhook
2. ✅ Email is sent to `srikanthsacademyforphysics@gmail.com`
3. ✅ Sign-in is logged to Google Sheets (if configured)
4. ✅ You're notified of all user sign-ins!

