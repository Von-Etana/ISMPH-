import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { Search, Share2 } from 'lucide-react-native';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  source: string;
  date: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  type: 'news' | 'report';
}

const DEMO_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'Maternal Mortality Report: Critical Rise in Lagos State',
    description: 'Health officials report a concerning increase in maternal mortality cases across Lagos hospitals.',
    source: 'Channels Television',
    date: '2025-10-28',
    category: 'RMNCAH',
    priority: 'high',
    type: 'news',
  },
  {
    id: '2',
    title: 'Abuja Pandemic Report: Influenza Outbreak Detected',
    description: 'Multiple cases of influenza noticed in Abuja environment.',
    source: 'ISMPH Abuja',
    date: '2025-10-27',
    category: 'Health PCHC',
    priority: 'high',
    type: 'report',
  },
  {
    id: '3',
    title: 'Kano and Lagos Journey: PHC Facility Assessment',
    description: 'Assessment of primary healthcare facilities and emergency response readiness.',
    source: 'ISMPH Report',
    date: '2025-10-26',
    category: 'Health PCHC',
    priority: 'medium',
    type: 'report',
  },
  {
    id: '4',
    title: 'Cholera Prevention: New Guidelines Released',
    description: 'Ministry releases updated cholera prevention guidelines focusing on water sanitation.',
    source: 'Federal Ministry of Health',
    date: '2025-10-25',
    category: 'Health Policy',
    priority: 'high',
    type: 'news',
  },
  {
    id: '5',
    title: 'Health Insurance Enrollment Reaches 5 Million',
    description: 'Significant enrollment increase makes healthcare more accessible nationwide.',
    source: 'Premium Times',
    date: '2025-10-24',
    category: 'Health Insurance',
    priority: 'medium',
    type: 'news',
  },
];

const CATEGORIES = ['All', 'RMNCAH', 'Health PCHC', 'Health Insurance', 'Health Policy'];

export default function NewsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredNews = DEMO_NEWS.filter((article) => {
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || article.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return COLORS.priorityHigh;
      case 'medium': return COLORS.priorityMedium;
      case 'low': return COLORS.priorityLow;
      default: return COLORS.textSecondary;
    }
  };

  const renderNewsItem = ({ item }: { item: NewsArticle }) => (
    <Card style={styles.newsCard} variant="elevated">
      <View style={styles.newsHeader}>
        <Badge label={item.priority.toUpperCase()} variant={item.priority} type="priority" />
        <TouchableOpacity>
          <Share2 size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsDescription} numberOfLines={3}>{item.description}</Text>
      <View style={styles.newsFooter}>
        <View style={styles.newsMetaLeft}>
          <Text style={styles.newsSource}>{item.source}</Text>
          <Text style={styles.newsDivider}>•</Text>
          <Text style={styles.newsDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
          <Text style={[styles.categoryText, { color: getPriorityColor(item.priority) }]}>
            {item.category}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Media Reports</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search news..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryChipText, selectedCategory === category && styles.categoryChipTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.priorityFilter}>
          {['All', 'high', 'medium', 'low'].map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[styles.priorityChip, selectedPriority === priority && styles.priorityChipActive]}
              onPress={() => setSelectedPriority(priority)}
            >
              <Text style={[styles.priorityChipText, selectedPriority === priority && styles.priorityChipTextActive]}>
                {priority === 'All' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredNews}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.newsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: SPACING.lg, paddingTop: SPACING.xl + 20 },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white },
  searchSection: { backgroundColor: COLORS.white, padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 8, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginBottom: SPACING.sm },
  searchInput: { flex: 1, marginLeft: SPACING.sm, ...TYPOGRAPHY.body1, color: COLORS.text },
  categoryScroll: { marginBottom: SPACING.sm },
  categoryChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: SPACING.sm },
  categoryChipActive: { backgroundColor: COLORS.primary },
  categoryChipText: { ...TYPOGRAPHY.body2, color: COLORS.text },
  categoryChipTextActive: { color: COLORS.white, fontWeight: '600' },
  priorityFilter: { flexDirection: 'row', gap: SPACING.sm },
  priorityChip: { flex: 1, paddingVertical: SPACING.xs, borderRadius: 8, backgroundColor: COLORS.surface, alignItems: 'center' },
  priorityChipActive: { backgroundColor: COLORS.primary },
  priorityChipText: { ...TYPOGRAPHY.caption, color: COLORS.text, fontWeight: '600' },
  priorityChipTextActive: { color: COLORS.white },
  newsList: { padding: SPACING.md },
  newsCard: { marginBottom: SPACING.md },
  newsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  newsTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.xs },
  newsDescription: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.sm },
  newsFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.xs },
  newsMetaLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  newsSource: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontWeight: '600' },
  newsDivider: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginHorizontal: SPACING.xs },
  newsDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  categoryBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 8 },
  categoryText: { ...TYPOGRAPHY.caption, fontWeight: '600' },
});
