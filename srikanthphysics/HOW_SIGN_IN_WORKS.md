# 🔐 How Sign-In Works in This Application

## 📋 Sign-In Methods Available

The application supports **3 sign-in methods**:

1. **Email + Password** (Primary method)
2. **Google OAuth** (Social login)
3. **Apple OAuth** (Social login)

---

## 🔄 Complete Sign-In Flow

### Step 1: User Visits Login Page
- **URL:** `/login`
- **File:** `src/pages/Login.tsx`

### Step 2: User Enters Credentials

**Email + Password Sign-In:**
```typescript
// User enters:
- Email address
- Password
- Clicks "Sign In" button
```

**Google/Apple Sign-In:**
```typescript
// User clicks:
- "Continue with Google" button, OR
- "Continue with Apple" button
```

### Step 3: Authentication Process

**Email + Password:**
1. Form submission triggers `handleSubmit()`
2. Calls `signIn(email, password)` from `authStore`
3. Supabase authenticates the user
4. User profile is fetched

**Google/Apple:**
1. OAuth redirect to provider (Google/Apple)
2. User authorizes on provider's website
3. Redirects back to application
4. Supabase handles OAuth token
5. User profile is fetched

### Step 4: Post-Sign-In Checks

After successful authentication, the system checks:

```typescript
1. ✅ User authenticated? → YES
2. ✅ Email confirmed? 
   ├─ NO → Shows "Email Confirmation Required" page
   └─ YES → Continue
3. ✅ User approved? (subscription_status = 'paid')
   ├─ NO → Shows "Approval Required" page
   └─ YES → Redirect to Dashboard ✅
```

### Step 5: Notification Sent

**Sign-in notification automatically sent:**
- Sent to n8n webhook (`VITE_N8N_SIGNIN_WEBHOOK_URL`)
- Email notification to admin
- Includes: user name, email, userId, timestamp

---

## 💻 Code Implementation

### Sign-In Form (`src/pages/Login.tsx`)

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    // Call signIn from authStore
    await signIn(email, password);
    
    // Check email verification status
    const { emailVerified } = useAuthStore.getState();
    
    if (emailVerified === false) {
      // Email not confirmed - will show EmailConfirmationRequired page
      navigate('/dashboard');
      return;
    }
    
    // Email confirmed - go to dashboard
    navigate('/dashboard');
  } catch (err: any) {
    setError(err.message || 'Failed to sign in');
  } finally {
    setLoading(false);
  }
};
```

### Authentication Store (`src/store/authStore.ts`)

```typescript
signIn: async (email, password) => {
  // Authenticate with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  
  // Check email verification
  if (data.user) {
    const emailVerified = data.user.email_confirmed_at !== null;
    set({ emailVerified });
  }
  
  // Fetch user profile from database
  await get().fetchUserProfile();
  
  // Send sign-in notification (background, doesn't block)
  sendSigninNotification({
    name: user.name,
    email: user.email,
    userId: user.id,
    lastSignIn: data.user.last_sign_in_at,
  }).catch(error => {
    // Notification failure doesn't block sign-in
    console.error('Failed to send notification:', error);
  });
}
```

---

## 🔐 What Happens After Sign-In?

### Scenario 1: Email Not Confirmed
```
Sign In → Success → Navigate to /dashboard → 
ProtectedRoute checks → Email not confirmed → 
Shows "Email Confirmation Required" page
```

### Scenario 2: Email Confirmed, Not Approved
```
Sign In → Success → Navigate to /dashboard → 
ProtectedRoute checks → Email confirmed → Not approved → 
Shows "Approval Required" page → 
Notification sent to admin
```

### Scenario 3: Email Confirmed, Approved
```
Sign In → Success → Navigate to /dashboard → 
ProtectedRoute checks → Email confirmed → Approved → 
Dashboard Access Granted ✅
```

---

## 🔑 Key Points

### ✅ Sign-In is NOT Restricted
- **Anyone can sign in** with valid email + password
- No approval needed to login
- No email confirmation needed to login

### ❌ Dashboard Access IS Restricted
- User must confirm email (before approval)
- User must be approved (subscription_status = 'paid')
- Only then dashboard access is granted

### 📧 Automatic Notifications
- Sign-in notification sent to admin via n8n
- Admin receives email with user details
- Helps track user activity

---

## 🌐 Social Sign-In (Google/Apple)

### Google Sign-In
```typescript
const handleGoogleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
};
```

**Requirements:**
- Google OAuth must be enabled in Supabase
- Redirect URIs configured in Google Cloud Console
- Supabase project configured with Google OAuth credentials

### Apple Sign-In
```typescript
const handleAppleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: `${window.location.origin}/ap-physics`,
    },
  });
};
```

---

## 📍 Sign-In Page Location

- **Route:** `/login`
- **Component:** `src/pages/Login.tsx`
- **Access:** Public (no authentication required)

### UI Features:
- Email + Password form
- Google sign-in button
- Apple sign-in button
- "Forgot Password" link
- "Create Account" link
- Error messages
- Success messages
- Loading states

---

## 🔄 Access Control After Sign-In

The `ProtectedRoute` component (`src/components/ProtectedRoute.tsx`) handles access:

```typescript
1. Is user logged in?
   ├─ NO → Redirect to /login
   └─ YES → Continue

2. Is test mode enabled?
   ├─ YES → Grant full access (bypass checks)
   └─ NO → Continue

3. Is email confirmed?
   ├─ NO → Show "Email Confirmation Required"
   └─ YES → Continue

4. Is user approved? (subscription_status = 'paid')
   ├─ NO → Show "Approval Required"
   └─ YES → Grant dashboard access ✅
```

---

## 📝 Summary

**Sign-In Process:**
1. User goes to `/login`
2. Enters email + password (or uses Google/Apple)
3. Supabase authenticates user
4. User profile fetched
5. Sign-in notification sent to admin
6. User redirected to dashboard (or approval/email confirmation page)

**Important:**
- ✅ **Sign-in = Authentication** (Anyone can do this)
- ❌ **Dashboard Access = Authorization** (Requires approval)
- 📧 **Notifications** sent automatically to admin

---

## 🎯 Quick Reference

| Action | Required | Access Granted |
|--------|----------|----------------|
| Sign In | Email + Password | ✅ Yes (Authentication) |
| Email Confirmation | ✅ Required | Access to approval page |
| Admin Approval | ✅ Required | Access to dashboard ✅ |
| Dashboard | Approval needed | Full app features |

---

**Sign-in is open to everyone, but dashboard access requires email confirmation + admin approval! 🔐**
