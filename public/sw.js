// ─── Cache version ────────────────────────────────────────────────────────────
// To push an update to users: bump this version string (e.g. v2, v3 …),
// then deploy.  The browser will install the new SW, delete the old cache,
// and serve fresh assets on the next page load.
const CACHE_NAME = 'drum-kit-v1.28';

// ─── Assets to pre-cache on install ───────────────────────────────────────────
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/reset.css',
    '/css/main.css?v=24e5cf43',
    '/js/main.js?v=31c63190',
    '/js/vendor/howler.js',
    '/audio/bass.mp3',
    '/audio/crash.mp3',
    '/audio/floortom.mp3',
    '/audio/hihat.mp3',
    '/audio/snare.mp3',
    '/audio/tom.mp3',
    '/img/bass.svg',
    '/img/crash.svg',
    '/img/floortom.svg',
    '/img/hihat.svg',
    '/img/snare.svg',
    '/img/tom.svg',
    '/img/icon-16x16.png',
    '/img/icon-32x32.png',
    '/img/icon-48x48.png',
    '/img/icon-64x64.png',
    '/img/icon-128x128.png',
    '/img/icon-192x192.png',
    '/img/icon-256x256.png',
    '/img/icon-512x512.png',
    '/img/apple-touch-icon.png',
    '/img/favicon.ico',
];

// ─── Install: pre-cache all assets ────────────────────────────────────────────
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    // Activate immediately without waiting for existing tabs to close
    self.skipWaiting();
});

// ─── Activate: purge old caches ───────────────────────────────────────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            )
        )
    );
    // Take control of all open tabs immediately
    self.clients.claim();
});

// ─── Fetch: cache-first, fall back to network ─────────────────────────────────
self.addEventListener('fetch', event => {
    // Only handle GET requests; let everything else pass through
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;

            return fetch(event.request).then(response => {
                // Cache any successful responses for future offline use
                if (response.ok) {
                    // Clone must happen synchronously before any async work
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            });
        })
    );
});
