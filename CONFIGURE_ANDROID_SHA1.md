# 🔐 Configure Android Keystore with Your SHA-1

## Your Certificate Fingerprints
- **MD5**: `77:83:97:A5:44:6E:12:4D:16:A8:DA:FC:B3:9B:94:0C`
- **SHA-1**: `DD:14:CE:65:13:34:F5:30:4F:A8:DA:86:69:4D:CF:7E:D4:1C:AA:53`
- **SHA-256**: `7B:BC:B6:A8:57:1F:65:ED:CC:91:E2:92:0F:C1:F2:64:CE:08:A0:13:37:A8:A3:77:B3:E4:91:4D:88:0F:95:44`

---

## 🎯 Most Common Use Case: Firebase Configuration

If you need this SHA-1 for **Firebase, Google Sign-In, or Google Maps**, follow these steps:

### Step 1: Check Your Current EAS Keystore SHA-1

Open **PowerShell** and run:

```bash
cd c:\Users\Stephen\ISMPH--1
eas credentials -p android
```

When prompted:
1. Select build profile: **production**
2. Select: **Keystore: View details**

You'll see the current SHA-1 fingerprint.

### Step 2: Add SHA-1 to Firebase

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your project
3. Click **⚙️ Project Settings**
4. Scroll to **Your apps** → Select your Android app
5. Under **SHA certificate fingerprints**, click **Add fingerprint**
6. Paste: `DD:14:CE:65:13:34:F5:30:4F:A8:DA:86:69:4D:CF:7E:D4:1C:AA:53`
7. Click **Save**

### Step 3: Download Updated google-services.json

1. In Firebase Console, click **Download google-services.json**
2. Save it to your project (if using Firebase)

---

## 🔄 If You Want to USE This Specific Keystore

If you have the actual `.keystore` or `.jks` file with this SHA-1:

### Option A: Upload to EAS (Recommended)

```bash
# Open PowerShell
cd c:\Users\Stephen\ISMPH--1
eas credentials -p android
```

When prompted:
1. Select: **production**
2. Select: **Keystore: Set up a new keystore**
3. Select: **Upload a keystore**
4. Provide:
   - **Keystore path**: Path to your `.jks` or `.keystore` file
   - **Keystore password**: Your keystore password
   - **Key alias**: Your key alias
   - **Key password**: Your key password

### Option B: Use Local Keystore

1. **Place keystore in project:**
   ```bash
   mkdir credentials
   # Copy your keystore file to credentials/
   ```

2. **Update eas.json:**

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

3. **Create android/app/build.gradle signing config:**

Add to `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file("../../credentials/your-keystore.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

4. **Set environment variables in EAS:**

```bash
eas secret:create --name KEYSTORE_PASSWORD --value "your-password" --type string
eas secret:create --name KEY_ALIAS --value "your-alias" --type string
eas secret:create --name KEY_PASSWORD --value "your-key-password" --type string
```

---

## 📋 Quick Reference Commands

### View Current Credentials
```bash
# SHA1: 28:B1:56:77:C5:02:46:54:D1:F0:CF:E6:E3:ED:E8:AE:07:C8:0A:24
eas credentials -p android
# Select: production → Keystore: View details
```

### Upload New Keystore
```bash
eas credentials -p android
# Select: production → Keystore: Set up a new keystore → Upload
```

### Build with Current Credentials
```bash
eas build --platform android --profile production
```

### Verify SHA-1 of a Keystore File
```bash
keytool -list -v -keystore path/to/your-keystore.jks -alias your-alias
```

---

## 🎯 What You Should Do

### If This is for Firebase/Google Services:
1. ✅ Keep using EAS-managed keystore
2. ✅ Get the SHA-1 from EAS credentials
3. ✅ Add it to Firebase Console
4. ✅ Also add your provided SHA-1 if it's from a different keystore

### If You Have the Keystore File:
1. ✅ Upload it to EAS using `eas credentials`
2. ✅ Or configure local credentials in `eas.json`

### If You're Not Sure:
1. ✅ Check current credentials: `eas credentials -p android`
2. ✅ See what SHA-1 is currently being used
3. ✅ Decide if you need to change it

---

## 🚨 Important Notes

### Multiple SHA-1 Fingerprints

For Firebase, you can (and should) add **multiple SHA-1 fingerprints**:

- **Development keystore** (for local testing)
- **Production keystore** (for production builds)
- **EAS keystore** (if using EAS Build)

This ensures your app works in all environments.

### Don't Lose Your Keystore!

If you're using a custom keystore:
- ✅ **Back it up securely**
- ✅ **Save the passwords**
- ✅ **Never commit to git**

If you lose it, you **cannot update your app** on Google Play!

---

## ✅ Recommended Approach

**For most users:**

1. **Let EAS manage your keystore** (automatic, secure)
2. **Get the SHA-1 from EAS**
3. **Add it to Firebase/Google Services**

**Only use a custom keystore if:**
- You already have one from a previous app
- You need to match an existing Play Store listing
- You have specific security requirements

---

## 📞 Next Steps

**Tell me:**

1. **Do you have the actual keystore file with this SHA-1?**
   - If YES → I'll help you upload it to EAS
   - If NO → I'll help you add this SHA-1 to Firebase

2. **What is this SHA-1 for?**
   - Firebase configuration?
   - Google Sign-In?
   - Google Maps?
   - Something else?

3. **Do you want to:**
   - A) Add this SHA-1 to Firebase (keep current keystore)
   - B) Replace your keystore with one that has this SHA-1
   - C) Check what SHA-1 you're currently using

Let me know and I'll provide specific instructions! 🚀
