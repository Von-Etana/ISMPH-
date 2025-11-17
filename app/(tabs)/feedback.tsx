import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { Badge } from '@/src/components/Badge';
import { SocialFooter } from '@/src/components/SocialFooter';
import { COLORS, SPACING, TYPOGRAPHY, STATES, FEEDBACK_CATEGORIES, FEEDBACK_TAGS } from '@/src/constants/theme';
import {
  MapPin,
  FileText,
  AlertCircle,
  Clock,
  CheckCircle,
  Search,
  X,
  Eye,
  EyeOff,
  MessageSquare,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

const PHC_FACILITIES = [
  { id: '1', name: 'Ikeja Primary Healthcare Centre', state: 'Lagos', address: 'Ikeja LGA', reports: 5 },
  { id: '2', name: 'Lekki PHC', state: 'Lagos', address: 'Lekki Phase 1', reports: 3 },
  { id: '3', name: 'Victoria Island Health Center', state: 'Lagos', address: 'Victoria Island', reports: 2 },
  { id: '4', name: 'Wuse District Hospital', state: 'Abuja', address: 'Wuse Zone 3', reports: 4 },
  { id: '5', name: 'Garki General Hospital', state: 'Abuja', address: 'Garki Area 11', reports: 1 },
  { id: '6', name: 'Kano Municipal PHC', state: 'Kano', address: 'Kano Municipal', reports: 6 },
  { id: '7', name: 'Fagge Health Centre', state: 'Kano', address: 'Fagge LGA', reports: 2 },
  { id: '8', name: 'Kaduna Central PHC', state: 'Kaduna', address: 'Kaduna Central', reports: 3 },
];

const STATE_STATS = [
  { state: 'Lagos', total: 10, pending: 4, resolved: 5, critical: 1 },
  { state: 'Abuja', total: 8, pending: 3, resolved: 5, critical: 0 },
  { state: 'Kano', total: 12, pending: 5, resolved: 6, critical: 1 },
  { state: 'Kaduna', total: 6, pending: 2, resolved: 4, critical: 0 },
];

const MY_FEEDBACK_DATA = [
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
  },
];

