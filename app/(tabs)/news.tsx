import React, { useState, useEffect } from 'react';
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
import { Badge } from '@/src/components/Badge';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { Search, Share2, ExternalLink, RefreshCw, Newspaper, Radio, Tv, Globe, Instagram } from 'lucide-react-native';
import { ALL_NEWS_DATA, NewsArticle } from '@/src/constants/newsData';
import {
  ALL_MEDIA_REPORTS,
  MediaReport,
  STATE_COLORS,
  THEMATIC_COLORS,
  ALL_THEMATIC_AREAS,
  ALL_PROGRAM_TYPES,
  StateCode,
  ProgramType
} from '@/src/constants/mediaReportsData';
import { router, useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store';
import { fetchTopHeadlines, searchNews } from '@/src/store/slices/newsSlice';
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
  programType?: ProgramType;
};

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
    category: report.thematicArea,
    priority: 'medium',
    date: report.month,
    programType: report.programType,
  }));
};

// Convert news articles to combined format
const convertNewsArticles = (articles: NewsArticle[]): CombinedNewsItem[] => {
  return articles.map(article => ({
    type: 'news' as const,
    id: article.id,
    title: article.title,
    description: article.description,
    source: article.source,
    link: article.url || '',
    state: article.state,
    category: article.category,
    priority: article.priority,
    date: article.date,
  }));
};

const DEMO_NEWS: NewsArticle[] = ALL_NEWS_DATA;

const SOURCE_TABS = ['All', 'Media Reports', 'News Articles'];
const STATE_FILTERS = ['All', 'Kaduna', 'Kano', 'Lagos'];

