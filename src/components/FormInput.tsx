import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

interface FormInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  required,
  secureTextEntry = false,
  showPasswordToggle = false,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const actualSecureTextEntry = secureTextEntry && !isPasswordVisible;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error && styles.inputError, showPasswordToggle && styles.inputWithIcon]}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={COLORS.textSecondary}
          secureTextEntry={actualSecureTextEntry}
          {...props}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={COLORS.textSecondary} />
            ) : (
              <Eye size={20} color={COLORS.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  required: {
    color: COLORS.error,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    ...TYPOGRAPHY.body1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: COLORS.text,
  },
  inputWithIcon: {
    paddingRight: SPACING.xl,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  iconContainer: {
    position: 'absolute',
    right: SPACING.sm,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: SPACING.xs,
  },
  errorText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});
