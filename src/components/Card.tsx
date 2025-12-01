import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  intensity?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  intensity = 50
}) => {
  const cardStyle = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'outlined' && styles.outlined,
    variant === 'glass' && styles.glass,
    style,
  ];

  const Content = () => (
    <>
      {variant === 'glass' && (
        <BlurView intensity={intensity} tint="light" style={StyleSheet.absoluteFill} />
      )}
      <View style={[styles.content, variant === 'glass' && styles.glassContent]}>
        {children}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress} activeOpacity={0.7}>
        <Content />
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}><Content /></View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16, // Increased radius for modern look
    overflow: 'hidden',
  },
  content: {
    padding: SPACING.md,
  },
  glassContent: {
    backgroundColor: 'transparent',
  },
  elevated: {
    backgroundColor: COLORS.surface,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
  },
});
