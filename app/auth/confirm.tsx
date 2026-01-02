import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/src/services/supabase';
import { COLORS, SPACING, TYPOGRAPHY } from '@/src/constants/theme';
import Toast from 'react-native-toast-message';

/**
 * Email Confirmation Handler
 * This route handles deep links from email verification
 * URL format: ismph://auth/confirm?token_hash=xxx&type=signup
 */
export default function EmailConfirmScreen() {
    const params = useLocalSearchParams();
    const { token_hash, type } = params;

    useEffect(() => {
        handleEmailConfirmation();
    }, []);

    const handleEmailConfirmation = async () => {
        try {
            if (!token_hash || !type) {
                throw new Error('Invalid confirmation link');
            }

            // Verify the email using Supabase
            const { error } = await supabase.auth.verifyOtp({
                token_hash: token_hash as string,
                type: type as 'signup' | 'email',
            });

            if (error) throw error;

            Toast.show({
                type: 'success',
                text1: 'Email Verified',
                text2: 'Your email has been successfully verified. You can now sign in.',
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.replace('/auth');
            }, 2000);
        } catch (error) {
            console.error('Email confirmation error:', error);

            Toast.show({
                type: 'error',
                text1: 'Verification Failed',
                text2: error instanceof Error ? error.message : 'Invalid or expired confirmation link',
            });

            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.replace('/auth');
            }, 3000);
        }
    };

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.text}>Verifying your email...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        padding: SPACING.lg,
    },
    text: {
        ...TYPOGRAPHY.body1,
        color: COLORS.text,
        marginTop: SPACING.md,
        textAlign: 'center',
    },
});
