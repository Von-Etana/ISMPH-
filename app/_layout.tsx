import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { LogBox, Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { store } from '@/src/store';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';

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
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
          <Toast />
        </Provider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
