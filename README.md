# ISMPH Media Tracker

A mobile application for tracking health media reports and disease surveillance in Nigeria.

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Expo CLI
- Supabase account with project created

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd ISMPH--1
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Supabase credentials
```

Required environment variables in `.env`:
```env
# Supabase Configuration (REQUIRED)
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# WhatsApp Group Links (Optional - defaults provided)
EXPO_PUBLIC_WHATSAPP_LAGOS=https://chat.whatsapp.com/...
EXPO_PUBLIC_WHATSAPP_KANO=https://chat.whatsapp.com/...
EXPO_PUBLIC_WHATSAPP_KADUNA=https://chat.whatsapp.com/...
```

4. **Start the development server**
```bash
npm run dev
```

5. **Run on your device**
- Scan the QR code with Expo Go app (iOS/Android)
- Or press `w` to open in web browser

## Available Scripts

- `npm run dev` - Start Expo development server
- `npm run build:web` - Build for web deployment
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
ISMPH--1/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   ├── auth/              # Authentication screens
│   ├── admin/             # Admin screens
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable components
│   ├── constants/         # Theme, colors, data
│   ├── services/          # API services
│   │   ├── supabase.ts   # Supabase client
│   │   ├── logger.ts     # Logging service
│   │   ├── chatService.ts
│   │   └── newsApi.ts
│   ├── store/            # Redux store and slices
│   └── types/            # TypeScript type definitions
├── assets/               # Images, fonts, etc.
└── hooks/                # Custom React hooks
```

## Features

- 📱 **Mobile-First Design** - Built with React Native and Expo
- 🔐 **Authentication** - Secure user authentication with Supabase
- 📊 **Disease Tracking** - Real-time disease surveillance data
- 📰 **News Integration** - Health news from multiple sources
- 💬 **Chat System** - Zone-based messaging for health workers
- 🎨 **Modern UI** - Beautiful interface with Lucide icons
- 🌍 **Multi-State Support** - Lagos, Kano, Kaduna coverage

## Database Setup

The app requires a Supabase database with the following tables:
- `profiles` - User profiles
- `reports` - Health facility reports
- `diseases` - Disease tracking data
- `messages` - Chat messages
- `news` - News articles

See `database_schema.sql` for the complete schema.

## Environment Variables

### Required
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Optional
- `EXPO_PUBLIC_WHATSAPP_LAGOS` - WhatsApp group link for Lagos
- `EXPO_PUBLIC_WHATSAPP_KANO` - WhatsApp group link for Kano
- `EXPO_PUBLIC_WHATSAPP_KADUNA` - WhatsApp group link for Kaduna

## Building for Production

### Android
```bash
# Build APK
eas build --platform android --profile production

# Or build locally
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

### iOS
```bash
# Build for App Store
eas build --platform ios --profile production
```

### Web
```bash
npm run build:web
```

## Troubleshooting

### App crashes on startup
- Ensure `.env` file exists with valid Supabase credentials
- Run `npm install` to ensure all dependencies are installed
- Clear Expo cache: `npx expo start -c`

### Session not persisting
- Check that AsyncStorage is properly installed
- Verify Supabase configuration in `src/services/supabase.ts`

### Type errors
- Run `npm run typecheck` to see all TypeScript errors
- Ensure you're using the correct types from `src/types/`

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run typecheck` and `npm run lint`
4. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions, please contact [your-email@example.com]
