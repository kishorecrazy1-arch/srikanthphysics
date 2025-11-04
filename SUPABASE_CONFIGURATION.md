# 🔧 Supabase Configuration Guide

## 📋 Database Connection Details

### Environment Variables
Your Supabase configuration is stored in `.env`:

```env
VITE_SUPABASE_URL=https://dixunaahfuuwxvvyxfkd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpeHVuYWFoZnV1d3h2dnl4ZmtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2ODM0MDIsImV4cCI6MjA3NjI1OTQwMn0.2Aelf8z-rW2MFn5DI2pONWS7wApe2NMOPyQk5rKgG3g
```

### Supabase Dashboard
Access your project dashboard at:
**https://supabase.com/dashboard/project/dixunaahfuuwxvvyxfkd**

---

## 🎯 Authentication Setup

### 1️⃣ Email/Password Authentication (Currently Active)

Your app supports native email/password authentication with the following features:

#### Sign Up Flow
- **Endpoint**: `supabase.auth.signUp()`
- **Required Fields**:
  - Email address
  - Password (minimum 6 characters)
  - Full name
  - Phone number with country code
  - Grade level (6-12)
  - Course type (13 options available)

#### Sign In Flow
- **Endpoint**: `supabase.auth.signInWithPassword()`
- **Required Fields**:
  - Email address
  - Password

#### Forgot Password Flow
- **Endpoint**: `supabase.auth.resetPasswordForEmail()`
- **Process**:
  1. User enters email on forgot password screen
  2. Supabase sends password reset email
  3. User clicks link in email
  4. User is redirected to `/reset-password` route
  5. User sets new password

### 2️⃣ OAuth Providers (Requires Configuration)

The UI includes buttons for Google and Apple sign-in, but these require additional setup:

#### Google OAuth Setup
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Google** provider
3. Create a Google Cloud Console project
4. Enable Google+ API
5. Create OAuth 2.0 credentials
6. Add authorized redirect URIs:
   ```
   https://dixunaahfuuwxvvyxfkd.supabase.co/auth/v1/callback
   ```
7. Copy Client ID and Client Secret to Supabase
8. Save configuration

#### Apple OAuth Setup
1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Apple** provider
3. Create an Apple Developer account
4. Register your app in App Store Connect
5. Create a Services ID
6. Configure Sign in with Apple
7. Add redirect URIs:
   ```
   https://dixunaahfuuwxvvyxfkd.supabase.co/auth/v1/callback
   ```
8. Copy Service ID and Key to Supabase
9. Save configuration

---

## 🗄️ Database Schema

### Tables Overview

#### 1. **user_profiles** (Main user data)
```sql
- id (uuid, FK to auth.users)
- name (text)
- email (text)
- country_code (text, default: '+91')
- phone_number (text)
- grade (integer)
- course_type (text)
- current_streak (integer, default: 0)
- longest_streak (integer, default: 0)
- total_questions (integer, default: 0)
- correct_answers (integer, default: 0)
- skill_level (integer, default: 0)
- created_at (timestamptz)
- last_active (timestamptz)
```

**RLS Policies**:
- Users can view their own profile
- Users can update their own profile
- Users can insert their own profile on signup

#### 2. **topics** (Physics topics)
```sql
- id (uuid)
- name (text)
- icon (text)
- description (text)
- subtopics (jsonb)
- total_questions (integer)
- display_order (integer)
- color (text)
- created_at (timestamptz)
```

**RLS Policies**:
- All authenticated users can read topics

#### 3. **topic_progress** (User progress per topic)
```sql
- id (uuid)
- user_id (uuid, FK to auth.users)
- topic_id (uuid, FK to topics)
- mastery (integer, 0-100)
- questions_completed (integer)
- questions_correct (integer)
- last_practiced (timestamptz)
- streak_days (integer)
- updated_at (timestamptz)
```

**RLS Policies**:
- Users can view their own progress
- Users can insert their own progress
- Users can update their own progress

#### 4. **questions** (Question bank)
```sql
- id (uuid)
- topic_id (uuid, FK to topics)
- segment_type (text: 'basics', 'homework', 'practice')
- question_text (text)
- options (jsonb)
- difficulty (text: 'easy', 'medium', 'hard')
- question_type (text: 'conceptual', 'calculation', 'application')
- subtopic (text)
- explanation (jsonb)
- image_url (text)
- time_limit (integer, default: 120)
- ai_generated (boolean)
- generated_date (date)
- homework_id (uuid)
- created_at (timestamptz)
```

**RLS Policies**:
- All authenticated users can read questions

