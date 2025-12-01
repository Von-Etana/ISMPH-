import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface BadgeProps {
  label: string;
  type?: 'priority' | 'status' | 'default';
  variant?: string;
  mode?: 'solid' | 'soft' | 'outline';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  type,
  variant,
  mode = 'solid',
  style
}) => {
  const getColor = () => {
    const v = variant?.toLowerCase();

    // Priority
    if (v === 'low') return COLORS.priorityLow;
    if (v === 'medium') return COLORS.priorityMedium;
    if (v === 'high') return COLORS.priorityHigh;
    if (v === 'critical') return COLORS.priorityCritical;

    // Status
    if (v === 'pending') return COLORS.statusPending;
    if (v === 'approved') return COLORS.statusApproved;
    if (v === 'rejected') return COLORS.statusRejected;
    if (v === 'resolved') return COLORS.statusResolved;
    if (v === 'draft') return COLORS.statusDraft;

    return COLORS.primary;
  };

  const color = getColor();

  const getContainerStyle = () => {
    if (mode === 'outline') {
      return {
        borderWidth: 1,
        borderColor: color,
        backgroundColor: 'transparent',
      };
    }
    if (mode === 'soft') {
      return {
        backgroundColor: color + '20', // 12% opacity
      };
    }
    return {
      backgroundColor: color,
    };
  };

  const getTextStyle = () => {
    if (mode === 'outline' || mode === 'soft') {
      return {
        color: color,
      };
    }
    return {
      color: COLORS.white,
    };
  };

  return (
    <View style={[styles.badge, getContainerStyle(), style]}>
      <Text style={[styles.text, getTextStyle()]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
    fontSize: 11,
  },
});
