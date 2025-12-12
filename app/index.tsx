import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';

export default function Index() {
  const { isAuthenticated, profile } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  // Redirect admin users to admin dashboard
  if (profile?.role === 'super_admin' || profile?.role === 'state_admin') {
    return <Redirect href="/admin" />;
  }

  return <Redirect href="/(tabs)" />;
}
