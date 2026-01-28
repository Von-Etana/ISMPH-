import React, { useEffect, useState } from 'react';
import { Tabs, router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store';
import { signOut } from '@/src/store/slices/authSlice';
import { View, TouchableOpacity, Text, Modal, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Newspaper, FileText, MessageSquare, User, MessageCircle, Menu, Settings, LogOut, Bell, Globe, BarChart3, Shield } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import Toast from 'react-native-toast-message';

export default function TabLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, profile } = useSelector((state: RootState) => state.auth);
  const [showMenu, setShowMenu] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated]);

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Signed Out',
        text2: 'Successfully signed out',
      });
      router.replace('/auth');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to sign out',
      });
    }
  };

  const handleLanguageChange = () => {
    const languages = ['English', 'Igbo', 'Yoruba', 'Hausa'];
    const currentIndex = languages.indexOf('English');
    const nextIndex = (currentIndex + 1) % languages.length;
    const nextLanguage = languages[nextIndex];
    Toast.show({
      type: 'info',
      text1: 'Language Changed',
      text2: `Switched to ${nextLanguage}. Full app translation will be implemented soon.`,
    });
    setShowMenu(false);
  };

  const handleNotifications = () => {
    Toast.show({
      type: 'info',
      text1: 'Notifications',
      text2: 'Notification settings will be available soon.',
    });
    setShowMenu(false);
  };

  const handleSettings = () => {
    router.push('/settings');
    setShowMenu(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  // Calculate proper bottom padding for tab bar
  const tabBarBottomPadding = Math.max(insets.bottom, 8);

  return (
    <View style={styles.container}>
      {/* Global Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.headerTitle}>PHC State</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.menuButton}>
          <Menu size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: {
            height: 60 + tabBarBottomPadding,
            paddingBottom: tabBarBottomPadding,
            paddingTop: 8,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="news"
          options={{
            title: 'News',
            tabBarIcon: ({ size, color }) => <Newspaper size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: 'Reports',
            tabBarIcon: ({ size, color }) => <FileText size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="feedback"
          options={{
            title: 'Feedback',
            tabBarIcon: ({ size, color }) => <MessageSquare size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            tabBarIcon: ({ size, color }) => <MessageCircle size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ size, color }) => <BarChart3 size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            tabBarIcon: ({ size, color }) => <Shield size={size} color={color} />,
            // Only show for admin users
            href: (Platform.OS === 'ios' || !(profile?.role === 'state_admin' || profile?.role === 'super_admin')) ? null : '/(tabs)/admin',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>

      {/* Profile Menu Modal */}
      <Modal visible={showMenu} animationType="fade" transparent={true}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.menuModal}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setShowMenu(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              <User size={40} color={COLORS.primary} />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{profile?.full_name || profile?.email?.split('@')[0] || 'User'}</Text>
                <Text style={styles.userEmail}>{profile?.email}</Text>
                <View style={styles.userRole}>
                  <Text style={styles.roleText}>{profile?.role?.toUpperCase()}</Text>
                  {profile?.state && <Text style={styles.stateText}>{profile.state}</Text>}
                </View>
              </View>
            </View>

            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={handleNotifications}>
                <Bell size={24} color={COLORS.text} />
                <Text style={styles.menuItemText}>Notifications</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleLanguageChange}>
                <Globe size={24} color={COLORS.text} />
                <Text style={styles.menuItemText}>Language</Text>
                <Text style={styles.menuItemValue}>English</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
                <Settings size={24} color={COLORS.text} />
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <LogOut size={20} color={COLORS.error} />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl + 20,
    paddingBottom: SPACING.md,
  },
  headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.white },
  menuButton: { padding: SPACING.sm },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  menuModal: {
    backgroundColor: COLORS.white,
    marginTop: 80,
    marginHorizontal: SPACING.lg,
    borderRadius: 12,
    padding: SPACING.lg,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  menuTitle: { ...TYPOGRAPHY.h4, color: COLORS.text },
  closeButton: { ...TYPOGRAPHY.h2, color: COLORS.text, fontWeight: 'bold' },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  userDetails: { flex: 1, marginLeft: SPACING.md },
  userName: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text },
  userEmail: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  userRole: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xs },
  roleText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    fontWeight: '600',
  },
  stateText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    backgroundColor: COLORS.info,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    fontWeight: '600',
  },

  menuItems: { marginBottom: SPACING.lg },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
  },
  menuItemText: { ...TYPOGRAPHY.body1, color: COLORS.text, flex: 1, marginLeft: SPACING.md },
  menuItemValue: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary },

  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.error + '10',
    borderRadius: 8,
  },
  signOutText: { ...TYPOGRAPHY.body1, color: COLORS.error, marginLeft: SPACING.sm, fontWeight: '600' },
});