export default function NewsScreen() {
  const { category: initialCategory } = useLocalSearchParams<{ category?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { articles: newsArticles, loading: newsLoading } = useSelector((state: RootState) => state.news);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedProgramType, setSelectedProgramType] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);

  // Combine all data sources
  const mediaReportsData = convertMediaReports(ALL_MEDIA_REPORTS);
  const newsData = newsArticles.length > 0
    ? convertNewsArticles(newsArticles as unknown as NewsArticle[])
    : convertNewsArticles(DEMO_NEWS);

  const allCombinedData: CombinedNewsItem[] = [
    ...mediaReportsData,
    ...newsData,
  ];

  // Get categories based on selection
  const categories = ['All', ...ALL_THEMATIC_AREAS];

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchTopHeadlines()).unwrap();
      Toast.show({
        type: 'success',
        text1: 'News Updated',
        text2: 'Latest health news fetched successfully',
      });
    } catch {
      // Silent fail for refresh
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleFetchLiveNews = async () => {
    try {
      await dispatch(fetchTopHeadlines()).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Live News Loaded',
        text2: 'Showing latest health news from NewsAPI',
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Failed to Load News',
        text2: 'Could not fetch news from NewsAPI',
      });
    }
  };

  // Filter data
  const filteredData = allCombinedData.filter((item) => {
    // Source filter
    if (selectedSource === 'Media Reports' && item.type !== 'media') return false;
    if (selectedSource === 'News Articles' && item.type !== 'news') return false;

    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    // State filter
    const matchesState = selectedState === 'All' || item.state === selectedState;

    // Program type filter (only for media reports)
    const matchesProgramType = selectedProgramType === 'All' ||
      (item.type === 'media' && item.programType === selectedProgramType);

    return matchesSearch && matchesCategory && matchesState &&
      (selectedProgramType === 'All' || item.type === 'news' || matchesProgramType);
  });

  const handleShare = async (item: CombinedNewsItem) => {
    try {
      const message = `${item.title}\n\n${item.description}\n\nRead more: ${item.link}`;
      await Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`);
    } catch {
      await Linking.openURL(`mailto:?subject=${encodeURIComponent(item.title)}&body=${encodeURIComponent(item.description + '\n\n' + item.link)}`);
    }
  };

  const handleItemPress = (item: CombinedNewsItem) => {
    if (item.link) {
      Linking.openURL(item.link);
    }
  };

  const getStateColor = (state?: string): { primary: string; light: string; text: string } => {
    if (state && state in STATE_COLORS) {
      return STATE_COLORS[state as StateCode];
    }
    return { primary: COLORS.primary, light: COLORS.surface, text: COLORS.text };
  };

  const getCategoryColor = (category: string): string => {
    return THEMATIC_COLORS[category] || COLORS.primary;
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
          style={StyleSheet.flatten([
            styles.newsCard,
            { borderLeftWidth: 4, borderLeftColor: stateColors.primary }
          ])}
          variant="elevated"
        >
          {/* Header with badges */}
          <View style={styles.newsHeader}>
            <View style={styles.headerBadges}>
              {/* State badge */}
              {item.state && (
                <View style={[styles.stateBadge, { backgroundColor: stateColors.primary }]}>
                  <Text style={styles.stateBadgeText}>{item.state}</Text>
                </View>
              )}
              {/* Program type badge for media reports */}
              {item.type === 'media' && item.programType && (
                <View style={[styles.programTypeBadge, { backgroundColor: COLORS.info }]}>
                  {getProgramTypeIcon(item.programType)}
                  <Text style={styles.programTypeText}>{item.programType}</Text>
                </View>
              )}
              {/* Source type indicator */}
              <View style={[
                styles.sourceTypeBadge,
                { backgroundColor: item.type === 'media' ? COLORS.success + '20' : COLORS.primary + '20' }
              ]}>
                <Text style={[
                  styles.sourceTypeText,
                  { color: item.type === 'media' ? COLORS.success : COLORS.primary }
                ]}>
                  {item.type === 'media' ? 'Media' : 'News'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleShare(item)}>
              <Share2 size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.newsTitle}>{item.title}</Text>

          {/* Description */}
          <Text style={styles.newsDescription} numberOfLines={2}>{item.description}</Text>

          {/* Footer */}
          <View style={styles.newsFooter}>
            <View style={styles.newsMetaLeft}>
              <Text style={styles.newsSource}>{item.source}</Text>
              {item.date && (
                <>
                  <Text style={styles.newsDivider}>•</Text>
                  <Text style={styles.newsDate}>{item.date}</Text>
                </>
              )}
            </View>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]} numberOfLines={1}>
                {item.category}
              </Text>
            </View>
          </View>

          {/* External link indicator */}
          <View style={styles.externalLink}>
            <ExternalLink size={16} color={stateColors.primary} />
            <Text style={[styles.externalLinkText, { color: stateColors.primary }]}>
              Open link
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Image
            source={require('@/assets/images/WhatsApp Image 2025-11-08 at 09.39.48_7cb724fe.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Media & News</Text>
        <TouchableOpacity
          onPress={handleFetchLiveNews}
          disabled={newsLoading}
          style={styles.liveNewsButton}
        >
          <RefreshCw size={18} color={newsLoading ? COLORS.textSecondary : COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Filters Section */}
      <View style={styles.filtersSection}>
        {/* Search Bar */}
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

        {/* Source Tabs */}
        <View style={styles.sourceTabs}>
          {SOURCE_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.sourceTab, selectedSource === tab && styles.sourceTabActive]}
              onPress={() => setSelectedSource(tab)}
            >
              <Text style={[styles.sourceTabText, selectedSource === tab && styles.sourceTabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* State Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stateScroll}>
          {STATE_FILTERS.map((state) => {
            const colors = state !== 'All' ? STATE_COLORS[state as StateCode] : null;
            return (
              <TouchableOpacity
                key={state}
                style={[
                  styles.stateChip,
                  selectedState === state && styles.stateChipActive,
                  selectedState === state && colors && { backgroundColor: colors.primary }
                ]}
                onPress={() => setSelectedState(state)}
              >
                <Text style={[
                  styles.stateChipText,
                  selectedState === state && styles.stateChipTextActive
                ]}>
                  {state}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Program Type Filter (only when viewing media reports) */}
        {selectedSource !== 'News Articles' && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.programTypeScroll}>
            {['All', ...ALL_PROGRAM_TYPES].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.programTypeChip,
                  selectedProgramType === type && styles.programTypeChipActive
                ]}
                onPress={() => setSelectedProgramType(type)}
              >
                {type !== 'All' && getProgramTypeIcon(type as ProgramType)}
                <Text style={[
                  styles.programTypeChipText,
                  selectedProgramType === type && styles.programTypeChipTextActive
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.slice(0, 10).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
                selectedCategory === category && { backgroundColor: getCategoryColor(category) }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredData.length} {filteredData.length === 1 ? 'result' : 'results'}
        </Text>
      </View>

      {/* News List */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerStyle={styles.newsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Newspaper size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No results found</Text>
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
  liveNewsButton: {
    backgroundColor: COLORS.white + '20',
    padding: SPACING.sm,
    borderRadius: 20,
  },

  filtersSection: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  searchInput: { flex: 1, marginLeft: SPACING.sm, ...TYPOGRAPHY.body1, color: COLORS.text },

  sourceTabs: { flexDirection: 'row', marginBottom: SPACING.sm },
  sourceTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    marginHorizontal: 2,
  },
  sourceTabActive: { backgroundColor: COLORS.primary },
  sourceTabText: { ...TYPOGRAPHY.body2, color: COLORS.text, fontWeight: '600' },
  sourceTabTextActive: { color: COLORS.white },

  stateScroll: { marginBottom: SPACING.sm },
  stateChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stateChipActive: { borderColor: COLORS.primary },
  stateChipText: { ...TYPOGRAPHY.body2, color: COLORS.text },
  stateChipTextActive: { color: COLORS.white, fontWeight: '600' },

  programTypeScroll: { marginBottom: SPACING.sm },
  programTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
    gap: SPACING.xs,
  },
  programTypeChipActive: { backgroundColor: COLORS.info },
  programTypeChipText: { ...TYPOGRAPHY.caption, color: COLORS.text, fontWeight: '600' },
  programTypeChipTextActive: { color: COLORS.white },

  categoryScroll: { marginBottom: SPACING.xs },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
  },
  categoryChipActive: { backgroundColor: COLORS.primary },
  categoryChipText: { ...TYPOGRAPHY.caption, color: COLORS.text },
  categoryChipTextActive: { color: COLORS.white, fontWeight: '600' },

  resultsHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
  },
  resultsCount: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },

  newsList: { padding: SPACING.md },
  newsCard: { marginBottom: SPACING.md },

  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  headerBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, flex: 1 },

  stateBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stateBadgeText: { ...TYPOGRAPHY.caption, color: COLORS.white, fontWeight: '700', fontSize: 10 },

  programTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  programTypeText: { ...TYPOGRAPHY.caption, color: COLORS.white, fontWeight: '600', fontSize: 10 },

  sourceTypeBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sourceTypeText: { ...TYPOGRAPHY.caption, fontWeight: '600', fontSize: 10 },

  newsTitle: { ...TYPOGRAPHY.body1, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.xs },
  newsDescription: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.sm },

  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsMetaLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  newsSource: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, fontWeight: '600' },
  newsDivider: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginHorizontal: SPACING.xs },
  newsDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },

  categoryBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 8,
    maxWidth: 120,
  },
  categoryText: { ...TYPOGRAPHY.caption, fontWeight: '600', fontSize: 10 },

  externalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  externalLinkText: { ...TYPOGRAPHY.caption, marginLeft: SPACING.xs, fontWeight: '600' },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyText: { ...TYPOGRAPHY.h4, color: COLORS.textSecondary, marginTop: SPACING.md },
  emptySubtext: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginTop: SPACING.xs },
});
