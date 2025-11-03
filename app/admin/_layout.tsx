import React from 'react';
import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function AdminLayout() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }

    if (user?.role !== 'admin') {
      router.replace('/(tabs)');
      return;
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="feedback" />
      <Stack.Screen name="users" />
      <Stack.Screen name="analytics" />
    </Stack>
  );
}