/**
 * Global Error Handler & Recovery
 * Provides graceful error handling and user feedback
 */

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 50; // Keep last 50 errors
        this.setupGlobalHandlers();
    }

    /**
     * Setup global error listeners
     */
    setupGlobalHandlers() {
        // Uncaught errors
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'uncaught-error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'unhandled-promise',
                message: event.reason?.message || String(event.reason),
                stack: event.reason?.stack
            });
            event.preventDefault(); // Prevent browser from logging
        });
    }

    /**
     * Handle and log error
     * @param {Object} error - Error details
     */
    handleError(error) {
        const errorWithTimestamp = {
            ...error,
            timestamp: new Date().toISOString()
        };

        // Store error
        this.errors.push(errorWithTimestamp);
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Log to console in development
        if (process.env.NODE_ENV !== 'production') {
            console.error('[ERROR]', errorWithTimestamp);
        }

        // Send to monitoring service (optional)
        this.reportError(errorWithTimestamp);

        // Show user-friendly message
        this.showErrorNotification(error.message);
    }

    /**
     * Send error to monitoring service
     * @param {Object} error - Error object
     */
    reportError(error) {
        // Example: Send to Sentry, LogRocket, etc
        // fetch('/logs', {
        //     method: 'POST',
        //     body: JSON.stringify(error)
        // }).catch(() => {});
    }

    /**
     * Show user-friendly error notification
     * @param {string} message - Error message
     */
    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <span>⚠️ Something went wrong: ${message}</span>
            <button onclick="this.parentElement.remove()">✕</button>
        `;
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Safe fetch wrapper with retry logic
     * @param {string} url - URL to fetch
     * @param {Object} options - Fetch options
     * @param {number} retries - Number of retries (default: 3)
     * @returns {Promise<Response>}
     */
    async safeFetch(url, options = {}, retries = 3) {
        let lastError;

        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                return response;
            } catch (error) {
                lastError = error;
                console.warn(`[Fetch Retry ${i + 1}/${retries}] Failed:`, url, error.message);

                // Exponential backoff
                if (i < retries - 1) {
                    await new Promise(resolve => 
                        setTimeout(resolve, Math.pow(2, i) * 1000)
                    );
                }
            }
        }

        // All retries failed
        this.handleError({
            type: 'fetch-failed',
            message: `Failed to fetch after ${retries} attempts: ${url}`,
            originalError: lastError?.message
        });

        return null;
    }

    /**
     * Wrap async functions with error handling
     * @param {Function} asyncFn - Async function
     * @param {string} context - For logging context
     * @returns {Function} Wrapped function
     */
    wrap(asyncFn, context = 'unknown') {
        return async (...args) => {
            try {
                return await asyncFn(...args);
            } catch (error) {
                this.handleError({
                    type: 'wrapped-function-error',
                    context,
                    message: error.message,
                    stack: error.stack
                });
                return null; // Return null as fallback
            }
        };
    }

    /**
     * Get all logged errors
     * @returns {Array} Array of errors
     */
    getErrors() {
        return [...this.errors];
    }

    /**
     * Clear error log
     */
    clearErrors() {
        this.errors = [];
    }
}

// Create global instance
window.ErrorHandler = new ErrorHandler();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}