export default function FeedbackScreen() {
  const [showPHCList, setShowPHCList] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showMyFeedback, setShowMyFeedback] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Service Quality');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredPHC = PHC_FACILITIES.filter(
    (phc) =>
      (selectedState === 'All' || phc.state === selectedState) &&
      (searchQuery === '' || phc.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitFeedback = () => {
    if (!selectedFacility || !feedbackText || selectedTags.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please select facility, category, tags, and describe the issue',
      });
      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Feedback Submitted',
      text2: 'Your report has been sent to the administrator',
    });
    setShowFeedbackForm(false);
    setSelectedFacility(null);
    setFeedbackText('');
    setSelectedCategory('Service Quality');
    setSelectedTags([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return COLORS.success;
      case 'pending': return COLORS.warning;
      case 'critical': return COLORS.error;
      default: return COLORS.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/WhatsApp Image 2025-11-08 at 09.39.48_7cb724fe.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>ISMPH Feedback System</Text>
        <Text style={styles.headerSubtitle}>Find facilities, report issues, and track alerts</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.actionsRow}>
          <Card style={styles.actionCard} variant="elevated" onPress={() => setShowPHCList(true)}>
            <View style={[styles.actionIcon, { backgroundColor: COLORS.primary + '20' }]}>
              <MapPin size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.actionTitle}>Find PHC</Text>
            <Text style={styles.actionSubtitle}>Locate facilities</Text>
          </Card>

          <Card style={styles.actionCard} variant="elevated" onPress={() => setShowFeedbackForm(true)}>
            <View style={[styles.actionIcon, { backgroundColor: COLORS.secondary + '20' }]}>
              <FileText size={32} color={COLORS.secondary} />
            </View>
            <Text style={styles.actionTitle}>Report PHC</Text>
            <Text style={styles.actionSubtitle}>Submit issues</Text>
          </Card>

          <Card style={styles.actionCard} variant="elevated" onPress={() => setShowMyFeedback(true)}>
            <View style={[styles.actionIcon, { backgroundColor: COLORS.info + '20' }]}>
              <AlertCircle size={32} color={COLORS.info} />
            </View>
            <Text style={styles.actionTitle}>View Feedback</Text>
            <Text style={styles.actionSubtitle}>Track reports</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>State PHC Reports Summary</Text>
          {STATE_STATS.map((stat) => (
            <Card key={stat.state} style={styles.stateCard} variant="outlined">
              <View style={styles.stateHeader}>
                <Text style={styles.stateName}>{stat.state}</Text>
                <Badge label={stat.total + ' Total'} />
              </View>
              <View style={styles.stateStats}>
                <View style={styles.statItem}>
                  <MapPin size={20} color={COLORS.info} />
                  <Text style={styles.statValue}>{stat.total}</Text>
                  <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statItem}>
                  <Clock size={20} color={COLORS.warning} />
                  <Text style={styles.statValue}>{stat.pending}</Text>
                  <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statItem}>
                  <CheckCircle size={20} color={COLORS.success} />
                  <Text style={styles.statValue}>{stat.resolved}</Text>
                  <Text style={styles.statLabel}>Resolved</Text>
                </View>
                <View style={styles.statItem}>
                  <AlertCircle size={20} color={COLORS.error} />
                  <Text style={styles.statValue}>{stat.critical}</Text>
                  <Text style={styles.statLabel}>Critical</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Card style={styles.alertBanner} variant="elevated">
            <View style={styles.alertHeader}>
              <AlertCircle size={24} color={COLORS.error} />
              <Text style={styles.alertTitle}>1 Critical Alert Requires Immediate Attention</Text>
            </View>
          </Card>
        </View>

        <SocialFooter />
      </ScrollView>

      {/* PHC Finder Modal */}
      <Modal visible={showPHCList} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Find PHC Facilities</Text>
            <TouchableOpacity onPress={() => setShowPHCList(false)}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchSection}>
            <View style={styles.searchBar}>
              <Search size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search facilities..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stateFilter}>
              {['All', ...STATES].map((state) => (
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

          <ScrollView style={styles.phcList}>
            {filteredPHC.map((phc) => (
              <Card key={phc.id} style={styles.phcCard} variant="outlined">
                <View style={styles.phcHeader}>
                  <MapPin size={20} color={COLORS.primary} />
                  <Text style={styles.phcName}>{phc.name}</Text>
                </View>
                <Text style={styles.phcAddress}>{phc.address}, {phc.state}</Text>
                <Text style={styles.phcReports}>{phc.reports} reports submitted</Text>
              </Card>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Feedback Form Modal */}
      <Modal visible={showFeedbackForm} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Report PHC Issue</Text>
            <TouchableOpacity onPress={() => setShowFeedbackForm(false)}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <Text style={styles.formLabel}>Select Facility *</Text>
            <ScrollView style={styles.facilityList}>
              {PHC_FACILITIES.map((phc) => (
                <TouchableOpacity
                  key={phc.id}
                  style={[
                    styles.facilityOption,
                    selectedFacility?.id === phc.id && styles.facilityOptionActive,
                  ]}
                  onPress={() => setSelectedFacility(phc)}
                >
                  <Text style={[styles.facilityOptionText, selectedFacility?.id === phc.id && styles.facilityOptionTextActive]}>
                    {phc.name} ({phc.state})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.formLabel}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
              {FEEDBACK_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.categoryChipText, selectedCategory === cat && styles.categoryChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.formLabel}>Tags * (Select one or more)</Text>
            <View style={styles.tagsGrid}>
              {FEEDBACK_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagChip, selectedTags.includes(tag) && styles.tagChipActive]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[styles.tagChipText, selectedTags.includes(tag) && styles.tagChipTextActive]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.formLabel}>Describe the Issue *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Provide details..."
              value={feedbackText}
              onChangeText={setFeedbackText}
              multiline
              numberOfLines={6}
              placeholderTextColor={COLORS.textSecondary}
            />

            <View style={styles.formActions}>
              <Button title="Cancel" onPress={() => setShowFeedbackForm(false)} variant="outline" style={{ flex: 1, marginRight: SPACING.sm }} />
              <Button title="Submit" onPress={handleSubmitFeedback} style={{ flex: 1 }} />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* My Feedback Modal */}
      <Modal visible={showMyFeedback} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>My Feedback ({MY_FEEDBACK_DATA.length})</Text>
            <TouchableOpacity onPress={() => setShowMyFeedback(false)}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.feedbackList}>
            {MY_FEEDBACK_DATA.map((feedback) => (
              <TouchableOpacity
                key={feedback.id}
                onPress={() => setSelectedFeedback(feedback)}
              >
                <Card style={styles.feedbackCard} variant="outlined">
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
                    {feedback.tags.map((tag) => (
                      <View key={tag} style={styles.miniTag}>
                        <Text style={styles.miniTagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  {feedback.actionTaken && (
                    <View style={styles.actionBadge}>
                      <CheckCircle size={14} color={COLORS.success} />
                      <Text style={styles.actionText}>Action taken</Text>
                    </View>
                  )}
                  {feedback.adminMessage && (
                    <View style={styles.messageBadge}>
                      <MessageSquare size={14} color={COLORS.info} />
                      <Text style={styles.messageText}>Admin replied</Text>
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

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
                    Your feedback is being reviewed by the administrator. You will be notified once action is taken.
                  </Text>
                </Card>
              )}
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: SPACING.lg, paddingTop: SPACING.xl + 20, alignItems: 'center' },
  logo: { width: 60, height: 60, marginBottom: SPACING.sm },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white },
  headerSubtitle: { ...TYPOGRAPHY.body2, color: COLORS.white, opacity: 0.9, marginTop: SPACING.xs },
  content: { flex: 1 },
  actionsRow: { flexDirection: 'row', padding: SPACING.md, gap: SPACING.sm },
  actionCard: { flex: 1, alignItems: 'center', padding: SPACING.md },
  actionIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  actionTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', textAlign: 'center', marginBottom: SPACING.xs },
  actionSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, textAlign: 'center' },
  section: { padding: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },
  stateCard: { marginBottom: SPACING.md },
  stateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  stateName: { ...TYPOGRAPHY.h4, color: COLORS.text },
  stateStats: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center' },
  statValue: { ...TYPOGRAPHY.body1, fontWeight: '600', marginTop: SPACING.xs },
  statLabel: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },
  alertBanner: { backgroundColor: COLORS.error + '10', padding: SPACING.md },
  alertHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  alertTitle: { ...TYPOGRAPHY.body1, color: COLORS.error, fontWeight: '600', flex: 1 },
  modalContainer: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingTop: SPACING.xl + 20 },
  modalTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
  searchSection: { padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 8, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginBottom: SPACING.sm },
  searchInput: { flex: 1, marginLeft: SPACING.sm, ...TYPOGRAPHY.body1, color: COLORS.text },
  stateFilter: { flexDirection: 'row' },
  stateChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 20, backgroundColor: COLORS.surface, marginRight: SPACING.sm },
  stateChipActive: { backgroundColor: COLORS.primary },
  stateChipText: { ...TYPOGRAPHY.body2, color: COLORS.text },
  stateChipTextActive: { color: COLORS.white, fontWeight: '600' },
  phcList: { flex: 1, padding: SPACING.md },
  phcCard: { marginBottom: SPACING.md },
  phcHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.xs },
  phcName: { ...TYPOGRAPHY.body1, fontWeight: '600', flex: 1 },
  phcAddress: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  phcReports: { ...TYPOGRAPHY.caption, color: COLORS.primary },
  formContainer: { flex: 1, padding: SPACING.lg },
  formLabel: { ...TYPOGRAPHY.body2, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.sm, marginTop: SPACING.md },
  facilityList: { maxHeight: 200, marginBottom: SPACING.sm },
  facilityOption: { padding: SPACING.md, borderRadius: 8, backgroundColor: COLORS.surface, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  facilityOptionActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  facilityOptionText: { ...TYPOGRAPHY.body2, color: COLORS.text },
  facilityOptionTextActive: { color: COLORS.white, fontWeight: '600' },
  categoryRow: { marginBottom: SPACING.sm },
  categoryChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 8, backgroundColor: COLORS.surface, marginRight: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  categoryChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoryChipText: { ...TYPOGRAPHY.body2, color: COLORS.text },
  categoryChipTextActive: { color: COLORS.white, fontWeight: '600' },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm },
  tagChip: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: 16, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  tagChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tagChipText: { ...TYPOGRAPHY.caption, color: COLORS.text },
  tagChipTextActive: { color: COLORS.white, fontWeight: '600' },
  textArea: { ...TYPOGRAPHY.body1, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: SPACING.md, minHeight: 120, textAlignVertical: 'top', marginBottom: SPACING.lg },
  formActions: { flexDirection: 'row', marginTop: SPACING.lg },
  feedbackList: { flex: 1, padding: SPACING.md },
  feedbackCard: { marginBottom: SPACING.md },
  feedbackCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  feedbackStatus: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  feedbackDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  feedbackIssue: { ...TYPOGRAPHY.body1, fontWeight: '600', marginBottom: SPACING.xs },
  feedbackFacility: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginBottom: SPACING.xs },
  feedbackTags: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.xs },
  miniTag: { paddingHorizontal: SPACING.xs, paddingVertical: 2, borderRadius: 4, backgroundColor: COLORS.primary + '20' },
  miniTagText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontSize: 10 },
  actionBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xs },
  actionText: { ...TYPOGRAPHY.caption, color: COLORS.success, fontWeight: '600' },
  messageBadge: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xs },
  messageText: { ...TYPOGRAPHY.caption, color: COLORS.info, fontWeight: '600' },
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
  submittedDate: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  actionCard: { backgroundColor: COLORS.success + '10', marginBottom: SPACING.md },
  actionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  actionTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.success },
  actionDescription: { ...TYPOGRAPHY.body2, color: COLORS.text },
  messageCard: { backgroundColor: COLORS.info + '10', marginBottom: SPACING.md },
  messageHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  messageTitle: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.info },
  messageDescription: { ...TYPOGRAPHY.body2, color: COLORS.text },
  pendingCard: { alignItems: 'center', padding: SPACING.lg },
  pendingText: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.sm },
});
