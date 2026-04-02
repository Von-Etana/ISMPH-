# 🔍 Extract SHA-1 from Build Logs

## Build Information

**Build ID:** `674cbadf-9642-418a-8e62-e5ff9e565a42`  
**Date:** November 17, 2025  
**Status:** ✅ Finished  
**Fingerprint:** `3c41aa9a13587473fd010238011d641267606d2c`

**Build Logs:** https://expo.dev/accounts/von-etana/projects/ismph-media-tracker/builds/674cbadf-9642-418a-8e62-e5ff9e565a42

---

## 🎯 What We Need to Find

We need to find the **SHA-1 fingerprint** of the keystore used in this build.

This will tell us if this build matches the keystore that Google Play Console expects:
```
DD:14:CE:65:13:34:F5:30:4F:A8:DA:86:69:4D:CF:7E:D4:1C:AA:53
```

---

## 📋 How to Extract SHA-1 from Build Logs

### Step 1: Open Build Logs

Click this link:
```
https://expo.dev/accounts/von-etana/projects/ismph-media-tracker/builds/674cbadf-9642-418a-8e62-e5ff9e565a42
```

### Step 2: Search for SHA-1

In the build logs, search for (Ctrl+F or Cmd+F):
- `SHA1`
- `SHA-1`
- `keystore`
- `signing`

### Step 3: Look for Keystore Information

You should find something like:
```
Keystore SHA1: XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX:XX
```

### Step 4: Copy the SHA-1

Copy the entire SHA-1 fingerprint.

---

## 🔍 Alternative: Download and Check the AAB

If you can't find the SHA-1 in the logs, you can download the AAB and check it:

### Step 1: Download the AAB

Download from:
```
https://expo.dev/artifacts/eas/dKQPk7gy37TZ3JtfWEjUQA.aab
```

### Step 2: Extract Signing Certificate

Use `jarsigner` to check the certificate:

```bash
jarsigner -verify -verbose -certs path/to/downloaded.aab
```

Look for the SHA-1 fingerprint in the output.

---

## 🎯 What to Do Next

### If SHA-1 Matches Google Play Console

If the SHA-1 from this build is:
```
DD:14:CE:65:13:34:F5:30:4F:A8:DA:86:69:4D:CF:7E:D4:1C:AA:53
```

**Then:**
1. ✅ This is the correct keystore!
2. ✅ We need to restore this keystore in EAS
3. ✅ Download the keystore from this build's credentials

### If SHA-1 Doesn't Match

If the SHA-1 is different, we need to:
1. Check older builds (before Nov 17)
2. Or check if you used a different EAS account/project
3. Or contact EAS support to recover the keystore

---

## 📝 Quick Commands

### Check EAS Credentials for This Build

The build used credentials from the **production** profile. Check what's currently there:

```bash
cd c:\Users\Stephen\ISMPH--1
eas credentials -p android
```

Select: **production** → **Keystore: View details**

### List All Historical Credentials

EAS might have stored multiple keystores. You can check:

```bash
eas credentials -p android
```

Look for options to view **historical credentials** or **previous keystores**.

---

## 🚨 Critical Question

**Was this build (Nov 17) successfully uploaded to Google Play Console?**

Check in Google Play Console:
1. Go to: https://play.google.com/console
2. Select your app
3. Go to: **Release → Production** (or **Internal testing**)
4. Check the upload date

**If the upload date is around November 17, 2025:**
- ✅ This is the build that's in Google Play!
- ✅ We need to use this build's keystore

**If the upload date is different:**
- ❌ A different build was uploaded
- ❌ We need to find that build

---

## 🎯 Action Items

**Please do the following:**

### 1. Check Build Logs
Open: https://expo.dev/accounts/von-etana/projects/ismph-media-tracker/builds/674cbadf-9642-418a-8e62-e5ff9e565a42

Search for "SHA1" or "SHA-1"

**Tell me:** What SHA-1 do you see?

### 2. Check Google Play Console
Go to: https://play.google.com/console → Your app → **Setup → App signing**

**Tell me:**
- Upload key certificate SHA-1: ?
- App signing key certificate SHA-1: ?

### 3. Check Google Play Release Date
Go to: https://play.google.com/console → Your app → **Release**

**Tell me:** When was the app first uploaded?

---

## 💡 Most Likely Scenario

Based on the error message, the SHA-1 `DD:14:CE:65:13:34:F5:30:4F:A8:DA:86:69:4D:CF:7E:D4:1C:AA:53` is either:

1. **The Upload Key** from the first build uploaded to Google Play
2. **The App Signing Key** created by Google Play when you enrolled in Play App Signing

**To confirm:** Check Google Play Console → Setup → App signing

---

## 🚀 Next Steps

Once you provide:
1. SHA-1 from build logs (or build `674cbadf`)
2. SHA-1 from Google Play Console (Upload key)
3. SHA-1 from Google Play Console (App signing key)

I'll tell you exactly how to fix this! 🎯

---

**Last Updated:** 2025-12-03 14:35 PM  
**Status:** ⏳ Need SHA-1 from build logs and Google Play Console  
**Action Required:** Check build logs and Google Play Console
