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
import { ArrowLeft, FileText, TrendingUp, BarChart3, MapPin, Calendar } from 'lucide-react-native';

interface TotalReport {
  id: string;
  title: string;
  category: string;
  description: string;
  state: string;
  status: string;
  priority: string;
  createdAt: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  reporterName: string;
}

const TOTAL_REPORTS_DATA = [
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
    contactName: 'Jane Smith',
    contactEmail: 'jane@example.com',
    reporterName: 'Jane Smith',
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
    contactName: 'Mrs. Johnson',
    contactPhone: '080-3456-7890',
    reporterName: 'Mrs. Johnson',
  },
];

const SUMMARY_STATS = {
  total: 245,
  thisMonth: 83,
  growth: '+23%',
  topCategory: 'Service Quality',
  topState: 'Lagos',
};

export default function TotalReportsScreen() {
  const renderReport = (report: TotalReport) => (
    <Card key={report.id} style={styles.reportCard} variant="outlined">
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

      {report.contactName && (
        <Text style={styles.reportContact}>Contact: {report.contactName}</Text>
      )}
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
        <Text style={styles.headerTitle}>Total Reports</Text>
        <Text style={styles.headerSubtitle}>All facility reports overview</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryGrid}>
            <Card style={styles.summaryCard} variant="elevated">
              <FileText size={24} color={COLORS.primary} />
              <Text style={styles.summaryValue}>{SUMMARY_STATS.total}</Text>
              <Text style={styles.summaryLabel}>Total Reports</Text>
            </Card>
            <Card style={styles.summaryCard} variant="elevated">
              <Calendar size={24} color={COLORS.info} />
              <Text style={styles.summaryValue}>{SUMMARY_STATS.thisMonth}</Text>
              <Text style={styles.summaryLabel}>This Month</Text>
            </Card>
            <Card style={styles.summaryCard} variant="elevated">
              <TrendingUp size={24} color={COLORS.success} />
              <Text style={styles.summaryValue}>{SUMMARY_STATS.growth}</Text>
              <Text style={styles.summaryLabel}>Growth</Text>
            </Card>
            <Card style={styles.summaryCard} variant="elevated">
              <MapPin size={24} color={COLORS.warning} />
              <Text style={styles.summaryValue}>{SUMMARY_STATS.topState}</Text>
              <Text style={styles.summaryLabel}>Top State</Text>
            </Card>
          </View>
        </View>

        {/* Analytics Link */}
        <TouchableOpacity
          style={styles.analyticsCard}
          onPress={() => router.push('/(tabs)/analytics')}
        >
          <Card variant="elevated" style={styles.analyticsContent}>
            <BarChart3 size={24} color={COLORS.primary} />
            <View style={styles.analyticsText}>
              <Text style={styles.analyticsTitle}>View Detailed Analytics</Text>
              <Text style={styles.analyticsSubtitle}>Comprehensive reports insights and trends</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Reports List */}
        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>All Reports ({TOTAL_REPORTS_DATA.length})</Text>
          {TOTAL_REPORTS_DATA.map(renderReport)}
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

  summarySection: { padding: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  summaryCard: { flex: 1, minWidth: '45%', alignItems: 'center', padding: SPACING.md },
  summaryValue: { ...TYPOGRAPHY.h2, color: COLORS.text, marginTop: SPACING.xs },
  summaryLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },

  analyticsCard: { margin: SPACING.md, marginTop: 0 },
  analyticsContent: { padding: SPACING.md },
  analyticsText: { flex: 1, marginLeft: SPACING.md },
  analyticsTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text },
  analyticsSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },

  reportsSection: { padding: SPACING.md },
  reportCard: { marginBottom: SPACING.md },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  reportHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  reportDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  reportTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  reportCategory: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  reportDescription: { ...TYPOGRAPHY.body2, color: COLORS.text, marginBottom: SPACING.xs },
  reportContact: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
});