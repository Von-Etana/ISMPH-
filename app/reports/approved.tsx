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
import { ArrowLeft, CheckCircle, TrendingUp, Calendar, MapPin, Star } from 'lucide-react-native';

const APPROVED_REPORTS_DATA = [
  {
    id: '2',
    title: 'Excellent Service at Garki Hospital',
    category: 'Service Quality',
    description: 'Commendable service delivery and staff professionalism.',
    state: 'Abuja',
    status: 'approved',
    priority: 'low',
    createdAt: '2025-10-27',
    resolvedAt: '2025-10-29',
    contactName: 'Jane Smith',
    contactEmail: 'jane@example.com',
    reporterName: 'Jane Smith',
    resolutionTime: '2 days',
    rating: 5,
  },
  {
    id: '4',
    title: 'Staff Behavior Complaint',
    category: 'Staff Behavior',
    description: 'Unprofessional conduct by nursing staff.',
    state: 'Rivers',
    status: 'approved',
    priority: 'high',
    createdAt: '2025-10-25',
    resolvedAt: '2025-10-28',
    contactName: 'Mrs. Johnson',
    contactPhone: '080-3456-7890',
    reporterName: 'Mrs. Johnson',
    resolutionTime: '3 days',
    rating: 4,
  },
  {
    id: '6',
    title: 'Emergency Response Improvement',
    category: 'Emergency Response',
    description: 'Quick and efficient emergency response team.',
    state: 'Lagos',
    status: 'approved',
    priority: 'medium',
    createdAt: '2025-10-20',
    resolvedAt: '2025-10-23',
    contactName: 'Dr. Okafor',
    contactPhone: '080-9012-3456',
    reporterName: 'Dr. Okafor',
    resolutionTime: '3 days',
    rating: 5,
  },
];

const APPROVED_STATS = {
  totalApproved: 156,
  thisMonth: 67,
  avgResolutionTime: '3.2 days',
  satisfactionRate: '94%',
};

export default function ApprovedReportsScreen() {
  const renderReport = (report: any) => (
    <Card key={report.id} style={styles.reportCard} variant="outlined">
      <View style={styles.reportHeader}>
        <View style={styles.reportHeaderLeft}>
          <Badge label={report.status.toUpperCase()} variant={report.status} type="status" />
          <Badge label={report.priority.toUpperCase()} variant={report.priority} type="priority" style={{ marginLeft: SPACING.xs }} />
        </View>
        <View style={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              color={i < report.rating ? COLORS.warning : COLORS.border}
              fill={i < report.rating ? COLORS.warning : 'transparent'}
            />
          ))}
        </View>
      </View>

      <Text style={styles.reportTitle}>{report.title}</Text>
      <Text style={styles.reportCategory}>{report.category} • {report.state}</Text>
      <Text style={styles.reportDescription} numberOfLines={2}>{report.description}</Text>

      <View style={styles.reportFooter}>
        <View style={styles.resolutionInfo}>
          <Text style={styles.resolutionTime}>Resolved in {report.resolutionTime}</Text>
          <Text style={styles.resolvedDate}>
            {new Date(report.resolvedAt).toLocaleDateString()}
          </Text>
        </View>
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
        <Text style={styles.headerTitle}>Approved Reports</Text>
        <Text style={styles.headerSubtitle}>Successfully resolved facility reports</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Success Message */}
        <Card style={styles.successCard} variant="elevated">
          <CheckCircle size={24} color={COLORS.success} />
          <View style={styles.successContent}>
            <Text style={styles.successTitle}>Great Progress!</Text>
            <Text style={styles.successText}>
              {APPROVED_STATS.satisfactionRate} of users are satisfied with the resolution process.
            </Text>
          </View>
        </Card>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Resolution Summary</Text>
          <View style={styles.summaryGrid}>
            <Card style={styles.summaryCard} variant="elevated">
              <CheckCircle size={24} color={COLORS.success} />
              <Text style={styles.summaryValue}>{APPROVED_STATS.totalApproved}</Text>
              <Text style={styles.summaryLabel}>Total Approved</Text>
            </Card>
            <Card style={styles.summaryCard} variant="elevated">
              <Calendar size={24} color={COLORS.info} />
              <Text style={styles.summaryValue}>{APPROVED_STATS.thisMonth}</Text>
              <Text style={styles.summaryLabel}>This Month</Text>
            </Card>
            <Card style={styles.summaryCard} variant="elevated">
              <TrendingUp size={24} color={COLORS.primary} />
              <Text style={styles.summaryValue}>{APPROVED_STATS.avgResolutionTime}</Text>
              <Text style={styles.summaryLabel}>Avg Resolution</Text>
            </Card>
            <Card style={styles.summaryCard} variant="elevated">
              <Star size={24} color={COLORS.warning} />
              <Text style={styles.summaryValue}>{APPROVED_STATS.satisfactionRate}</Text>
              <Text style={styles.summaryLabel}>Satisfaction</Text>
            </Card>
          </View>
        </View>

        {/* Reports List */}
        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Approved Reports ({APPROVED_REPORTS_DATA.length})</Text>
          {APPROVED_REPORTS_DATA.map(renderReport)}
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

  successCard: {
    margin: SPACING.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.success + '10',
    borderColor: COLORS.success,
    borderWidth: 1,
  },
  successContent: { flex: 1, marginLeft: SPACING.md },
  successTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.success, marginBottom: SPACING.xs },
  successText: { ...TYPOGRAPHY.body2, color: COLORS.text },

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
  rating: { flexDirection: 'row' },
  reportTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  reportCategory: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  reportDescription: { ...TYPOGRAPHY.body2, color: COLORS.text, marginBottom: SPACING.sm },
  reportFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resolutionInfo: { flex: 1 },
  resolutionTime: { ...TYPOGRAPHY.caption, color: COLORS.success, fontWeight: '600' },
  resolvedDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },
  reportContact: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
});