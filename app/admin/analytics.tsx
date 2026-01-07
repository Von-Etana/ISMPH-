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
import { BarChart3, TrendingUp, Users, FileText, MessageSquare, Activity, Calendar, MapPin, PieChart, Clock, CheckCircle, type LucideIcon } from 'lucide-react-native';

interface ChartData {
  month?: string;
  category?: string;
  state?: string;
  disease?: string;
  reports?: number;
  count?: number;
  percentage?: number;
  cases?: number;
}

interface PieData {
  category?: string;
  priority?: string;
  status?: string;
  range?: string;
  count: number;
  percentage: number;
}

const { width } = Dimensions.get('window');

// Reports Analytics Data
const REPORTS_ANALYTICS = {
  overview: {
    totalReports: 245,
    pendingReports: 89,
    approvedReports: 156,
    resolvedReports: 134,
    avgResolutionTime: '3.2 days',
  },
  monthlyTrends: [
    { month: 'Jul', reports: 18, resolved: 15 },
    { month: 'Aug', reports: 32, resolved: 28 },
    { month: 'Sep', reports: 45, resolved: 38 },
    { month: 'Oct', reports: 67, resolved: 53 },
    { month: 'Nov', reports: 83, resolved: 0 }, // Current month
  ],
  relevanceDistribution: [
    { relevance: 'Critical', count: 45, percentage: 18.4, color: COLORS.error },
    { relevance: 'High', count: 78, percentage: 31.8, color: COLORS.warning },
    { relevance: 'Medium', count: 89, percentage: 36.3, color: COLORS.info },
    { relevance: 'Low', count: 33, percentage: 13.5, color: COLORS.success },
  ],
  topDiseasesByCases: [
    { disease: 'Malaria', cases: 45, percentage: 28.1 },
    { disease: 'Typhoid', cases: 32, percentage: 20.0 },
    { disease: 'Diarrhea', cases: 28, percentage: 17.5 },
    { disease: 'Respiratory Infections', cases: 25, percentage: 15.6 },
    { disease: 'Skin Infections', cases: 18, percentage: 11.3 },
    { disease: 'Others', cases: 12, percentage: 7.5 },
  ],
  byState: [
    { state: 'Lagos', reports: 89, percentage: 36.3 },
    { state: 'Abuja', reports: 67, percentage: 27.3 },
    { state: 'Kano', reports: 45, percentage: 18.4 },
    { state: 'Rivers', reports: 34, percentage: 13.9 },
    { state: 'Others', reports: 10, percentage: 4.1 },
  ],
  byCategory: [
    { category: 'Service Quality', count: 67, percentage: 27.3 },
    { category: 'Equipment Shortage', count: 56, percentage: 22.9 },
    { category: 'Drug Availability', count: 45, percentage: 18.4 },
    { category: 'Staff Behavior', count: 34, percentage: 13.9 },
    { category: 'Infrastructure', count: 28, percentage: 11.4 },
    { category: 'Others', count: 15, percentage: 6.1 },
  ],
  responseTimeAnalysis: [
    { range: '< 24hrs', count: 89, percentage: 36.3 },
    { range: '24-48hrs', count: 67, percentage: 27.3 },
    { range: '2-7 days', count: 56, percentage: 22.9 },
    { range: '> 7 days', count: 33, percentage: 13.5 },
  ],
  facilityPerformance: [
    { facility: 'General Hospital Lagos', reports: 23, avgRating: 3.2 },
    { facility: 'PHC Ikeja', reports: 18, avgRating: 4.1 },
    { facility: 'Teaching Hospital Abuja', reports: 15, avgRating: 3.8 },
    { facility: 'PHC Kano', reports: 12, avgRating: 2.9 },
    { facility: 'General Hospital Port Harcourt', reports: 10, avgRating: 3.5 },
  ],
};

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const renderMetricCard = (title: string, value: string | number, change: string, IconComponent: LucideIcon, color: string) => (
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
      <Text style={styles.metricValue}>{typeof value === 'number' ? value.toLocaleString() : value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </Card>
  );

  // Horizontal bar item for lists
  const renderHorizontalBar = (label: string, value: number, maxValue: number, color: string = COLORS.primary) => (
    <View key={label} style={styles.horizontalBarItem}>
      <View style={styles.horizontalBarHeader}>
        <Text style={styles.horizontalBarLabel}>{label}</Text>
        <Text style={styles.horizontalBarValue}>{value}</Text>
      </View>
      <View style={styles.horizontalBarTrack}>
        <View
          style={[styles.horizontalBarFill, {
            width: `${(value / maxValue) * 100}%`,
            backgroundColor: color
          }]}
        />
      </View>
    </View>
  );

  // Vertical bar chart for grouped data
  const renderVerticalBarChart = (data: Array<{ label: string, value: number }>, maxValue: number, color: string = COLORS.primary) => (
    <View style={styles.verticalChartContainer}>
      <View style={styles.verticalBarsRow}>
        {data.map((item, index) => (
          <View key={item.label} style={styles.verticalBarWrapper}>
            <Text style={styles.verticalBarValue}>{item.value}</Text>
            <View style={styles.verticalBarTrack}>
              <View
                style={[styles.verticalBarFill, {
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color
                }]}
              />
            </View>
            <Text style={styles.verticalBarLabel} numberOfLines={2}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPieSegment = (data: PieData, total: number) => (
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
        <Text style={styles.headerTitle}>Reports Analytics</Text>
        <Text style={styles.headerSubtitle}>Comprehensive insights into facility reports and trends</Text>
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
            {renderMetricCard('Total Reports', REPORTS_ANALYTICS.overview.totalReports, '+23%', FileText, COLORS.primary)}
            {renderMetricCard('Pending Reports', REPORTS_ANALYTICS.overview.pendingReports, '+12%', Clock, COLORS.warning)}
            {renderMetricCard('Approved Reports', REPORTS_ANALYTICS.overview.approvedReports, '+18%', CheckCircle, COLORS.success)}
            {renderMetricCard('Avg Resolution Time', REPORTS_ANALYTICS.overview.avgResolutionTime, '-8%', Activity, COLORS.info)}
          </View>
        </View>

        {/* Monthly Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Report Trends</Text>
          <Card style={styles.trendsCard} variant="elevated">
            <View style={styles.trendChart}>
              <Text style={styles.trendTitle}>Reports Submitted</Text>
              <View style={styles.trendBars}>
                {REPORTS_ANALYTICS.monthlyTrends.map((data, index) => (
                  <View key={data.month} style={styles.trendBar}>
                    <View
                      style={[styles.trendFill, {
                        height: `${(data.reports / 90) * 100}%`,
                        backgroundColor: COLORS.primary
                      }]}
                    />
                    <Text style={styles.trendLabel}>{data.month}</Text>
                    <Text style={styles.trendValue}>{data.reports}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.trendChart}>
              <Text style={styles.trendTitle}>Reports Resolved</Text>
              <View style={styles.trendBars}>
                {REPORTS_ANALYTICS.monthlyTrends.map((data, index) => (
                  <View key={data.month} style={styles.trendBar}>
                    <View
                      style={[styles.trendFill, {
                        height: `${(data.resolved / 60) * 100}%`,
                        backgroundColor: COLORS.success
                      }]}
                    />
                    <Text style={styles.trendLabel}>{data.month}</Text>
                    <Text style={styles.trendValue}>{data.resolved}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        </View>

        {/* Relevance Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Relevance Distribution</Text>
          <Card style={styles.chartCard} variant="outlined">
            {REPORTS_ANALYTICS.relevanceDistribution.map(data => (
              <View key={data.relevance} style={styles.relevanceItem}>
                <View style={styles.relevanceHeader}>
                  <Text style={styles.relevanceLabel}>{data.relevance}</Text>
                  <Text style={styles.relevanceValue}>{data.count} ({data.percentage}%)</Text>
                </View>
                <View style={styles.relevanceBar}>
                  <View
                    style={[styles.relevanceFill, {
                      width: `${data.percentage}%`,
                      backgroundColor: data.color
                    }]}
                  />
                </View>
              </View>
            ))}
          </Card>
        </View>

        {/* Top Diseases by Cases - Bar Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Diseases by Reported Cases</Text>
          <Card style={styles.chartCard} variant="outlined">
            {renderVerticalBarChart(
              REPORTS_ANALYTICS.topDiseasesByCases.map(d => ({ label: d.disease, value: d.cases })),
              Math.max(...REPORTS_ANALYTICS.topDiseasesByCases.map(d => d.cases)),
              COLORS.error
            )}
          </Card>
        </View>

        {/* State-wise Breakdown - Bar Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reports by State</Text>
          <Card style={styles.chartCard} variant="outlined">
            {renderVerticalBarChart(
              REPORTS_ANALYTICS.byState.map(d => ({ label: d.state, value: d.reports })),
              Math.max(...REPORTS_ANALYTICS.byState.map(d => d.reports)),
              COLORS.info
            )}
          </Card>
        </View>

        {/* Category Distribution - Bar Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Categories</Text>
          <Card style={styles.categoriesCard} variant="outlined">
            {renderVerticalBarChart(
              REPORTS_ANALYTICS.byCategory.map(c => ({ label: c.category, value: c.count })),
              Math.max(...REPORTS_ANALYTICS.byCategory.map(c => c.count)),
              COLORS.warning
            )}
          </Card>
        </View>

        {/* Response Time Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Response Time Analysis</Text>
          <Card style={styles.chartCard} variant="outlined">
            {REPORTS_ANALYTICS.responseTimeAnalysis.map(data =>
              renderPieSegment(data, REPORTS_ANALYTICS.overview.totalReports)
            )}
          </Card>
        </View>

        {/* Facility Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Facilities</Text>
          <Card style={styles.chartCard} variant="outlined">
            {REPORTS_ANALYTICS.facilityPerformance.map(data => (
              <View key={data.facility} style={styles.facilityItem}>
                <View style={styles.facilityInfo}>
                  <Text style={styles.facilityName}>{data.facility}</Text>
                  <Text style={styles.facilityStats}>{data.reports} reports • {data.avgRating}★ avg</Text>
                </View>
                <View style={styles.facilityBar}>
                  <View
                    style={[styles.facilityFill, {
                      width: `${(data.avgRating / 5) * 100}%`,
                      backgroundColor: data.avgRating >= 4 ? COLORS.success : data.avgRating >= 3 ? COLORS.warning : COLORS.error
                    }]}
                  />
                </View>
              </View>
            ))}
          </Card>
        </View>

        {/* User Engagement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Engagement Trends</Text>
          <Card style={styles.chartCard} variant="outlined">
            <View style={styles.engagementGrid}>
              <View style={styles.engagementItem}>
                <Text style={styles.engagementValue}>89%</Text>
                <Text style={styles.engagementLabel}>App Usage</Text>
                <Text style={styles.engagementChange}>Daily active users</Text>
              </View>
              <View style={styles.engagementItem}>
                <Text style={styles.engagementValue}>4.2</Text>
                <Text style={styles.engagementLabel}>Avg Rating</Text>
                <Text style={styles.engagementChange}>User satisfaction</Text>
              </View>
              <View style={styles.engagementItem}>
                <Text style={styles.engagementValue}>156</Text>
                <Text style={styles.engagementLabel}>Feedback</Text>
                <Text style={styles.engagementChange}>Positive responses</Text>
              </View>
              <View style={styles.engagementItem}>
                <Text style={styles.engagementValue}>3.2</Text>
                <Text style={styles.engagementLabel}>Avg Response</Text>
                <Text style={styles.engagementChange}>Resolution time</Text>
              </View>
            </View>
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

  // Horizontal bar styles
  horizontalBarItem: { marginBottom: SPACING.md },
  horizontalBarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  horizontalBarLabel: { ...TYPOGRAPHY.body2, color: COLORS.text, flex: 1 },
  horizontalBarValue: { ...TYPOGRAPHY.body2, fontWeight: '600', color: COLORS.primary },
  horizontalBarTrack: { height: 12, backgroundColor: COLORS.border, borderRadius: 6, overflow: 'hidden' },
  horizontalBarFill: { height: '100%', borderRadius: 6 },

  // Vertical bar chart styles
  verticalChartContainer: { paddingVertical: SPACING.md },
  verticalBarsRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 160, paddingHorizontal: SPACING.xs },
  verticalBarWrapper: { alignItems: 'center', flex: 1, maxWidth: 60 },
  verticalBarValue: { ...TYPOGRAPHY.caption, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.xs },
  verticalBarTrack: { width: 32, height: 120, backgroundColor: COLORS.border, borderRadius: 6, overflow: 'hidden', justifyContent: 'flex-end' },
  verticalBarFill: { width: '100%', borderRadius: 6 },
  verticalBarLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs, textAlign: 'center', fontSize: 10 },

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

  // Relevance Distribution
  relevanceItem: { marginBottom: SPACING.md },
  relevanceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  relevanceLabel: { ...TYPOGRAPHY.body2, color: COLORS.text, fontWeight: '600' },
  relevanceValue: { ...TYPOGRAPHY.body2, color: COLORS.primary, fontWeight: '600' },
  relevanceBar: { height: 12, backgroundColor: COLORS.border, borderRadius: 6, overflow: 'hidden' },
  relevanceFill: { height: '100%', borderRadius: 6 },

  // Facility Performance
  facilityItem: { marginBottom: SPACING.md },
  facilityInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  facilityName: { ...TYPOGRAPHY.body2, color: COLORS.text, fontWeight: '600', flex: 1 },
  facilityStats: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  facilityBar: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  facilityFill: { height: '100%', borderRadius: 4 },

  // User Engagement
  engagementGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  engagementItem: { flex: 1, minWidth: '45%', alignItems: 'center', padding: SPACING.md, margin: SPACING.xs, backgroundColor: COLORS.surface, borderRadius: 8 },
  engagementValue: { ...TYPOGRAPHY.h2, color: COLORS.primary, fontWeight: '700' },
  engagementLabel: { ...TYPOGRAPHY.body2, color: COLORS.text, marginTop: SPACING.xs },
  engagementChange: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },
});
