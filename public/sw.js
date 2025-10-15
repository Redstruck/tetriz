// Enhanced Service Worker for Tetris PWA
// This service worker implements proper caching strategies and update mechanisms

// Dynamic cache versioning based on timestamp - updates automatically with new builds
const CACHE_VERSION = '1.0.0';
const CACHE_NAME = `tetris-game-v${CACHE_VERSION}`;
const RUNTIME_CACHE = `tetris-runtime-v${CACHE_VERSION}`;

// Static assets to cache immediately (shell resources)
// Note: In production, Vite will generate hashed filenames for JS/CSS
// The service worker will cache them dynamically based on URL patterns
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon.png',
  '/favicon-32.png',
  '/tetris-logo.svg',
  '/placeholder.svg'
];

// Assets that should be cached with a network-first strategy
const RUNTIME_CACHE_URLS = [
  /.*\.js$/,
  /.*\.css$/,
  /.*\.woff2?$/,
  /.*\.ttf$/,
  /.*\.otf$/
];

// Install event - cache static resources and claim clients immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Install event - caching static assets');
  
  event.waitUntil(
    (async () => {
      try {
        // Cache static shell resources
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(STATIC_CACHE_URLS);
        console.log('[SW] Static assets cached successfully');
        
        // Skip waiting to activate immediately (ensures updates are applied quickly)
        await self.skipWaiting();
      } catch (error) {
        console.error('[SW] Failed to cache static assets:', error);
      }
    })()
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event - cleaning up old caches');
  
  event.waitUntil(
    (async () => {
      try {
        // Get all cache names
        const cacheNames = await caches.keys();
        
        // Delete old caches
        const deletePromises = cacheNames
          .filter(cacheName => 
            cacheName.startsWith('tetris-') && 
            cacheName !== CACHE_NAME && 
            cacheName !== RUNTIME_CACHE
          )
          .map(cacheName => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          });
        
        await Promise.all(deletePromises);
        
        // Take control of all clients immediately (ensures PWA updates apply right away)
        await self.clients.claim();
        console.log('[SW] Service worker activated and claimed clients');
      } catch (error) {
        console.error('[SW] Error during activation:', error);
      }
    })()
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  event.respondWith(
    (async () => {
      try {
        // Strategy 1: Cache-first for static shell resources
        if (STATIC_CACHE_URLS.includes(url.pathname) || url.pathname === '/') {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If not in cache, fetch and cache
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }
        
        // Strategy 2: Stale-while-revalidate for runtime assets (JS, CSS, fonts)
        if (RUNTIME_CACHE_URLS.some(pattern => pattern.test(url.pathname))) {
          const cachedResponse = await caches.match(request);
          
          // Background update
          const fetchPromise = fetch(request).then(networkResponse => {
            if (networkResponse.ok) {
              const cache = caches.open(RUNTIME_CACHE);
              cache.then(c => c.put(request, networkResponse.clone()));
            }
            return networkResponse;
          }).catch(() => cachedResponse);
          
          // Return cached version immediately if available, otherwise wait for network
          return cachedResponse || await fetchPromise;
        }
        
        // Strategy 3: Network-first for API calls and other requests
        try {
          const networkResponse = await fetch(request);
          
          // Cache successful responses for offline fallback
          if (networkResponse.ok && url.origin === self.location.origin) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
          }
          
          return networkResponse;
        } catch (error) {
          // Fallback to cache if network fails
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // For navigation requests, return cached index.html as fallback
          if (request.mode === 'navigate') {
            const cachedIndex = await caches.match('/index.html');
            if (cachedIndex) {
              return cachedIndex;
            }
          }
          
          throw error;
        }
      } catch (error) {
        console.error('[SW] Fetch error:', error);
        throw error;
      }
    })()
  );
});

// Handle service worker updates - notify clients when a new version is available
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
});

// Notify clients about updates
function notifyClientsAboutUpdate() {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_UPDATE_AVAILABLE'
      });
    });
  });
}

// Background sync for saving high scores when offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'high-score-sync') {
    console.log('[SW] Background sync: high-score-sync');
    // High scores are already saved in localStorage, no additional action needed
    // This event is here for future enhancements if needed
  }
});