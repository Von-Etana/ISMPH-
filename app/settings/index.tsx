import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { RootState, AppDispatch } from '@/src/store';
import { signOut } from '@/src/store/slices/authSlice';
import { Card } from '@/src/components/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { ArrowLeft, User, Globe, HelpCircle, LogOut } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function SettingsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: RootState) => state.auth);

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

  const settingsOptions = [
    {
      id: 'profile',
      title: 'Profile Settings',
      subtitle: 'Update your personal information',
      icon: User,
      action: () => router.push('/(tabs)/profile'),
    },
    {
      id: 'language',
      title: 'Language',
      subtitle: 'Change app language',
      icon: Globe,
      action: () => {
        Toast.show({
          type: 'info',
          text1: 'Coming Soon',
          text2: 'Language settings will be available soon',
        });
      },
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: HelpCircle,
      action: () => {
        Toast.show({
          type: 'info',
          text1: 'Coming Soon',
          text2: 'Help & Support will be available soon',
        });
      },
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Image
          source={require('@/assets/images/WhatsApp Image 2025-11-08 at 09.39.48_7cb724fe.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card style={styles.userCard} variant="elevated">
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <User size={32} color={COLORS.white} />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{profile?.full_name || profile?.email?.split('@')[0] || 'User'}</Text>
                <Text style={styles.userEmail}>{profile?.email}</Text>
                <Text style={styles.userRole}>{profile?.role?.toUpperCase()}</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {settingsOptions.map((option) => (
            <Card key={option.id} style={styles.optionCard} variant="outlined">
              <TouchableOpacity style={styles.optionButton} onPress={option.action}>
                <View style={styles.optionLeft}>
                  <View style={[styles.optionIcon, { backgroundColor: COLORS.primary + '20' }]}>
                    <option.icon size={20} color={COLORS.primary} />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color={COLORS.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 40, height: 40 },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white, flex: 1, textAlign: 'center' },
  content: { flex: 1, padding: SPACING.md },
  section: { marginBottom: SPACING.xl },
  sectionTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.md },
  userCard: { padding: SPACING.lg },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  userDetails: { flex: 1 },
  userName: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.xs },
  userEmail: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  userRole: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
    fontWeight: '600',
  },
  optionCard: { marginBottom: SPACING.sm },
  optionButton: { padding: SPACING.md },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  optionText: { flex: 1 },
  optionTitle: { ...TYPOGRAPHY.body1, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.xs },
  optionSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.error + '10',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error + '20',
  },
  signOutText: { ...TYPOGRAPHY.body1, color: COLORS.error, fontWeight: '600', marginLeft: SPACING.sm },
});