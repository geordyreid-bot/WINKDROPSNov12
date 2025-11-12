// sw.js

const CACHE_NAME = 'winkdrops-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install the service worker and cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Activate event to clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event to serve content from cache first
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response from cache
        if (response) {
          return response;
        }

        // Not in cache - fetch from network
        return fetch(event.request);
      })
  );
});


self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');
  
  const data = event.data.json();
  const title = data.title;
  const options = {
    body: data.body,
    icon: 'data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3ClinearGradient id=\'logoGradient\' x1=\'0\' y1=\'0\' x2=\'1\' y2=\'1\'%3E%3Cstop offset=\'0%25\' stop-color=\'%2398d1ff\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23e9d1ff\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d=\'M50 10C50 10 15 45.82 15 62.5C15 79.92 30.67 90 50 90C69.33 90 85 79.92 85 62.5C85 45.82 50 10 50 10Z\' stroke=\'url(%23logoGradient)\' stroke-width=\'7\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3Cpath d=\'M58 60 C 58 66, 68 66, 68 60\' stroke=\'url(%23logoGradient)\' stroke-width=\'7\' stroke-linecap=\'round\' stroke-linejoin=\'round\' fill=\'none\'/%3E%3C/svg%3E',
    badge: 'data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3ClinearGradient id=\'logoGradient\' x1=\'0\' y1=\'0\' x2=\'1\' y2=\'1\'%3E%3Cstop offset=\'0%25\' stop-color=\'%2398d1ff\'/%3E%3Cstop offset=\'100%25\' stop-color=\'%23e9d1ff\'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d=\'M50 10C50 10 15 45.82 15 62.5C15 79.92 30.67 90 50 90C69.33 90 85 79.92 85 62.5C85 45.82 50 10 50 10Z\' stroke=\'url(%23logoGradient)\' stroke-width=\'7\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3Cpath d=\'M58 60 C 58 66, 68 66, 68 60\' stroke=\'url(%23logoGradient)\' stroke-width=\'7\' stroke-linecap=\'round\' stroke-linejoin=\'round\' fill=\'none\'/%3E%3C/svg%3E'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
