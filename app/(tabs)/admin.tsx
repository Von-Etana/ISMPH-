import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store';
import { fetchUsers, updateUserRole } from '@/src/store/slices/adminSlice';
import { Profile, UserRole } from '@/src/types';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import {
    Users as UsersIcon,
    UserCheck,
    UserX,
    Shield,
    FileText,
    MessageSquare,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '@/src/services/supabase';

type AdminTab = 'users' | 'reports' | 'feedback';

interface Report {
    id: string;
    title: string;
    category: string;
    description: string;
    state: string;
    status: string;
    priority: string;
    reporter_name?: string;
    created_at: string;
}

interface Feedback {
    id: string;
    facility_name: string;
    category: string;
    description: string;
    status: string;
    priority: string;
    state: string;
    created_at: string;
}

export default function AdminTabScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const { users, loading: usersLoading } = useSelector((state: RootState) => state.admin);
    const { profile: currentUser } = useSelector((state: RootState) => state.auth);

    const [activeTab, setActiveTab] = useState<AdminTab>('users');
    const [reports, setReports] = useState<Report[]>([]);
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        dispatch(fetchUsers());
        loadReports();
        loadFeedback();
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const loadReports = async () => {
        setReportsLoading(true);
        try {
            let query = supabase.from('reports').select('*').order('created_at', { ascending: false });

            // State admins only see reports from their state
            if (currentUser?.role === 'state_admin' && currentUser?.state) {
                query = query.eq('state', currentUser.state);
            }

            const { data, error } = await query;
            if (error) throw error;
            setReports(data || []);
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setReportsLoading(false);
        }
    };

    const loadFeedback = async () => {
        setFeedbackLoading(true);
        try {
            let query = supabase.from('feedback').select('*').order('created_at', { ascending: false });

            // State admins only see feedback from their state
            if (currentUser?.role === 'state_admin' && currentUser?.state) {
                query = query.eq('state', currentUser.state);
            }

            const { data, error } = await query;
            if (error) throw error;
            setFeedback(data || []);
        } catch (error) {
            console.error('Error loading feedback:', error);
        } finally {
            setFeedbackLoading(false);
        }
    };

    // User Management Functions
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

    // Report Management Functions
    const handleReportStatus = async (reportId: string, newStatus: string, title: string) => {
        Alert.alert(
            'Update Report Status',
            `Mark "${title}" as ${newStatus}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Update',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('reports')
                                .update({ status: newStatus, updated_at: new Date().toISOString() })
                                .eq('id', reportId);

                            if (error) throw error;

                            Toast.show({
                                type: 'success',
                                text1: 'Report Updated',
                                text2: `Report marked as ${newStatus}`,
                            });
                            loadReports();
                        } catch (err) {
                            Toast.show({
                                type: 'error',
                                text1: 'Update Failed',
                                text2: 'Could not update report status',
                            });
                        }
                    },
                },
            ]
        );
    };

    // Feedback Management Functions
    const handleFeedbackStatus = async (feedbackId: string, newStatus: string, facilityName: string) => {
        Alert.alert(
            'Update Feedback Status',
            `Mark feedback for "${facilityName}" as ${newStatus}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Update',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('feedback')
                                .update({ status: newStatus, updated_at: new Date().toISOString() })
                                .eq('id', feedbackId);

                            if (error) throw error;

                            Toast.show({
                                type: 'success',
                                text1: 'Feedback Updated',
                                text2: `Feedback marked as ${newStatus}`,
                            });
                            loadFeedback();
                        } catch (err) {
                            Toast.show({
                                type: 'error',
                                text1: 'Update Failed',
                                text2: 'Could not update feedback status',
                            });
                        }
                    },
                },
            ]
        );
    };

    const canManageUser = (targetUser: Profile) => {
        if (currentUser?.role === 'state_admin') {
            return targetUser.state === currentUser.state && targetUser.id !== currentUser.id;
        }
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
            case 'resolved': return COLORS.success;
            case 'pending': return COLORS.warning;
            case 'rejected':
            case 'critical': return COLORS.error;
            default: return COLORS.textSecondary;
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'critical': return <AlertTriangle size={16} color={COLORS.error} />;
            case 'high': return <AlertTriangle size={16} color={COLORS.warning} />;
            default: return null;
        }
    };

    // Stats calculations
    const filteredUsers = currentUser?.role === 'state_admin'
        ? users.filter(u => u.state === currentUser.state)
        : users;
    const staffCount = filteredUsers.filter(u => u.role === 'staff').length;
    const pendingReports = reports.filter(r => r.status === 'pending').length;
    const pendingFeedback = feedback.filter(f => f.status === 'pending').length;

    const renderTabButton = (tab: AdminTab, label: string, icon: React.ReactNode, count?: number) => (
        <TouchableOpacity
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab)}
        >
            {icon}
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{label}</Text>
            {count !== undefined && count > 0 && (
                <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{count}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    const renderUsersTab = () => (
        <View>
            {/* Stats */}
            <View style={styles.statsRow}>
                <Card style={styles.statCard} variant="elevated">
                    <UsersIcon size={20} color={COLORS.primary} />
                    <Text style={styles.statValue}>{filteredUsers.length}</Text>
                    <Text style={styles.statLabel}>Users</Text>
                </Card>
                <Card style={styles.statCard} variant="elevated">
                    <UserCheck size={20} color={COLORS.success} />
                    <Text style={styles.statValue}>{staffCount}</Text>
                    <Text style={styles.statLabel}>Staff</Text>
                </Card>
            </View>

            {/* Info */}
            <Card style={styles.infoBanner} variant="outlined">
                <Shield size={18} color={COLORS.primary} />
                <Text style={styles.infoText}>
                    Approve users by changing role from "Public" to "Staff"
                </Text>
            </Card>

            {/* User List */}
            {usersLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
            ) : (
                filteredUsers.map((user) => (
                    <Card key={user.id} style={styles.itemCard} variant="outlined">
                        <View style={styles.itemHeader}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemTitle}>{user.full_name || 'Unknown'}</Text>
                                <Text style={styles.itemSubtitle}>{user.email}</Text>
                                {user.state && <Text style={styles.itemMeta}>{user.state}</Text>}
                            </View>
                            <Badge
                                label={user.role.toUpperCase()}
                                variant="custom"
                                style={{ backgroundColor: getRoleColor(user.role) }}
                            />
                        </View>

                        {canManageUser(user) && (
                            <View style={styles.actionRow}>
                                <TouchableOpacity
                                    style={[styles.actionBtn, user.role === 'public' && styles.actionBtnActive]}
                                    onPress={() => handleRoleUpdate(user.id, 'public', user.full_name || 'User')}
                                >
                                    <Text style={[styles.actionBtnText, user.role === 'public' && styles.actionBtnTextActive]}>
                                        Public
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.approveBtn, user.role === 'staff' && styles.actionBtnActive]}
                                    onPress={() => handleRoleUpdate(user.id, 'staff', user.full_name || 'User')}
                                >
                                    <Text style={[styles.actionBtnText, user.role === 'staff' && styles.actionBtnTextActive]}>
                                        Staff ✓
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Card>
                ))
            )}
        </View>
    );

    const renderReportsTab = () => (
        <View>
            {/* Stats */}
            <View style={styles.statsRow}>
                <Card style={styles.statCard} variant="elevated">
                    <FileText size={20} color={COLORS.primary} />
                    <Text style={styles.statValue}>{reports.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </Card>
                <Card style={styles.statCard} variant="elevated">
                    <Clock size={20} color={COLORS.warning} />
                    <Text style={styles.statValue}>{pendingReports}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </Card>
            </View>

            {/* Report List */}
            {reportsLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
            ) : reports.length === 0 ? (
                <Card style={styles.emptyCard} variant="outlined">
                    <Text style={styles.emptyText}>No reports found</Text>
                </Card>
            ) : (
                reports.map((report) => (
                    <Card key={report.id} style={styles.itemCard} variant="outlined">
                        <View style={styles.itemHeader}>
                            <View style={styles.itemInfo}>
                                <View style={styles.titleRow}>
                                    {getPriorityIcon(report.priority)}
                                    <Text style={styles.itemTitle}>{report.title}</Text>
                                </View>
                                <Text style={styles.itemSubtitle}>{report.category} • {report.state}</Text>
                                <Text style={styles.itemMeta} numberOfLines={2}>{report.description}</Text>
                            </View>
                            <Badge
                                label={report.status.toUpperCase()}
                                variant="custom"
                                style={{ backgroundColor: getStatusColor(report.status) }}
                            />
                        </View>

                        {report.status === 'pending' && (
                            <View style={styles.actionRow}>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.approveBtn]}
                                    onPress={() => handleReportStatus(report.id, 'approved', report.title)}
                                >
                                    <CheckCircle size={16} color={COLORS.success} />
                                    <Text style={[styles.actionBtnText, { color: COLORS.success }]}>Approve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.rejectBtn]}
                                    onPress={() => handleReportStatus(report.id, 'rejected', report.title)}
                                >
                                    <XCircle size={16} color={COLORS.error} />
                                    <Text style={[styles.actionBtnText, { color: COLORS.error }]}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Card>
                ))
            )}
        </View>
    );

    const renderFeedbackTab = () => (
        <View>
            {/* Stats */}
            <View style={styles.statsRow}>
                <Card style={styles.statCard} variant="elevated">
                    <MessageSquare size={20} color={COLORS.primary} />
                    <Text style={styles.statValue}>{feedback.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </Card>
                <Card style={styles.statCard} variant="elevated">
                    <Clock size={20} color={COLORS.warning} />
                    <Text style={styles.statValue}>{pendingFeedback}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </Card>
            </View>

            {/* Feedback List */}
            {feedbackLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
            ) : feedback.length === 0 ? (
                <Card style={styles.emptyCard} variant="outlined">
                    <Text style={styles.emptyText}>No feedback found</Text>
                </Card>
            ) : (
                feedback.map((item) => (
                    <Card key={item.id} style={styles.itemCard} variant="outlined">
                        <View style={styles.itemHeader}>
                            <View style={styles.itemInfo}>
                                <View style={styles.titleRow}>
                                    {getPriorityIcon(item.priority)}
                                    <Text style={styles.itemTitle}>{item.facility_name}</Text>
                                </View>
                                <Text style={styles.itemSubtitle}>{item.category} • {item.state}</Text>
                                <Text style={styles.itemMeta} numberOfLines={2}>{item.description}</Text>
                            </View>
                            <Badge
                                label={item.status.toUpperCase()}
                                variant="custom"
                                style={{ backgroundColor: getStatusColor(item.status) }}
                            />
                        </View>

                        {item.status === 'pending' && (
                            <View style={styles.actionRow}>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.approveBtn]}
                                    onPress={() => handleFeedbackStatus(item.id, 'resolved', item.facility_name)}
                                >
                                    <CheckCircle size={16} color={COLORS.success} />
                                    <Text style={[styles.actionBtnText, { color: COLORS.success }]}>Resolve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionBtn, styles.rejectBtn]}
                                    onPress={() => handleFeedbackStatus(item.id, 'critical', item.facility_name)}
                                >
                                    <AlertTriangle size={16} color={COLORS.error} />
                                    <Text style={[styles.actionBtnText, { color: COLORS.error }]}>Critical</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Card>
                ))
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Tab Bar */}
            <View style={styles.tabBar}>
                {renderTabButton('users', 'Users', <UsersIcon size={18} color={activeTab === 'users' ? COLORS.primary : COLORS.textSecondary} />)}
                {renderTabButton('reports', 'Reports', <FileText size={18} color={activeTab === 'reports' ? COLORS.primary : COLORS.textSecondary} />, pendingReports)}
                {renderTabButton('feedback', 'Feedback', <MessageSquare size={18} color={activeTab === 'feedback' ? COLORS.primary : COLORS.textSecondary} />, pendingFeedback)}
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {activeTab === 'users' && renderUsersTab()}
                {activeTab === 'reports' && renderReportsTab()}
                {activeTab === 'feedback' && renderFeedbackTab()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },

    tabBar: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingHorizontal: SPACING.sm,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.md,
        gap: SPACING.xs,
    },
    tabButtonActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
    tabLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
    tabLabelActive: { color: COLORS.primary, fontWeight: '600' },
    tabBadge: {
        backgroundColor: COLORS.error,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    tabBadgeText: { ...TYPOGRAPHY.caption, color: COLORS.white, fontSize: 10, fontWeight: '600' },

    content: { flex: 1, padding: SPACING.md },

    statsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
    statCard: { flex: 1, alignItems: 'center', padding: SPACING.md },
    statValue: { ...TYPOGRAPHY.h3, color: COLORS.text, marginTop: SPACING.xs },
    statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },

    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.sm,
        marginBottom: SPACING.md,
        backgroundColor: COLORS.primary + '10',
        borderColor: COLORS.primary + '30',
    },
    infoText: { ...TYPOGRAPHY.caption, color: COLORS.text, marginLeft: SPACING.sm, flex: 1 },

    emptyCard: { padding: SPACING.xl, alignItems: 'center' },
    emptyText: { ...TYPOGRAPHY.body1, color: COLORS.textSecondary },

    itemCard: { marginBottom: SPACING.sm, padding: SPACING.md },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    itemInfo: { flex: 1, marginRight: SPACING.md },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
    itemTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text },
    itemSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },
    itemMeta: { ...TYPOGRAPHY.caption, color: COLORS.primary, marginTop: SPACING.xs },

    actionRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
    },
    approveBtn: { borderColor: COLORS.success + '50', backgroundColor: COLORS.success + '10' },
    rejectBtn: { borderColor: COLORS.error + '50', backgroundColor: COLORS.error + '10' },
    actionBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    actionBtnText: { ...TYPOGRAPHY.caption, color: COLORS.text, fontWeight: '600' },
    actionBtnTextActive: { color: COLORS.white },
});