#### 5. **user_answers** (User answer history)
```sql
- id (uuid)
- user_id (uuid, FK to auth.users)
- question_id (uuid, FK to questions)
- selected_answer (text)
- is_correct (boolean)
- time_spent (integer)
- answered_at (timestamptz)
```

**RLS Policies**:
- Users can view their own answers
- Users can insert their own answers

#### 6. **homework** (Homework assignments)
```sql
- id (uuid)
- topic_id (uuid, FK to topics)
- title (text)
- uploaded_by (uuid, FK to auth.users)
- due_date (timestamptz)
- pdf_url (text)
- extracted_text (text)
- status (text: 'active', 'completed', 'archived')
- created_at (timestamptz)
```

#### 7. **quiz_sessions** (Quiz tracking)
```sql
- id (uuid)
- user_id (uuid, FK to user_profiles)
- quiz_type (text)
- status (text)
- score (integer)
- total_questions (integer)
- time_spent (integer)
- started_at (timestamptz)
- completed_at (timestamptz)
```

#### 8. **quiz_answers** (Individual quiz answers)
```sql
- id (uuid)
- session_id (uuid, FK to quiz_sessions)
- question_id (integer)
- selected_answer (text)
- confidence (integer, 1-5)
- time_spent (integer)
- is_correct (boolean)
- created_at (timestamptz)
```

#### 9. **badges** (User achievements)
```sql
- id (uuid)
- user_id (uuid, FK to user_profiles)
- badge_name (text)
- earned_at (timestamptz)
```

#### 10. **schedule_items** (Study schedule)
```sql
- id (uuid)
- user_id (uuid, FK to user_profiles)
- day (text)
- time (text)
- topic (text)
- reminder_enabled (boolean)
```

#### 11. **topic_mastery** (Legacy mastery tracking)
```sql
- id (uuid)
- user_id (uuid, FK to user_profiles)
- topic (text)
- mastery (integer, 0-100)
- questions_attempted (integer)
- questions_correct (integer)
- last_practiced (timestamptz)
```

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with the following pattern:

### User Data Access
```sql
-- Users can only access their own data
USING (auth.uid() = user_id)
```

### Insert Policies
```sql
-- Users can only insert data for themselves
WITH CHECK (auth.uid() = user_id)
```

### Public Read Access (Topics, Questions)
```sql
-- All authenticated users can read
USING (auth.role() = 'authenticated')
```

---

## 🧪 Testing & Development

### Create a Test Account

#### Option 1: Via the App (Recommended)
1. Navigate to `/signup`
2. Fill in the form:
   ```
   Name: Test User
   Email: test@example.com
   Password: test123
   Country Code: +1
   Phone: 1234567890
   Grade: 11
   Course: AP Physics 1
   ```
3. Click "Create Account"
4. You'll be automatically logged in

#### Option 2: Via Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   ```
   Email: demo@example.com
   Password: demo123456
   Auto Confirm User: Yes
   ```
4. Click **"Create user"**
5. Then manually insert into `user_profiles` table:
   ```sql
   INSERT INTO user_profiles (id, name, email, country_code, phone_number, grade, course_type)
   VALUES (
     '[USER_ID_FROM_AUTH]',
     'Demo User',
     'demo@example.com',
     '+1',
     '1234567890',
     11,
     'ap_physics_1'
   );
   ```

### Test Credentials Template

```
📧 Email: test@yourapp.com
🔒 Password: TestUser123!
👤 Name: Test Student
📱 Phone: +1-555-0100
📚 Grade: 11th
📖 Course: AP Physics 1
```

---

## 🚀 Key Authentication Features Implemented

### ✅ Implemented Features

1. **Email/Password Sign Up**
   - Full user profile creation
   - Automatic user_profiles table insertion
   - Phone number with country code support
   - Grade and course selection

2. **Email/Password Sign In**
   - Session management via Supabase
   - Automatic profile loading
   - Persistent authentication

3. **Forgot Password**
   - Email-based password reset
   - Secure reset link generation
   - Custom redirect URL support

4. **Protected Routes**
   - Authentication state checking
   - Automatic redirect to login
   - Session persistence

5. **User Profile Management**
   - View profile data
   - Update profile information
   - Track progress and statistics

### 🔄 OAuth Integration (Ready for Setup)

The UI includes buttons for:
- Google Sign-In (requires Google Cloud setup)
- Apple Sign-In (requires Apple Developer setup)

Both are coded and ready to work once you configure the providers in Supabase Dashboard.

---

## 📊 Data Flow

### Sign Up Process
```
1. User fills signup form
   ↓
2. supabase.auth.signUp() creates auth.users record
   ↓
