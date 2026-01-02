import { useEffect } from 'react';
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

// Auth listener component
function AuthListener({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth Event]', event);

        if (event === 'SIGNED_OUT') {
          // Clear user from Redux
          dispatch(setUser(null));

          // Navigate to auth screen if not already there
          const inAuthGroup = segments[0] === 'auth';
          if (!inAuthGroup) {
            router.replace('/auth');
          }
        } else if (event === 'SIGNED_IN' && session) {
          // Fetch and update profile
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              dispatch(setUser(profile));
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('[Auth] Token refreshed successfully');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, router, segments]);

  // Handle navigation protection
  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to auth if not authenticated
      router.replace('/auth');
    }
  }, [isAuthenticated, segments, router]);

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
