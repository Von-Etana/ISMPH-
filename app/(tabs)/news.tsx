import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  Linking,
} from 'react-native';
import { Card } from '@/src/components/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { Search, Share2, ExternalLink, RefreshCw, Newspaper, Radio, Tv, Globe, Instagram } from 'lucide-react-native';
import { ALL_NEWS_DATA } from '@/src/constants/newsData';
import {
  ALL_MEDIA_REPORTS,
  MediaReport,
  STATE_COLORS,
  THEMATIC_COLORS,
  ALL_PROGRAM_TYPES,
  StateCode,
  ProgramType
} from '@/src/constants/mediaReportsData';
import { router, useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store';
import { fetchTopHeadlines, fetchApprovedNews } from '@/src/store/slices/newsSlice';
import { NewsArticle } from '@/src/types';
import Toast from 'react-native-toast-message';

// Combined item type for both sources
type CombinedNewsItem = {
  type: 'news' | 'media';
  id: string;
  title: string;
  description: string;
  source: string;
  link: string;
  state?: string;
  category: string;
  priority?: string;
  date?: string;
  sortDate: number; // Timestamp for sorting
  programType?: ProgramType;
  status?: string;
};

// Helper to normalize dates for sorting
const getSortDate = (dateStr?: string): number => {
  if (!dateStr) return 0;
  // If YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr).getTime();
  }
  // If MMM-YY (e.g., May-25)
  const parts = dateStr.split('-');
  if (parts.length === 2) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames.indexOf(parts[0]);
    if (month !== -1) {
      const year = 2000 + parseInt(parts[1]);
      return new Date(year, month, 1).getTime();
    }
  }
  return 0;
};

// Category normalization map to fix "zero results" bug
const CATEGORY_MAP: Record<string, string> = {
  'RMNCAH+N': 'RMNCAH',
  'Primary Health Care': 'PHC Agenda',
  'Health Policy/Legislation': 'PHC Agenda',
  'SWAp': 'SWAp Unit Activity',
};

const normalizeCategory = (category: string) => CATEGORY_MAP[category] || category;

// Convert media reports to combined format
const convertMediaReports = (reports: MediaReport[]): CombinedNewsItem[] => {
  return reports.map(report => ({
    type: 'media' as const,
    id: report.id,
    title: `${report.thematicArea} - ${report.platform}`,
    description: `${report.programType} coverage from ${report.platform} in ${report.state}`,
    source: report.platform,
    link: report.link,
    state: report.state,
    category: normalizeCategory(report.thematicArea),
    priority: 'medium',
    date: report.month,
    sortDate: getSortDate(report.month),
    programType: report.programType,
    status: 'approved',
  }));
};

// Convert news articles to combined format
const convertNewsArticles = (articles: any[]): CombinedNewsItem[] => {
  return articles.map(article => ({
    type: 'news' as const,
    id: article.id,
    title: article.title,
    description: article.description,
    source: article.source,
    link: article.url || article.link || '',
    state: article.state,
    category: normalizeCategory(article.category),
    priority: article.priority,
    date: article.date,
    sortDate: getSortDate(article.date),
    status: article.status || 'approved',
  }));
};

const SOURCE_TABS = ['All', 'Media Reports', 'News Articles'];
const STATE_FILTERS = ['All', 'Kaduna', 'Kano', 'Lagos'];

