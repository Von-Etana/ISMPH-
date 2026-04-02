import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { LogBox, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { store, AppDispatch, RootState } from '@/src/store';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { supabase } from '@/src/services/supabase';
import { setUser } from '@/src/store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Suppress specific warnings that can cause issues
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Require cycle:',
]);

// Global error handler to prevent crashes from unhandled errors
if (Platform.OS !== 'web') {
  // Handle unhandled promise rejections
  const originalHandler = (global as unknown as { ErrorUtils?: { setGlobalHandler: (handler: (error: Error, isFatal?: boolean) => void) => void } }).ErrorUtils?.setGlobalHandler;

  if (originalHandler) {
    (global as unknown as { ErrorUtils: { setGlobalHandler: (handler: (error: Error, isFatal?: boolean) => void) => void } }).ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
      console.error('[GlobalErrorHandler]', isFatal ? 'Fatal:' : 'Error:', error);
      // Don't re-throw to prevent crash
    });
  }
}

import { notificationService } from '@/src/services/notificationService';

// Auth listener component
function AuthListener({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, profile } = useSelector((state: RootState) => state.auth);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = React.useState<boolean | null>(null);

  // Wait for component to mount before allowing navigation
  useEffect(() => {
    // Small delay to ensure Root Layout is fully mounted
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Check onboarding status
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem('@has_seen_onboarding');
        setIsFirstLaunch(value === null);
      } catch (error) {
        setIsFirstLaunch(false); // In case of error, skip onboarding to prevent blocking
      }
    };
    checkOnboarding();
  }, []);

  // Handle push notification registration
  useEffect(() => {
    if (isAuthenticated && profile?.id && isMounted) {
      const registerPush = async () => {
        try {
          const token = await notificationService.registerForPushNotificationsAsync();
          if (token) {
            await notificationService.savePushToken(profile.id, token);
          }
        } catch (error) {
          console.error('[PushRegistration] Error:', error);
        }
      };
      registerPush();
    }
  }, [isAuthenticated, profile?.id, isMounted]);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth Event]', event);

        if (event === 'SIGNED_OUT') {
          // Clear user from Redux
          dispatch(setUser(null));

          // Navigate to auth screen if not already there (only if mounted)
          const inAuthGroup = segments[0] === 'auth';
          const inOnboardingGroup = segments[0] === 'onboarding';
          if (!inAuthGroup && !inOnboardingGroup && isMounted) {
            setTimeout(() => router.replace('/auth'), 100);
          }
        } else if (event === 'SIGNED_IN' && session) {
          // Fetch and update profile
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileData) {
              dispatch(setUser(profileData));
            }
          } catch (error) {
            console.error('Error fetching profileData:', error);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('[Auth] Token refreshed successfully');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, router, segments, isMounted]);

  // Handle navigation protection - only after mounted
  useEffect(() => {
    if (!isMounted || isFirstLaunch === null) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';

    // Prioritize onboarding if it's the first launch
    if (isFirstLaunch && !inOnboardingGroup) {
      setTimeout(() => router.replace('/onboarding'), 100);
      return;
    }

    // Only force auth if completely unauthenticated and not already in auth or onboarding
    if (!isFirstLaunch && !isAuthenticated && !inAuthGroup && !inOnboardingGroup) {
      setTimeout(() => router.replace('/auth'), 100);
    }
  }, [isAuthenticated, segments, router, isMounted, isFirstLaunch]);

  return <>{children}</>;
}

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.warn('[UnhandledPromiseRejection]', event.reason);
      event.preventDefault();
    };

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('unhandledrejection', handleUnhandledRejection);
      return () => {
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <Provider store={store}>
          <AuthListener>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="admin" />
              <Stack.Screen name="reports" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
            <Toast />
          </AuthListener>
        </Provider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
