import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store';
import { fetchAllNewsAdmin, updateNewsStatus, deleteNews } from '@/src/store/slices/newsSlice';
import { Card } from '@/src/components/Card';
import { Badge } from '@/src/components/Badge';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { Trash2, CheckCircle, XCircle, ChevronLeft, Globe, Newspaper } from 'lucide-react-native';
import { router } from 'expo-router';
import { NewsArticle, NewsStatus } from '@/src/types';
import Toast from 'react-native-toast-message';

export default function AdminNewsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { allArticles, loading, error } = useSelector((state: RootState) => state.news);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    dispatch(fetchAllNewsAdmin());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  const handleUpdateStatus = (id: string, status: NewsStatus) => {
    const actionText = status === 'approved' ? 'Approve' : 'Reject';
    Alert.alert(
      `${actionText} Article`,
      `Are you sure you want to ${actionText.toLowerCase()} this article?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: actionText,
          style: status === 'approved' ? 'default' : 'destructive',
          onPress: async () => {
            try {
              await dispatch(updateNewsStatus({ id, status })).unwrap();
              Toast.show({ type: 'success', text1: `Article ${status}` });
            } catch (err: any) {
              Toast.show({ type: 'error', text1: 'Error', text2: err });
            }
          },
        },
      ]
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Article',
      'Are you sure you want to permanently delete this article?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteNews(id)).unwrap();
              Toast.show({ type: 'success', text1: 'Article deleted successfully' });
            } catch (err: any) {
              Toast.show({ type: 'error', text1: 'Error deleting article', text2: err });
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: NewsArticle }) => (
    <Card style={styles.newsCard} variant="elevated">
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Badge
            label={item.status}
            variant="custom"
            style={{
              backgroundColor:
                item.status === 'approved'
                  ? COLORS.success
                  : item.status === 'pending'
                  ? COLORS.warning
                  : COLORS.error,
            }}
          />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Trash2 size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>

      <Text style={styles.articleTitle}>{item.title}</Text>
      <Text style={styles.articleSource}>Source: {item.source} • {item.category}</Text>
      <Text style={styles.articleDesc} numberOfLines={3}>{item.description}</Text>

      <View style={styles.actionRow}>
        {item.status !== 'approved' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleUpdateStatus(item.id, 'approved')}
          >
            <CheckCircle size={18} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
        )}
        {item.status !== 'rejected' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleUpdateStatus(item.id, 'rejected')}
          >
            <XCircle size={18} color={COLORS.error} />
            <Text style={[styles.actionButtonText, { color: COLORS.error }]}>Reject</Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage News</Text>
        <View style={styles.headerRight} />
      </View>

      <FlatList
        data={allArticles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        ListEmptyComponent={
          loading ? (
            <LoadingSpinner message="Fetching news..." />
          ) : (
            <View style={styles.emptyContainer}>
              <Newspaper size={48} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No news articles found in database</Text>
              <Text style={styles.emptySubtext}>Approval queue is currently empty</Text>
            </View>
          )
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
  backButton: { padding: SPACING.xs },
  headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.white },
  headerRight: { width: 40 },
  listContent: { padding: SPACING.md, paddingBottom: SPACING.xl },
  newsCard: { marginBottom: SPACING.md, padding: SPACING.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  dateText: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  articleTitle: { ...TYPOGRAPHY.h4, color: COLORS.text, marginBottom: SPACING.xs },
  articleSource: { ...TYPOGRAPHY.caption, fontWeight: '600', color: COLORS.primary, marginBottom: SPACING.sm },
  articleDesc: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.md },
  actionRow: { flexDirection: 'row', gap: SPACING.sm },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    gap: SPACING.xs,
  },
  approveButton: { backgroundColor: COLORS.success },
  rejectButton: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.error },
  actionButtonText: { ...TYPOGRAPHY.button, fontSize: 14, color: COLORS.white },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100, opacity: 0.5 },
  emptyText: { ...TYPOGRAPHY.h4, color: COLORS.text, marginTop: SPACING.md },
  emptySubtext: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginTop: SPACING.xs },
});
