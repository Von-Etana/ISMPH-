import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { ArrowLeft, Clock, AlertTriangle, Calendar, MapPin, User } from 'lucide-react-native';

const PENDING_REPORTS_DATA = [
  {
    id: '1',
    title: 'Equipment Shortage at Ikeja PHC',
    category: 'Equipment Shortage',
    description: 'Critical shortage of medical equipment affecting patient care quality.',
    state: 'Lagos',
    status: 'pending',
    priority: 'high',
    createdAt: '2025-10-28',
    contactName: 'John Doe',
    contactPhone: '080-1234-5678',
    reporterName: 'John Doe',
    daysPending: 12,
  },
  {
    id: '3',
    title: 'Drug Availability Issues',
    category: 'Drug Availability',
    description: 'Several essential medications are out of stock.',
    state: 'Kano',
    status: 'pending',
    priority: 'medium',
    createdAt: '2025-10-26',
    contactName: 'Dr. Ahmed',
    contactPhone: '080-5678-9012',
    reporterName: 'Dr. Ahmed',
    daysPending: 14,
  },
  {
    id: '5',
    title: 'Infrastructure Problems',
    category: 'Infrastructure',
    description: 'Broken water supply system in maternity ward.',
    state: 'Abuja',
    status: 'pending',
    priority: 'high',
    createdAt: '2025-10-25',
    contactName: 'Nurse Fatima',
    contactPhone: '080-7890-1234',
    reporterName: 'Nurse Fatima',
    daysPending: 15,
  },
];

const PENDING_STATS = {
  totalPending: 89,
  highPriority: 34,
  overdue: 23,
  avgResponseTime: '8.5 days',
};

export default function PendingReportsScreen() {
  const renderReport = (report: any) => (
    <Card key={report.id} style={styles.reportCard} variant="outlined">
      <View style={styles.reportHeader}>
        <View style={styles.reportHeaderLeft}>
          <Badge label={report.status.toUpperCase()} variant={report.status} type="status" />
          <Badge label={report.priority.toUpperCase()} variant={report.priority} type="priority" style={{ marginLeft: SPACING.xs }} />
        </View>
        <View style={styles.pendingInfo}>
          <Clock size={16} color={COLORS.warning} />
          <Text style={styles.pendingDays}>{report.daysPending} days</Text>
        </View>
      </View>

      <Text style={styles.reportTitle}>{report.title}</Text>
      <Text style={styles.reportCategory}>{report.category} • {report.state}</Text>
      <Text style={styles.reportDescription} numberOfLines={2}>{report.description}</Text>

      <View style={styles.reportFooter}>
        <Text style={styles.reportDate}>{new Date(report.createdAt).toLocaleDateString()}</Text>
        {report.contactName && (
          <Text style={styles.reportContact}>Contact: {report.contactName}</Text>
        )}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Image
            source={require('@/assets/images/WhatsApp Image 2025-11-08 at 09.39.48_7cb724fe.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Reports</Text>
        <Text style={styles.headerSubtitle}>Reports awaiting review and action</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Priority Alert */}
        <Card style={styles.alertCard} variant="elevated">
          <AlertTriangle size={24} color={COLORS.error} />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Action Required</Text>
            <Text style={styles.alertText}>
              {PENDING_STATS.overdue} reports are overdue for review. High priority items need immediate attention.
            </Text>
          </View>
        </Card>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Pending Summary</Text>
          <View style={styles.summaryGrid}>
            <Card style={styles.summaryCard} variant="elevated">
              <Clock size={24} color={COLORS.warning} />
              <Text style={styles.summaryValue}>{PENDING_STATS.totalPending}</Text>
              <Text style={styles.summaryLabel}>Total Pending</Text>
            </Card>
            <Card style={styles.summaryCard} variant="elevated">
              <AlertTriangle size={24} color={COLORS.error} />
              <Text style={styles.summaryValue}>{PENDING_STATS.highPriority}</Text>
              <Text style={styles.summaryLabel}>High Priority</Text>
            </Card>
            <Card style={styles.summaryCard} variant="elevated">
              <Calendar size={24} color={COLORS.error} />
              <Text style={styles.summaryValue}>{PENDING_STATS.overdue}</Text>
              <Text style={styles.summaryLabel}>Overdue</Text>
            </Card>
            <Card style={styles.summaryCard} variant="elevated">
              <User size={24} color={COLORS.info} />
              <Text style={styles.summaryValue}>{PENDING_STATS.avgResponseTime}</Text>
              <Text style={styles.summaryLabel}>Avg Response</Text>
            </Card>
          </View>
        </View>

        {/* Reports List */}
        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Pending Reports ({PENDING_REPORTS_DATA.length})</Text>
          {PENDING_REPORTS_DATA.map(renderReport)}
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
  },
  backButton: {
    position: 'absolute',
    left: SPACING.lg,
    top: SPACING.xl + 20,
    zIndex: 1,
  },
  logo: { width: 60, height: 60, marginBottom: SPACING.sm },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white },
  headerSubtitle: { ...TYPOGRAPHY.body2, color: COLORS.white, opacity: 0.9, marginTop: SPACING.xs },
  content: { flex: 1 },

  alertCard: {
    margin: SPACING.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.error + '10',
    borderColor: COLORS.error,
    borderWidth: 1,
  },
  alertContent: { flex: 1, marginLeft: SPACING.md },
  alertTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.error, marginBottom: SPACING.xs },
  alertText: { ...TYPOGRAPHY.body2, color: COLORS.text },

  summarySection: { padding: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  summaryCard: { flex: 1, minWidth: '45%', alignItems: 'center', padding: SPACING.md },
  summaryValue: { ...TYPOGRAPHY.h2, color: COLORS.text, marginTop: SPACING.xs },
  summaryLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },

  reportsSection: { padding: SPACING.md },
  reportCard: { marginBottom: SPACING.md },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  reportHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  pendingInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  pendingDays: { ...TYPOGRAPHY.caption, color: COLORS.warning, fontWeight: '600' },
  reportTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  reportCategory: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  reportDescription: { ...TYPOGRAPHY.body2, color: COLORS.text, marginBottom: SPACING.sm },
  reportFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reportDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  reportContact: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
});