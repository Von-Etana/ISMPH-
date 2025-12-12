# 🔐 Change Android Keystore Credentials

## Current vs New Keystore

### Current Keystore (EAS-managed)
```
SHA1: 28:B1:56:77:C5:02:46:54:D1:F0:CF:E6:E3:ED:E8:AE:07:C8:0A:24
```

### New Keystore (Your keystore)
```
SHA1: C8:9E:1C:F0:24:C0:80:FD:A3:DC:48:93:FF:D5:10:17:3F:A2:44:D1
```

---

## ⚠️ IMPORTANT: What You Need

To change the keystore, you need the **actual keystore file** (`.jks` or `.keystore`) that has the SHA-1 fingerprint `C8:9E:1C:F0:24:C0:80:FD:A3:DC:48:93:FF:D5:10:17:3F:A2:44:D1`.

You also need:
- 🔑 **Keystore password**
- 🔑 **Key alias**
- 🔑 **Key password**

---

## 🚨 Critical Warning

**If you already have an app published on Google Play Store:**

⚠️ **DO NOT change the keystore!** You **CANNOT** update an existing app with a different keystore. Google Play will reject it.

**Only change the keystore if:**
- ✅ This is a new app (not yet published)
- ✅ You're replacing a test keystore with your production keystore
- ✅ You're starting fresh

**If you already published with the old keystore:**
- ❌ You cannot change it
- ✅ Keep using the EAS-managed keystore
- ✅ Add the new SHA-1 to Firebase/Google Services instead

---

## Option 1: Upload Your Keystore to EAS (Recommended)

### Prerequisites
1. You have the keystore file (e.g., `my-app.jks` or `my-app.keystore`)
2. You know the keystore password
3. You know the key alias
4. You know the key password

### Steps

#### Step 1: Verify Your Keystore SHA-1

First, verify that your keystore file has the correct SHA-1:

```bash
keytool -list -v -keystore path/to/your-keystore.jks -alias your-alias
```

Look for the SHA-1 fingerprint in the output. It should be:
```
C8:9E:1C:F0:24:C0:80:FD:A3:DC:48:93:FF:D5:10:17:3F:A2:44:D1
```

#### Step 2: Upload to EAS

Open PowerShell and run:

```bash
cd c:\Users\Stephen\ISMPH--1
eas credentials
```

When prompted:
1. Select: **Android**
2. Select: **production**
3. Select: **Keystore: Set up a new keystore**
4. Select: **Upload a keystore**
5. Provide:
   - **Keystore path**: `path/to/your-keystore.jks`
   - **Keystore password**: Your keystore password
   - **Key alias**: Your key alias
   - **Key password**: Your key password

#### Step 3: Verify Upload

After uploading, verify the SHA-1:

```bash
eas credentials -p android
```

Select: **production** → **Keystore: View details**

You should see:
```
SHA1: C8:9E:1C:F0:24:C0:80:FD:A3:DC:48:93:FF:D5:10:17:3F:A2:44:D1
```

#### Step 4: Build

```bash
eas build --platform android --profile production
```

---

## Option 2: Use Local Keystore (Advanced)

If you want to keep the keystore file locally and not upload to EAS:

### Step 1: Create Credentials Folder

```bash
mkdir credentials
```

### Step 2: Copy Your Keystore

Copy your keystore file to the credentials folder:
```
credentials/my-app.jks
```

### Step 3: Update eas.json

Add to your `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "resourceClass": "medium",
        "buildType": "app-bundle",
        "credentialsSource": "local"
      }
    }
  }
}
```

### Step 4: Create Keystore Config

Create `credentials.json` in your project root:

```json
{
  "android": {
    "keystore": {
      "keystorePath": "credentials/my-app.jks",
      "keystorePassword": "YOUR_KEYSTORE_PASSWORD",
      "keyAlias": "YOUR_KEY_ALIAS",
      "keyPassword": "YOUR_KEY_PASSWORD"
    }
  }
}
```

⚠️ **Add to .gitignore:**
```bash
echo "credentials.json" >> .gitignore
echo "credentials/" >> .gitignore
```

### Step 5: Build

```bash
eas build --platform android --profile production
```

---

## Option 3: Just Add SHA-1 to Firebase (Easiest)

If you're using this SHA-1 for **Firebase, Google Sign-In, or Google Maps**, you don't need to change the keystore. Just add both SHA-1 fingerprints to Firebase:

### Step 1: Go to Firebase Console
https://console.firebase.google.com

### Step 2: Add Both SHA-1 Fingerprints

1. Select your project
2. Go to **Project Settings** (⚙️)
3. Scroll to **Your apps** → Select Android app
4. Under **SHA certificate fingerprints**, add:

**Current EAS keystore:**
```
28:B1:56:77:C5:02:46:54:D1:F0:CF:E6:E3:ED:E8:AE:07:C8:0A:24
```

**Your keystore:**
```
C8:9E:1C:F0:24:C0:80:FD:A3:DC:48:93:FF:D5:10:17:3F:A2:44:D1
```

5. Click **Save**

### Step 3: Download Updated google-services.json

Download the updated `google-services.json` and add it to your project.

### Step 4: Build

```bash
eas build --platform android --profile production
```

This way, your app works with **both** keystores!

---

## 🎯 Which Option Should You Choose?

### Choose Option 1 (Upload to EAS) if:
- ✅ You have the keystore file
- ✅ This is a new app (not yet published)
- ✅ You want EAS to manage everything

### Choose Option 2 (Local Keystore) if:
- ✅ You have the keystore file
- ✅ You want full control over the keystore
- ✅ You don't want to upload to EAS

### Choose Option 3 (Add to Firebase) if:
- ✅ You're using Firebase/Google Services
- ✅ You want to support both keystores
- ✅ Your app is already published (safest option!)

---

## 📋 What I Need to Know

To help you further, please tell me:

1. **Do you have the actual keystore file?**
   - If YES → Where is it located?
   - If NO → We can only add the SHA-1 to Firebase (Option 3)

2. **Is your app already published on Google Play Store?**
   - If YES → **DO NOT change keystore!** Use Option 3
   - If NO → You can safely change (Option 1 or 2)

3. **What is this SHA-1 for?**
   - Firebase configuration?
   - Google Sign-In?
   - Google Maps?
   - App signing?

4. **Do you know the keystore credentials?**
   - Keystore password?
   - Key alias?
   - Key password?

---

## 🚨 Critical Reminders

### If App is Published
- ❌ **NEVER** change the keystore for a published app
- ✅ **ALWAYS** use the same keystore for updates
- ✅ **ADD** new SHA-1 to Firebase instead

### If App is New
- ✅ You can change the keystore
- ✅ Upload to EAS or use local keystore
- ✅ Make sure to back up the keystore file!

### Keystore Backup
- ✅ **ALWAYS** back up your keystore file
- ✅ **NEVER** lose the keystore password
- ✅ **NEVER** commit keystore to git

---

## 📞 Next Steps

**Tell me:**
1. Do you have the keystore file?
2. Is the app already published?
3. What is this SHA-1 for?

Then I'll give you specific commands to run! 🚀

---

**Last Updated:** 2025-12-03 12:50 PM  
**Status:** ⏳ Waiting for keystore file information  
**Action Required:** Provide keystore file details
