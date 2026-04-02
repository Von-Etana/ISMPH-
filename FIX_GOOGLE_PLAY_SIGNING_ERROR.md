# 🔧 Fix Google Play Console Signing Key Error

## ❌ The Error

Your Google Play Console is rejecting the app bundle because:

**Expected SHA-1 (registered in Google Play):**
```
DD:14:CE:65:13:34:F5:30:4F:A8:DA:86:69:4D:CF:7E:D4:1C:AA:53
```

**Actual SHA-1 (your current EAS keystore):**
```
28:B1:56:77:C5:02:46:54:D1:F0:CF:E6:E3:ED:E8:AE:07:C8:0A:24
```

**Error Message:**
> "Your Android App Bundle is signed with the wrong key. Ensure that your App Bundle is signed with the correct signing key and try again."

---

## 🎯 Root Cause

You previously uploaded a build to Google Play Console using a keystore with SHA-1 `DD:14:CE:65:13:34:F5:30:4F:A8:DA:86:69:4D:CF:7E:D4:1C:AA:53`.

Now EAS is using a different keystore (SHA-1 `28:B1:56:77:C5:02:46:54:D1:F0:CF:E6:E3:ED:E8:AE:07:C8:0A:24`).

**Google Play requires ALL updates to use the SAME keystore!**

---

## ✅ Solution: Upload Your Original Keystore to EAS

You need to find and upload the original keystore file that has SHA-1 `DD:14:CE:65:13:34:F5:30:4F:A8:DA:86:69:4D:CF:7E:D4:1C:AA:53`.

### Step 1: Locate Your Original Keystore

The keystore file is typically named:
- `my-app.keystore`
- `my-app.jks`
- `android.keystore`
- `release.keystore`

**Common locations:**
- Project folder
- `android/app/` directory
- Your computer's Documents folder
- External backup drive
- Email attachments (if you sent it to yourself)

### Step 2: Verify the Keystore SHA-1

Once you find the keystore, verify it has the correct SHA-1:

```bash
keytool -list -v -keystore path/to/your-keystore.jks -alias your-alias
```

**Look for:**
```
SHA1: DD:14:CE:65:13:34:F5:30:4F:A8:DA:86:69:4D:CF:7E:D4:1C:AA:53
```

**If you don't know the alias, list all aliases:**
```bash
keytool -list -v -keystore path/to/your-keystore.jks
```

### Step 3: Upload to EAS

Once verified, upload to EAS:

```bash
cd c:\Users\Stephen\ISMPH--1
eas credentials
```

**When prompted:**
1. Select: **Android**
2. Select: **production**
3. Select: **Keystore: Set up a new keystore**
4. Select: **Upload a keystore**
5. Provide:
   - **Keystore path**: `path/to/your-keystore.jks`
   - **Keystore password**: Your keystore password
   - **Key alias**: Your key alias (e.g., `my-app`, `release`, `key0`)
   - **Key password**: Your key password

### Step 4: Rebuild

After uploading the correct keystore:

```bash
eas build --platform android --profile production
```

### Step 5: Verify SHA-1

Check that the new build has the correct SHA-1:

```bash
eas credentials -p android
```

Select: **production** → **Keystore: View details**

**You should see:**
```
SHA1: DD:14:CE:65:13:34:F5:30:4F:A8:DA:86:69:4D:CF:7E:D4:1C:AA:53
```

### Step 6: Submit to Google Play

```bash
eas submit --platform android --latest
```

---

## 🚨 If You Can't Find the Original Keystore

### Option 1: Check Google Play Console for Upload Key

1. Go to: https://play.google.com/console
2. Select your app
3. Go to: **Setup → App signing**
4. Look for **"Upload key certificate"**

**If you see it:**
- Download the certificate
- This might help you identify which keystore you used

### Option 2: Reset App Signing (LAST RESORT)

⚠️ **WARNING:** This is a drastic measure and has consequences!

If you absolutely cannot find the original keystore, you may need to:

1. **Contact Google Play Support** to reset app signing
2. **Or create a new app listing** with a new package name

**Consequences:**
- ❌ Lose all existing users (they can't update)
- ❌ Lose all reviews and ratings
- ❌ Start from scratch

**Only do this if:**
- The app has no users yet
- You're willing to start over

---

## 📋 Keystore Information You Need

To upload the keystore to EAS, you need:

### 1. Keystore File
- File name: `your-app.jks` or `your-app.keystore`
- Location: Where is it stored?

### 2. Keystore Password
- The password to open the keystore file
- You set this when creating the keystore

### 3. Key Alias
- Common aliases: `my-app`, `release`, `key0`, `androiddebugkey`
- You set this when creating the keystore

### 4. Key Password
- The password for the specific key
- Often the same as keystore password

---

## 🔍 How to Find Keystore Information

### If You Have the Keystore File

**List all aliases:**
```bash
keytool -list -v -keystore your-keystore.jks
```

**Check specific alias:**
```bash
keytool -list -v -keystore your-keystore.jks -alias your-alias
```

### If You Used Android Studio

Check:
- `~/.android/` directory
- `android/app/` directory in your project
- Android Studio build configuration

### If You Used Expo Previously

Check:
- Old Expo credentials
- `expo credentials:manager` (if you used classic build)

---

## ✅ Quick Checklist

- [ ] Find the original keystore file
- [ ] Verify it has SHA-1: `DD:14:CE:65:13:34:F5:30:4F:A8:DA:86:69:4D:CF:7E:D4:1C:AA:53`
- [ ] Know the keystore password
- [ ] Know the key alias
- [ ] Know the key password
- [ ] Upload to EAS using `eas credentials`
- [ ] Rebuild: `eas build --platform android --profile production`
- [ ] Verify SHA-1 matches
- [ ] Submit: `eas submit --platform android --latest`

---

## 📞 Next Steps

**Tell me:**

1. **Do you have the original keystore file?**
   - If YES → Where is it located?
   - If NO → We need to explore recovery options

2. **Do you know the keystore credentials?**
   - Keystore password?
   - Key alias?
   - Key password?

3. **How did you create the first build?**
   - Using EAS Build?
   - Using Android Studio?
   - Using Expo Classic Build?
   - Other method?

Once you provide this information, I'll give you exact commands to fix this! 🚀

---

## 🎯 Summary

**Problem:** Google Play expects SHA-1 `DD:14:CE:65:13:34:F5:30:4F:A8:DA:86:69:4D:CF:7E:D4:1C:AA:53`  
**Current:** EAS is using SHA-1 `28:B1:56:77:C5:02:46:54:D1:F0:CF:E6:E3:ED:E8:AE:07:C8:0A:24`  
**Solution:** Upload the original keystore to EAS  
**Result:** Builds will have the correct SHA-1 and Google Play will accept them ✅

---

**Last Updated:** 2025-12-03 13:20 PM  
**Status:** ⏳ Need original keystore file  
**Action Required:** Locate and upload original keystore
