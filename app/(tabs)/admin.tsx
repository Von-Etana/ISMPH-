import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store';
import { fetchUsers, updateUserRole } from '@/src/store/slices/adminSlice';
import { Profile, UserRole } from '@/src/types';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { Users as UsersIcon, UserCheck, UserX, Shield } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function AdminTabScreen() {
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
                    onPress: async () => {
                        try {
                            const role = newRole as UserRole;
                            await dispatch(updateUserRole({ userId, role })).unwrap();
                            Toast.show({
                                type: 'success',
                                text1: 'Role Updated',
                                text2: `${userName} is now ${newRole}`,
                            });
                        } catch (err) {
                            Toast.show({
                                type: 'error',
                                text1: 'Update Failed',
                                text2: 'Could not update user role',
                            });
                        }
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
        // Super admins can manage all users except themselves
        return currentUser?.role === 'super_admin' && targetUser.id !== currentUser.id;
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'super_admin': return COLORS.error;
            case 'state_admin': return COLORS.warning;
            case 'staff': return COLORS.info;
            default: return COLORS.textSecondary;
        }
    };

    const getRoleBadgeStyle = (role: string) => ({
        backgroundColor: getRoleColor(role),
    });

    // Count stats
    const totalUsers = users.length;
    const staffCount = users.filter(u => u.role === 'staff').length;
    const publicCount = users.filter(u => u.role === 'public').length;

    // Filter users based on admin's state (state_admin only sees their state)
    const filteredUsers = currentUser?.role === 'state_admin'
        ? users.filter(u => u.state === currentUser.state)
        : users;

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                {/* Stats */}
                <View style={styles.statsContainer}>
                    <Card style={styles.statCard} variant="elevated">
                        <UsersIcon size={24} color={COLORS.primary} />
                        <Text style={styles.statValue}>{filteredUsers.length}</Text>
                        <Text style={styles.statLabel}>Total Users</Text>
                    </Card>
                    <Card style={styles.statCard} variant="elevated">
                        <UserCheck size={24} color={COLORS.success} />
                        <Text style={styles.statValue}>{staffCount}</Text>
                        <Text style={styles.statLabel}>Staff</Text>
                    </Card>
                    <Card style={styles.statCard} variant="elevated">
                        <UserX size={24} color={COLORS.textSecondary} />
                        <Text style={styles.statValue}>{publicCount}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </Card>
                </View>

                {/* Info Banner */}
                <Card style={styles.infoBanner} variant="outlined">
                    <Shield size={20} color={COLORS.primary} />
                    <Text style={styles.infoText}>
                        Approve users by changing their role from "Public" to "Staff" to grant access to chat features.
                    </Text>
                </Card>

                {/* Loading State */}
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>Loading users...</Text>
                    </View>
                )}

                {/* Error State */}
                {error && (
                    <Card style={styles.errorCard} variant="outlined">
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => dispatch(fetchUsers())}>
                            <Text style={styles.retryText}>Tap to retry</Text>
                        </TouchableOpacity>
                    </Card>
                )}

                {/* User List */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>User Accounts</Text>

                    {filteredUsers.length === 0 && !loading && (
                        <Card style={styles.emptyCard} variant="outlined">
                            <Text style={styles.emptyText}>No users found</Text>
                        </Card>
                    )}

                    {filteredUsers.map((user) => (
                        <Card key={user.id} style={styles.userCard} variant="outlined">
                            <View style={styles.userHeader}>
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{user.full_name || 'Unknown User'}</Text>
                                    <Text style={styles.userEmail}>{user.email}</Text>
                                    {user.state && <Text style={styles.userState}>{user.state}</Text>}
                                </View>
                                <Badge
                                    label={user.role.toUpperCase()}
                                    variant="custom"
                                    style={getRoleBadgeStyle(user.role)}
                                />
                            </View>

                            {canManageUser(user) && (
                                <View style={styles.roleActions}>
                                    <Text style={styles.actionsLabel}>Change Role:</Text>
                                    <View style={styles.roleButtons}>
                                        <TouchableOpacity
                                            style={[
                                                styles.roleButton,
                                                user.role === 'public' && styles.roleButtonActive
                                            ]}
                                            onPress={() => handleRoleUpdate(user.id, 'public', user.full_name || 'User')}
                                        >
                                            <Text style={[
                                                styles.roleButtonText,
                                                user.role === 'public' && styles.roleButtonTextActive
                                            ]}>
                                                Public
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[
                                                styles.roleButton,
                                                styles.approveButton,
                                                user.role === 'staff' && styles.roleButtonActive
                                            ]}
                                            onPress={() => handleRoleUpdate(user.id, 'staff', user.full_name || 'User')}
                                        >
                                            <Text style={[
                                                styles.roleButtonText,
                                                user.role === 'staff' && styles.roleButtonTextActive
                                            ]}>
                                                Staff ✓
                                            </Text>
                                        </TouchableOpacity>
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
    content: { flex: 1, padding: SPACING.md },

    statsContainer: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
    statCard: { flex: 1, alignItems: 'center', padding: SPACING.md },
    statValue: { ...TYPOGRAPHY.h2, color: COLORS.text, marginTop: SPACING.xs },
    statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },

    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        marginBottom: SPACING.md,
        backgroundColor: COLORS.primary + '10',
        borderColor: COLORS.primary + '30',
    },
    infoText: {
        ...TYPOGRAPHY.body2,
        color: COLORS.text,
        marginLeft: SPACING.sm,
        flex: 1
    },

    loadingContainer: { alignItems: 'center', padding: SPACING.xl },
    loadingText: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginTop: SPACING.md },

    errorCard: { padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.md },
    errorText: { ...TYPOGRAPHY.body2, color: COLORS.error, marginBottom: SPACING.sm },
    retryText: { ...TYPOGRAPHY.body2, color: COLORS.primary, fontWeight: '600' },

    emptyCard: { padding: SPACING.xl, alignItems: 'center' },
    emptyText: { ...TYPOGRAPHY.body1, color: COLORS.textSecondary },

    section: { marginBottom: SPACING.lg },
    sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },

    userCard: { marginBottom: SPACING.md, padding: SPACING.md },
    userHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    userInfo: { flex: 1, marginRight: SPACING.md },
    userName: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
    userEmail: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.xs },
    userState: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },

    roleActions: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md, marginTop: SPACING.md },
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
    approveButton: {
        borderColor: COLORS.success + '50',
        backgroundColor: COLORS.success + '10',
    },
    roleButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    roleButtonText: { ...TYPOGRAPHY.body2, color: COLORS.text },
    roleButtonTextActive: { color: COLORS.white, fontWeight: '600' },
});
