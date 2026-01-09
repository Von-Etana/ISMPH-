import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store';
import { restoreSession } from '@/src/store/slices/authSlice';
import { COLORS } from '@/src/constants/theme';

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, profile, initialized, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const [isMounted, setIsMounted] = useState(false);

  // Wait for component to mount before navigating
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Attempt to restore session on app start
    if (!initialized) {
      dispatch(restoreSession());
    }
  }, [initialized, dispatch]);

  // Handle navigation after mount and initialization
  useEffect(() => {
    if (!isMounted || !initialized || loading) return;

    // Use setTimeout to ensure navigation happens after render
    const navigateTimer = setTimeout(() => {
      if (!isAuthenticated) {
        router.replace('/auth');
      } else if (profile?.role === 'super_admin' || profile?.role === 'state_admin') {
        router.replace('/admin');
      } else {
        router.replace('/(tabs)');
      }
    }, 100);

    return () => clearTimeout(navigateTimer);
  }, [isMounted, initialized, loading, isAuthenticated, profile, router]);

  // Show loading spinner while checking session or waiting for mount
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
