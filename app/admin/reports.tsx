import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { Badge } from '@/src/components/Badge';
import { COLORS, SPACING, TYPOGRAPHY, STATES } from '@/src/constants/theme';
import { FileText, Clock, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

const ADMIN_REPORTS = [
  {
    id: '1',
    title: 'Equipment Shortage at Ikeja PHC',
    category: 'Equipment Shortage',
    description: 'Critical shortage of medical equipment affecting patient care quality.',
    state: 'Lagos',
    status: 'pending',
    priority: 'high',
    createdAt: '2025-10-28',
    reporterName: 'John Doe',
    reporterEmail: 'john@example.com',
    reporterPhone: '080-1234-5678',
    reporterAddress: 'Ikeja, Lagos',
    mediaCount: 3,
  },
  {
    id: '2',
    title: 'Excellent Service at Garki Hospital',
    category: 'Service Quality',
    description: 'Commendable service delivery and staff professionalism.',
    state: 'Abuja',
    status: 'approved',
    priority: 'low',
    createdAt: '2025-10-27',
    reporterName: 'Jane Smith',
    reporterEmail: 'jane@example.com',
    reporterPhone: '',
    reporterAddress: '',
    mediaCount: 0,
  },
  {
    id: '3',
    title: 'Infrastructure Upgrade Needed in Kano',
    category: 'Infrastructure',
    description: 'Building requires immediate renovation and maintenance.',
    state: 'Kano',
    status: 'pending',
    priority: 'medium',
    createdAt: '2025-10-26',
    reporterName: 'Ahmed Musa',
    reporterEmail: 'ahmed@example.com',
    reporterPhone: '080-9876-5432',
    reporterAddress: 'Kano Municipal',
    mediaCount: 5,
  },
];

export default function AdminReportsScreen() {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredReports = ADMIN_REPORTS.filter(report =>
    filterStatus === 'all' || report.status === filterStatus
  );

  const handleApproveReport = (reportId: string) => {
    Alert.alert(
      'Approve Report',
      'Are you sure you want to approve this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            Toast.show({
              type: 'success',
              text1: 'Report Approved',
              text2: 'The report has been approved and published',
            });
          }
        }
      ]
    );
  };

  const handleRejectReport = (reportId: string) => {
    Alert.alert(
      'Reject Report',
      'Are you sure you want to reject this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            Toast.show({
              type: 'error',
              text1: 'Report Rejected',
              text2: 'The report has been rejected',
            });
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

  const renderReportCard = (report: any) => (
    <Card key={report.id} style={styles.reportCard} variant="elevated">
      <View style={styles.reportHeader}>
        <View style={styles.reportHeaderLeft}>
          <Badge label={report.status.toUpperCase()} variant={report.status} type="status" />
          <Badge label={report.priority.toUpperCase()} variant={report.priority} type="priority" style={{ marginLeft: SPACING.xs }} />
        </View>
        <Text style={styles.reportDate}>{new Date(report.createdAt).toLocaleDateString()}</Text>
      </View>

      <Text style={styles.reportTitle}>{report.title}</Text>
      <Text style={styles.reportCategory}>{report.category} • {report.state}</Text>
      <Text style={styles.reportDescription} numberOfLines={2}>{report.description}</Text>

      <View style={styles.reportMeta}>
        <Text style={styles.reporterName}>Reported by: {report.reporterName}</Text>
        {report.mediaCount > 0 && (
          <View style={styles.mediaBadge}>
            <FileText size={14} color={COLORS.primary} />
            <Text style={styles.mediaText}>{report.mediaCount} media</Text>
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
            <Text style={styles.statValue}>{ADMIN_REPORTS.length}</Text>
            <Text style={styles.statLabel}>Total Reports</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <Clock size={24} color={COLORS.warning} />
            <Text style={styles.statValue}>{ADMIN_REPORTS.filter(r => r.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <CheckCircle size={24} color={COLORS.success} />
            <Text style={styles.statValue}>{ADMIN_REPORTS.filter(r => r.status === 'approved').length}</Text>
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
                <Text style={styles.contactInfo}>Name: {selectedReport.reporterName}</Text>
                <Text style={styles.contactInfo}>Email: {selectedReport.reporterEmail}</Text>
                {selectedReport.reporterPhone && (
                  <Text style={styles.contactInfo}>Phone: {selectedReport.reporterPhone}</Text>
                )}
                {selectedReport.reporterAddress && (
                  <Text style={styles.contactInfo}>Address: {selectedReport.reporterAddress}</Text>
                )}
              </Card>

              {selectedReport.mediaCount > 0 && (
                <Card style={styles.mediaCard} variant="outlined">
                  <Text style={styles.mediaTitle}>Attached Media</Text>
                  <Text style={styles.mediaCount}>{selectedReport.mediaCount} files attached</Text>
                </Card>
              )}

              <Text style={styles.submittedDate}>
                Submitted: {new Date(selectedReport.createdAt).toLocaleString()}
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
  headerSubtitle: { ...TYPOGRAPHY.body2, color: COLORS.white, opacity: 0.9, marginTop: SPACING.xs },

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

  mediaCard: { marginBottom: SPACING.md },
  mediaTitle: { ...TYPOGRAPHY.body2, fontWeight: '600', marginBottom: SPACING.xs },
  mediaCount: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary },

  submittedDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  modalActions: { flexDirection: 'row', marginTop: SPACING.lg },
});