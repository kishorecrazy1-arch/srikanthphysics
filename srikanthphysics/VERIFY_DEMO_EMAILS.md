# ✅ Verify Demo Form Emails Are Being Sent

## Quick Check: Is the Workflow Still Working?

### Step 1: Test the Webhook Connection

1. **Open your website** and go to the demo form page
2. **Open browser console** (Press F12)
3. **Go to Network tab**
4. **Submit the demo form** with test data
5. **Look for a request** to `webhook/demo-booking`
6. **Check the response**:
   - ✅ **Status 200** = Webhook is working, data is being sent
   - ❌ **Status 404/500** = Webhook URL is wrong or workflow is inactive

### Step 2: Check n8n Workflow Status

1. **Go to n8n Dashboard**: https://manasapadavala.app.n8n.cloud
2. **Find your "Demo Booking" workflow**
3. **Check if it's Active**:
   - ✅ **Green toggle ON** = Workflow is active
   - ❌ **Gray toggle OFF** = Workflow is inactive (this is the problem!)

4. **If inactive, activate it**:
   - Click the toggle to turn it ON
   - Workflow should turn green

### Step 3: Check Recent Executions

1. **Click on your workflow** in n8n
2. **Go to "Executions" tab** (at the top)
3. **Look for recent executions**:
   - Should see executions from when you submitted the form
   - Click on a recent execution to see details

4. **Check each node**:
   - ✅ **Green checkmark** = Node executed successfully
   - ❌ **Red X** = Node failed (click to see error)

5. **Specifically check**:
   - ✅ Webhook node received data
   - ✅ Google Sheets node saved data
   - ✅ Email node sent email (if this is red, that's the problem!)

### Step 4: Check Email Node Configuration

If email node shows error or is missing:

1. **Click on the Email/Gmail node** in your workflow
2. **Verify settings**:
   - **To**: Should be `srikanthsacademyforphysics@gmail.com`
   - **Subject**: Should have a subject line
   - **Authentication**: Should be connected (green checkmark)

3. **If authentication is broken**:
   - Click "Reconnect" or "Update Credentials"
   - Re-authorize Gmail/SMTP access

### Step 5: Test Email Delivery

1. **Submit a test form** with your own email
2. **Wait 1-2 minutes**
3. **Check email inbox**:
   - Check `srikanthsacademyforphysics@gmail.com`
   - **IMPORTANT**: Also check **Spam/Junk folder**
   - Gmail sometimes filters automated emails

4. **If email is in spam**:
   - Mark it as "Not Spam"
   - Future emails should go to inbox

## 🔧 Common Issues & Fixes

### Issue 1: Workflow Became Inactive
**Symptom**: No executions in n8n, webhook returns 404
**Fix**: 
- Go to n8n dashboard
- Find your workflow
- Toggle it ON (should turn green)

### Issue 2: Email Node Authentication Expired
**Symptom**: Email node shows red error, "Authentication failed"
**Fix**:
- Click on Email/Gmail node
- Click "Reconnect" or "Update Credentials"
- Re-authorize with Gmail

### Issue 3: Emails Going to Spam
**Symptom**: Emails not in inbox, but workflow shows success
**Fix**:
- Check Spam/Junk folder
- Mark as "Not Spam"
- Consider using a different "From" email address

### Issue 4: Webhook URL Changed
**Symptom**: Webhook returns 404 error
**Fix**:
- Check n8n workflow webhook node
- Copy the webhook URL
- Update `.env` file with new URL
- Restart dev server

## 📋 Quick Verification Checklist

- [ ] n8n workflow is **Active** (green toggle)
- [ ] Webhook URL in `.env` matches n8n workflow
- [ ] Recent executions show in n8n
- [ ] All nodes show green checkmarks (no red X)
- [ ] Email node is configured correctly
- [ ] Email authentication is connected
- [ ] Checked email inbox AND spam folder
- [ ] Tested with a new form submission

## 🎯 Next Steps

1. **Check n8n workflow status first** (most common issue)
2. **Verify webhook is being called** (browser console)
3. **Check execution logs** in n8n
4. **Test email delivery** with a new submission

If workflow is active and email node shows success but you still don't receive emails, check the spam folder!