3. App inserts record into user_profiles table
   ↓
4. User session established
   ↓
5. Redirect to /dashboard
```

### Sign In Process
```
1. User enters email/password
   ↓
2. supabase.auth.signInWithPassword() validates
   ↓
3. App fetches user_profiles data
   ↓
4. Store user state in Zustand
   ↓
5. Redirect to /dashboard
```

### Password Reset Process
```
1. User clicks "Forgot password?"
   ↓
2. User enters email
   ↓
3. supabase.auth.resetPasswordForEmail() sends email
   ↓
4. User clicks link in email
   ↓
5. Redirected to /reset-password
   ↓
6. User sets new password
```

---

## 🛠️ Required Supabase Settings

### Email Templates (Optional Customization)
Go to **Authentication** → **Email Templates** to customize:

1. **Confirmation Email** (if you enable email confirmation)
2. **Magic Link Email** (if you use magic links)
3. **Password Reset Email**
4. **Email Change Email**

### URL Configuration
Go to **Authentication** → **URL Configuration**:

```
Site URL: https://your-app-domain.com
Redirect URLs:
  - https://your-app-domain.com/dashboard
  - https://your-app-domain.com/reset-password
```

### Email Settings
Go to **Settings** → **Authentication**:

- **Enable Email Confirmations**: OFF (disabled by default)
- **Enable Email Change Confirmations**: OFF
- **Secure Email Change**: ON
- **Minimum Password Length**: 6 characters

---

## 🎓 Course Types Available

The system supports 13 different physics courses:

1. **AP Physics 1** (ap_physics_1)
2. **AP Physics 2** (ap_physics_2)
3. **AP Physics C: Mechanics** (ap_physics_c_mechanics)
4. **AP Physics C: E&M** (ap_physics_c_em)
5. **IB Physics** (ib_physics)
6. **AQA Physics** (aqa_physics)
7. **IGCSE** (igcse)
8. **IIT JEE** (iit_jee)
9. **NEET** (neet)
10. **IMAT** (imat)
11. **CBSE** (cbse)
12. **ICSE** (icse)
13. **Quantum Mechanics** (quantum_mechanics)

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: "User already registered"
- **Solution**: Use sign in instead, or use password reset if forgotten

#### Issue: "Invalid login credentials"
- **Solution**: Check email/password, ensure account exists

#### Issue: "Email not confirmed"
- **Solution**: Check email confirmation settings in Supabase Dashboard

#### Issue: OAuth not working
- **Solution**: Configure OAuth providers in Supabase Dashboard

### Debug Mode

Check browser console for authentication errors:
```javascript
// The app logs authentication state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session);
});
```

---

## 📝 Next Steps

### To Enable Full OAuth:

1. **Configure Google OAuth**
   - Create Google Cloud Console project
   - Enable Google+ API
   - Add OAuth credentials to Supabase

2. **Configure Apple OAuth**
   - Create Apple Developer account
   - Register app in App Store Connect
   - Add Apple credentials to Supabase

### To Customize Email Templates:

1. Go to Supabase Dashboard → **Authentication** → **Email Templates**
2. Edit templates with your branding
3. Include your app name and logo
4. Customize reset password URL

### To Enable Email Confirmation:

1. Go to **Authentication** → **Settings**
2. Enable "Email Confirmations"
3. Update signup flow to show confirmation message
4. Test confirmation email delivery

---

## 📞 Support

For Supabase-specific issues:
- **Documentation**: https://supabase.com/docs
- **Community**: https://github.com/supabase/supabase/discussions
- **Dashboard**: https://supabase.com/dashboard/project/dixunaahfuuwxvvyxfkd

For app-specific issues:
- Check the browser console for errors
- Verify .env file is loaded correctly
- Test database connection in Supabase Dashboard
- Review RLS policies for access issues

---

## ✅ Quick Start Checklist

- [x] Supabase project created
- [x] Database schema migrated
- [x] RLS policies enabled
- [x] Email/password auth implemented
- [x] Forgot password flow implemented
- [x] User profiles table configured
- [x] OAuth UI buttons added
- [ ] Google OAuth configured (optional)
- [ ] Apple OAuth configured (optional)
- [ ] Email templates customized (optional)
- [ ] Production URL configured (when deploying)

---

## 🎉 You're All Set!

Your Supabase backend is fully configured and ready to use. Users can now:

1. ✅ Sign up with email/password
2. ✅ Sign in to their account
3. ✅ Reset forgotten passwords
4. ✅ Have their data securely stored
5. ✅ Access personalized features

Once you configure OAuth providers, they'll also be able to sign in with Google and Apple!
