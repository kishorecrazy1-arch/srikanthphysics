# 📋 Complete Flow: Demo Booking → Dashboard Sign-In

## Overview
This document describes the complete user journey from demo booking to dashboard access, using Google Sheet approval system.

---

## 🔄 Complete User Journey

```
📝 Demo Booking
   ↓
📧 Email Confirmation (to student & admin)
   ↓
👤 Sign Up (Create Account)
   ↓
✉️ Verify Email
   ↓
🔐 Sign In (Enter Email + Password)
   ↓
🔍 n8n Checks "Sign in details" Google Sheet
   ↓
   ├─ Status = "Approved" → ✅ Dashboard Access
   └─ Status ≠ "Approved" → ⏳ Approval Pending Page
```

---

## Step 1: Demo Booking 🎓

**Process:**
```
Student fills demo booking form
   ↓
Submits: Name, Email, Mobile, Date, Time
   ↓
n8n Workflow "srikanths demo booking" receives data
   ↓
Data logged to Google Sheet "Sign in details"
   (Sheet ID: 10EresbXBxZly7-VywrkxIaqVmdVYGMFU_rbgWquooQQ)
   ↓
Email sent to student: "Booking confirmed!"
Email sent to admin: "New demo booking received"
   ↓
Status in sheet = BLANK (not approved yet)
```

**Google Sheet Columns:**
- Email
- Name
- Mobile
- Date
- Time
- Status (initially blank)
- timestamp
- Referrer

---

## Step 2: Admin Approval ✅

**Process:**
```
Admin receives email notification
   ↓
Opens Google Sheet "Sign in details"
   ↓
Finds student's row (by Email)
   ↓
Types "Approved" in Status column
   ↓
Student is now approved for dashboard access!
```

**Google Sheet Example:**
| Email | Name | Mobile | Status |
|-------|------|--------|--------|
| student@gmail.com | John | +91... | **Approved** ✅ |

**Important:** 
- Status must be exactly `"Approved"` (case-sensitive)
- Admin can approve before or after student signs up
- Approval is checked in real-time on every sign-in

---

## Step 3: Student Creates Account 🔐

**Process:**
```
Student goes to Sign Up page (/signup)
   ↓
Enters: Email, Password, Name, Mobile, Grade, Course
   ↓
Clicks "Sign Up"
   ↓
Supabase creates user account
   ↓
Email verification sent to student
   ↓
Student clicks verification link in email
   ↓
Email confirmed ✅
```

**Note:** 
- Sign up does NOT require approval
- Email verification is required before dashboard access
- Account is created even if not approved yet

---

## Step 4: Student Signs In 🚪

**Process:**
```
Student goes to Sign In page (/login)
   ↓
Enters: Email + Password
   ↓
Clicks "Sign In"
   ↓
Supabase authenticates credentials ✅
   ↓
Frontend calls n8n webhook: signin-check
   ↓
Payload sent: { 
   email, 
   name, 
   userId, 
   mobile,
   timestamp 
}
```

**Webhook URL:** `VITE_N8N_SIGNIN_WEBHOOK_URL`

---

## Step 5: n8n Approval Check 🔍

**n8n Workflow Process:**
```
n8n Workflow receives webhook (signin-check)
   ↓
Looks up user by EMAIL in "Sign in details" sheet
   ↓
Finds matching row
   ↓
Checks "Status" column:
   
   IF Status = "Approved":
      ↓
      Updates "LastSignIn" timestamp in sheet
      ↓
      Returns: { 
         approved: true, 
         redirectTo: "/dashboard" 
      }
      ↓
      Frontend redirects to /dashboard ✅
      ↓
      Sends email to admin: "✅ User signed in - APPROVED"
   
   IF Status ≠ "Approved" (blank, "Pending", etc.):
      ↓
      Updates "LastSignIn" timestamp in sheet
      ↓
      Returns: { 
         approved: false, 
         redirectTo: "/approval-pending" 
      }
      ↓
      Frontend shows "Approval Pending" page ⏳
      ↓
      Sends email to admin: "⏳ User signed in - NEEDS APPROVAL"
```

**n8n Workflow Structure:**
```
Webhook (signin-check)
   ↓
Google Sheets (Lookup by Email)
   ↓
IF Statement (Check Status = "Approved")
   ├─ YES → Update LastSignIn, Return { approved: true }
   └─ NO → Update LastSignIn, Return { approved: false }
   ↓
Gmail (Send notification to admin)
```

---

## Step 6: Dashboard Access 🎯

### **If Approved (Status = "Approved"):**
```
User sees Dashboard
   ↓
Full access to all features:
   • View courses
   • Take quizzes
   • Access materials
   • Track progress
   • All premium features
```

### **If Not Approved (Status ≠ "Approved"):**
```
User sees "Approval Pending" page
   ↓
Message: "Your account is awaiting admin approval"
   ↓
Instructions: "Admin will approve your account soon"
   ↓
User must wait for admin to type "Approved" in sheet
   ↓
Once admin types "Approved" → User can sign in again
   ↓
Next sign-in will check sheet again → Dashboard access ✅
```

---

## 📊 Google Sheet Tracking

