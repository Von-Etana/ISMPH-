# 🧪 Testing & Production Build Guide

## ⚠️ CRITICAL: Environment Setup Required

**The `.env` file is missing!** You must create it before testing or building.

### Step 1: Create .env File

```powershell
# Copy the example file
Copy-Item .env.example .env
```

### Step 2: Add Your Supabase Credentials

Open `.env` and add your actual credentials:

```env
# Supabase Configuration (REQUIRED)
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# WhatsApp Group Links (Optional - defaults provided)
EXPO_PUBLIC_WHATSAPP_LAGOS=https://chat.whatsapp.com/BKKJA9uWto6KSMbm6SOmnb
EXPO_PUBLIC_WHATSAPP_KANO=https://chat.whatsapp.com/HQQBeJnwIs0FUTCQq6h1tL
EXPO_PUBLIC_WHATSAPP_KADUNA=https://chat.whatsapp.com/GcHwV95X6UH5bvhfwigpxH
```

**Where to find your Supabase credentials:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy "Project URL" → `EXPO_PUBLIC_SUPABASE_URL`
5. Copy "anon public" key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

---

## 🧪 Testing Phase

### Test 1: Type Checking

```powershell
npm run typecheck
```

**Expected Result:** ✅ No errors

**If errors occur:**
- Check that all imports are correct
- Verify TypeScript version: `npm list typescript`
- Review error messages and fix accordingly

---

### Test 2: Linting

```powershell
npm run lint
```

**Expected Result:** ✅ No critical errors (warnings are okay)

---

### Test 3: Install Dependencies

```powershell
npm install
```

**Expected Result:** ✅ All packages installed successfully

**If errors occur:**
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

---

### Test 4: Development Server

```powershell
npm run dev
```

**Expected Result:** 
- ✅ Metro bundler starts
- ✅ QR code appears
- ✅ No errors in console

**Test on:**
- [ ] Web browser (press `w`)
- [ ] iOS simulator (press `i` if on Mac)
- [ ] Android emulator (press `a`)
- [ ] Physical device (scan QR code with Expo Go)

---

### Test 5: Functional Testing

Once the app is running, test these critical flows:

#### Authentication Flow
- [ ] Sign up with new account
- [ ] Verify email validation
- [ ] Sign in with existing account
- [ ] Sign out
- [ ] Sign in again (verify session persistence)
- [ ] Close and reopen app (session should persist)

#### Reports Flow
- [ ] Navigate to Reports tab
- [ ] Create new report
- [ ] Add title and description
- [ ] Select category and priority
- [ ] Submit report
- [ ] Verify report appears in list

#### Disease Tracker
- [ ] Navigate to home screen
- [ ] View disease statistics
- [ ] Expand analytics section
- [ ] Verify data displays correctly

#### Thematic Categories
- [ ] Scroll to "Thematic Area of Focus"
- [ ] Verify all 8 icons display (not emojis)
- [ ] Icons should be Lucide components
- [ ] Tap a category
- [ ] Verify navigation works

#### Chat/Messaging
- [ ] Navigate to Chat tab (if available)
- [ ] Send a message
- [ ] Verify message appears
- [ ] Test real-time updates

#### Error Handling
- [ ] Disconnect internet
- [ ] Try to load data
- [ ] Verify error message appears
- [ ] Reconnect internet
- [ ] Verify data loads

---

## 🏗️ Production Build

### Prerequisites

1. **EAS CLI installed:**
```powershell
npm install -g eas-cli
```

2. **Expo account:**
- Sign up at https://expo.dev
- Login: `eas login`

3. **EAS configured:**
```powershell
eas build:configure
```

---

### Build for Android

#### Option 1: APK (for testing)

```powershell
eas build --platform android --profile preview
```

**This creates:**
- APK file you can install directly
- Good for testing on devices
- Not for Google Play Store

#### Option 2: AAB (for Google Play)

```powershell
eas build --platform android --profile production
```

**This creates:**
- Android App Bundle (.aab)
- Required for Google Play Store
- Optimized for different devices

**Build process:**
1. EAS will ask for Android package name (already set: `com.ismph.mediatrackerapp`)
2. Build starts on EAS servers
3. Wait 10-15 minutes
4. Download from EAS dashboard or CLI

---

### Build for iOS

```powershell
eas build --platform ios --profile production
```

**Requirements:**
- Apple Developer account ($99/year)
- Certificates and provisioning profiles (EAS handles this)

**Build process:**
1. EAS will guide you through setup
2. Creates .ipa file
3. Can be submitted to App Store

---

### Build for Web

```powershell
npm run build:web
```

**Output:** `dist/` folder with static files

