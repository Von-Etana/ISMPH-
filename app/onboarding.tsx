import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, Image } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import { BarChart3, FileText, Camera, ShieldCheck } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Welcome to ISMPH',
    description: 'The Media Tracker app empowers you to report and track issues at Primary Healthcare Centers (PHCs) directly from your device.',
    icon: (props: any) => <ShieldCheck {...props} />,
  },
  {
    id: '2',
    title: 'Easy Reporting',
    description: 'Submit detailed reports regarding service quality, equipment shortages, or staff behavior with just a few taps.',
    icon: (props: any) => <FileText {...props} />,
  },
  {
    id: '3',
    title: 'Media Evidence',
    description: 'Attach photos and videos directly from your camera or gallery to provide crucial context for your reports.',
    icon: (props: any) => <Camera {...props} />,
  },
  {
    id: '4',
    title: 'Track & Analyze',
    description: 'Follow up on your submissions and view overall analytics to see how PHCs are improving over time.',
    icon: (props: any) => <BarChart3 {...props} />,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('@has_seen_onboarding', 'true');
      router.replace('/auth');
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      router.replace('/auth');
    }
  };

  const renderItem = ({ item, index }: { item: typeof SLIDES[0], index: number }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.iconContainer}>
          {item.icon({ size: 100, color: COLORS.primary })}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.footer}>
        {renderPagination()}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.skipButton]} 
            onPress={handleComplete}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.nextButton]} 
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  slide: {
    width,
    height: height * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  iconContainer: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xxl,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.md,
  },
  footer: {
    height: height * 0.25,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: COLORS.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: 'transparent',
  },
  skipButtonText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    flex: 1,
    marginLeft: SPACING.lg,
  },
  nextButtonText: {
    ...TYPOGRAPHY.body1,
    color: COLORS.white,
    fontWeight: '600',
  },
});
