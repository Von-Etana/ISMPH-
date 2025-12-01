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
 * Helper to convert unknown errors to ApiError
 */
export function toApiError(error: unknown): ApiError {
    if (error instanceof Error) {
        return {
            message: error.message,
            details: error,
        };
    }

    if (typeof error === 'object' && error !== null) {
        const err = error as Record<string, unknown>;
        return {
            message: err.message as string || 'An error occurred',
            code: err.code as string,
            details: err.details,
            status: err.status as number,
        };
    }

    return {
        message: String(error) || 'Unknown error',
    };
}