**"Sign in details" sheet tracks:**
| Column | Purpose | Example |
|--------|---------|---------|
| **Email** | Unique identifier - used for lookup | student@gmail.com |
| **Name** | Student name | John Doe |
| **Mobile** | Contact number | +91 1234567890 |
| **Userid** | Supabase user ID | uuid-here |
| **Status** | **"Approved"** = Dashboard access ✅ | "Approved" or blank |
| **LastSignIn** | Timestamp of last sign-in | 2024-01-15T10:30:00Z |
| **timestamp** | When first added to sheet | 2024-01-10T08:00:00Z |
| **Referrer** | How they found the site | google.com |

**Sheet ID:** `10EresbXBxZly7-VywrkxIaqVmdVYGMFU_rbgWquooQQ`

---

## ✅ Admin Actions Required

### **1. After Demo Booking:**
- ✅ Check email for new booking
- ✅ Review student details
- ✅ Open Google Sheet "Sign in details"
- ✅ Find student by email
- ✅ Type **"Approved"** in Status column

### **2. After Student Signs In (if not approved):**
- ✅ Receive email: "User needs approval"
- ✅ Open Google Sheet "Sign in details"
- ✅ Find student by email
- ✅ Type **"Approved"** in Status column
- ✅ Student can now sign in and access dashboard

---

## 🔧 Technical Implementation

### **1. Environment Variables:**
```env
VITE_N8N_SIGNIN_WEBHOOK_URL=https://manasapadavala.app.n8n.cloud/webhook/signin-check
```

### **2. n8n Workflows:**
- ✅ **"srikanths demo booking"** - Handles demo bookings
- ✅ **"My workflow 52"** (or signin-check) - Handles sign-in approval checks

### **3. Google Sheet:**
- ✅ **"Sign in details"** 
- ✅ Sheet ID: `10EresbXBxZly7-VywrkxIaqVmdVYGMFU_rbgWquooQQ`
- ✅ Must have columns: Email, Name, Mobile, Status, LastSignIn, Userid, timestamp, Referrer

### **4. Code Files:**
- ✅ `src/services/approvalCheckService.ts` - Checks approval via n8n
- ✅ `src/store/authStore.ts` - Stores approval status
- ✅ `src/components/ProtectedRoute.tsx` - Checks approval before dashboard access
- ✅ `src/pages/ApprovalRequired.tsx` - Shows approval pending page

---

## 🎯 Key Points

✅ **Demo booking does NOT require sign in** - anyone can book  
✅ **Status = "Approved"** is THE key to dashboard access  
✅ **Email is the matching point** - used to find user in sheet  
✅ **Admin approves by typing "Approved"** - simple and fast  
✅ **Real-time check** - every sign-in checks current status  
✅ **Email notifications** - admin knows every sign-in attempt  
✅ **Case-sensitive** - Status must be exactly `"Approved"`  

---

## 🔄 Approval Status Flow

```
Sign In
   ↓
Check Email Confirmation
   ├─ NO → Email Confirmation Page
   └─ YES → Check Approval Status
       ↓
       Call n8n Webhook (signin-check)
       ↓
       n8n Looks up Email in Google Sheet
       ↓
       Check Status Column
       ├─ "Approved" → approved: true → Dashboard ✅
       └─ Not "Approved" → approved: false → Approval Pending ⏳
```

---

## 📧 Email Notifications

### **To Admin (srikanthsacademyforphysics@gmail.com):**

**When user signs in and is APPROVED:**
```
Subject: ✅ User signed in - APPROVED
Body: 
- User name, email, userId
- Last sign-in timestamp
- Status: Approved
- Dashboard access granted
```

**When user signs in and is NOT APPROVED:**
```
Subject: ⏳ User signed in - NEEDS APPROVAL
Body:
- User name, email, userId
- Last sign-in timestamp
- Status: Pending
- Action required: Type "Approved" in Google Sheet
```

---

## 🧪 Testing the Flow

### **Test Scenario 1: Approved User**
1. Admin types "Approved" in Google Sheet
2. User signs in
3. n8n checks sheet → Status = "Approved"
4. Returns `{ approved: true }`
5. User sees dashboard ✅

### **Test Scenario 2: Not Approved User**
1. Status in sheet is blank or "Pending"
2. User signs in
3. n8n checks sheet → Status ≠ "Approved"
4. Returns `{ approved: false }`
5. User sees approval pending page ⏳

### **Test Scenario 3: Admin Approves After Sign-In**
1. User signs in → Not approved → Sees pending page
2. Admin types "Approved" in sheet
3. User signs in again
4. n8n checks sheet → Status = "Approved"
5. User sees dashboard ✅

---

## 🆘 Troubleshooting

### **User can't access dashboard:**
1. Check if email is confirmed
2. Check Google Sheet - find user by email
3. Verify Status column = "Approved" (exact match, case-sensitive)
4. Check n8n workflow execution logs
5. Verify webhook URL is correct

### **n8n not finding user:**
1. Check email matches exactly (case-sensitive)
2. Verify user exists in "Sign in details" sheet
3. Check n8n Google Sheets node configuration
4. Verify sheet ID is correct

### **Approval not working:**
1. Verify Status = "Approved" (exact spelling)
2. Check n8n workflow is active
3. Verify webhook URL in `.env`
4. Check browser console for errors
5. Review n8n execution logs

---

**That's the complete flow from demo booking to dashboard sign-in! 🚀**
