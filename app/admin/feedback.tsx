import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { Badge } from '@/src/components/Badge';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import {
  MessageSquare,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Send,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

const ADMIN_FEEDBACK_DATA = [
  {
    id: '1',
    facility: 'Ikeja Primary Healthcare Centre',
    issue: 'Equipment Shortage',
    category: 'Equipment Shortage',
    tags: ['Urgent', 'Equipment'],
    description: 'X-ray machine not working for 2 weeks',
    status: 'pending',
    isRead: true,
    actionTaken: 'Under review by state admin',
    adminMessage: 'We have received your report. Our technical team will visit the facility within 48 hours.',
    submittedAt: '2025-10-28T10:30:00',
    reporterName: 'John Doe',
    reporterEmail: 'john@example.com',
  },
  {
    id: '2',
    facility: 'Lekki PHC',
    issue: 'Excellent Staff Service',
    category: 'Service Quality',
    tags: ['Compliment', 'Staff'],
    description: 'Nurses were very professional and caring',
    status: 'resolved',
    isRead: true,
    actionTaken: 'Feedback shared with staff',
    adminMessage: 'Thank you for your positive feedback! We have commended the staff for their excellent service.',
    submittedAt: '2025-10-25T14:20:00',
    reporterName: 'Jane Smith',
    reporterEmail: 'jane@example.com',
  },
  {
    id: '3',
    facility: 'Victoria Island Health Center',
    issue: 'Long Wait Times',
    category: 'Wait Times',
    tags: ['Complaint', 'Routine'],
    description: 'Waited 3 hours for consultation',
    status: 'critical',
    isRead: false,
    actionTaken: null,
    adminMessage: null,
    submittedAt: '2025-10-27T09:15:00',
    reporterName: 'Ahmed Musa',
    reporterEmail: 'ahmed@example.com',
  },
];

export default function AdminFeedbackScreen() {
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [actionText, setActionText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredFeedback = ADMIN_FEEDBACK_DATA.filter(feedback =>
    filterStatus === 'all' || feedback.status === filterStatus
  );

  const handleSendResponse = () => {
    if (!responseText.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Response Required',
        text2: 'Please enter a response message',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Response Sent',
      text2: 'Your response has been sent to the user',
    });

    setShowResponseModal(false);
    setResponseText('');
    setActionText('');
  };

  const handleMarkAsRead = (feedbackId: string) => {
    Toast.show({
      type: 'success',
      text1: 'Marked as Read',
      text2: 'Feedback has been marked as read',
    });
  };

  const handleTakeAction = (feedbackId: string) => {
    if (!actionText.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Action Required',
        text2: 'Please describe the action taken',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Action Recorded',
      text2: 'Action has been recorded and user notified',
    });

    setShowResponseModal(false);
    setResponseText('');
    setActionText('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return COLORS.success;
      case 'pending': return COLORS.warning;
      case 'critical': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  const renderFeedbackCard = (feedback: any) => (
    <TouchableOpacity
      key={feedback.id}
      onPress={() => setSelectedFeedback(feedback)}
    >
      <Card style={styles.feedbackCard} variant="elevated">
        <View style={styles.feedbackCardHeader}>
          <View style={styles.feedbackStatus}>
            <Badge
              label={feedback.status.toUpperCase()}
              variant={feedback.status === 'critical' ? 'high' : feedback.status === 'resolved' ? 'low' : 'medium'}
            />
            {feedback.isRead ? (
              <Eye size={16} color={COLORS.success} />
            ) : (
              <EyeOff size={16} color={COLORS.textSecondary} />
            )}
          </View>
          <Text style={styles.feedbackDate}>
            {new Date(feedback.submittedAt).toLocaleDateString()}
          </Text>
        </View>

        <Text style={styles.feedbackIssue}>{feedback.issue}</Text>
        <Text style={styles.feedbackFacility}>{feedback.facility}</Text>

        <View style={styles.feedbackTags}>
          {feedback.tags.map((tag: string) => (
            <View key={tag} style={styles.miniTag}>
              <Text style={styles.miniTagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.feedbackMeta}>
          <Text style={styles.reporterName}>By: {feedback.reporterName}</Text>
          {feedback.actionTaken && (
            <View style={styles.actionBadge}>
              <CheckCircle size={14} color={COLORS.success} />
              <Text style={styles.actionText}>Action taken</Text>
            </View>
          )}
          {feedback.adminMessage && (
            <View style={styles.messageBadge}>
              <MessageSquare size={14} color={COLORS.info} />
              <Text style={styles.messageText}>Responded</Text>
            </View>
          )}
        </View>

        {!feedback.isRead && (
          <TouchableOpacity
            style={styles.markReadButton}
            onPress={() => handleMarkAsRead(feedback.id)}
          >
            <Eye size={16} color={COLORS.primary} />
            <Text style={styles.markReadText}>Mark as Read</Text>
          </TouchableOpacity>
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feedback Management</Text>
        <Text style={styles.headerSubtitle}>Handle user feedback and complaints</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {['all', 'pending', 'critical', 'resolved'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[styles.filterTab, filterStatus === status && styles.filterTabActive]}
            onPress={() => setFilterStatus(status)}
          >
            <Text style={[styles.filterTabText, filterStatus === status && styles.filterTabTextActive]}>
              {status === 'all' ? 'All Feedback' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsRow}>
          <Card style={styles.statCard} variant="elevated">
            <MessageSquare size={24} color={COLORS.info} />
            <Text style={styles.statValue}>{ADMIN_FEEDBACK_DATA.length}</Text>
            <Text style={styles.statLabel}>Total Feedback</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <Clock size={24} color={COLORS.warning} />
            <Text style={styles.statValue}>{ADMIN_FEEDBACK_DATA.filter(f => f.status === 'pending').length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card>
          <Card style={styles.statCard} variant="elevated">
            <AlertCircle size={24} color={COLORS.error} />
            <Text style={styles.statValue}>{ADMIN_FEEDBACK_DATA.filter(f => f.status === 'critical').length}</Text>
            <Text style={styles.statLabel}>Critical</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback Items ({filteredFeedback.length})</Text>
          {filteredFeedback.map(renderFeedbackCard)}
        </View>
      </ScrollView>

      {/* Feedback Detail Modal */}
      <Modal visible={!!selectedFeedback} animationType="slide" presentationStyle="pageSheet">
        {selectedFeedback && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Feedback Details</Text>
              <TouchableOpacity onPress={() => setSelectedFeedback(null)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.detailContainer}>
              <View style={styles.detailHeader}>
                <Badge
                  label={selectedFeedback.status.toUpperCase()}
                  variant={selectedFeedback.status === 'critical' ? 'high' : selectedFeedback.status === 'resolved' ? 'low' : 'medium'}
                />
                <View style={styles.readStatus}>
                  {selectedFeedback.isRead ? (
                    <>
                      <Eye size={20} color={COLORS.success} />
                      <Text style={[styles.readText, { color: COLORS.success }]}>Read by admin</Text>
                    </>
                  ) : (
                    <>
                      <EyeOff size={20} color={COLORS.textSecondary} />
                      <Text style={[styles.readText, { color: COLORS.textSecondary }]}>Not read yet</Text>
                    </>
                  )}
                </View>
              </View>

              <Text style={styles.detailIssue}>{selectedFeedback.issue}</Text>
              <Text style={styles.detailFacility}>{selectedFeedback.facility}</Text>
              <Text style={styles.detailCategory}>Category: {selectedFeedback.category}</Text>

              <View style={styles.detailTags}>
                {selectedFeedback.tags.map((tag: string) => (
                  <View key={tag} style={styles.detailTag}>
                    <Text style={styles.detailTagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <Card style={styles.descriptionCard} variant="outlined">
                <Text style={styles.descriptionLabel}>Description:</Text>
                <Text style={styles.descriptionText}>{selectedFeedback.description}</Text>
              </Card>

              <Card style={styles.reporterCard} variant="outlined">
                <Text style={styles.reporterTitle}>Reporter Information</Text>
                <Text style={styles.reporterInfo}>Name: {selectedFeedback.reporterName}</Text>
                <Text style={styles.reporterInfo}>Email: {selectedFeedback.reporterEmail}</Text>
              </Card>

              <Text style={styles.submittedDate}>
                Submitted: {new Date(selectedFeedback.submittedAt).toLocaleString()}
              </Text>

              {selectedFeedback.actionTaken && (
                <Card style={styles.actionCard} variant="elevated">
                  <View style={styles.actionHeader}>
                    <CheckCircle size={20} color={COLORS.success} />
                    <Text style={styles.actionTitle}>Action Taken</Text>
                  </View>
                  <Text style={styles.actionDescription}>{selectedFeedback.actionTaken}</Text>
                </Card>
              )}

              {selectedFeedback.adminMessage && (
                <Card style={styles.messageCard} variant="elevated">
                  <View style={styles.messageHeader}>
                    <MessageSquare size={20} color={COLORS.info} />
                    <Text style={styles.messageTitle}>Admin Response</Text>
                  </View>
                  <Text style={styles.messageDescription}>{selectedFeedback.adminMessage}</Text>
                </Card>
              )}

              {!selectedFeedback.actionTaken && !selectedFeedback.adminMessage && (
                <Card style={styles.pendingCard} variant="outlined">
                  <Clock size={24} color={COLORS.warning} />
                  <Text style={styles.pendingText}>
                    This feedback requires attention. Take action and respond to the user.
                  </Text>
                </Card>
              )}

              <View style={styles.detailActions}>
                {!selectedFeedback.isRead && (
                  <Button
                    title="Mark as Read"
                    onPress={() => {
                      handleMarkAsRead(selectedFeedback.id);
                      setSelectedFeedback({ ...selectedFeedback, isRead: true });
                    }}
                    variant="outline"
                    style={{ flex: 1, marginRight: SPACING.sm }}
                  />
                )}
                <Button
                  title="Respond & Take Action"
                  onPress={() => setShowResponseModal(true)}
                  style={{ flex: 1 }}
                />
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* Response Modal */}
      <Modal visible={showResponseModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Respond to Feedback</Text>
            <TouchableOpacity onPress={() => setShowResponseModal(false)}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.responseContainer}>
            <Text style={styles.responseLabel}>Action Taken (Optional)</Text>
            <TextInput
              style={styles.actionInput}
              placeholder="Describe the action taken..."
              value={actionText}
              onChangeText={setActionText}
              multiline
              numberOfLines={3}
              placeholderTextColor={COLORS.textSecondary}
            />

            <Text style={styles.responseLabel}>Response Message *</Text>
            <TextInput
              style={styles.responseInput}
              placeholder="Enter your response to the user..."
              value={responseText}
              onChangeText={setResponseText}
              multiline
              numberOfLines={6}
              placeholderTextColor={COLORS.textSecondary}
            />

            <View style={styles.responseActions}>
              <Button
                title="Cancel"
                onPress={() => setShowResponseModal(false)}
                variant="outline"
                style={{ flex: 1, marginRight: SPACING.sm }}
              />
              <Button
                title="Send Response"
                onPress={handleSendResponse}
                style={{ flex: 1 }}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: SPACING.lg, paddingTop: SPACING.xl + 20 },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white },
  headerSubtitle: { ...TYPOGRAPHY.body2, color: COLORS.white, opacity: 0.9, marginTop: SPACING.xs },

  filterTabs: { flexDirection: 'row', backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filterTab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center' },
  filterTabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  filterTabText: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary },
  filterTabTextActive: { color: COLORS.primary, fontWeight: '600' },

  content: { flex: 1 },
  statsRow: { flexDirection: 'row', padding: SPACING.md, gap: SPACING.sm },
  statCard: { flex: 1, alignItems: 'center', padding: SPACING.md },
  statValue: { ...TYPOGRAPHY.h2, color: COLORS.text, marginTop: SPACING.xs },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },

  section: { padding: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },

  feedbackCard: { marginBottom: SPACING.md },
  feedbackCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  feedbackStatus: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  feedbackDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  feedbackIssue: { ...TYPOGRAPHY.body1, fontWeight: '600', marginBottom: SPACING.xs },
  feedbackFacility: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  feedbackTags: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.sm },
  miniTag: { paddingHorizontal: SPACING.xs, paddingVertical: 2, borderRadius: 4, backgroundColor: COLORS.primary + '20' },
  miniTagText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontSize: 10 },

  feedbackMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reporterName: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  actionBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  actionText: { ...TYPOGRAPHY.caption, color: COLORS.success, fontWeight: '600' },
  messageBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  messageText: { ...TYPOGRAPHY.caption, color: COLORS.info, fontWeight: '600' },

  markReadButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', padding: SPACING.sm, borderRadius: 6, backgroundColor: COLORS.primary + '20', gap: SPACING.xs, marginTop: SPACING.sm },
  markReadText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },

  modalContainer: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingTop: SPACING.xl + 20 },
  modalTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },

  detailContainer: { flex: 1, padding: SPACING.lg },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  readStatus: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  readText: { ...TYPOGRAPHY.body2, fontWeight: '600' },
  detailIssue: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.xs },
  detailFacility: { ...TYPOGRAPHY.body1, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  detailCategory: { ...TYPOGRAPHY.body2, color: COLORS.text, marginBottom: SPACING.sm },
  detailTags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  detailTag: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: 16, backgroundColor: COLORS.primary + '20' },
  detailTagText: { ...TYPOGRAPHY.body2, color: COLORS.primary, fontWeight: '600' },

  descriptionCard: { marginBottom: SPACING.md },
  descriptionLabel: { ...TYPOGRAPHY.body2, fontWeight: '600', marginBottom: SPACING.xs },
  descriptionText: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary },

  reporterCard: { marginBottom: SPACING.md },
  reporterTitle: { ...TYPOGRAPHY.body2, fontWeight: '600', marginBottom: SPACING.sm },
  reporterInfo: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.xs },

  submittedDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.lg },

  actionCard: { backgroundColor: COLORS.success + '10', marginBottom: SPACING.md },
  actionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  actionTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.success },
  actionDescription: { ...TYPOGRAPHY.body2, color: COLORS.text },

  messageCard: { backgroundColor: COLORS.info + '10', marginBottom: SPACING.md },
  messageHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  messageTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.info },
  messageDescription: { ...TYPOGRAPHY.body2, color: COLORS.text },

  pendingCard: { alignItems: 'center', padding: SPACING.lg, marginBottom: SPACING.md },
  pendingText: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.sm },

  detailActions: { flexDirection: 'row', marginTop: SPACING.lg },

  responseContainer: { flex: 1, padding: SPACING.lg },
  responseLabel: { ...TYPOGRAPHY.body2, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.sm, marginTop: SPACING.md },
  actionInput: { ...TYPOGRAPHY.body1, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SPACING.md, minHeight: 80, textAlignVertical: 'top', marginBottom: SPACING.md },
  responseInput: { ...TYPOGRAPHY.body1, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SPACING.md, minHeight: 120, textAlignVertical: 'top', marginBottom: SPACING.lg },
  responseActions: { flexDirection: 'row' },
});