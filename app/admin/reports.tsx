import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { FormInput } from '@/src/components/FormInput';
import { Badge } from '@/src/components/Badge';
import { COLORS, SPACING, TYPOGRAPHY, STATES } from '@/src/constants/theme';
import { FileText, Clock, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store';
import { fetchAllReports, updateReportStatus } from '@/src/store/slices/reportsSlice';
import { Report } from '@/src/types';

export default function AdminReportsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { allReports, loading } = useSelector((state: RootState) => state.reports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  React.useEffect(() => {
    dispatch(fetchAllReports());
  }, [dispatch]);

  const filteredReports = allReports.filter(report => {
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSearch = 
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.reporter_name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const reportDate = new Date(report.created_at).getTime();
    const matchesStartDate = !startDate || reportDate >= new Date(startDate).getTime();
    const matchesEndDate = !endDate || reportDate <= new Date(endDate).getTime() + 86400000; // End of day

    return matchesStatus && matchesSearch && matchesStartDate && matchesEndDate;
  });

  const handleApproveReport = async (reportId: string) => {
    Alert.alert(
      'Approve Report',
      'Are you sure you want to approve this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              await dispatch(updateReportStatus({ reportId, status: 'approved' })).unwrap();
              Toast.show({
                type: 'success',
                text1: 'Report Approved',
                text2: 'The report has been approved and published',
              });
            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Approval Failed',
                text2: error || 'Please try again',
              });
            }
          }
        }
      ]
    );
  };

  const handleRejectReport = async (reportId: string) => {
    Alert.alert(
      'Reject Report',
      'Are you sure you want to reject this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(updateReportStatus({ reportId, status: 'rejected' })).unwrap();
              Toast.show({
                type: 'error',
                text1: 'Report Rejected',
                text2: 'The report has been rejected',
              });
            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Rejection Failed',
                text2: error || 'Please try again',
              });
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return COLORS.success;
      case 'pending': return COLORS.warning;
      case 'rejected': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const renderReportCard = (report: Report) => (
    <Card key={report.id} style={styles.reportCard} variant="elevated">
      <View style={styles.reportHeader}>
        <View style={styles.reportHeaderLeft}>
          <Badge label={report.status.toUpperCase()} variant={report.status} type="status" />
          <Badge label={report.priority.toUpperCase()} variant={report.priority} type="priority" style={{ marginLeft: SPACING.xs }} />
        </View>
        <Text style={styles.reportDate}>{new Date(report.created_at).toLocaleDateString()}</Text>
      </View>

      <Text style={styles.reportTitle}>{report.title}</Text>
      <Text style={styles.reportCategory}>{report.category} • {report.state}</Text>
      <Text style={styles.reportDescription} numberOfLines={2}>{report.description}</Text>

      <View style={styles.reportMeta}>
        <Text style={styles.reporterName}>State: {report.state}</Text>
        {report.media_urls && report.media_urls.length > 0 && (
          <View style={styles.mediaBadge}>
            <FileText size={14} color={COLORS.primary} />
            <Text style={styles.mediaText}>{report.media_urls.length} media</Text>
          </View>
        )}
      </View>

      <View style={styles.reportActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            setSelectedReport(report);
            setShowDetailsModal(true);
          }}
        >
          <Eye size={16} color={COLORS.primary} />
          <Text style={styles.actionText}>View Details</Text>
        </TouchableOpacity>

        {report.status === 'pending' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApproveReport(report.id)}
            >
              <CheckCircle size={16} color={COLORS.success} />
              <Text style={[styles.actionText, styles.approveText]}>Approve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleRejectReport(report.id)}
            >
              <XCircle size={16} color={COLORS.error} />
              <Text style={[styles.actionText, styles.rejectText]}>Reject</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Report Management</Text>
        <Text style={styles.headerSubtitle}>Review and manage submitted reports</Text>
        
        <View style={styles.searchContainer}>
          <FormInput
            placeholder="Search by title or reporter..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle={styles.searchInput}
            leftIcon={<Eye size={20} color={COLORS.textSecondary} />}
          />
        </View>

        <View style={styles.dateFilterRow}>
          <View style={styles.dateInputWrapper}>
            <Text style={styles.dateLabel}>From:</Text>
            <FormInput
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
              containerStyle={styles.dateInput}
            />
          </View>
          <View style={styles.dateInputWrapper}>
            <Text style={styles.dateLabel}>To:</Text>
            <FormInput
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={setEndDate}
              containerStyle={styles.dateInput}
            />
          </View>
          {(startDate || endDate || searchQuery) && (
            <TouchableOpacity 
              style={styles.clearFilters} 
              onPress={() => {
                setStartDate('');
                setEndDate('');
                setSearchQuery('');
              }}
            >
              <XCircle size={20} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {['all', 'pending', 'approved', 'rejected'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterTab, filterStatus === status && styles.filterTabActive]}
            onPress={() => setFilterStatus(status)}
          >
            <Text style={[styles.filterTabText, filterStatus === status && styles.filterTabTextActive]}>
              {status === 'all' ? 'All Reports' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard} variant="elevated">
            <FileText size={24} color={COLORS.info} />
            <Text style={styles.statValue}>{allReports.length}</Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <Clock size={24} color={COLORS.warning} />
            <Text style={styles.statValue}>{allReports.filter(r => r.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <CheckCircle size={24} color={COLORS.success} />
            <Text style={styles.statValue}>{allReports.filter(r => r.status === 'approved').length}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reports ({filteredReports.length})</Text>
          {filteredReports.map(renderReportCard)}
        </View>
      </ScrollView>

      {/* Report Details Modal */}
      <Modal visible={showDetailsModal} animationType="slide" presentationStyle="pageSheet">
        {selectedReport && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Report Details</Text>
              <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                <XCircle size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.detailHeader}>
                <Badge label={selectedReport.status.toUpperCase()} variant={selectedReport.status} type="status" />
                <Badge label={selectedReport.priority.toUpperCase()} variant={selectedReport.priority} type="priority" />
              </View>

              <Text style={styles.detailTitle}>{selectedReport.title}</Text>
              <Text style={styles.detailCategory}>{selectedReport.category} • {selectedReport.state}</Text>

              <Card style={styles.descriptionCard} variant="outlined">
                <Text style={styles.descriptionLabel}>Description:</Text>
                <Text style={styles.descriptionText}>{selectedReport.description}</Text>
              </Card>

              <Card style={styles.contactCard} variant="outlined">
                <Text style={styles.contactTitle}>Reporter Information</Text>
                <Text style={styles.contactInfo}>Name: {selectedReport.reporter_name || 'N/A'}</Text>
                <Text style={styles.contactInfo}>Email: {selectedReport.reporter_email || 'N/A'}</Text>
                {selectedReport.reporter_phone && (
                  <Text style={styles.contactInfo}>Phone: {selectedReport.reporter_phone}</Text>
                )}
                {selectedReport.reporter_address && (
                  <Text style={styles.contactInfo}>Address: {selectedReport.reporter_address}</Text>
                )}
              </Card>

              {selectedReport.media_urls && selectedReport.media_urls.length > 0 && (
                <View style={styles.mediaSection}>
                  <Text style={styles.mediaTitle}>Attached Media ({selectedReport.media_urls.length})</Text>
                  <View style={styles.mediaGrid}>
                    {selectedReport.media_urls.map((url, index) => (
                      <TouchableOpacity 
                        key={index} 
                        style={styles.mediaGridItem}
                        onPress={() => {
                          // In a real app, this would open a full-screen viewer
                          Alert.alert('View Image', 'Opening full screen viewer...');
                        }}
                      >
                        <Image source={{ uri: url }} style={styles.mediaGridImage} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <Text style={styles.submittedDate}>
                Submitted: {new Date(selectedReport.created_at).toLocaleString()}
              </Text>

              {selectedReport.status === 'pending' && (
                <View style={styles.modalActions}>
                  <Button
                    title="Approve Report"
                    onPress={() => {
                      handleApproveReport(selectedReport.id);
                      setShowDetailsModal(false);
                    }}
                    style={{ flex: 1, marginRight: SPACING.sm }}
                  />
                  <Button
                    title="Reject Report"
                    onPress={() => {
                      handleRejectReport(selectedReport.id);
                      setShowDetailsModal(false);
                    }}
                    variant="secondary"
                    style={{ flex: 1 }}
                  />
                </View>
              )}
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
  headerSubtitle: { ...TYPOGRAPHY.body2, color: COLORS.white, opacity: 0.9, marginTop: SPACING.xs, marginBottom: SPACING.md },
  searchContainer: { marginBottom: SPACING.sm },
  searchInput: { backgroundColor: COLORS.white, borderRadius: 8 },
  dateFilterRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  dateInputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  dateLabel: { ...TYPOGRAPHY.caption, color: COLORS.white, fontWeight: '600' },
  dateInput: { flex: 1, backgroundColor: COLORS.white, borderRadius: 8, height: 40 },
  clearFilters: { padding: SPACING.xs },

  filterTabs: { flexDirection: 'row', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filterTab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center' },
  filterTabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  filterTabText: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary },
  filterTabTextActive: { color: COLORS.primary, fontWeight: '600' },

  content: { flex: 1 },
  statsRow: { flexDirection: 'row', padding: SPACING.md, gap: SPACING.sm },
  statCard: { flex: 1, alignItems: 'center', padding: SPACING.md },
  statValue: { ...TYPOGRAPHY.h2, color: COLORS.text, marginTop: SPACING.xs },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },

  section: { padding: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },

  reportCard: { marginBottom: SPACING.md },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  reportHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  reportDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  reportTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  reportCategory: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  reportDescription: { ...TYPOGRAPHY.body2, color: COLORS.text, marginBottom: SPACING.sm },
  reportMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  reporterName: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  mediaBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  mediaText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },

  reportActions: { flexDirection: 'row', gap: SPACING.sm },
  actionButton: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm, borderRadius: 6, backgroundColor: COLORS.surface, gap: SPACING.xs },
  actionText: { ...TYPOGRAPHY.caption, color: COLORS.text, fontWeight: '600' },
  approveButton: { backgroundColor: COLORS.success + '20' },
  approveText: { color: COLORS.success },
  rejectButton: { backgroundColor: COLORS.error + '20' },
  rejectText: { color: COLORS.error },

  modalContainer: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingTop: SPACING.xl + 20 },
  modalTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
  modalContent: { flex: 1, padding: SPACING.lg },

  detailHeader: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  detailTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.xs },
  detailCategory: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.md },

  descriptionCard: { marginBottom: SPACING.md },
  descriptionLabel: { ...TYPOGRAPHY.body2, fontWeight: '600', marginBottom: SPACING.xs },
  descriptionText: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary },

  contactCard: { marginBottom: SPACING.md },
  contactTitle: { ...TYPOGRAPHY.body2, fontWeight: '600', marginBottom: SPACING.sm },
  contactInfo: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.xs },

  submittedDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  modalActions: { flexDirection: 'row', marginTop: SPACING.lg },
  mediaSection: { marginBottom: SPACING.lg },
  mediaTitle: { ...TYPOGRAPHY.body2, fontWeight: '600', marginBottom: SPACING.md, color: COLORS.text },
  mediaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  mediaGridItem: { width: '48%', aspectRatio: 1, borderRadius: 8, overflow: 'hidden', backgroundColor: COLORS.surface },
  mediaGridImage: { width: '100%', height: '100%' },
});