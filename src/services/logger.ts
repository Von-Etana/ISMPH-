/**
 * Logging service for the application
 * In development: logs to console
 * In production: can be extended to send to error tracking service (Sentry, etc.)
 */

const isDevelopment = __DEV__;

export const logger = {
    /**
     * Log error messages
     * @param message - Error message
     * @param error - Optional error object or additional data
     */
    error: (message: string, error?: unknown) => {
        if (isDevelopment) {
            console.error(`[ERROR] ${message}`, error);
        }
        // TODO: In production, send to error tracking service (Sentry, Bugsnag, etc.)
        // Example: Sentry.captureException(error, { extra: { message } });
    },

    /**
     * Log warning messages
     * @param message - Warning message
     * @param data - Optional additional data
     */
    warn: (message: string, data?: unknown) => {
        if (isDevelopment) {
            console.warn(`[WARN] ${message}`, data);
        }
        // TODO: In production, send to monitoring service
    },

    /**
     * Log info messages (development only)
     * @param message - Info message
     * @param data - Optional additional data
     */
    info: (message: string, data?: unknown) => {
        if (isDevelopment) {
            console.log(`[INFO] ${message}`, data);
        }
    },

    /**
     * Log debug messages (development only)
     * @param message - Debug message
     * @param data - Optional additional data
     */
    debug: (message: string, data?: unknown) => {
        if (isDevelopment) {
            console.log(`[DEBUG] ${message}`, data);
        }
    },
};
