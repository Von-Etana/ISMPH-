import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store';
import { fetchUsers, updateUserRole } from '@/src/store/slices/adminSlice';
import { Profile, UserRole } from '@/src/types';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { Button } from '@/src/components/Button';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { ArrowLeft, Users as UsersIcon, UserCheck, UserX } from 'lucide-react-native';
import { router } from 'expo-router';

export default function UsersManagementScreen() {
   const dispatch = useDispatch<AppDispatch>();
   const { users, loading, error } = useSelector((state: RootState) => state.admin);
   const { profile: currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleUpdate = (userId: string, newRole: string, userName: string) => {
    Alert.alert(
      'Update User Role',
      `Change ${userName}'s role to ${newRole}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: () => {
            const role = newRole as UserRole;
            dispatch(updateUserRole({ userId, role }));
          },
        },
      ]
    );
  };

  const canManageUser = (targetUser: Profile) => {
    // State admins can only manage users from their state
    if (currentUser?.role === 'state_admin') {
      return targetUser.state === currentUser.state && targetUser.id !== currentUser.id;
    }
    // Regular admins can manage all users except themselves
    return currentUser?.role === 'super_admin' && targetUser.id !== currentUser.id;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return COLORS.error;
      case 'state_admin': return COLORS.warning;
      case 'staff': return COLORS.info;
      default: return COLORS.success;
    }
  };

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
        <Text style={styles.headerTitle}>User Management</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <Card style={styles.statCard} variant="elevated">
            <UsersIcon size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <UserCheck size={24} color={COLORS.success} />
            <Text style={styles.statValue}>
              {users.filter(u => u.role === 'staff' || u.role === 'super_admin' || u.role === 'state_admin').length}
            </Text>
            <Text style={styles.statLabel}>Active Staff</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Accounts</Text>

          {users.map((user) => (
            <Card key={user.id} style={styles.userCard} variant="outlined">
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.full_name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  <Text style={styles.userState}>{user.state}</Text>
                </View>
                <Badge
                  label={user.role.toUpperCase()}
                  variant="custom"
                  style={{ backgroundColor: getRoleColor(user.role) }}
                />
              </View>

              {canManageUser(user) && (
                <View style={styles.roleActions}>
                  <Text style={styles.actionsLabel}>Change Role:</Text>
                  <View style={styles.roleButtons}>
                    {['public', 'staff'].map((role) => (
                      <TouchableOpacity
                        key={role}
                        style={[
                          styles.roleButton,
                          user.role === role && styles.roleButtonActive
                        ]}
                        onPress={() => handleRoleUpdate(user.id, role, user.full_name || '')}
                      >
                        <Text style={[
                          styles.roleButtonText,
                          user.role === role && styles.roleButtonTextActive
                        ]}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </Card>
          ))}
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
    alignItems: 'center',
    flexDirection: 'row',
  },
  backButton: {
    position: 'absolute',
    left: SPACING.lg,
    top: SPACING.xl + 20,
    zIndex: 1,
  },
  logo: { width: 40, height: 40, marginRight: SPACING.md },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white, flex: 1, textAlign: 'center' },
  content: { flex: 1, padding: SPACING.md },

  statsContainer: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg },
  statCard: { flex: 1, alignItems: 'center', padding: SPACING.md },
  statValue: { ...TYPOGRAPHY.h2, color: COLORS.text, marginTop: SPACING.xs },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },

  section: { marginBottom: SPACING.lg },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },

  userCard: { marginBottom: SPACING.md },
  userHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  userInfo: { flex: 1 },
  userName: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  userEmail: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  userState: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },

  roleActions: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md },
  actionsLabel: { ...TYPOGRAPHY.body2, color: COLORS.text, marginBottom: SPACING.sm, fontWeight: '600' },
  roleButtons: { flexDirection: 'row', gap: SPACING.sm },
  roleButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  roleButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  roleButtonText: { ...TYPOGRAPHY.body2, color: COLORS.text },
  roleButtonTextActive: { color: COLORS.white, fontWeight: '600' },
});
