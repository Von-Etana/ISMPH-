# 🚀 Authentication Setup Checklist for Supabase

## ✅ **COMPLETED** (Already Done)

- ✅ Supabase client configured (`src/services/supabase.ts`)
- ✅ Auth Redux slice with session restoration (`src/store/slices/authSlice.ts`)
- ✅ Input validation for signup/login
- ✅ User-friendly error messages
- ✅ Session persistence logic
- ✅ Auth state listener in app layout
- ✅ Auto-navigation on logout
- ✅ Profile integration with full name display

---

## 📋 **NEXT STEPS - ACTION REQUIRED**

### **Step 1: Configure Supabase Credentials** ⚠️ CRITICAL

**What to do:**
1. Open your **`.env`** file
2. Replace the placeholder values with your actual Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to find these:**
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Open your project (or create one if you haven't)
4. Click **Settings** (gear icon) → **API**
5. Copy:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **Project API keys > anon public** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

⚠️ **Without these, authentication will NOT work!**

---

### **Step 2: Run Database Fixes** ⚠️ CRITICAL

**What to do:**
Run the SQL scripts in your Supabase dashboard to set up authentication properly.

**Option A: Complete Setup (Recommended)**
1. Open **Supabase Dashboard** → **SQL Editor**
2. Click **New Query**
3. Open the file: `fix_auth_complete.sql`
4. Copy ALL contents
5. Paste into SQL Editor
6. Click **RUN** button
7. ✅ Wait for "SUCCESS" message

This script will:
- Fix role constraints (allows all valid roles)
- Set up RLS policies for profiles
- **Auto-confirm email** (no verification needed)
- Enable profile read/write permissions

**OR Option B: Manual Email Disable (Easier)**
1. Open **Supabase Dashboard** → **Authentication** → **Settings**
2. Scroll to **"Email Auth"** section
3. Toggle **OFF** the "Confirm email" option
4. Click **Save**

---

### **Step 3: Restart Your App**

**What to do:**
```bash
# Stop the current dev server (Ctrl+C)
# Then restart with cache clear:
npx expo start --clear
```

This ensures:
- New Supabase credentials are loaded
- Redux state is fresh
- No cached errors

---

### **Step 4: Test Authentication Flow**

**What to test:**

#### **A. Sign Up (New User)**
1. Open the app
2. Click **Sign Up**
3. Enter:
   - Email: `test@example.com`
   - Password: `Test123!`
   - Full Name: `Test User`
   - Select Account Type: User or Staff
   - Select State (if staff)
4. Click **Sign Up**
5. ✅ **Expected:** Success toast, navigate to main app

❌ **If fails:** Check error message, verify .env credentials

#### **B. Session Persistence**
1. Close the app completely
2. Reopen the app
3. ✅ **Expected:** Automatically logged in (no login screen)

❌ **If fails:** Session restoration not working

#### **C. Sign Out**
1. Go to Profile tab
2. Click **Sign Out**
3. ✅ **Expected:** Navigate to auth screen

#### **D. Sign In (Existing User)**
1. Enter your email and password
2. Click **Sign In**
3. ✅ **Expected:** Success toast, navigate to main app

❌ **If fails:** Check credentials, verify user exists

---

## 🔍 **Common Issues & Solutions**

### **Issue: "Supabase client not properly configured"**
**Solution:**
- Check `.env` file has correct `EXPO_PUBLIC_SUPABASE_URL`
- Check `.env` file has correct `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Restart app with `npx expo start --clear`

### **Issue: "Email already exists"**
**Solution:**
- Check Supabase Dashboard → Authentication → Users
- Delete test user or use different email

### **Issue: "Profile not found"**
**Solution:**
- Run `fix_auth_complete.sql` to fix RLS policies
- Check if trigger creates profile on signup

### **Issue: "Invalid email or password"**
**Solution:**
- Verify email format (must have @)
- Verify password is at least 6 characters
- Check caps lock is off

### **Issue: "localhost refused to connect" (email link)**
**Solution:**
- Already fixed! Email auto-confirmation is set up
- OR disable email confirmation in Supabase settings

### **Issue: "User stays on auth screen after signup"**
**Solution:**
- Check Redux state (`isAuthenticated`)
- Check profile was created
- Check navigation in `app/auth/index.tsx`

---

## 📱 **Quick Verification Commands**

### **Check Environment Variables:**
```bash
# In your terminal
npx expo start
# Look for any .env error messages
```

### **Check Supabase Connection:**
Open the app and watch the terminal/console for:
- ✅ `[Supabase] Client initialized successfully`
- ❌ `[Error] Supabase URL or key missing`

---

## 🎯 **Success Criteria**

You'll know authentication is working when:

✅ **Signup:**
- Form validation works
- User is created in Supabase
- Profile is created with correct role
- User is logged in automatically
- Full name appears in profile

✅ **Login:**
- Credentials are validated
- User is authenticated
- Session is stored
- Navigation works based on role

✅ **Session Persistence:**
- App reopens with user logged in
- No need to re-enter credentials
- Profile data is loaded

✅ **Logout:**
- Session is cleared
- User returns to auth screen
- Cannot access protected screens

---

## 📞 **Need Help?**

If you encounter issues:

1. **Check Terminal Output** - Look for error messages
2. **Check Supabase Logs** - Dashboard → Logs
3. **Check Browser Console** - If using web
4. **Verify Database** - Check if profile was created

---

## 🔐 **Security Reminders**

⚠️ **DO NOT:**
- Share your `EXPO_PUBLIC_SUPABASE_ANON_KEY` publicly
- Commit `.env` file to GitHub (it's in `.gitignore`)
- Use the service role key in the app (only in backend scripts)

✅ **DO:**
- Keep `.env` file local
- Use environment variables
- Test with dummy data first
- Enable RLS policies in production

---

## 📄 **Related Files**

- `fix_auth_complete.sql` - Run this in Supabase SQL Editor
- `AUTH_FIX_COMPLETE.md` - Full authentication documentation
- `FIX_EMAIL_VERIFICATION.md` - Email setup options
- `.env.example` - Template for environment variables
- `.env` - YOUR credentials (DO NOT share!)

---

## 🎉 **Next After Authentication Works**

Once authentication is working:
1. ✅ Test all features (Reports, Feedback, Analytics, Chat)
2. ✅ Test admin approval workflow (with `verify-admin-users.js`)
3. ✅ Add more test users
4. ✅ Configure WhatsApp group links (if needed)
5. ✅ Customize branding/colors
6. ✅ Deploy to Expo/App Stores

---

**Start with Step 1 (configure .env) then Step 2 (run SQL), then test! 🚀**
