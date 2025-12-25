import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { RootState, AppDispatch } from '@/src/store';
import { signOut } from '@/src/store/slices/authSlice';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { User, Settings, LogOut, Bell, Globe, Camera } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: RootState) => state.auth);
  const [profileImage, setProfileImage] = useState<string | null>(null);

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

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera roll permissions are needed to select a profile picture.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
      Toast.show({
        type: 'success',
        text1: 'Profile Picture Updated',
        text2: 'Your profile picture has been changed',
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Image
            source={require('@/assets/images/WhatsApp Image 2025-11-08 at 09.39.48_7cb724fe.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.profileCard} variant="elevated">
          <View style={styles.avatarContainer}>
            <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatar} />
              ) : (
                <View style={styles.avatar}>
                  <User size={48} color={COLORS.white} />
                </View>
              )}
              <View style={styles.cameraButton}>
                <Camera size={16} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{profile?.full_name || profile?.email?.split('@')[0] || 'User'}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
          <View style={styles.roleContainer}>
            <Text style={styles.role}>{profile?.role?.toUpperCase()}</Text>
            {profile?.state && <Text style={styles.state}>{profile.state}</Text>}
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <Card style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              Toast.show({
                type: 'info',
                text1: 'Notifications',
                text2: 'Notification settings will be available soon.',
              });
            }}>
              <View style={styles.menuLeft}>
                <Bell size={24} color={COLORS.text} />
                <Text style={styles.menuText}>Notifications</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={() => {
              // Cycle through languages: English -> Igbo -> Yoruba -> Hausa -> English
              const languages = ['English', 'Igbo', 'Yoruba', 'Hausa'];
              const currentIndex = languages.indexOf('English'); // Default to English for now
              const nextIndex = (currentIndex + 1) % languages.length;
              const nextLanguage = languages[nextIndex];
              Toast.show({
                type: 'info',
                text1: 'Language Changed',
                text2: `Switched to ${nextLanguage}. Full app translation will be implemented soon.`,
              });
            }}>
              <View style={styles.menuLeft}>
                <Globe size={24} color={COLORS.text} />
                <Text style={styles.menuText}>Language</Text>
              </View>
              <Text style={styles.menuValue}>English</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings')}>
              <View style={styles.menuLeft}>
                <Settings size={24} color={COLORS.text} />
                <Text style={styles.menuText}>Settings</Text>
              </View>
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <Button title="Sign Out" onPress={handleSignOut} variant="secondary" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 20,
    alignItems: 'center',
  },
  logo: { width: 60, height: 60, marginBottom: SPACING.sm },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.white,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  profileCard: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  name: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  email: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  role: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    fontWeight: '600',
  },
  state: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    backgroundColor: COLORS.info,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    fontWeight: '600',
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  menuCard: {
    padding: 0,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.text,
  },
  menuValue: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
});
