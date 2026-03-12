# 📧 How to Add Approval Button to Email

## Problem
You're receiving approval emails but there's **no approval button** in the email.

## Solution
Update your n8n email template to include the approval button using the `approvalUrl` from the payload.

---

## 🔧 Step-by-Step: Add Approval Button to n8n Email

### Step 1: Open Your n8n Workflow

1. Go to your n8n instance
2. Open the workflow that sends approval emails
3. Find the **Gmail** or **Email Send** node

### Step 2: Update Email Template

The approval URL is already being sent in the webhook payload as `approvalUrl`. You just need to use it in your email template.

**Use this HTML email template:**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .approval-button {
      background-color: #2563eb;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      display: inline-block;
      margin: 20px 0;
    }
    .approval-button:hover {
      background-color: #1d4ed8;
    }
  </style>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎓 New Subscription Approval Request</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Action Required: Approve within 24 hours</p>
    </div>

    <!-- Content -->
    <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
      
      <h2 style="color: #1f2937; margin-top: 0;">Student Information:</h2>
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
          <td style="padding: 8px 0; font-weight: bold;">Board:</td>
          <td style="padding: 8px 0;">{{ $json.board || 'Not provided' }}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">City:</td>
          <td style="padding: 8px 0;">{{ $json.city || 'Not provided' }}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Country:</td>
          <td style="padding: 8px 0;">{{ $json.country || 'Not provided' }}</td>
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

      <!-- APPROVAL BUTTON -->
      <div style="text-align: center; margin: 40px 0; padding: 30px; background: #f0f9ff; border-radius: 10px; border: 2px solid #3b82f6;">
        <h3 style="color: #1e40af; margin-top: 0;">✅ Quick Approval</h3>
        <p style="color: #1e3a8a; margin-bottom: 20px;">Click the button below to instantly approve this user's subscription:</p>
        
        <a href="{{ $json.approvalUrl }}" 
           class="approval-button"
           style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 10px 0;">
          ✅ Approve Subscription
        </a>
        
        <p style="color: #64748b; font-size: 12px; margin-top: 15px;">
          Or copy this link: <br>
          <a href="{{ $json.approvalUrl }}" style="color: #3b82f6; word-break: break-all;">{{ $json.approvalUrl }}</a>
        </p>
      </div>

      <!-- Footer -->
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

## 📋 n8n Gmail Node Configuration

### Settings:

1. **Operation**: `Send Email`
2. **To**: `srikanthsacademyforphysics@gmail.com` (or your admin email)
3. **Subject**: `🎓 Approval Request: {{ $json.name }} - {{ $json.email }}`
4. **Email Format**: `HTML`
5. **Message**: Paste the HTML template above

### Important:
- Make sure to use `{{ $json.approvalUrl }}` in the template
- The approval URL is automatically included in the webhook payload
- The button will link directly to the approval page

---

## 🔗 Approval URL Format

The approval URL in the email will look like:
```
https://your-domain.com/approve-subscription?userId=USER_ID_HERE
```

**For local development:**
```
http://localhost:5175/approve-subscription?userId=USER_ID_HERE
```

**For production:**
```
https://your-production-domain.com/approve-subscription?userId=USER_ID_HERE
```

---

## ✅ What Happens When You Click the Button

1. **Opens approval page** in browser
2. **Automatically approves** the user
3. **Sets subscription_status** to `'paid'`
4. **Grants 1 year access** (subscription_expires_at = 1 year from now)
5. **User can immediately** sign in and access dashboard

---

## 🧪 Testing

### Test the Email Template:

1. **Trigger a demo form submission** (or approval request)
2. **Check your email** - should receive email with approval button
3. **Click the approval button** - should open approval page
4. **Verify user is approved** - check Supabase `user_profiles` table

### Verify Approval URL is in Payload:

In n8n workflow, add a **Set** node before Gmail to check:
```json
{
  "approvalUrl": "{{ $json.approvalUrl }}",
  "userId": "{{ $json.userId }}",
  "name": "{{ $json.name }}"
}
```

---

## 🎯 Quick Fix: Simple Email Template

If you want a simpler template, use this:

```html
<h2>🎓 New Subscription Approval Request</h2>

<p><strong>Student:</strong> {{ $json.name }} ({{ $json.email }})</p>
<p><strong>Submitted:</strong> {{ $json.timestamp }}</p>

<div style="text-align: center; margin: 30px 0;">
  <a href="{{ $json.approvalUrl }}" 
     style="background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
    ✅ Approve Subscription
  </a>
</div>

<p style="color: #666; font-size: 12px;">
  Approval Link: <a href="{{ $json.approvalUrl }}">{{ $json.approvalUrl }}</a>
</p>
```

---

## 📝 Checklist

- [ ] n8n workflow receives webhook with `approvalUrl` field
- [ ] Gmail/Email node configured with HTML template
- [ ] Template uses `{{ $json.approvalUrl }}` for button link
- [ ] Test email received with approval button
- [ ] Clicking button successfully approves user
- [ ] Approved user can access dashboard

---

## 🆘 Troubleshooting

### Button Not Showing?
- Check that email format is set to **HTML** (not plain text)
- Verify `{{ $json.approvalUrl }}` is in the template
- Check n8n workflow logs to see if `approvalUrl` is in payload

### Approval URL is Empty?
- Check that `subscriptionService.ts` is generating the URL correctly
- Verify `VITE_APP_URL` is set in `.env` (or it uses current domain)
- Check browser console for approval URL when user requests approval

### Button Doesn't Work?
- Verify the approval URL format is correct
- Check that `/approve-subscription` route exists in your app
- Ensure Supabase RLS policies allow approval updates

---

**After updating the n8n email template, your approval emails will include a clickable approval button! 🎉**
