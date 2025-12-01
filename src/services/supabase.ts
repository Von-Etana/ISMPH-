import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Throw error instead of silent warning - fail fast in development
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase credentials are required. Please check your .env file and ensure ' +
    'EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Enable session persistence
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
