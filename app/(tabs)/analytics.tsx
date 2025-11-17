import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card } from '@/src/components/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { BarChart3, TrendingUp, Users, FileText, MessageSquare, Activity, Calendar, MapPin, PieChart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Analytics data
const ANALYTICS_DATA = {
  overview: {
    totalReports: 2,
    pendingReports: 1,
    approvedReports: 1,
    totalUsers: 150,
  },
  trends: {
    monthlyReports: [
      { month: 'Aug', reports: 12 },
      { month: 'Sep', reports: 18 },
      { month: 'Oct', reports: 2 },
    ],
  },
  byState: [
    { state: 'Lagos', reports: 1, percentage: 50 },
    { state: 'Abuja', reports: 1, percentage: 50 },
  ],
  byCategory: [
    { category: 'Service Quality', count: 1, percentage: 50 },
    { category: 'Equipment Shortage', count: 1, percentage: 50 },
  ],
  byPriority: [
    { priority: 'High', count: 1, percentage: 50 },
    { priority: 'Medium', count: 0, percentage: 0 },
    { priority: 'Low', count: 1, percentage: 50 },
  ],
  byStatus: [
    { status: 'Pending', count: 1, percentage: 50 },
    { status: 'Approved', count: 1, percentage: 50 },
  ],
};

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const renderMetricCard = (title: string, value: number, change: string, IconComponent: any, color: string) => (
    <Card style={styles.metricCard} variant="elevated">
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
          <IconComponent size={24} color={color} />
        </View>
        <View style={styles.metricChange}>
          <TrendingUp size={16} color={COLORS.success} />
          <Text style={styles.changeText}>{change}</Text>
        </View>
      </View>
      <Text style={styles.metricValue}>{value.toLocaleString()}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </Card>
  );

  const renderChartBar = (data: any, maxValue: number) => (
    <View key={data.month || data.category || data.state} style={styles.chartBar}>
      <View style={styles.barContainer}>
        <View
          style={[styles.barFill, {
            width: `${(data.reports || data.count || data.percentage) / maxValue * 100}%`,
            backgroundColor: COLORS.primary
          }]}
        />
      </View>
      <Text style={styles.barLabel}>{data.month || data.category || data.state}</Text>
      <Text style={styles.barValue}>{data.reports || data.count || data.percentage}</Text>
    </View>
  );

  const renderPieSegment = (data: any, total: number) => (
    <View key={data.category || data.priority || data.status} style={styles.pieSegment}>
      <View style={styles.segmentInfo}>
        <Text style={styles.segmentLabel}>{data.category || data.priority || data.status}</Text>
        <Text style={styles.segmentValue}>{data.count} ({data.percentage}%)</Text>
      </View>
      <View style={styles.segmentBar}>
        <View
          style={[styles.segmentFill, {
            width: `${data.percentage}%`,
            backgroundColor: COLORS.primary
          }]}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics Dashboard</Text>
        <Text style={styles.headerSubtitle}>Comprehensive system insights and trends</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {['7d', '30d', '90d', '1y'].map((period) => (
          <TouchableOpacity
            key={period}
            style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[styles.periodText, selectedPeriod === period && styles.periodTextActive]}>
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            {renderMetricCard('Total Users', ANALYTICS_DATA.overview.totalUsers, '+12%', Users, COLORS.info)}
            {renderMetricCard('Total Reports', ANALYTICS_DATA.overview.totalReports, '+8%', FileText, COLORS.warning)}
            {renderMetricCard('Total Feedback', ANALYTICS_DATA.overview.totalUsers, '+15%', MessageSquare, COLORS.error)}
            {renderMetricCard('Active Cases', ANALYTICS_DATA.overview.totalUsers, '+5%', Activity, COLORS.success)}
          </View>
        </View>

        {/* Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Trends</Text>
          <Card style={styles.trendsCard} variant="elevated">
            <View style={styles.trendChart}>
              <Text style={styles.trendTitle}>User Registration</Text>
              <View style={styles.trendBars}>
                {ANALYTICS_DATA.trends.monthlyReports.map((data, index) => (
                  <View key={data.month} style={styles.trendBar}>
                    <View
                      style={[styles.trendFill, {
                        height: `${(data.reports / 20) * 100}%`,
                        backgroundColor: COLORS.info
                      }]}
                    />
                    <Text style={styles.trendLabel}>{data.month}</Text>
                    <Text style={styles.trendValue}>{data.reports}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.trendChart}>
              <Text style={styles.trendTitle}>Report Submissions</Text>
              <View style={styles.trendBars}>
                {ANALYTICS_DATA.trends.monthlyReports.map((data, index) => (
                  <View key={data.month} style={styles.trendBar}>
                    <View
                      style={[styles.trendFill, {
                        height: `${(data.reports / 20) * 100}%`,
                        backgroundColor: COLORS.warning
                      }]}
                    />
                    <Text style={styles.trendLabel}>{data.month}</Text>
                    <Text style={styles.trendValue}>{data.reports}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        </View>

        {/* State-wise Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>State-wise Breakdown</Text>
          <Card style={styles.chartCard} variant="outlined">
            {ANALYTICS_DATA.byState.map(data =>
              renderChartBar(data, Math.max(...ANALYTICS_DATA.byState.map(d => d.reports)))
            )}
          </Card>
        </View>

        {/* Category Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Categories</Text>
          <Card style={styles.categoriesCard} variant="outlined">
            {ANALYTICS_DATA.byCategory.map(category =>
              renderChartBar(category, Math.max(...ANALYTICS_DATA.byCategory.map(c => c.count)))
            )}
          </Card>
        </View>

        {/* Priority Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reports by Priority</Text>
          <Card style={styles.chartCard} variant="outlined">
            {ANALYTICS_DATA.byPriority.map(data =>
              renderPieSegment(data, ANALYTICS_DATA.overview.totalReports)
            )}
          </Card>
        </View>

        {/* Status Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reports by Status</Text>
          <Card style={styles.chartCard} variant="outlined">
            {ANALYTICS_DATA.byStatus.map(data =>
              renderPieSegment(data, ANALYTICS_DATA.overview.totalReports)
            )}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: SPACING.lg, paddingTop: SPACING.xl + 20 },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white },
  headerSubtitle: { ...TYPOGRAPHY.body2, color: COLORS.white, opacity: 0.9, marginTop: SPACING.xs },

  periodSelector: { flexDirection: 'row', backgroundColor: COLORS.white, padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  periodButton: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: 6 },
  periodButtonActive: { backgroundColor: COLORS.primary },
  periodText: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary },
  periodTextActive: { color: COLORS.white, fontWeight: '600' },

  content: { flex: 1 },
  section: { padding: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },

  // Metrics
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  metricCard: { flex: 1, minWidth: (width - SPACING.md * 3) / 2, padding: SPACING.md },
  metricHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  metricIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  metricChange: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  changeText: { ...TYPOGRAPHY.caption, color: COLORS.success, fontWeight: '600' },
  metricValue: { ...TYPOGRAPHY.h2, color: COLORS.text, marginTop: SPACING.xs },
  metricTitle: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },

  // Trends
  trendsCard: { padding: SPACING.md },
  trendChart: { marginBottom: SPACING.lg },
  trendTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md },
  trendBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120, paddingHorizontal: SPACING.md },
  trendBar: { alignItems: 'center', flex: 1 },
  trendFill: { width: 30, borderRadius: 4, marginBottom: SPACING.sm },
  trendLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  trendValue: { ...TYPOGRAPHY.caption, color: COLORS.text, fontWeight: '600', marginTop: SPACING.xs },

  // Charts
  chartCard: { padding: SPACING.md },
  chartTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.md },
  chartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120, paddingHorizontal: SPACING.md },
  chartBar: { alignItems: 'center', flex: 1 },
  barContainer: { width: 30, height: 100, justifyContent: 'flex-end', marginBottom: SPACING.sm },
  barFill: { height: '100%', borderRadius: 4 },
  barLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  barValue: { ...TYPOGRAPHY.caption, color: COLORS.text, fontWeight: '600', marginTop: SPACING.xs },

  categoriesCard: { padding: SPACING.md },
  categoryItem: { marginBottom: SPACING.md },
  categoryInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  categoryName: { ...TYPOGRAPHY.body2, color: COLORS.text },
  categoryCount: { ...TYPOGRAPHY.body2, fontWeight: '600', color: COLORS.primary },
  categoryBar: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  categoryFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },

  pieSegment: { marginBottom: SPACING.md },
  segmentInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  segmentLabel: { ...TYPOGRAPHY.body2, color: COLORS.text },
  segmentValue: { ...TYPOGRAPHY.body2, fontWeight: '600', color: COLORS.primary },
  segmentBar: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  segmentFill: { height: '100%', borderRadius: 4 },
});