**Deploy to:**
- Vercel: `vercel deploy`
- Netlify: Drag `dist/` folder to Netlify
- GitHub Pages: Push to gh-pages branch

---

## 📋 Pre-Build Checklist

Before building for production:

### Code Quality
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` has no critical errors
- [ ] All tests pass (if you have tests)
- [ ] No `console.log` statements (we use logger)
- [ ] No hardcoded credentials

### Configuration
- [ ] `.env` has production credentials
- [ ] `app.json` version number updated
- [ ] `app.json` versionCode incremented (Android)
- [ ] Splash screen image exists
- [ ] App icon exists
- [ ] All permissions are necessary

### Assets
- [ ] All images optimized
- [ ] No missing assets
- [ ] Icons are correct size
- [ ] Splash screen tested

### Functionality
- [ ] Authentication works
- [ ] Data fetching works
- [ ] Forms submit correctly
- [ ] Navigation works
- [ ] Error handling works
- [ ] Session persistence works

---

## 🚀 Build Commands Reference

### Development
```powershell
npm run dev                    # Start development server
npm run typecheck              # Check TypeScript
npm run lint                   # Run linter
```

### Production Builds
```powershell
# Android
eas build -p android --profile preview      # APK for testing
eas build -p android --profile production   # AAB for Play Store

# iOS
eas build -p ios --profile production       # IPA for App Store

# Web
npm run build:web                           # Static files
```

### Submission
```powershell
# Submit to stores (after successful build)
eas submit -p android
eas submit -p ios
```

---

## 🐛 Common Build Issues

### Issue: "EXPO_PUBLIC_SUPABASE_URL is not defined"
**Solution:** Create `.env` file with credentials

### Issue: "Module not found"
**Solution:** 
```powershell
rm -rf node_modules package-lock.json
npm install
```

### Issue: "TypeScript errors"
**Solution:** Run `npm run typecheck` and fix errors

### Issue: "Build failed on EAS"
**Solution:** 
- Check EAS build logs
- Verify `eas.json` configuration
- Ensure all dependencies are in `package.json`

### Issue: "App crashes on startup"
**Solution:**
- Check `.env` file exists
- Verify Supabase credentials
- Check error logs in development

---

## 📊 Build Status Tracking

After running a build, track it:

```powershell
# List all builds
eas build:list

# View specific build
eas build:view [build-id]

# Download build
eas build:download [build-id]
```

---

## ✅ Post-Build Verification

After building:

### Android APK/AAB
- [ ] Install on physical device
- [ ] Test all features
- [ ] Check app size
- [ ] Verify splash screen
- [ ] Test on different Android versions

### iOS IPA
- [ ] Install via TestFlight
- [ ] Test on physical device
- [ ] Verify all features work
- [ ] Check app size

### Web
- [ ] Deploy to hosting
- [ ] Test in different browsers
- [ ] Check responsive design
- [ ] Verify all features work

---

## 📱 Distribution

### Android (Google Play)
1. Build AAB: `eas build -p android --profile production`
2. Download AAB from EAS
3. Go to Google Play Console
4. Create new release
5. Upload AAB
6. Fill in release notes
7. Submit for review

### iOS (App Store)
1. Build IPA: `eas build -p ios --profile production`
2. Submit: `eas submit -p ios`
3. Go to App Store Connect
4. Fill in app information
5. Add screenshots
6. Submit for review

### Web
1. Build: `npm run build:web`
2. Deploy `dist/` folder to:
   - Vercel
   - Netlify
   - GitHub Pages
   - Your own server

---

## 🎯 Success Criteria

Your build is successful when:

- ✅ No TypeScript errors
- ✅ No critical lint errors
- ✅ App runs in development
- ✅ All features work
- ✅ Build completes on EAS
- ✅ App installs on device
- ✅ No crashes on startup
- ✅ Supabase connection works
- ✅ Session persistence works
- ✅ All icons display correctly

---

## 📞 Need Help?

If you encounter issues:

1. **Check documentation:**
   - `README.md`
   - `QUICK_REFERENCE.md`
   - Phase documentation files

2. **Check logs:**
   - Development: Metro bundler console
   - Production: EAS build logs
   - Runtime: Error boundary messages

3. **Common fixes:**
   - Clear cache: `npx expo start -c`
   - Reinstall: `rm -rf node_modules && npm install`
   - Reset EAS: `eas build:configure`

---

## 🎉 Ready to Build!

Once you've:
1. ✅ Created `.env` file
2. ✅ Added Supabase credentials
3. ✅ Tested in development
4. ✅ Verified all features work

You're ready to build for production! 🚀

**Next command to run:**
```powershell
# First, create .env file
Copy-Item .env.example .env

# Then test
npm run typecheck
npm run dev
```
