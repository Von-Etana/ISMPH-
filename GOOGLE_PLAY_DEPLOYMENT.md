# Google Play Store Deployment Guide

## Prerequisites

### 1. Google Play Console Account
- Create a Google Play Console account at https://play.google.com/console/
- Pay the one-time $25 registration fee
- Verify your account with a payment method

### 2. Expo Application Services (EAS)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to your Expo account
eas login
```

### 3. Google Play Console Setup (for automated publishing - optional)
If you want automated publishing from EAS:
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable Google Play Android Developer API
4. Create a Service Account with "Service Account User" role
5. Generate JSON key and download it as `google-service-account-key.json`
6. Add the service account as a user in Google Play Console with "Release" permissions

**Note:** Since this app uses Supabase (not Firebase), Google services are optional for basic publishing.

## Step 1: Configure App for Production

### Update app.json
The app.json has been configured with:
- Android package name: `com.ismph.mediatracker`
- Version code: 1
- Required permissions
- Adaptive icon configuration

### Update EAS Configuration
Edit `eas.json` with your actual values:
```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-service-account-key.json",
        "track": "internal"
      }
    }
  }
}
```

## Step 2: Build Android App Bundle

### Install Dependencies
```bash
npm install
```

### Create Production Build
```bash
# Build for Android
eas build --platform android --profile production

# Or build for both platforms
eas build --platform all --profile production
```

### Monitor Build Progress
- The build will take 10-30 minutes
- Check progress at: https://expo.dev/accounts/[your-username]/projects/[project-name]/builds
- Download the AAB (Android App Bundle) file when complete

## Step 3: Create Google Play Store Listing

### 1. Create App in Google Play Console
1. Go to Google Play Console → "Create app"
2. Fill in app details:
   - **App name**: ISMPH Media Tracker
   - **Default language**: English
   - **App type**: App (not game)
   - **Free or paid**: Free

### 2. Store Listing
1. **App details**:
   - **Short description**: Track PHC reports and health analytics
   - **Full description**: Comprehensive platform for monitoring Primary Healthcare Center reports, disease tracking, and facility management across Nigerian states.

2. **Graphics**:
   - **App icon**: 512x512 PNG (use your existing icon)
   - **Feature graphic**: 1024x500 PNG
   - **Screenshots**: At least 2 screenshots (phone and tablet if supported)

3. **Categorization**:
   - **Category**: Health & Fitness → Health
   - **Content rating**: Everyone

### 3. Privacy Policy
Create a privacy policy URL and add it to the store listing. You can use:
- Google Play's privacy policy generator
- Or host your own at: https://ismph.org/privacy-policy

## Step 4: Upload and Configure Release

### 1. Upload App Bundle
1. Go to Google Play Console → Release → Production
2. Click "Create new release"
3. Upload the AAB file from EAS build
4. Fill release notes: "Initial release with comprehensive PHC reporting and analytics features"

### 2. App Content
1. **Content rating**: Complete the questionnaire (should be "Everyone")
2. **Target audience**: Select appropriate age groups
3. **News app**: No
4. **Data safety**: Complete data collection disclosure

### 3. Testing
1. **Internal testing** (recommended first):
   - Create internal test track
   - Add tester emails
   - Release to internal testing

2. **Closed testing** (optional):
   - Create closed test with specific users

## Step 5: Submit for Review

### Production Release
1. Go to Production track
2. Click "Create new release"
3. Upload your AAB file
4. Set version code to 1
5. Add release notes
6. Review all sections are complete
7. Click "Save" then "Review release"
8. Click "Start rollout to production"

## Step 6: Post-Submission

### 1. Monitor Review Process
- Review typically takes 1-7 days
- Check email for updates
- Monitor Google Play Console for status

### 2. Handle Review Feedback
- If rejected, fix issues and resubmit
- Common issues: privacy policy, content rating, missing screenshots

### 3. Publish Updates
```bash
# For future updates, increment version code in app.json
# Then rebuild and submit
eas build --platform android --profile production
eas submit --platform android --profile production
```

## Required Assets

### Screenshots (Required)
Create screenshots showing:
1. Login screen
2. Reports dashboard
3. Analytics view
4. News feed
5. Profile/settings

### Feature Graphic (1024x500)
Design showing app features and benefits

### App Icon (512x512)
High-resolution version of your current icon

## Troubleshooting

### Build Issues
```bash
# Clear EAS cache
eas build:clean

# Check build logs
eas build:list
eas build:view [build-id]
```

### Submission Issues
- Ensure all required fields are filled
- Check content rating is appropriate
- Verify privacy policy is accessible
- Make sure app bundle is valid

### Common Errors
1. **Version code conflicts**: Increment versionCode in app.json
2. **Missing permissions**: Check Android permissions in app.json
3. **Privacy policy**: Must be a valid HTTPS URL
4. **Content rating**: Complete the rating questionnaire

## Cost Considerations

- **Google Play Console**: $25 one-time fee
- **EAS Builds**: Free for basic builds, paid for priority builds
- **Google Cloud**: Free tier available for service account

## Support

- Expo Documentation: https://docs.expo.dev/
- Google Play Console Help: https://support.google.com/googleplay/
- EAS Forums: https://forums.expo.dev/

## Checklist Before Submission

- [ ] App builds successfully with EAS
- [ ] All required assets created (screenshots, icons, feature graphic)
- [ ] Privacy policy published and linked
- [ ] Content rating completed
- [ ] Target audience configured
- [ ] Data safety form completed
- [ ] Internal testing completed (recommended)
- [ ] Release notes written
- [ ] Version code incremented
- [ ] Google service account configured (for automated publishing)

## Next Steps After Approval

1. **Monitor downloads and ratings**
2. **Respond to user reviews**
3. **Plan feature updates**
4. **Set up crash reporting** (optional)
5. **Configure in-app updates** (optional)

---

**Note**: This guide assumes you have a valid Google Play Developer account and have completed all legal requirements for publishing Android apps.