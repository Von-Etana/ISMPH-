import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store';
import { Card } from '@/src/components/Card';
import { Button } from '@/src/components/Button';
import { Badge } from '@/src/components/Badge';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import {
  MessageCircle,
  Send,
  Users,
  MapPin,
  X,
  Phone,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { ChatService } from '@/src/services/chatService';
import { Message } from '@/src/types';
// Constants for magic numbers
const CHAT_CONSTANTS = {
  MAX_MESSAGE_HEIGHT: 80,
  SEND_BUTTON_SIZE: 44,
  SEND_BUTTON_RADIUS: 22,
  MESSAGE_BUBBLE_MAX_WIDTH: '80%',
  AVATAR_SIZE: 64,
  ZONE_AVATAR_SIZE: 100,
  ACTION_BUTTON_HEIGHT: 44,
  MODAL_PADDING_TOP: SPACING.xl + 20,
} as const;
export default function ChatScreen() {
  const { profile } = useSelector((state: RootState) => state.auth);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [realtimeUnsubscribe, setRealtimeUnsubscribe] = useState<(() => void) | null>(null);
  const chatService = ChatService.getInstance();

  // Only staff users can access this feature
  const isStaff = profile?.role === 'staff';
  const userZone = profile?.state || 'Lagos';

  const handleError = useCallback((error: Error) => {
    console.error('Chat component error:', error);
    Toast.show({
      type: 'error',
      text1: 'Chat Error',
      text2: 'Something went wrong with the chat. Please refresh and try again.',
    });
  }, []);

  useEffect(() => {
    if (selectedZone) {
      loadChatHistory(selectedZone);
      // Subscribe to real-time updates
      const unsubscribe = chatService.subscribeToZoneMessages(selectedZone, (newMessage) => {
        setChatHistory(prev => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      });
      setRealtimeUnsubscribe(() => unsubscribe);
    }

    // Cleanup subscription when zone changes or component unmounts
    return () => {
      if (realtimeUnsubscribe) {
        realtimeUnsubscribe();
        setRealtimeUnsubscribe(null);
      }
    };
  }, [selectedZone, chatService]);

  const loadChatHistory = useCallback(async (zone: string) => {
    setIsLoading(true);
    try {
      const messages = await chatService.getMessagesForZone(zone);
      setChatHistory(messages);
    } catch (error) {
      handleError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [chatService, handleError]);
  const openWhatsAppGroup = useCallback(async (zone: string) => {
    try {
      // Use environment variables for WhatsApp group links
      const groupLinks: Record<string, string> = {
        'Lagos': process.env.EXPO_PUBLIC_WHATSAPP_LAGOS || 'https://chat.whatsapp.com/BKKJA9uWto6KSMbm6SOmnb',
        'Kano': process.env.EXPO_PUBLIC_WHATSAPP_KANO || 'https://chat.whatsapp.com/HQQBeJnwIs0FUTCQq6h1tL',
        'Kaduna': process.env.EXPO_PUBLIC_WHATSAPP_KADUNA || 'https://chat.whatsapp.com/GcHwV95X6UH5bvhfwigpxH',
        'Abuja': process.env.EXPO_PUBLIC_WHATSAPP_ABUJA || '',
      };

      const groupLink = groupLinks[zone];

      if (!groupLink) {
        Toast.show({
          type: 'info',
          text1: 'Group Not Available',
          text2: `WhatsApp group for ${zone} zone is not yet configured.`,
        });
        return;
      }

      const supported = await Linking.canOpenURL(groupLink);
      if (supported) {
        await Linking.openURL(groupLink);
        Toast.show({
          type: 'success',
          text1: 'Opening WhatsApp',
          text2: `${zone} zone group opened`,
        });
      } else {
        // Try opening in browser as fallback
        await Linking.openURL(groupLink);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Connection Error',
        text2: 'Failed to open WhatsApp group. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = async () => {
    if (!messageText.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Message Required',
        text2: 'Please enter a message to send',
      });
      return;
    }

    if (!selectedZone || !profile?.id) return;

    // Validate message
    const validation = await chatService.validateMessage(messageText);
    if (!validation.isValid) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Message',
        text2: validation.error,
      });
      return;
    }

    setIsSending(true);
    try {
      await chatService.sendMessage(selectedZone, messageText.trim(), profile.id);
      // Don't add to local state - real-time subscription will handle it
      setMessageText('');
      Toast.show({
        type: 'success',
        text1: 'Message Sent',
        text2: 'Your message has been sent to the zone',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Send Message',
        text2: 'Please try again later.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const openChatForZone = useCallback((zone: string) => {
    setSelectedZone(zone);
    setShowChatModal(true);
  }, []);

  if (!isStaff) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Zone Chat</Text>
        </View>
        <View style={styles.restrictedContainer}>
          <View style={styles.restrictedAvatar}>
            <MessageCircle size={CHAT_CONSTANTS.AVATAR_SIZE * 0.6} color={COLORS.white} />
          </View>
          <Text style={styles.restrictedTitle}>Admin Approval Required</Text>
          <Text style={styles.restrictedText}>
            This feature is only available for staff members to communicate within their zone groups.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ErrorBoundary onError={handleError}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Zone Communication</Text>
          <Text style={styles.headerSubtitle}>Connect with your zone team via WhatsApp</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Zone</Text>
            <Card style={styles.zoneCard} variant="elevated" onPress={() => openChatForZone(userZone)}>
              <View style={styles.zoneHeader}>
                <View style={styles.zoneInfo}>
                  <MapPin size={24} color={COLORS.primary} />
                  <View style={styles.zoneText}>
                    <Text style={styles.zoneName}>{userZone} Zone</Text>
                    <Text style={styles.zoneDescription}>Your assigned zone group</Text>
                  </View>
                </View>
                <View style={styles.zoneStats}>
                  <Users size={20} color={COLORS.textSecondary} />
                  <Text style={styles.zoneMembers}>
                    {chatHistory.length} messages
                  </Text>
                </View>
              </View>
              <View style={styles.zoneActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openChatForZone(userZone)}
                  disabled={isLoading}
                >
                  <MessageCircle size={16} color={COLORS.primary} />
                  <Text style={styles.actionText}>Open Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
                  onPress={() => openWhatsAppGroup(userZone)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={COLORS.success} />
                  ) : (
                    <Phone size={16} color={COLORS.success} />
                  )}
                  <Text style={[styles.actionText, styles.whatsappText]}>
                    {isLoading ? 'Opening...' : 'Open WhatsApp'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Zones</Text>
            <Text style={styles.sectionSubtitle}>View other zone activities (read-only)</Text>

            {['Kano', 'Kaduna']
              .filter(zone => zone !== userZone)
              .map((zone) => (
                <Card key={zone} style={styles.otherZoneCard} variant="outlined">
                  <View style={styles.zoneHeader}>
                    <View style={styles.zoneInfo}>
                      <MapPin size={20} color={COLORS.textSecondary} />
                      <View style={styles.zoneText}>
                        <Text style={styles.otherZoneName}>{zone} Zone</Text>
                        <Text style={styles.otherZoneDescription}>Read-only access</Text>
                      </View>
                    </View>
                    <View style={styles.zoneStats}>
                      <Users size={18} color={COLORS.textSecondary} />
                      <Text style={styles.otherZoneMembers}>
                        {chatHistory.length} messages
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.viewActivityButton}
                    onPress={() => {
                      setSelectedZone(zone);
                      setShowChatModal(true);
                    }}
                  >
                    <Text style={styles.viewActivityText}>View Activity</Text>
                  </TouchableOpacity>
                </Card>
              ))}
          </View>
        </ScrollView>

        {/* Chat Modal */}
        <Modal visible={showChatModal} animationType="slide" presentationStyle="pageSheet">
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.chatHeader}>
                <MapPin size={20} color={COLORS.primary} />
                <Text style={styles.chatTitle}>{selectedZone} Zone Chat</Text>
                {selectedZone === userZone && (
                  <Badge label="Your Zone" variant="custom" style={{ backgroundColor: COLORS.primary + '20' }} />
                )}
              </View>
              <TouchableOpacity onPress={() => setShowChatModal(false)}>
                <X size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.loadingText}>Loading messages...</Text>
                </View>
              ) : chatHistory.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <MessageCircle size={48} color={COLORS.textSecondary} />
                  <Text style={styles.emptyText}>No messages yet</Text>
                  <Text style={styles.emptySubtext}>Be the first to start the conversation!</Text>
                </View>
              ) : (
                chatHistory.map((message) => {
                  const isOwn = message.user_id === profile?.id;
                  return (
                    <View
                      key={message.id}
                      style={[
                        styles.messageBubble,
                        isOwn ? styles.ownMessage : styles.otherMessage,
                      ]}
                    >
                      {!isOwn && (
                        <Text style={styles.messageSender}>{message.sender_name}</Text>
                      )}
                      <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
                        {message.message}
                      </Text>
                      <Text style={[styles.messageTime, isOwn && styles.ownMessageTime]}>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  );
                })
              )}
            </ScrollView>

            {selectedZone === userZone && (
              <View style={styles.messageInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Type your message..."
                  value={messageText}
                  onChangeText={setMessageText}
                  multiline
                  placeholderTextColor={COLORS.textSecondary}
                />
                <TouchableOpacity
                  style={[styles.sendButton, (!messageText.trim() || isSending) && styles.sendButtonDisabled]}
                  onPress={sendMessage}
                  disabled={!messageText.trim() || isSending}
                >
                  {isSending ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Send size={20} color={messageText.trim() ? COLORS.white : COLORS.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>
            )}

            {selectedZone !== userZone && (
              <View style={styles.readOnlyNotice}>
                <Text style={styles.readOnlyText}>
                  This is a read-only view. You can only chat in your assigned zone.
                </Text>
                <Button
                  title="Go to My Zone"
                  onPress={() => {
                    setSelectedZone(userZone);
                  }}
                  style={{ marginTop: SPACING.sm }}
                />
              </View>
            )}
          </View>
        </Modal>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.primary, padding: SPACING.lg, paddingTop: SPACING.xl + 20 },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white },
  headerSubtitle: { ...TYPOGRAPHY.body2, color: COLORS.white, opacity: 0.9, marginTop: SPACING.xs },
  content: { flex: 1 },

  restrictedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  restrictedTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  restrictedAvatar: { width: CHAT_CONSTANTS.AVATAR_SIZE, height: CHAT_CONSTANTS.AVATAR_SIZE, borderRadius: CHAT_CONSTANTS.AVATAR_SIZE / 2, backgroundColor: COLORS.textSecondary, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  restrictedText: { ...TYPOGRAPHY.body1, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24 },

  section: { padding: SPACING.md },
  sectionTitle: { ...TYPOGRAPHY.h3, color: COLORS.text, marginBottom: SPACING.md },
  sectionSubtitle: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginBottom: SPACING.md, marginTop: -SPACING.sm },

  zoneCard: { marginBottom: SPACING.md },
  zoneHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  zoneInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  zoneText: { marginLeft: SPACING.sm, flex: 1 },
  zoneName: { ...TYPOGRAPHY.body1, fontWeight: '600', color: COLORS.text },
  zoneDescription: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  zoneStats: { alignItems: 'center' },
  zoneMembers: { ...TYPOGRAPHY.caption, color: COLORS.primary, marginTop: SPACING.xs },
  zoneActions: { flexDirection: 'row', gap: SPACING.sm },
  actionButton: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm, borderRadius: 6, backgroundColor: COLORS.surface, gap: SPACING.xs },
  actionButtonDisabled: { opacity: 0.6 },
  actionText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },
  whatsappText: { color: COLORS.success },

  otherZoneCard: { marginBottom: SPACING.sm },
  otherZoneName: { ...TYPOGRAPHY.body2, fontWeight: '600', color: COLORS.text },
  otherZoneDescription: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary },
  otherZoneMembers: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs },
  viewActivityButton: { alignSelf: 'flex-start', padding: SPACING.sm, marginTop: SPACING.sm },
  viewActivityText: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600' },

  modalContainer: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingTop: CHAT_CONSTANTS.MODAL_PADDING_TOP },
  chatHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  chatTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },

  chatContainer: { flex: 1 },
  chatContent: { padding: SPACING.md },
  messageBubble: { marginBottom: SPACING.md, maxWidth: CHAT_CONSTANTS.MESSAGE_BUBBLE_MAX_WIDTH },
  ownMessage: { alignSelf: 'flex-end', backgroundColor: COLORS.primary, borderRadius: 16, borderBottomRightRadius: 4, padding: SPACING.sm },
  otherMessage: { alignSelf: 'flex-start', backgroundColor: COLORS.surface, borderRadius: 16, borderBottomLeftRadius: 4, padding: SPACING.sm },
  messageSender: { ...TYPOGRAPHY.caption, color: COLORS.primary, fontWeight: '600', marginBottom: SPACING.xs },
  messageText: { ...TYPOGRAPHY.body2, color: COLORS.text },
  ownMessageText: { color: COLORS.white },
  messageTime: { ...TYPOGRAPHY.caption, color: COLORS.textSecondary, marginTop: SPACING.xs, alignSelf: 'flex-end' },
  ownMessageTime: { color: COLORS.white + 'C0' },

  messageInput: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.white },
  input: { flex: 1, ...TYPOGRAPHY.body1, backgroundColor: COLORS.surface, borderRadius: 20, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginRight: SPACING.sm, maxHeight: CHAT_CONSTANTS.MAX_MESSAGE_HEIGHT },
  sendButton: { width: CHAT_CONSTANTS.SEND_BUTTON_SIZE, height: CHAT_CONSTANTS.SEND_BUTTON_SIZE, borderRadius: CHAT_CONSTANTS.SEND_BUTTON_RADIUS, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  sendButtonDisabled: { backgroundColor: COLORS.surface },

  readOnlyNotice: { padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.surface },
  readOnlyText: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, textAlign: 'center' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  loadingText: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginTop: SPACING.md },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyText: { ...TYPOGRAPHY.h3, color: COLORS.textSecondary, marginTop: SPACING.md, textAlign: 'center' },
  emptySubtext: { ...TYPOGRAPHY.body2, color: COLORS.textSecondary, marginTop: SPACING.sm, textAlign: 'center' },
});