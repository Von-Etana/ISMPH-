#!/bin/bash

# ISMPH Android Deployment Script
# This script helps deploy the app to Google Play Store

echo "🚀 ISMPH Android Deployment Script"
echo "=================================="

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g @expo/eas-cli
fi

# Check if user is logged in to EAS
echo "🔐 Checking EAS login status..."
if ! eas whoami &> /dev/null; then
    echo "Please login to EAS:"
    eas login
fi

# Check if required files exist
echo "📁 Checking required files..."
if [ ! -f "app.json" ]; then
    echo "❌ app.json not found!"
    exit 1
fi

if [ ! -f "eas.json" ]; then
    echo "❌ eas.json not found!"
    exit 1
fi

# Note: Google services not required since we use Supabase
echo "ℹ️  Using Supabase for backend services (no Google services required)"

echo "✅ Prerequisites check complete!"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the app
echo "🔨 Building Android app bundle..."
echo "This may take 10-30 minutes..."
eas build --platform android --profile production

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Download the AAB file from: https://expo.dev/accounts/[your-username]/projects/[project-name]/builds"
    echo "2. Go to Google Play Console: https://play.google.com/console/"
    echo "3. Create a new app or update existing one"
    echo "4. Upload the AAB file to Production track"
    echo "5. Complete store listing and submit for review"
    echo ""
    echo "📖 For detailed instructions, see GOOGLE_PLAY_DEPLOYMENT.md"
else
    echo "❌ Build failed! Check the error messages above."
    exit 1
fi