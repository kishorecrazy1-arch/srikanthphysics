# ✅ Google Sheet Approval System - Implementation Complete

## 🎯 What Changed

The approval system has been updated to use **Google Sheet** for approval tracking instead of Supabase database fields.

### **Old System:**
- Approval stored in Supabase `subscription_status` field
- Admin clicks approval link to update database
- Direct database update

### **New System:**
- Approval stored in Google Sheet "Sign in details"
- Admin types "Approved" in Status column
- n8n workflow checks sheet on every sign-in
- Real-time approval status check

---

## 📋 How It Works Now

### **1. Sign-In Process:**
```
User signs in
   ↓
Email confirmed? → YES
   ↓
Call n8n webhook (signin-check)
   ↓
n8n looks up user by Email in Google Sheet
   ↓
Check Status column:
   ├─ "Approved" → Dashboard access ✅
   └─ Not "Approved" → Approval Pending page ⏳
```

### **2. Approval Check:**
- **Service:** `src/services/approvalCheckService.ts`
- **Webhook:** `VITE_N8N_SIGNIN_WEBHOOK_URL`
- **Payload:** `{ email, name, userId, mobile, timestamp }`
- **Response:** `{ approved: true/false, redirectTo: "/dashboard" or "/approval-pending" }`

### **3. State Management:**
- **Store:** `src/store/authStore.ts`
- **New field:** `approved: boolean | null`
  - `null` = checking status
  - `true` = approved (dashboard access)
  - `false` = not approved (pending page)

---

## 🔧 Code Changes

### **New Files:**
1. ✅ `src/services/approvalCheckService.ts` - Checks approval via n8n
2. ✅ `COMPLETE_SIGNIN_FLOW.md` - Complete flow documentation
3. ✅ `GOOGLE_SHEET_APPROVAL_SYSTEM.md` - This file

### **Updated Files:**
1. ✅ `src/store/authStore.ts`
   - Added `approved` state
   - Added `checkApproval()` method
   - Updated `signIn()` to check approval
   - Updated `fetchUserProfile()` to check approval

2. ✅ `src/components/ProtectedRoute.tsx`
   - Now checks `approved` state instead of `subscriptionStatus`
   - Shows loading while checking approval
   - Redirects based on approval status

3. ✅ `src/pages/ApprovalRequired.tsx`
   - Updated to show Google Sheet approval message
   - Added refresh button to re-check status
   - Auto-refreshes every 30 seconds

---

## 📊 Google Sheet Requirements

### **Sheet Name:** "Sign in details"
### **Sheet ID:** `10EresbXBxZly7-VywrkxIaqVmdVYGMFU_rbgWquooQQ`

### **Required Columns:**
| Column | Purpose | Example |
|--------|---------|---------|
| **Email** | Lookup key (must match user email exactly) | student@gmail.com |
| **Name** | Student name | John Doe |
| **Mobile** | Contact number | +91 1234567890 |
| **Status** | **"Approved"** = dashboard access | "Approved" or blank |
| **LastSignIn** | Timestamp of last sign-in | 2024-01-15T10:30:00Z |
| **Userid** | Supabase user ID | uuid-here |
| **timestamp** | When added to sheet | 2024-01-10T08:00:00Z |
| **Referrer** | How they found site | google.com |

### **Important:**
- ✅ Status must be exactly `"Approved"` (case-sensitive)
- ✅ Email must match exactly (case-sensitive)
- ✅ Admin types "Approved" in Status column to approve

---

## 🔗 n8n Workflow Setup

### **Workflow Name:** "My workflow 52" or "signin-check"
### **Webhook Path:** `signin-check`

### **Workflow Structure:**
```
1. Webhook Node
   - Path: signin-check
   - Method: POST
   - Receives: { email, name, userId, mobile, timestamp }

2. Google Sheets Node (Lookup)
   - Operation: Read
   - Sheet: "Sign in details"
   - Find row where Email = {{ $json.email }}

3. IF Node (Check Status)
   - Condition: Status = "Approved"
   - TRUE → Update LastSignIn, Return { approved: true }
   - FALSE → Update LastSignIn, Return { approved: false }

4. Google Sheets Node (Update)
   - Operation: Update
   - Update LastSignIn = {{ $json.timestamp }}

5. Gmail Node (Optional)
   - Send notification to admin
   - Subject: "User signed in - APPROVED" or "User signed in - NEEDS APPROVAL"
```

### **Response Format:**
```json
{
  "approved": true,
  "redirectTo": "/dashboard"
}
```

OR

```json
{
  "approved": false,
  "redirectTo": "/approval-pending"
}
```

---

## 🔐 Environment Variables

### **Required:**
```env
VITE_N8N_SIGNIN_WEBHOOK_URL=https://manasapadavala.app.n8n.cloud/webhook/signin-check
```

### **Optional (for notifications):**
```env
VITE_N8N_SIGNUP_WEBHOOK_URL=https://manasapadavala.app.n8n.cloud/webhook/user-signup
VITE_N8N_WEBHOOK_URL=https://manasapadavala.app.n8n.cloud/webhook/demo-booking
```

---

## ✅ Testing Checklist

- [ ] n8n workflow created and active
- [ ] Webhook URL added to `.env` file
- [ ] Google Sheet has correct columns
- [ ] Test user added to sheet with Status = "Approved"
- [ ] Test sign-in with approved user → Should see dashboard
- [ ] Test sign-in with non-approved user → Should see pending page
- [ ] Admin types "Approved" in sheet
- [ ] User signs in again → Should see dashboard
- [ ] Email notifications working

---

## 🆘 Troubleshooting

### **User can't access dashboard:**
1. Check Google Sheet - find user by email
2. Verify Status = "Approved" (exact match)
3. Check n8n workflow execution logs
4. Verify webhook URL in `.env`
5. Check browser console for errors

### **Approval check not working:**
1. Verify n8n workflow is active
2. Check webhook URL is correct
3. Verify Google Sheets node can access sheet
4. Check email matches exactly in sheet
5. Review n8n execution logs

### **Status not updating:**
1. Verify Status column exists in sheet
2. Check admin typed "Approved" exactly (case-sensitive)
3. Verify n8n can write to sheet
4. Check sheet permissions

---

## 📝 Summary

✅ **Approval now uses Google Sheet** instead of database  
✅ **n8n workflow checks sheet on every sign-in**  
✅ **Admin approves by typing "Approved" in sheet**  
✅ **Real-time approval status checking**  
✅ **Auto-refresh on approval pending page**  

**The system is ready to use!** 🚀
