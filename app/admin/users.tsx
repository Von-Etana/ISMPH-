import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { Badge } from '@/src/components/Badge';
import { COLORS, SPACING, TYPOGRAPHY, STATES } from '@/src/constants/theme';
import { Users, UserCheck, UserX, Mail, Phone, MapPin, X } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

const ADMIN_USERS_DATA = [
  {
    id: '1',
    full_name: 'John Doe',
    email: 'john@example.com',
    role: 'public',
    state: 'Lagos',
    created_at: '2025-10-15T08:30:00',
    is_active: true,
    reports_count: 3,
    feedback_count: 2,
  },
  {
    id: '2',
    full_name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'staff',
    state: 'Abuja',
    created_at: '2025-10-12T14:20:00',
    is_active: true,
    reports_count: 5,
    feedback_count: 1,
  },
  {
    id: '3',
    full_name: 'Ahmed Musa',
    email: 'ahmed@example.com',
    role: 'public',
    state: 'Kano',
    created_at: '2025-10-20T11:15:00',
    is_active: false,
    reports_count: 2,
    feedback_count: 3,
  },
  {
    id: '4',
    full_name: 'Admin User',
    email: 'admin@ismph.org.ng',
    role: 'admin',
    state: 'Abuja',
    created_at: '2025-10-01T09:00:00',
    is_active: true,
    reports_count: 0,
    feedback_count: 0,
  },
];

