import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/src/components/Card';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { ArrowLeft, Mail, Phone, Globe, MapPin } from 'lucide-react-native';

export default function ContactScreen() {
  const handleEmailPress = () => {
    Linking.openURL('mailto:info@ismph.org');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+2348039627357');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://ismph.org');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={{ width: 40 }} /> {/* Spacer to align title */}
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>
          Get in touch with the International Society of Media in Public Health (ISMPH) for support or inquiries.
        </Text>

        <View style={styles.section}>
          <Card style={styles.contactCard} variant="outlined">
            <TouchableOpacity style={styles.contactButton} onPress={handleEmailPress}>
              <View style={[styles.contactIcon, { backgroundColor: COLORS.primary + '20' }]}>
                <Mail size={24} color={COLORS.primary} />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Email Us</Text>
                <Text style={styles.contactValue}>info@ismph.org</Text>
              </View>
            </TouchableOpacity>
          </Card>

          <Card style={styles.contactCard} variant="outlined">
            <TouchableOpacity style={styles.contactButton} onPress={handlePhonePress}>
              <View style={[styles.contactIcon, { backgroundColor: COLORS.success + '20' }]}>
                <Phone size={24} color={COLORS.success} />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Call Us</Text>
                <Text style={styles.contactValue}>+234 803 962 7357</Text>
              </View>
            </TouchableOpacity>
          </Card>

          <Card style={styles.contactCard} variant="outlined">
            <TouchableOpacity style={styles.contactButton} onPress={handleWebsitePress}>
              <View style={[styles.contactIcon, { backgroundColor: COLORS.info + '20' }]}>
                <Globe size={24} color={COLORS.info} />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue}>https://ismph.org</Text>
              </View>
            </TouchableOpacity>
          </Card>
          
          <Card style={styles.contactCard} variant="outlined">
            <View style={styles.contactButton}>
              <View style={[styles.contactIcon, { backgroundColor: COLORS.warning + '20' }]}>
                <MapPin size={24} color={COLORS.warning} />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Address</Text>
                <Text style={styles.contactValue}>Abuja, Nigeria</Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...TYPOGRAPHY.h2, color: COLORS.white, textAlign: 'center' },
  content: { flex: 1, padding: SPACING.lg },
  description: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  section: {
    gap: SPACING.md,
  },
  contactCard: {
    overflow: 'hidden',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    ...TYPOGRAPHY.body2,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  contactValue: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
  },
});
