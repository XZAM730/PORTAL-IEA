/**
 * IEA Portal Service Worker
 * Enables offline functionality and asset caching
 * 
 * Features:
 * - Cache static assets (CSS, JS, HTML)
 * - Fallback for API responses
 * - Background sync for data
 */

const CACHE_NAME = 'iea-portal-v1.0.0';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/style.css',
    '/css/theme.css',
    '/css/calculate.css',
    '/css/compatibility.css',
    '/css/inline-styles.css',
    '/js/script.js',
    '/js/calculate.js',
    '/js/config.js',
    '/assets/favicon-iea.png',
    '/pages/admin.html',
    '/pages/calculate.html',
    '/pages/information.html',
    '/pages/library.html',
    '/pages/live.html',
    '/pages/mind.html'
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
            .catch((err) => console.error('[SW] Cache failed:', err))
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

/**
 * Fetch event - serve from cache, fallback to network
 * Strategy: Cache-first for static, Network-first for API
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // API calls - network first, fallback to cache
    if (url.href.includes('api.') || url.href.includes('wheretheiss') || url.href.includes('firebase')) {
        event.respondWith(networkFirstStrategy(request));
        return;
    }
    
    // Static assets - cache first, fallback to network
    event.respondWith(cacheFirstStrategy(request));
});

/**
 * Cache-first strategy for static assets
 */
function cacheFirstStrategy(request) {
    return caches.match(request)
        .then((response) => {
            if (response) {
                console.log('[SW] Serving from cache:', request.url);
                return response;
            }
            
            return fetch(request)
                .then((response) => {
                    // Cache successful responses
                    if (response && response.status === 200 && request.method === 'GET') {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Return offline fallback
                    console.log('[SW] Offline - request failed:', request.url);
                    return caches.match('/index.html');
                });
        });
}

/**
 * Network-first strategy for API calls
 */
function networkFirstStrategy(request) {
    return fetch(request)
        .then((response) => {
            // Cache successful API responses
            if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME + '-api').then((cache) => {
                    cache.put(request, responseClone);
                });
            }
            return response;
        })
        .catch(() => {
            // Fallback to cached API response
            console.log('[SW] Network error - serving cached API response');
            return caches.match(request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    // Return offline response
                    return new Response(
                        JSON.stringify({ 
                            error: 'Offline',
                            message: 'No cached data available'
                        }),
                        {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'application/json'
                            })
                        }
                    );
                });
        });
}

/**
 * Message handler for background sync
 */
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[SW] Service Worker registered successfully');
