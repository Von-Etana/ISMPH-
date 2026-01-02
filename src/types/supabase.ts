import { User, Session } from '@supabase/supabase-js';

/**
 * Supabase-specific type definitions
 * These extend the base types from the application
 */

export interface SupabaseUser extends User {
    // Add any custom user properties if needed
}

export interface SupabaseSession extends Session {
    // Add any custom session properties if needed
}

/**
 * API Error type for consistent error handling
 */
export interface ApiError {
    message: string;
    code?: string;
    details?: unknown;
    status?: number;
}

/**
 * Helper to convert unknown errors to ApiError with user-friendly messages
 */
export function toApiError(error: unknown): ApiError {
    if (error instanceof Error) {
        return {
            message: getUserFriendlyErrorMessage(error.message),
            details: error,
        };
    }

    if (typeof error === 'object' && error !== null) {
        const err = error as Record<string, unknown>;
        const message = err.message as string || 'An error occurred';
        return {
            message: getUserFriendlyErrorMessage(message),
            code: err.code as string,
            details: err.details,
            status: err.status as number,
        };
    }

    return {
        message: 'An unexpected error occurred. Please try again.',
    };
}

/**
 * Convert technical error messages to user-friendly ones
 */
function getUserFriendlyErrorMessage(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Configuration errors
    if (lowerMessage.includes('invalid api key') ||
        lowerMessage.includes('invalid jwt') ||
        lowerMessage.includes('jwt malformed')) {
        return 'Configuration error: Invalid Supabase credentials. Please contact support.';
    }

    // Network errors
    if (lowerMessage.includes('fetch failed') ||
        lowerMessage.includes('network') ||
        lowerMessage.includes('failed to fetch')) {
        return 'Network error: Please check your internet connection and try again.';
    }

    // Auth errors
    if (lowerMessage.includes('invalid login credentials') ||
        lowerMessage.includes('invalid email or password')) {
        return 'Invalid email or password. Please check your credentials and try again.';
    }

    if (lowerMessage.includes('email already registered') ||
        lowerMessage.includes('user already registered')) {
        return 'An account with this email already exists. Please sign in instead.';
    }

    if (lowerMessage.includes('email not confirmed')) {
        return 'Please verify your email address before signing in.';
    }

    if (lowerMessage.includes('password') && lowerMessage.includes('weak')) {
        return 'Password is too weak. Please use a stronger password.';
    }

    // Database errors
    if (lowerMessage.includes('unique constraint') ||
        lowerMessage.includes('duplicate key')) {
        return 'This record already exists.';
    }

    if (lowerMessage.includes('foreign key') ||
        lowerMessage.includes('violates')) {
        return 'Unable to complete operation due to data constraints.';
    }

    if (lowerMessage.includes('permission denied') ||
        lowerMessage.includes('not authorized')) {
        return 'You do not have permission to perform this action.';
    }

    // Profile creation errors
    if (lowerMessage.includes('profile not found')) {
        return 'Account setup incomplete. Please try signing up again.';
    }

    // Return original message if no match found, but clean it up
    return message || 'An error occurred. Please try again.';
}