export default function NewsScreen() {
  const { category: initialCategory } = useLocalSearchParams<{ category?: string }>();
  const normalizedInitialCategory = initialCategory ? normalizeCategory(initialCategory) : 'All';
  const dispatch = useDispatch<AppDispatch>();
  const { articles: newsArticles, loading: newsLoading } = useSelector((state: RootState) => state.news);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState(normalizedInitialCategory);
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedProgramType, setSelectedProgramType] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchApprovedNews());
  }, [dispatch]);

  // Combined data using useMemo for performance and sorting
  const allCombinedData = useMemo(() => {
    const mediaReportsData = convertMediaReports(ALL_MEDIA_REPORTS);
    const dbArticles = convertNewsArticles(newsArticles);
    const staticNewsData = convertNewsArticles(ALL_NEWS_DATA);

    // Combine and sort by date descending
    return [...mediaReportsData, ...dbArticles, ...staticNewsData]
      .filter(item => item.status === 'approved')
      .sort((a, b) => b.sortDate - a.sortDate);
  }, [newsArticles]);

  // Get unique categories for the filters, unified
  const categoriesList = useMemo(() => {
    const cats = new Set(['All']);
    allCombinedData.forEach(item => cats.add(item.category));
    return Array.from(cats);
  }, [allCombinedData]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchApprovedNews()).unwrap(),
        dispatch(fetchTopHeadlines()).unwrap()
      ]);
      Toast.show({
        type: 'success',
        text1: 'News Updated',
        text2: 'Latest health news synchronized',
      });
    } catch {
      // Silent fail
    }
    setRefreshing(false);
  };

  const handleFetchLiveNews = async () => {
    try {
      await dispatch(fetchTopHeadlines()).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Live News Loaded',
        text2: 'Fetched latest health news',
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Failed to Load News',
      });
    }
  };

  // Filter data based on user selection
  const filteredData = allCombinedData.filter((item) => {
    if (selectedSource === 'Media Reports' && item.type !== 'media') return false;
    if (selectedSource === 'News Articles' && item.type !== 'news') return false;

    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesState = selectedState === 'All' || item.state === selectedState;
    const matchesProgramType = selectedProgramType === 'All' ||
      (item.type === 'media' && item.programType === selectedProgramType);

    return matchesSearch && matchesCategory && matchesState &&
      (selectedProgramType === 'All' || item.type === 'news' || matchesProgramType);
  });

  const handleShare = async (item: CombinedNewsItem) => {
    const message = `${item.title}\n\n${item.description}\n\nRead more: ${item.link}`;
    try {
      await Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`);
    } catch {
      Linking.openURL(`mailto:?subject=${encodeURIComponent(item.title)}&body=${encodeURIComponent(message)}`);
    }
  };

  const handleItemPress = (item: CombinedNewsItem) => {
    if (item.link) Linking.openURL(item.link);
  };

  const getStateColor = (state?: string) => {
    if (state && state in STATE_COLORS) return STATE_COLORS[state as StateCode];
    return { primary: COLORS.primary, light: COLORS.surface, text: COLORS.text };
  };

  const getCategoryColor = (category: string): string => {
    return THEMATIC_COLORS[category] || THEMATIC_COLORS[Object.keys(CATEGORY_MAP).find(k => CATEGORY_MAP[k] === category) || ''] || COLORS.primary;
  };

  const getProgramTypeIcon = (programType?: ProgramType) => {
    switch (programType) {
      case 'TV': return <Tv size={14} color={COLORS.white} />;
      case 'Radio': return <Radio size={14} color={COLORS.white} />;
      case 'Social Media': return <Instagram size={14} color={COLORS.white} />;
      case 'Online': return <Globe size={14} color={COLORS.white} />;
      default: return <Newspaper size={14} color={COLORS.white} />;
    }
  };

  const renderItem = ({ item }: { item: CombinedNewsItem }) => {
    const stateColors = getStateColor(item.state);
    const categoryColor = getCategoryColor(item.category);

    return (
      <TouchableOpacity onPress={() => handleItemPress(item)}>
        <Card
          style={StyleSheet.flatten([styles.newsCard, { borderLeftWidth: 4, borderLeftColor: stateColors.primary }])}
          variant="elevated"
        >
          <View style={styles.newsHeader}>
            <View style={styles.headerBadges}>
              {item.state && (
                <View style={[styles.stateBadge, { backgroundColor: stateColors.primary }]}>
                  <Text style={styles.stateBadgeText}>{item.state}</Text>
                </View>
              )}
              {item.type === 'media' && item.programType && (
                <View style={[styles.programTypeBadge, { backgroundColor: COLORS.info }]}>
                  {getProgramTypeIcon(item.programType)}
                  <Text style={styles.programTypeText}>{item.programType}</Text>
                </View>
              )}
              <View style={[styles.sourceTypeBadge, { backgroundColor: item.type === 'media' ? COLORS.success + '20' : COLORS.primary + '20' }]}>
                <Text style={[styles.sourceTypeText, { color: item.type === 'media' ? COLORS.success : COLORS.primary }]}>
                  {item.type === 'media' ? 'Media' : 'News'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleShare(item)}>
              <Share2 size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsDescription} numberOfLines={2}>{item.description}</Text>

          <View style={styles.newsFooter}>
            <View style={styles.newsMetaLeft}>
              <Text style={styles.newsSource} numberOfLines={1}>Source: {item.source}</Text>
              {item.date && (
                <View style={styles.dateRow}>
                  <Text style={styles.newsDivider}>•</Text>
                  <Text style={styles.newsDate} numberOfLines={1}>{item.date}</Text>
                </View>
              )}
            </View>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]} numberOfLines={1}>
                {item.category}
              </Text>
            </View>
          </View>

          <View style={styles.externalLink}>
            <ExternalLink size={14} color={stateColors.primary} />
            <Text style={[styles.externalLinkText, { color: stateColors.primary }]}>Read full article</Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Image
            source={require('@/assets/images/WhatsApp Image 2025-11-08 at 09.39.48_7cb724fe.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Media & News</Text>
        <TouchableOpacity onPress={handleFetchLiveNews} disabled={newsLoading} style={styles.liveNewsButton}>
          <RefreshCw size={18} color={newsLoading ? COLORS.textSecondary : COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersSection}>
        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports and news..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        <View style={styles.sourceTabs}>
          {SOURCE_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.sourceTab, selectedSource === tab && styles.sourceTabActive]}
              onPress={() => setSelectedSource(tab)}
            >
              <Text style={[styles.sourceTabText, selectedSource === tab && styles.sourceTabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {STATE_FILTERS.map((state) => (
            <TouchableOpacity
              key={state}
              style={[styles.chip, selectedState === state && styles.chipActive]}
              onPress={() => setSelectedState(state)}
            >
              <Text style={[styles.chipText, selectedState === state && styles.chipTextActive]}>{state}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {categoriesList.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.chip, selectedCategory === category && styles.chipActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.chipText, selectedCategory === category && styles.chipTextActive]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredData.length} results found</Text>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerStyle={styles.newsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Newspaper size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No articles found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { width: 50, height: 50 },
  headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.white, flex: 1, marginLeft: SPACING.md },
  liveNewsButton: { backgroundColor: COLORS.white + '20', padding: SPACING.sm, borderRadius: 20 },

  filtersSection: { backgroundColor: COLORS.white, padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 8, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginBottom: SPACING.sm },
  searchInput: { flex: 1, marginLeft: SPACING.sm, ...TYPOGRAPHY.body1, color: COLORS.text },

  sourceTabs: { flexDirection: 'row', marginBottom: SPACING.sm },
  sourceTab: { flex: 1, paddingVertical: SPACING.sm, alignItems: 'center', borderRadius: 8, backgroundColor: COLORS.surface, marginHorizontal: 2 },
  sourceTabActive: { backgroundColor: COLORS.primary },
  sourceTabText: { ...TYPOGRAPHY.body2, color: COLORS.text, fontWeight: '600' },
  sourceTabTextActive: { color: COLORS.white },

  filterScroll: { marginBottom: SPACING.xs },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { ...TYPOGRAPHY.caption, color: COLORS.text },
  chipTextActive: { color: COLORS.white, fontWeight: '600' },

  resultsHeader: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: COLORS.surface },
  resultsCount: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },

  newsList: { padding: SPACING.md },
  newsCard: { marginBottom: SPACING.md, padding: SPACING.md },
  newsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.sm },
  headerBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, flex: 1 },
  stateBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: 4 },
  stateBadgeText: { ...TYPOGRAPHY.caption, color: COLORS.white, fontWeight: '700', fontSize: 10 },
  programTypeBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: 4, gap: 4 },
  programTypeText: { ...TYPOGRAPHY.caption, color: COLORS.white, fontWeight: '600', fontSize: 10 },
  sourceTypeBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: 4 },
  sourceTypeText: { ...TYPOGRAPHY.caption, fontWeight: '600', fontSize: 10 },

  newsTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.xs },
  newsDescription: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.sm },

  newsFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  newsMetaLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, overflow: 'hidden' },
  newsSource: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontWeight: '600' },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  newsDivider: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginHorizontal: SPACING.xs },
  newsDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },

  categoryBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: 8, marginLeft: SPACING.xs },
  categoryText: { ...TYPOGRAPHY.caption, fontWeight: '600', fontSize: 10 },

  externalLink: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 6 },
  externalLinkText: { ...TYPOGRAPHY.caption, marginLeft: SPACING.xs, fontWeight: '700' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: SPACING.xl * 2 },
  emptyText: { ...TYPOGRAPHY.h4, color: COLORS.textSecondary, marginTop: SPACING.md },
  emptySubtext: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginTop: SPACING.xs },
});
