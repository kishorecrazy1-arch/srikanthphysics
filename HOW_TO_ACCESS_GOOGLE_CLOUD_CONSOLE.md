# 📍 How to Access Google Cloud Console Credentials

## Step-by-Step Guide

### Step 1: Go to Google Cloud Console

1. Open your web browser
2. Go to: **https://console.cloud.google.com/**
3. Sign in with your Google account (the same one you want to use for OAuth)

---

### Step 2: Select or Create a Project

**If you already have a project:**
1. At the top of the page, you'll see a dropdown that says **"Select a project"** or shows your current project name
2. Click on it
3. Select your project from the list

**If you don't have a project yet:**
1. Click **"Select a project"** at the top
2. Click **"NEW PROJECT"** button
3. Enter a project name (e.g., "Srikanth Academy" or "AP Physics App")
4. Click **"CREATE"**
5. Wait a few seconds for it to be created
6. Select the new project from the dropdown

---

### Step 3: Navigate to Credentials

**Method 1: Direct Navigation**
1. In the left sidebar, look for **"APIs & Services"**
2. Click on **"APIs & Services"** to expand it
3. Click on **"Credentials"** (it's usually the second option)

**Method 2: Using the Search Bar**
1. At the top of the page, you'll see a search bar that says "Search products and resources"
2. Type: **"Credentials"**
3. Click on **"Credentials"** from the search results

**Method 3: Direct URL**
1. Go directly to: **https://console.cloud.google.com/apis/credentials**
2. Make sure you've selected your project first

---

### Step 4: Find Your OAuth Client

Once you're on the Credentials page, you'll see:

1. **"Create Credentials"** button at the top
2. A list of existing credentials below

**Look for:**
- **"OAuth 2.0 Client IDs"** section
- Your client named **"Supabase Auth"** (or whatever you named it)

**If you don't see any OAuth clients:**
- You need to create one first (see Step 5)

---

### Step 5: Create OAuth Client (If You Don't Have One)

1. Click **"CREATE CREDENTIALS"** button at the top
2. Select **"OAuth client ID"** from the dropdown
3. If prompted, configure the OAuth consent screen:
   - Choose **"External"** (unless you have Google Workspace)
   - Fill in:
     - **App name:** "Srikanth's Academy" (or your app name)
     - **User support email:** Your email
     - **Developer contact:** Your email
   - Click **"SAVE AND CONTINUE"** through all steps
4. Back to creating OAuth client:
   - **Application type:** Select **"Web application"**
   - **Name:** Enter "Supabase Auth" (or any name you prefer)
   - **Authorized redirect URIs:** Click **"ADD URI"** and add:
     ```
     https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback
     http://localhost:5175/auth/callback
     ```
   - Click **"CREATE"**
5. You'll see a popup with:
   - **Client ID** (copy this!)
   - **Client Secret** (copy this!)
6. **Save these** - you'll need them for Supabase

---

### Step 6: Edit Existing OAuth Client

If you already have an OAuth client:

1. Find it in the **"OAuth 2.0 Client IDs"** list
2. Click on the **name** of the client (e.g., "Supabase Auth")
3. You'll see the client details page
4. Scroll down to **"Authorized redirect URIs"**
5. Click **"ADD URI"** or edit existing ones
6. Add/Update to:
   ```
   https://ubivreetpsledaqffuvn.supabase.co/auth/v1/callback
   http://localhost:5175/auth/callback
   ```
7. Click **"SAVE"** at the bottom

---

## 🗺️ Visual Navigation Path

```
Google Cloud Console Home
    ↓
APIs & Services (Left Sidebar)
    ↓
Credentials
    ↓
OAuth 2.0 Client IDs
    ↓
[Your Client Name] → Click to Edit
    ↓
Authorized redirect URIs → Edit Here
```

---

## 🔗 Quick Links

**Main Console:** https://console.cloud.google.com/
**Credentials Page:** https://console.cloud.google.com/apis/credentials
**OAuth Consent Screen:** https://console.cloud.google.com/apis/credentials/consent

---

## 📸 What You Should See

On the Credentials page, you'll see sections like:
- **API Keys**
- **OAuth 2.0 Client IDs** ← **This is what you need!**
- **Service Accounts**
- etc.

Click on **"OAuth 2.0 Client IDs"** to see your clients.

---

## 🆘 Troubleshooting

### "I don't see APIs & Services"
- Make sure you're signed in to Google Cloud Console
- You might need to accept terms of service first
- Try refreshing the page

### "I don't see Credentials option"
- Make sure you've selected a project (top dropdown)
- Look in the left sidebar menu
- Try the search bar at the top

### "I can't create OAuth client"
- You need to configure OAuth consent screen first
- Go to: **APIs & Services** → **OAuth consent screen**
- Complete the setup there first

---

## ✅ Checklist

- [ ] Signed in to Google Cloud Console
- [ ] Selected/Created a project
- [ ] Navigated to APIs & Services → Credentials
- [ ] Found/Created OAuth 2.0 Client ID
- [ ] Added correct redirect URIs
- [ ] Saved changes
- [ ] Copied Client ID and Client Secret (if creating new)

---

## 🎯 Next Steps After Updating URIs

1. **Save** the changes in Google Cloud Console
2. **Go to Supabase Dashboard:** https://supabase.com/dashboard/project/ubivreetpsledaqffuvn
3. **Navigate to:** Authentication → Providers → Google
4. **Paste** your Client ID and Client Secret
5. **Save** in Supabase
6. **Test** "Continue with Google" in your app!



