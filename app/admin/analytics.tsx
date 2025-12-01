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
import { Badge } from '@/src/components/Badge';
import { COLORS, SPACING, TYPOGRAPHY, ZONES } from '@/src/constants/theme';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  MessageSquare,
  Activity,
  Calendar,
  MapPin,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mock analytics data
const ANALYTICS_DATA = {
  overview: {
    totalUsers: 1247,
    totalReports: 89,
    totalFeedback: 156,
    activeCases: 234,
  },
  trends: {
    userGrowth: [
      { month: 'Aug', users: 980 },
      { month: 'Sep', users: 1050 },
      { month: 'Oct', users: 1247 },
    ],
    reportActivity: [
      { month: 'Aug', reports: 45 },
      { month: 'Sep', reports: 67 },
      { month: 'Oct', reports: 89 },
    ],
  },
  byState: [
    { state: 'Lagos', users: 423, reports: 34, feedback: 45, cases: 89 },
    { state: 'Abuja', users: 312, reports: 28, feedback: 38, cases: 67 },
    { state: 'Kano', users: 298, reports: 19, feedback: 41, cases: 45 },
    { state: 'Kaduna', users: 214, reports: 8, feedback: 32, cases: 33 },
  ],
  byCategory: [
    { category: 'Service Quality', count: 34 },
    { category: 'Equipment Shortage', count: 28 },
    { category: 'Infrastructure', count: 19 },
    { category: 'Staff Behavior', count: 15 },
    { category: 'Drug Availability', count: 12 },
    { category: 'Emergency Response', count: 8 },
  ],
  recentActivity: [
    { type: 'user', action: 'New user registered', details: 'Staff account from Lagos', time: '2 hours ago' },
    { type: 'report', action: 'Report submitted', details: 'Equipment shortage at Ikeja PHC', time: '4 hours ago' },
    { type: 'feedback', action: 'Critical feedback', details: 'Long wait times at Victoria Island', time: '6 hours ago' },
    { type: 'user', action: 'User deactivated', details: 'Account from Kano', time: '1 day ago' },
  ],
};

export default function AdminAnalyticsScreen() {
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

  const renderStateCard = (stateData: any) => (
    <Card key={stateData.state} style={styles.stateCard} variant="outlined">
      <View style={styles.stateHeader}>
        <Text style={styles.stateName}>{stateData.state}</Text>
        <MapPin size={16} color={COLORS.primary} />
      </View>
      <View style={styles.stateStats}>
        <View style={styles.stateStat}>
          <Users size={14} color={COLORS.info} />
          <Text style={styles.stateStatValue}>{stateData.users}</Text>
          <Text style={styles.stateStatLabel}>Users</Text>
        </View>
        <View style={styles.stateStat}>
          <FileText size={14} color={COLORS.warning} />
          <Text style={styles.stateStatValue}>{stateData.reports}</Text>
          <Text style={styles.stateStatLabel}>Reports</Text>
        </View>
        <View style={styles.stateStat}>
          <MessageSquare size={14} color={COLORS.error} />
          <Text style={styles.stateStatValue}>{stateData.feedback}</Text>
          <Text style={styles.stateStatLabel}>Feedback</Text>
        </View>
        <View style={styles.stateStat}>
          <Activity size={14} color={COLORS.success} />
          <Text style={styles.stateStatValue}>{stateData.cases}</Text>
          <Text style={styles.stateStatLabel}>Cases</Text>
        </View>
      </View>
    </Card>
  );

  const renderCategoryBar = (categoryData: any, maxCount: number) => {
    const percentage = (categoryData.count / maxCount) * 100;
    return (
      <View key={categoryData.category} style={styles.categoryItem}>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{categoryData.category}</Text>
          <Text style={styles.categoryCount}>{categoryData.count}</Text>
        </View>
        <View style={styles.categoryBar}>
          <View
            style={[styles.categoryFill, { width: `${percentage}%` }]}
          />
        </View>
      </View>
    );
  };

  const renderActivityItem = (activity: any) => (
    <View key={`${activity.type}-${activity.time}`} style={styles.activityItem}>
      <Badge
        label={activity.type.toUpperCase()}
        variant="custom"
        style={{
          backgroundColor:
            activity.type === 'user' ? COLORS.info + '20' :
            activity.type === 'report' ? COLORS.warning + '20' :
            COLORS.error + '20'
        }}
      />
      <View style={styles.activityContent}>
        <Text style={styles.activityAction}>{activity.action}</Text>
        <Text style={styles.activityDetails}>{activity.details}</Text>
        <Text style={styles.activityTime}>{activity.time}</Text>
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
            {renderMetricCard('Total Feedback', ANALYTICS_DATA.overview.totalFeedback, '+15%', MessageSquare, COLORS.error)}
            {renderMetricCard('Active Cases', ANALYTICS_DATA.overview.activeCases, '+5%', Activity, COLORS.success)}
            {renderMetricCard('System Health', 98, '+2%', TrendingUp, COLORS.primary)}
          </View>
        </View>

        {/* Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Trends</Text>
          <Card style={styles.trendsCard} variant="elevated">
            <View style={styles.trendChart}>
              <Text style={styles.trendTitle}>User Registration</Text>
              <View style={styles.trendBars}>
                {ANALYTICS_DATA.trends.userGrowth.map((data, index) => (
                  <View key={data.month} style={styles.trendBar}>
                    <View
                      style={[styles.trendFill, {
                        height: `${(data.users / 1300) * 100}%`,
                        backgroundColor: COLORS.info
                      }]}
                    />
                    <Text style={styles.trendLabel}>{data.month}</Text>
                    <Text style={styles.trendValue}>{data.users}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.trendChart}>
              <Text style={styles.trendTitle}>Report Submissions</Text>
              <View style={styles.trendBars}>
                {ANALYTICS_DATA.trends.reportActivity.map((data, index) => (
                  <View key={data.month} style={styles.trendBar}>
                    <View
                      style={[styles.trendFill, {
                        height: `${(data.reports / 100) * 100}%`,
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
          {ANALYTICS_DATA.byState.map(renderStateCard)}
        </View>

        {/* Category Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Categories</Text>
          <Card style={styles.categoriesCard} variant="outlined">
            {ANALYTICS_DATA.byCategory.map(category =>
              renderCategoryBar(category, Math.max(...ANALYTICS_DATA.byCategory.map(c => c.count)))
            )}
          </Card>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card style={styles.activityCard} variant="outlined">
            {ANALYTICS_DATA.recentActivity.map(renderActivityItem)}
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

  // States
  stateCard: { marginBottom: SPACING.md },
  stateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  stateName: { ...TYPOGRAPHY.h4, color: COLORS.text },
  stateStats: { flexDirection: 'row', justifyContent: 'space-between' },
  stateStat: { alignItems: 'center' },
  stateStatValue: { ...TYPOGRAPHY.body1, fontWeight: '600', marginTop: SPACING.xs },
  stateStatLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },

  // Categories
  categoriesCard: { padding: SPACING.md },
  categoryItem: { marginBottom: SPACING.md },
  categoryInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  categoryName: { ...TYPOGRAPHY.body2, color: COLORS.text },
  categoryCount: { ...TYPOGRAPHY.body2, fontWeight: '600', color: COLORS.primary },
  categoryBar: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  categoryFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },

  // Activity
  activityCard: { padding: SPACING.md },
  activityItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.md },
  activityContent: { flex: 1, marginLeft: SPACING.sm },
  activityAction: { ...TYPOGRAPHY.body2, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  activityDetails: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  activityTime: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
});