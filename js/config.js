/**
 * IEA Portal Configuration
 * Centralized API and system configuration
 * 
 * Usage: import { API_CONFIG, SYSTEM_CONFIG } from './config.js';
 */

export const API_CONFIG = {
    // NASA API - Astronomy data
    NASA: {
        endpoint: 'https://api.nasa.gov',
        key: localStorage.getItem('nasa_api_key') || 'DEMO_KEY', // Override in localStorage for custom key
        endpoints: {
            apod: 'https://api.nasa.gov/planetary/apod',
            neo: 'https://api.nasa.gov/neo/rest/v1/feed'
        }
    },
    
    // ISS Tracking
    ISS: {
        endpoint: 'https://api.wheretheiss.at/v1/satellites/25544',
        name: 'International Space Station'
    },
    
    // Firebase Configuration
    FIREBASE: {
        databaseURL: 'https://iea-pendaftaran-default-rtdb.asia-southeast1.firebasedatabase.app',
        version: '12.7.0'
    },
    
    // Rate limiting & retry config
    RETRY: {
        maxAttempts: 3,
        delayMs: 1000,
        backoffMultiplier: 2
    }
};

export const SYSTEM_CONFIG = {
    // App identification
    name: 'IEA Portal',
    version: '1.0.0',
    author: 'Xzam',
    
    // Theme & UI
    theme: {
        dark: {
            bg: '#0a0a0f',
            primary: '#00f3ff',
            secondary: '#88ccff'
        },
        light: {
            bg: '#ffffff',
            primary: '#0066cc',
            secondary: '#3399ff'
        }
    },
    
    // Feature flags
    features: {
        serviceWorker: true,
        offlineMode: true,
        analytics: true,
        darkMode: true,
        soundEffects: true
    },
    
    // Storage keys
    storage: {
        theme: 'iea_theme',
        userName: 'iea_user_name',
        soundEnabled: 'iea_sound',
        gfxEnabled: 'iea_gfx',
        motionEnabled: 'iea_motion',
        fontSize: 'iea_fontsize',
        noteData: 'iea_note_data',
        nasaApiKey: 'nasa_api_key'
    },
    
    // Logging
    logging: {
        enabled: true,
        level: 'info', // 'debug', 'info', 'warn', 'error'
        prefix: 'IEA_LOG'
    }
};

/**
 * Get API key (allows runtime override)
 * @param {string} apiType - 'NASA', 'ISS', etc
 * @returns {string} API key/endpoint
 */
export function getApiKey(apiType) {
    if (apiType === 'NASA') {
        return API_CONFIG.NASA.key;
    }
    return null;
}

/**
 * Set API key at runtime (for production setup)
 * @param {string} apiType - 'NASA'
 * @param {string} key - API key value
 */
export function setApiKey(apiType, key) {
    if (apiType === 'NASA') {
        API_CONFIG.NASA.key = key;
        localStorage.setItem('nasa_api_key', key);
    }
}
