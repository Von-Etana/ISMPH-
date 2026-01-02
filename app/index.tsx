import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store';
import { restoreSession } from '@/src/store/slices/authSlice';
import { COLORS } from '@/src/constants/theme';

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, profile, initialized, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Attempt to restore session on app start
    if (!initialized) {
      dispatch(restoreSession());
    }
  }, [initialized, dispatch]);

  // Show loading spinner while checking session
  if (!initialized || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Not authenticated - redirect to auth screen
  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  // Redirect admin users to admin dashboard
  if (profile?.role === 'super_admin' || profile?.role === 'state_admin') {
    return <Redirect href="/admin" />;
  }

  // Redirect regular users to main app
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
