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
import { Search, Share2, ExternalLink, RefreshCw } from 'lucide-react-native';
import { ALL_NEWS_DATA, NewsArticle, getNewsByCategory } from '@/src/constants/newsData';
import { router, useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store';
import { fetchNewsFromAPI, fetchTopHeadlines, searchNews, setArticles } from '@/src/store/slices/newsSlice';
import Toast from 'react-native-toast-message';


const DEMO_NEWS: NewsArticle[] = ALL_NEWS_DATA;

const CATEGORIES = [
  'All',
  'RMNCAH',
  'RMNCAH+N',
  'Contributory Health Insurance',
  'PHC Agenda',
  'Capacity Building',
  'Other Health Report',
  'SWAp Unit Activity',
  'Accountability Meeting',
  'Co-creation Meeting',
  'Review Meeting',
  'Alliance Meeting',
  'Immunization'
];

export default function NewsScreen() {
  const { category: initialCategory } = useLocalSearchParams<{ category?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { articles: newsArticles, loading: newsLoading, error: newsError } = useSelector((state: RootState) => state.news);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);
  const [useLiveNews, setUseLiveNews] = useState(false);

  // Use live news from API if available, otherwise fall back to static data
  const currentNewsData = useLiveNews && newsArticles.length > 0 ? newsArticles : DEMO_NEWS;

  useEffect(() => {
    // Optionally fetch news on component mount
    // dispatch(fetchTopHeadlines());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (useLiveNews) {
      try {
        await dispatch(fetchTopHeadlines()).unwrap();
        Toast.show({
          type: 'success',
          text1: 'News Updated',
          text2: 'Latest health news fetched successfully',
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: 'Could not fetch latest news',
        });
      }
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleFetchLiveNews = async () => {
    try {
      await dispatch(fetchTopHeadlines()).unwrap();
      setUseLiveNews(true);
      Toast.show({
        type: 'success',
        text1: 'Live News Loaded',
        text2: 'Showing latest health news from NewsAPI',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Load News',
        text2: 'Could not fetch news from NewsAPI',
      });
    }
  };

  const handleSearchNews = async () => {
    if (searchQuery.trim()) {
      try {
        await dispatch(searchNews({ query: searchQuery + ' health Nigeria' })).unwrap();
        setUseLiveNews(true);
        Toast.show({
          type: 'success',
          text1: 'Search Results',
          text2: `Found news articles for "${searchQuery}"`,
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Search Failed',
          text2: 'Could not search news articles',
        });
      }
    }
  };

  const filteredNews = currentNewsData.filter((article) => {
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || article.priority === selectedPriority;
    const matchesState = selectedState === 'All' || article.state === selectedState;
    return matchesSearch && matchesCategory && matchesPriority && matchesState;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return COLORS.priorityHigh;
      case 'medium': return COLORS.priorityMedium;
      case 'low': return COLORS.priorityLow;
      default: return COLORS.textSecondary;
    }
  };

  const handleShare = async (article: NewsArticle) => {
    try {
      const message = `${article.title}\n\n${article.description}\n\nRead more: ${article.url}`;
      await Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`);
    } catch (error) {
      // Fallback to share sheet
      await Linking.openURL(`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(article.description + '\n\n' + article.url)}`);
    }
  };

  const handleArticlePress = (article: NewsArticle) => {
    Linking.openURL(article.url);
  };

  const renderNewsItem = ({ item }: { item: NewsArticle }) => (
    <TouchableOpacity onPress={() => handleArticlePress(item)}>
      <Card style={styles.newsCard} variant="elevated">
        <View style={styles.newsHeader}>
          <Badge label={item.priority.toUpperCase()} variant={item.priority} type="priority" />
          <TouchableOpacity onPress={() => handleShare(item)}>
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
            <Text style={styles.newsDivider}>•</Text>
            <Text style={styles.newsState}>{item.state}</Text>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: getPriorityColor(item.priority) + '20' }]}>
            <Text style={[styles.categoryText, { color: getPriorityColor(item.priority) }]}>
              {item.category}
            </Text>
          </View>
        </View>
        <View style={styles.externalLink}>
          <ExternalLink size={16} color={COLORS.primary} />
          <Text style={styles.externalLinkText}>Read full article</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Media Reports</Text>
        <TouchableOpacity
          onPress={handleFetchLiveNews}
          disabled={newsLoading}
          style={styles.liveNewsButton}
        >
          <RefreshCw size={20} color={newsLoading ? COLORS.textSecondary : COLORS.primary} />
          <Text style={[styles.liveNewsText, { color: newsLoading ? COLORS.textSecondary : COLORS.primary }]}>
            {newsLoading ? 'Loading...' : 'Live News'}
          </Text>
        </TouchableOpacity>
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

        <View style={styles.stateFilter}>
          <Text style={styles.filterLabel}>Filter by State:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stateScroll}>
            {['All', 'Lagos', 'Kaduna', 'Kano', 'Abuja'].map((state) => (
              <TouchableOpacity
                key={state}
                style={[styles.stateChip, selectedState === state && styles.stateChipActive]}
                onPress={() => setSelectedState(state)}
              >
                <Text style={[styles.stateChipText, selectedState === state && styles.stateChipTextActive]}>
                  {state}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  header: { backgroundColor: COLORS.primary, padding: SPACING.lg, paddingTop: SPACING.xl + 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  logo: { width: 60, height: 60, marginBottom: SPACING.sm },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white, flex: 1, textAlign: 'center' },
  liveNewsButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white + '20', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 20 },
  liveNewsText: { ...TYPOGRAPHY.caption, fontWeight: '600', marginLeft: SPACING.xs },
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
  stateFilter: { marginTop: SPACING.sm },
  filterLabel: { ...TYPOGRAPHY.body2, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.xs },
  stateScroll: { flexDirection: 'row' },
  stateChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  stateChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stateChipText: { ...TYPOGRAPHY.body2, color: COLORS.text },
  stateChipTextActive: { color: COLORS.white, fontWeight: '600' },
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
  newsState: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  categoryBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: 8 },
  categoryText: { ...TYPOGRAPHY.caption, fontWeight: '600' },
  externalLink: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border },
  externalLinkText: { ...TYPOGRAPHY.caption, color: COLORS.primary, marginLeft: SPACING.xs, fontWeight: '600' },
});
