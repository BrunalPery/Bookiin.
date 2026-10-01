/**
 * BOOKIIN SERVICE WORKER
 * Version: 1.0.0
 * Provides offline navigation, asset precaching, and offline reading capabilities.
 */

const CACHE_NAME = 'bookiin-pwa-v1';
const READER_CACHE = 'bookiin-reader-v1';
const FONT_CACHE = 'bookiin-fonts-v1';

const STATIC_PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/apple-touch-icon.png'
];

// Installation: Cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE).catch((err) => {
        console.warn('[SW] Pre-caching warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activation: Clean up older cache versions and take immediate control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== READER_CACHE && name !== FONT_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Apply intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests (e.g. POST to stripe/api)
  if (request.method !== 'GET') {
    return;
  }

  // CRITICAL: Bypass Vite dev server, HMR, and development asset requests
  if (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.includes('node_modules') ||
    url.pathname.includes('__vite') ||
    url.searchParams.has('t') ||
    url.hostname === 'localhost' ||
    url.hostname === '127.0.0.1' ||
    url.port === '3000'
  ) {
    return; // Pass through natively to network
  }

  // 1. Google Fonts: Cache First with 1-year cache longevity
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          return cachedResponse || new Response('', { status: 408 });
        }
      })
    );
    return;
  }

  // 2. Navigation requests (HTML): Network First, fallback to cached App Shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return networkResponse;
      }).catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const shell = await caches.match('/');
        return shell || caches.match('/index.html');
      })
    );
    return;
  }

  // 3. Static assets & Book cover images (Stale-While-Revalidate)
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.hostname.includes('unsplash.com')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 4. Default fallback: Network with cache backup
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// Communication with client app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
