/**
 * Privacy-respecting Analytics
 * Lightweight analytics without external dependencies
 */

class Analytics {
    constructor(config = {}) {
        this.config = {
            enabled: config.enabled !== false,
            trackPageViews: config.trackPageViews !== false,
            trackEvents: config.trackEvents !== false,
            storageKey: config.storageKey || 'iea_analytics',
            ...config
        };
        
        this.sessionId = this.generateSessionId();
        this.pageViews = [];
        this.events = [];
        this.setupTracking();
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Setup automatic tracking
     */
    setupTracking() {
        if (!this.config.enabled) return;

        // Track page views
        if (this.config.trackPageViews) {
            this.trackPageView();
            window.addEventListener('hashchange', () => this.trackPageView());
        }

        // Unload handler to save session data
        window.addEventListener('beforeunload', () => {
            this.saveSessionData();
        });
    }

    /**
     * Track page view
     */
    trackPageView() {
        const view = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            userAgent: navigator.userAgent
        };

        this.pageViews.push(view);
        this.log('[Analytics] Page View:', view.url);
    }

    /**
     * Track custom event
     * @param {string} category - Event category
     * @param {string} action - Event action
     * @param {string} label - Event label (optional)
     * @param {number} value - Event value (optional)
     */
    trackEvent(category, action, label = '', value = 0) {
        if (!this.config.trackEvents) return;

        const event = {
            timestamp: new Date().toISOString(),
            category,
            action,
            label,
            value,
            sessionId: this.sessionId
        };

        this.events.push(event);
        this.log('[Analytics] Event:', event);
    }

    /**
     * Track feature usage
     * @param {string} feature - Feature name
     */
    trackFeature(feature) {
        this.trackEvent('feature', 'use', feature);
    }

    /**
     * Track API call
     * @param {string} endpoint - API endpoint
     * @param {number} duration - Duration in ms
     * @param {boolean} success - Success status
     */
    trackApiCall(endpoint, duration, success = true) {
        this.trackEvent('api', success ? 'success' : 'error', endpoint, duration);
    }

    /**
     * Track error
     * @param {string} errorType - Type of error
     * @param {string} message - Error message
     */
    trackError(errorType, message) {
        this.trackEvent('error', errorType, message);
    }

    /**
     * Save session data to localStorage
     */
    saveSessionData() {
        const sessionData = {
            sessionId: this.sessionId,
            pageViews: this.pageViews,
            events: this.events,
            duration: Date.now(),
            system: {
                screenResolution: `${window.innerWidth}x${window.innerHeight}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                language: navigator.language,
                platform: navigator.platform
            }
        };

        try {
            localStorage.setItem(
                this.config.storageKey,
                JSON.stringify(sessionData)
            );
        } catch (e) {
            console.warn('[Analytics] Failed to save session data:', e);
        }
    }

    /**
     * Get session data
     */
    getSessionData() {
        try {
            const data = localStorage.getItem(this.config.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.warn('[Analytics] Failed to retrieve session data:', e);
            return null;
        }
    }

    /**
     * Send analytics data to server
     * @param {string} endpoint - Server endpoint
     */
    async sendData(endpoint = '/analytics') {
        if (!this.config.enabled) return;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: this.sessionId,
                    pageViews: this.pageViews,
                    events: this.events,
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                this.log('[Analytics] Data sent successfully');
                // Clear local data after sending
                this.pageViews = [];
                this.events = [];
            }
        } catch (error) {
            console.warn('[Analytics] Failed to send data:', error);
        }
    }

    /**
     * Get usage statistics
     */
    getStats() {
        return {
            sessionId: this.sessionId,
            pageViewCount: this.pageViews.length,
            eventCount: this.events.length,
            topPages: this.getTopPages(),
            topEvents: this.getTopEvents(),
            sessionDuration: Date.now()
        };
    }

    /**
     * Get most visited pages
     */
    getTopPages(limit = 5) {
        const pageCount = {};
        this.pageViews.forEach(view => {
            pageCount[view.url] = (pageCount[view.url] || 0) + 1;
        });

        return Object.entries(pageCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([url, count]) => ({ url, views: count }));
    }

    /**
     * Get most tracked events
     */
    getTopEvents(limit = 5) {
        const eventCount = {};
        this.events.forEach(event => {
            const key = `${event.category}:${event.action}`;
            eventCount[key] = (eventCount[key] || 0) + 1;
        });

        return Object.entries(eventCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([key, count]) => {
                const [category, action] = key.split(':');
                return { category, action, count };
            });
    }

    /**
     * Clear all data
     */
    clear() {
        this.pageViews = [];
        this.events = [];
        localStorage.removeItem(this.config.storageKey);
    }

    /**
     * Enable/disable logging
     */
    log(message, data) {
        if (this.config.debug) {
            console.log(message, data);
        }
    }
}

// Create global instance
window.Analytics = new Analytics({
    enabled: true,
    trackPageViews: true,
    trackEvents: true,
    debug: false // Set to true for development
});

// Auto-track button clicks
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.id) {
        window.Analytics.trackEvent('interaction', 'button_click', e.target.id);
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}
