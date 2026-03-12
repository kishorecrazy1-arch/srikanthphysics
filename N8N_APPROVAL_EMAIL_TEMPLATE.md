# 📧 n8n Email Template with Approval Button

## Problem
You're receiving approval emails but there's **no approval button** in the email.

## Solution
The approval URL (`approvalUrl`) is already being sent in the webhook payload. You just need to add it to your n8n email template.

---

## 🔧 Quick Fix: Add Approval Button to n8n Email

### Step 1: Open Your n8n Workflow

1. Go to your n8n instance
2. Find the workflow that sends approval emails
3. Open the **Gmail** or **Email Send** node

### Step 2: Update Email Template

**Add this approval button section to your email template:**

```html
<!-- APPROVAL BUTTON SECTION -->
<div style="text-align: center; margin: 40px 0; padding: 30px; background: #f0f9ff; border-radius: 10px; border: 2px solid #3b82f6;">
  <h3 style="color: #1e40af; margin-top: 0;">✅ Quick Approval</h3>
  <p style="color: #1e3a8a; margin-bottom: 20px;">Click the button below to instantly approve this user:</p>
  
  <a href="{{ $json.approvalUrl }}" 
     style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 10px 0;">
    ✅ Approve Subscription
  </a>
  
  <p style="color: #64748b; font-size: 12px; margin-top: 15px;">
    Or copy this link: <br>
    <a href="{{ $json.approvalUrl }}" style="color: #3b82f6; word-break: break-all;">{{ $json.approvalUrl }}</a>
  </p>
</div>
```

---

## 📋 Complete Email Template (For Subscription Approvals)

Use this complete template for subscription approval emails:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">🎓 New Subscription Approval Request</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Action Required: Approve within 24 hours</p>
    </div>
    
    <div class="content">
      <h2 style="color: #1f2937;">Student Information:</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 150px;">Name:</td>
          <td style="padding: 8px 0;">{{ $json.name }}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0;">{{ $json.email }}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
          <td style="padding: 8px 0;">{{ $json.phone || 'Not provided' }}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Grade:</td>
          <td style="padding: 8px 0;">{{ $json.grade || 'Not provided' }}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Course Type:</td>
          <td style="padding: 8px 0;">{{ $json.courseType || 'Not provided' }}</td>
        </tr>
      </table>

      <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 30px 0;">

      <h2 style="color: #1f2937;">Submission Details:</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 150px;">User ID:</td>
          <td style="padding: 8px 0; font-family: monospace; font-size: 12px;">{{ $json.userId }}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Submitted:</td>
          <td style="padding: 8px 0;">{{ $json.timestamp }}</td>
        </tr>
      </table>

      <!-- ✅ APPROVAL BUTTON -->
      <div style="text-align: center; margin: 40px 0; padding: 30px; background: #f0f9ff; border-radius: 10px; border: 2px solid #3b82f6;">
        <h3 style="color: #1e40af; margin-top: 0;">✅ Quick Approval</h3>
        <p style="color: #1e3a8a; margin-bottom: 20px;">Click the button below to instantly approve this user's subscription:</p>
        
        <a href="{{ $json.approvalUrl }}" 
           style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 10px 0;">
          ✅ Approve Subscription
        </a>
        
        <p style="color: #64748b; font-size: 12px; margin-top: 15px;">
          Or copy this link: <br>
          <a href="{{ $json.approvalUrl }}" style="color: #3b82f6; word-break: break-all;">{{ $json.approvalUrl }}</a>
        </p>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
        <p>This is an automated notification from Srikanth's Academy</p>
        <p>Approving this user grants them 1 year of full platform access.</p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## ⚙️ n8n Gmail Node Configuration

### Settings:

1. **Operation**: `Send Email`
2. **To**: `srikanthsacademyforphysics@gmail.com`
3. **Subject**: `🎓 Approval Request: {{ $json.name }} - {{ $json.email }}`
4. **Email Format**: `HTML` (IMPORTANT!)
5. **Message**: Paste the HTML template above

### Important Notes:

- ✅ Use `{{ $json.approvalUrl }}` in the template
- ✅ Make sure email format is set to **HTML** (not plain text)
- ✅ The `approvalUrl` is automatically included in the webhook payload

---

## 🔍 Verify Approval URL is in Payload

To check if `approvalUrl` is being sent, add a **Set** node in n8n before the email:

```json
{
  "approvalUrl": "{{ $json.approvalUrl }}",
  "userId": "{{ $json.userId }}",
  "name": "{{ $json.name }}"
}
```

This will show you what data is available.

---

## 🎯 What Happens When You Click the Button

1. Opens approval page: `/approve-subscription?userId=USER_ID`
2. Automatically approves the user
3. Sets `subscription_status = 'paid'`
4. Grants 1 year access
5. User can immediately sign in and access dashboard

---

## 📝 For Demo Lead Emails (Different Template)

**Note:** Demo lead emails (from demo form) don't need approval buttons - they're just notifications.

If you want to add approval for demo leads too, you'd need to:
1. Get the user ID from the demo submission
2. Generate approval URL
3. Include it in the demo webhook payload

But typically, demo leads don't need approval - they just need to be contacted.

---

## ✅ Checklist

- [ ] n8n workflow receives webhook with `approvalUrl` field
- [ ] Gmail/Email node configured with HTML template
- [ ] Template uses `{{ $json.approvalUrl }}` for button
- [ ] Email format set to **HTML** (not plain text)
- [ ] Test email received with approval button
- [ ] Clicking button successfully approves user

---

## 🆘 Troubleshooting

### Button Not Showing?
- ✅ Check email format is **HTML** (not plain text)
- ✅ Verify `{{ $json.approvalUrl }}` is in template
- ✅ Check n8n workflow logs to see if `approvalUrl` exists in payload

### Approval URL is Empty?
- ✅ Check that subscription approval request includes `approvalUrl`
- ✅ Verify `VITE_APP_URL` is set in `.env` (or uses current domain)
- ✅ Check browser console when user requests approval

### Button Doesn't Work?
- ✅ Verify approval URL format: `/approve-subscription?userId=...`
- ✅ Check that route exists in your app
- ✅ Ensure Supabase RLS policies allow updates

---

**After updating your n8n email template, approval emails will include a clickable approval button! 🎉**
