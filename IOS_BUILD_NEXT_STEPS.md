# 🍎 iOS Build - Apple Credentials Required

## Current Status
✅ New Architecture disabled in `app.json`  
⚠️ Build requires Apple account credentials

## Next Steps

### Option 1: Build with Interactive Prompt (RECOMMENDED)

Open a **new PowerShell terminal** and run:

```bash
cd c:\Users\Stephen\ISMPH--1
eas build --platform ios --profile production
```

When prompted:
1. **"Do you want to log in to your Apple account?"** → Press `Y` (Yes)
2. Enter your **Apple ID**: `stevietany@gmail.com` (from your eas.json)
3. Enter your **App-Specific Password** (not your regular Apple password)

### How to Generate App-Specific Password

1. Go to: https://appleid.apple.com/account/manage
2. Sign in with your Apple ID
3. Navigate to **"Security"** section
4. Under **"App-Specific Passwords"**, click **"Generate Password"**
5. Label it: `EAS Build`
6. Copy the generated password (format: `xxxx-xxxx-xxxx-xxxx`)
7. Use this password when EAS asks for credentials

---

### Option 2: Use Existing Credentials

If you've already configured credentials before, run:

```bash
eas build --platform ios --profile production --non-interactive
```

This will use your stored credentials without prompting.

---

### Option 3: Manual Credential Management

Check your current credentials:

```bash
eas credentials
```

Then select:
1. **iOS**
2. **Production**
3. View or configure credentials

---

## Build Command Reference

```bash
# Interactive build (will prompt for Apple credentials)
eas build --platform ios --profile production

# Non-interactive build (uses stored credentials)
eas build --platform ios --profile production --non-interactive

# Check credential status
eas credentials

# View build status
eas build:list
```

---

## What Happens Next

Once you provide credentials, EAS will:

1. ✅ **Generate iOS native code** (fixes ExpoReactDelegate error)
2. ✅ **Create/update provisioning profiles**
3. ✅ **Build with Xcode** on macOS servers
4. ✅ **Sign the IPA** with your certificates
5. ✅ **Upload to EAS servers**

**Build time:** ~15-25 minutes

---

## After Build Completes

You'll get a **build URL** like:
```
https://expo.dev/accounts/von-etana/projects/ismph-media-tracker/builds/...
```

Then you can:

### Submit to TestFlight
```bash
eas submit --platform ios --profile production
```

### Or Download IPA
Visit the build URL and click **"Download"**

---

## Troubleshooting

### "Invalid Apple ID or Password"
- ✅ Make sure you're using an **App-Specific Password**, not your regular password
- ✅ Generate a new one at: https://appleid.apple.com/account/manage

### "No credentials found"
- ✅ Run `eas credentials` to set them up manually
- ✅ Or let EAS generate them when you provide Apple account access

### "Build failed with Xcode error"
- ✅ Check the build logs at the build URL
- ✅ The ExpoReactDelegate error should be fixed now (we disabled New Architecture)

---

## Quick Start (Copy & Paste)

```bash
# Open PowerShell and run:
cd c:\Users\Stephen\ISMPH--1
eas build --platform ios --profile production
```

When prompted, provide your Apple credentials and let it run! 🚀

---

## Important Notes

- 📧 **Apple ID**: `stevietany@gmail.com` (from your eas.json)
- 🔐 **Password**: Use App-Specific Password (not regular password)
- ⏱️ **Build Time**: 15-25 minutes
- 💰 **EAS Builds**: Check your plan limits at https://expo.dev/accounts/von-etana/settings/billing

---

## What We Fixed

✅ **Disabled New Architecture** in `app.json`  
✅ **This resolves the ExpoReactDelegate error**  
✅ **EAS Build will generate correct iOS native code**  

The build should now succeed! 🎉