export default function AdminUsersScreen() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterState, setFilterState] = useState<string>('all');

  const filteredUsers = ADMIN_USERS_DATA.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesState = filterState === 'all' || user.state === filterState;
    return matchesRole && matchesState;
  });

  const handleToggleUserStatus = (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    Toast.show({
      type: 'success',
      text1: `User ${action}d`,
      text2: `User account has been ${action}d successfully`,
    });
  };

  const handleSendMessage = (userEmail: string) => {
    Toast.show({
      type: 'success',
      text1: 'Message Sent',
      text2: 'Email has been sent to the user',
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return COLORS.error;
      case 'staff': return COLORS.warning;
      case 'public': return COLORS.info;
      default: return COLORS.textSecondary;
    }
  };

  const renderUserCard = (user: any) => (
    <TouchableOpacity
      key={user.id}
      onPress={() => {
        setSelectedUser(user);
        setShowUserModal(true);
      }}
    >
      <Card style={styles.userCard} variant="elevated">
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.full_name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <View style={styles.userStatus}>
            <Badge
              label={user.role.toUpperCase()}
              variant="custom"
              style={{ backgroundColor: getRoleColor(user.role) + '20', borderColor: getRoleColor(user.role) }}
            />
            {user.is_active ? (
              <UserCheck size={16} color={COLORS.success} />
            ) : (
              <UserX size={16} color={COLORS.error} />
            )}
          </View>
        </View>

        <View style={styles.userDetails}>
          <Text style={styles.userState}>📍 {user.state}</Text>
          <Text style={styles.userStats}>
            {user.reports_count} reports • {user.feedback_count} feedback
          </Text>
        </View>

        <View style={styles.userMeta}>
          <Text style={styles.userDate}>
            Joined: {new Date(user.created_at).toLocaleDateString()}
          </Text>
          <Text style={[styles.userStatusText, { color: user.is_active ? COLORS.success : COLORS.error }]}>
            {user.is_active ? 'Active' : 'Inactive'}
          </Text>
        </View>

        <View style={styles.userActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSendMessage(user.email)}
          >
            <Mail size={16} color={COLORS.primary} />
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, user.is_active ? styles.deactivateButton : styles.activateButton]}
            onPress={() => handleToggleUserStatus(user.id, user.is_active)}
          >
            {user.is_active ? (
              <>
                <UserX size={16} color={COLORS.error} />
                <Text style={[styles.actionText, styles.deactivateText]}>Deactivate</Text>
              </>
            ) : (
              <>
                <UserCheck size={16} color={COLORS.success} />
                <Text style={[styles.actionText, styles.activateText]}>Activate</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>Manage user accounts and permissions</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roleFilter}>
          {['all', 'admin', 'staff', 'public'].map((role) => (
            <TouchableOpacity
              key={role}
              style={[styles.filterChip, filterRole === role && styles.filterChipActive]}
              onPress={() => setFilterRole(role)}
            >
              <Text style={[styles.filterChipText, filterRole === role && styles.filterChipTextActive]}>
                {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stateFilter}>
          {['All', ...STATES].map((state) => (
            <TouchableOpacity
              key={state}
              style={[styles.filterChip, filterState === state.toLowerCase() && styles.filterChipActive]}
              onPress={() => setFilterState(state.toLowerCase())}
            >
              <Text style={[styles.filterChipText, filterState === state.toLowerCase() && styles.filterChipTextActive]}>
                {state}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard} variant="elevated">
            <Users size={24} color={COLORS.info} />
            <Text style={styles.statValue}>{ADMIN_USERS_DATA.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <UserCheck size={24} color={COLORS.success} />
            <Text style={styles.statValue}>{ADMIN_USERS_DATA.filter(u => u.is_active).length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <UserX size={24} color={COLORS.error} />
            <Text style={styles.statValue}>{ADMIN_USERS_DATA.filter(u => !u.is_active).length}</Text>
            <Text style={styles.statLabel}>Inactive</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Users ({filteredUsers.length})</Text>
          {filteredUsers.map(renderUserCard)}
        </View>
      </ScrollView>

      {/* User Detail Modal */}
      <Modal visible={showUserModal} animationType="slide" presentationStyle="pageSheet">
        {selectedUser && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>User Details</Text>
              <TouchableOpacity onPress={() => setShowUserModal(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.userDetailContainer}>
              <View style={styles.userProfile}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {selectedUser.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.detailName}>{selectedUser.full_name}</Text>
                <Text style={styles.detailEmail}>{selectedUser.email}</Text>
                <View style={styles.detailBadges}>
                  <Badge
                    label={selectedUser.role.toUpperCase()}
                    variant="custom"
                    style={{ backgroundColor: getRoleColor(selectedUser.role) + '20', borderColor: getRoleColor(selectedUser.role) }}
                  />
                  <Badge
                    label={selectedUser.is_active ? 'ACTIVE' : 'INACTIVE'}
                    variant={selectedUser.is_active ? 'low' : 'high'}
                  />
                </View>
              </View>

              <Card style={styles.detailCard} variant="outlined">
                <Text style={styles.detailTitle}>Account Information</Text>
                <View style={styles.detailRow}>
                  <MapPin size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>State: {selectedUser.state}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Joined:</Text>
                  <Text style={styles.detailText}>
                    {new Date(selectedUser.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={[styles.detailText, { color: selectedUser.is_active ? COLORS.success : COLORS.error }]}>
                    {selectedUser.is_active ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </Card>

              <Card style={styles.detailCard} variant="outlined">
                <Text style={styles.detailTitle}>Activity Summary</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Reports Submitted:</Text>
                  <Text style={styles.detailText}>{selectedUser.reports_count}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Feedback Given:</Text>
                  <Text style={styles.detailText}>{selectedUser.feedback_count}</Text>
                </View>
              </Card>

              <View style={styles.detailActions}>
                <Button
                  title="Send Message"
                  onPress={() => {
                    handleSendMessage(selectedUser.email);
                    setShowUserModal(false);
                  }}
                  variant="outline"
                  style={{ flex: 1, marginRight: SPACING.sm }}
                />
                <Button
                  title={selectedUser.is_active ? "Deactivate User" : "Activate User"}
                  onPress={() => {
                    handleToggleUserStatus(selectedUser.id, selectedUser.is_active);
                    setShowUserModal(false);
                  }}
                  variant={selectedUser.is_active ? "secondary" : "primary"}
                  style={{ flex: 1 }}
                />
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: SPACING.lg, paddingTop: SPACING.xl + 20 },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white },
  headerSubtitle: { ...TYPOGRAPHY.body2, color: COLORS.white, opacity: 0.9, marginTop: SPACING.xs },

  filterContainer: { backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  roleFilter: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  stateFilter: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  filterChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: SPACING.sm },
  filterChipActive: { backgroundColor: COLORS.primary },
  filterChipText: { ...TYPOGRAPHY.body2, color: COLORS.text },
  filterChipTextActive: { color: COLORS.white, fontWeight: '600' },

  content: { flex: 1 },
  statsRow: { flexDirection: 'row', padding: SPACING.md, gap: SPACING.sm },
  statCard: { flex: 1, alignItems: 'center', padding: SPACING.md },
  statValue: { ...TYPOGRAPHY.h2, color: COLORS.text, marginTop: SPACING.xs },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },

  section: { padding: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },

  userCard: { marginBottom: SPACING.md },
  userHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.sm },
  userInfo: { flex: 1 },
  userName: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  userEmail: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary },
  userStatus: { alignItems: 'flex-end', gap: SPACING.sm },
  userDetails: { marginBottom: SPACING.sm },
  userState: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  userStats: { ...TYPOGRAPHY.caption, color: COLORS.primary },
  userMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  userDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  userStatusText: { ...TYPOGRAPHY.caption, fontWeight: '600' },

  userActions: { flexDirection: 'row', gap: SPACING.sm },
  actionButton: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm, borderRadius: 6, backgroundColor: COLORS.surface, gap: SPACING.xs },
  actionText: { ...TYPOGRAPHY.caption, color: COLORS.text, fontWeight: '600' },
  deactivateButton: { backgroundColor: COLORS.error + '20' },
  deactivateText: { color: COLORS.error },
  activateButton: { backgroundColor: COLORS.success + '20' },
  activateText: { color: COLORS.success },

  modalContainer: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingTop: SPACING.xl + 20 },
  modalTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },

  userDetailContainer: { flex: 1, padding: SPACING.lg },
  userProfile: { alignItems: 'center', marginBottom: SPACING.lg },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  avatarText: { ...TYPOGRAPHY.h2, color: COLORS.white, fontWeight: '700' },
  detailName: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.xs },
  detailEmail: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  detailBadges: { flexDirection: 'row', gap: SPACING.sm },

  detailCard: { marginBottom: SPACING.md },
  detailTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', marginBottom: SPACING.sm },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  detailLabel: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginRight: SPACING.sm },
  detailText: { ...TYPOGRAPHY.body2, color: COLORS.text },

  detailActions: { flexDirection: 'row', marginTop: SPACING.lg },
});