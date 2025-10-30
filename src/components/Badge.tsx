import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface BadgeProps {
  label: string;
  type?: string;
  variant?: string;
  style?: any;
}

export const Badge: React.FC<BadgeProps> = ({ label, type, variant, style }) => {
  const getColor = () => {
    if (variant === 'low') return COLORS.priorityLow;
    if (variant === 'medium') return COLORS.priorityMedium;
    if (variant === 'high') return COLORS.priorityHigh;
    if (variant === 'critical') return COLORS.priorityCritical;
    return COLORS.primary;
  };

  return (
    <View style={[styles.badge, { backgroundColor: getColor() }, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    ...TYPOGRAPHY.caption,
    color: COLORS.white,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
