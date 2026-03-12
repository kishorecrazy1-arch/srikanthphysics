# ✅ Verify Demo Booking Workflow

## Current Status Check

Your demo form workflow should handle these 4 steps:
1. ✅ Send confirmation email to student (within a few minutes)
2. ✅ Contact student via WhatsApp/Email (within 24 hours)
3. ✅ Schedule free demo at convenient time
4. ✅ Show platform and provide personalized guidance

---

## 🔍 How to Verify It's Working

### Step 1: Check n8n Webhook is Configured

1. **Verify webhook URL in `.env`:**
   ```env
   VITE_N8N_WEBHOOK_URL=https://manasapadavala.app.n8n.cloud/webhook/ap-physics-demo
   ```

2. **Check browser console after form submission:**
   - Open DevTools (F12)
   - Go to Network tab
   - Submit demo form
   - Look for request to `webhook/ap-physics-demo`
   - Should return status `200 OK`

---

### Step 2: Verify n8n Workflow Has Required Nodes

**Your n8n workflow should have these nodes in order:**

```
1. Webhook (Receives form data)
   ↓
2. Code (Normalize Lead Data) - Optional
   ↓
3. Email Node (Send confirmation to student)
   ↓
4. Email Node (Send notification to srikanthsacademyforphysics@gmail.com)
   ↓
5. WhatsApp/SMS Node (Optional - Send WhatsApp message)
   ↓
6. Google Sheets (Save to spreadsheet)
```

**To check:**
1. Go to: https://manasapadavala.app.n8n.cloud/workflow/XmafvLhS28STAmPo
2. Verify all nodes are connected
3. Make sure workflow is **Active** (toggle ON/green)
4. Click on the Webhook node to get the webhook URL

---

### Step 3: Test Each Step

#### ✅ Step 1: Confirmation Email to Student

**What to check:**
- After form submission, student should receive email
- Email should come from your configured email address
- Subject should mention "Demo Booking Confirmed" or similar

**To verify:**
1. Submit a test form with your own email
2. Check inbox (and spam folder)
3. Should receive email within 1-2 minutes

**If NOT working:**
- Check n8n workflow has "Email" node configured
- Verify email authentication in n8n
- Check n8n execution logs for errors

---

#### ✅ Step 2: Team Contact via WhatsApp/Email

**What to check:**
- Your team should receive notification at `srikanthsacademyforphysics@gmail.com`
- Notification should include student details (name, email, phone, etc.)
- If WhatsApp integration is set up, message should be sent

**To verify:**
1. Submit test form
2. Check `srikanthsacademyforphysics@gmail.com` inbox
3. Should see new demo lead notification

**If NOT working:**
- Add Gmail/SMTP node to n8n workflow (see: `N8N_EMAIL_SETUP.md`)
- Configure WhatsApp integration in n8n (if using)

---

#### ✅ Step 3: Demo Scheduling

**What to check:**
- Student receives calendar invite or scheduling link
- OR your team manually schedules based on notification

**Note:** This step might be:
- **Automated:** Using Calendly integration or calendar API
- **Manual:** Team receives notification and contacts student to schedule

**If using Calendly:**
- Verify `VITE_CALENDLY_URL` is set in `.env`
- Check Calendly widget appears on demo form page

---

#### ✅ Step 4: Demo Session

**What to check:**
- This is the actual demo meeting
- Student sees platform walkthrough
- Personalized guidance is provided

**Note:** This step happens during the actual demo call/meeting.

---

## 🧪 Quick Test Procedure

1. **Submit test form:**
   - Go to: http://localhost:5175/demo
   - Fill form with test data
   - Use your own email for testing
   - Submit form

2. **Check browser console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Should see: "Form submitted successfully"
   - Go to Network tab
   - Should see POST request to n8n webhook

3. **Check n8n workflow:**
   - Go to n8n dashboard
   - Check execution history
   - Should see successful execution
   - Check if all nodes executed without errors

4. **Check emails:**
   - Check your test email inbox
   - Check `srikanthsacademyforphysics@gmail.com` inbox
   - Both should receive emails

5. **Check Google Sheets:**
   - Open your Google Sheet
   - Should see new row with test data

---

## 🔧 Common Issues & Fixes

### Issue 1: Form submits but no emails sent

**Solution:**
- Check n8n workflow has Email nodes configured
- Verify email authentication in n8n
- Check n8n execution logs

### Issue 2: Webhook not receiving data

**Solution:**
- Verify `VITE_N8N_WEBHOOK_URL` in `.env` is correct
- Restart dev server after updating `.env`
- Check browser console for webhook errors

### Issue 3: Emails going to spam

**Solution:**
- Use proper email authentication (SPF, DKIM)
- Check sender reputation
- Use professional email service (Gmail, SendGrid, etc.)

### Issue 4: WhatsApp not working

**Solution:**
- Configure WhatsApp API integration in n8n
- Or use email notification instead
- Or manually send WhatsApp after receiving email notification

---

## ✅ Success Checklist

- [ ] Form submission works
- [ ] Data reaches n8n webhook (check Network tab)
- [ ] n8n workflow executes successfully
- [ ] Student receives confirmation email
- [ ] Team receives notification email
- [ ] Data saved to Google Sheets
- [ ] WhatsApp notification sent (if configured)

---

## 📞 Need Help?

If any step is not working:
1. Check n8n execution logs for errors
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Make sure n8n workflow is **Active**
