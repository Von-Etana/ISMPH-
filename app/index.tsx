import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';

export default function Index() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return <Redirect href={isAuthenticated ? '/(tabs)' : '/auth'} />;
}
