# 🔧 Troubleshoot: Demo Form Emails Not Coming

## Quick Checklist

### ✅ Step 1: Check n8n Workflow is Active

1. **Go to n8n Dashboard:**
   - Visit: https://manasapadavala.app.n8n.cloud
   - Log in to your account

2. **Find your Demo Booking workflow:**
   - Look for workflow: "Demo Booking" or similar
   - **Check the toggle switch** (top right of workflow):
     - ✅ **Green/ON** = Workflow is active
     - ❌ **Gray/OFF** = Workflow is inactive (THIS IS THE PROBLEM!)

3. **If inactive, activate it:**
   - Click the toggle to turn it ON
   - Workflow should turn green
   - **This is the most common issue!**

---

### ✅ Step 2: Check Recent Executions for Errors

1. **Open your workflow** in n8n
2. **Click "Executions" tab** (at the top)
3. **Look for recent executions:**
   - Should see executions from when you submitted the form
   - Click on a recent execution to see details

4. **Check each node:**
   - ✅ **Green checkmark** = Node executed successfully
   - ❌ **Red X** = Node failed (click to see error message)

5. **Common issues:**
   - **Webhook node red** = Webhook URL changed or workflow inactive
   - **Email node red** = Email authentication expired or configuration error
   - **Google Sheets node red** = Permission issue

---

### ✅ Step 3: Verify Email Node Configuration

1. **Click on the Email/Gmail node** in your workflow
2. **Check these settings:**
   - **To**: Should be `srikanthsacademyforphysics@gmail.com`
   - **Subject**: Should have a subject line
   - **Authentication**: Should show a green checkmark ✅

3. **If authentication shows error:**
   - Click "Reconnect" or "Update Credentials"
   - Re-authorize with Gmail
   - Save the node

4. **Test the email node:**
   - Click "Execute Node" button
   - Check if test email is sent

---

### ✅ Step 4: Verify Webhook URL is Correct

1. **Check the Webhook node:**
   - Click on the Webhook node (first node)
   - Copy the **Production URL** shown

2. **Verify in Vercel:**
   - Go to: Vercel Dashboard → Settings → Environment Variables
   - Find `VITE_N8N_WEBHOOK_URL`
   - **Compare** the URL with the one from n8n
   - **They must match exactly!**

3. **If they don't match:**
   - Update `VITE_N8N_WEBHOOK_URL` in Vercel
   - Redeploy your application

---

### ✅ Step 5: Test the Webhook Directly

1. **Get your webhook URL** from n8n (Step 4.1)
2. **Test with curl** (or use Postman):
   ```bash
   curl -X POST https://manasapadavala.app.n8n.cloud/webhook/[your-path] \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "phone": "+1234567890",
       "grade": "11"
     }'
   ```

3. **Check n8n executions:**
   - Should see a new execution appear
   - Check if it completes successfully
   - Check if email is sent

---

### ✅ Step 6: Check Browser Console for Errors

1. **Open your website** in browser
2. **Open Developer Tools** (F12)
3. **Go to Network tab**
4. **Submit the demo form**
5. **Look for request to webhook:**
   - Should see a POST request to your n8n webhook URL
   - **Status should be 200 OK**
   - If status is 404 or 500, webhook URL is wrong

---

## Most Common Issues & Solutions

### Issue 1: Workflow is Inactive
**Solution:** Activate the workflow in n8n (toggle switch ON)

### Issue 2: Email Authentication Expired
**Solution:** Reconnect Gmail/SMTP credentials in n8n email node

### Issue 3: Webhook URL Changed
**Solution:** Update `VITE_N8N_WEBHOOK_URL` in Vercel and redeploy

### Issue 4: Email Node Configuration Error
**Solution:** Check email node settings, verify "To" address is correct

---

## Quick Fix Steps (Do These First!)

1. ✅ **Activate workflow** in n8n (if inactive)
2. ✅ **Check recent executions** for red X errors
3. ✅ **Reconnect email authentication** if expired
4. ✅ **Verify webhook URL** matches in n8n and Vercel
5. ✅ **Test webhook** directly with curl

---

## Still Not Working?

If emails still don't come after checking all above:

1. **Check n8n execution logs** for specific error messages
2. **Verify email is not going to spam folder**
3. **Check if Gmail account has any restrictions**
4. **Try sending test email from n8n directly** (Execute Node button)
