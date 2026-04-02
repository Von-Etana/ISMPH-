import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, HelpCircle, FileText, Shield, Mail } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { Card } from '@/src/components/Card';

export default function HelpScreen() {
  const FAQ_ITEMS = [
    {
      question: 'How do I submit a new report?',
      answer: 'Navigate to the "Reports" tab using the bottom menu, then click the floating "+" button to open the submission form. Fill out the necessary details and upload any supporting media before submitting.',
    },
    {
      question: 'What are the supported media formats?',
      answer: 'You can upload images (JPG, PNG) and videos (MP4) to support your reports. The maximum file size per upload is 50MB.',
    },
    {
      question: 'How do I track my submitted reports?',
      answer: 'In the "Reports" tab, you can filter by "My Reports" to see the status of all complaints you have submitted. The status will update from Pending to Approved when addressed.',
    },
    {
      question: 'Who sees my reports?',
      answer: 'Reports are securely stored and reviewed by verified State Program Officers and system administrators. Your contact information is kept confidential.',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Dynamic Header mimicking app layout but with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Info</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.introCard} variant="elevated">
          <HelpCircle size={40} color={COLORS.primary} style={styles.introIcon} />
          <Text style={styles.introTitle}>How can we help you?</Text>
          <Text style={styles.introText}>
            Welcome to the ISMPH Media Tracker Help Center. Here you can find answers to frequently asked questions and learn more about how to use the application.
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        {FAQ_ITEMS.map((item, index) => (
          <Card key={index} style={styles.faqCard} variant="outlined">
            <Text style={styles.faqQuestion}>{item.question}</Text>
            <Text style={styles.faqAnswer}>{item.answer}</Text>
          </Card>
        ))}

        <Text style={styles.sectionTitle}>More Information</Text>

        <TouchableOpacity style={styles.actionItem}>
          <FileText size={24} color={COLORS.primary} />
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Terms of Service</Text>
            <Text style={styles.actionSubtitle}>Read our usage policies</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Shield size={24} color={COLORS.primary} />
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Privacy Policy</Text>
            <Text style={styles.actionSubtitle}>How we protect your data</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionItem}>
          <Mail size={24} color={COLORS.primary} />
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Contact Support</Text>
            <Text style={styles.actionSubtitle}>support@ismph.org</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl + 20,
    paddingBottom: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
    marginLeft: -SPACING.sm, // Adjust to align with edge
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.white,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  introCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.primary + '10', // Light hint of primary color
    borderWidth: 0,
  },
  introIcon: {
    marginBottom: SPACING.md,
  },
  introTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  introText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  faqCard: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  faqQuestion: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  faqAnswer: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionTextContainer: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  actionTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    color: COLORS.text,
  },
  actionSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
