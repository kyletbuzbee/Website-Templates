// Service Worker for Website Template Usability Tester
const CACHE_NAME = 'usability-tester-v1.0.0';
const STATIC_CACHE = 'usability-tester-static-v1.0.0';
const DYNAMIC_CACHE = 'usability-tester-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/tools/usability-tester/',
  '/tools/usability-tester/index.html',
  '/tools/usability-tester/manifest.json',
  '/tools/usability-tester/scripts/usability-tester.js',
  '/assets/css/main.css',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Usability Tester - Install event');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Usability Tester - Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // Handle template assets (cache first strategy for testing)
  if (url.pathname.includes('/kits/') || url.pathname.includes('/industries/')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request)
            .then((response) => {
              // Cache successful responses
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => cache.put(request, responseClone));
              }
              return response;
            })
            .catch(() => {
              // Return offline fallback
              return caches.match('/tools/usability-tester/index.html');
            });
        })
    );
    return;
  }

  // Handle static assets (cache first strategy)
  if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset))) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          return cachedResponse || fetch(request);
        })
    );
    return;
  }

  // Default: Network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request)
          .then((cachedResponse) => {
            return cachedResponse || caches.match('/tools/usability-tester/index.html');
          });
      })
  );
});

// Background sync for test results
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);

  if (event.tag === 'test-results-sync') {
    event.waitUntil(syncTestResults());
  }
});

// Push notifications for test session updates
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received');

  const options = {
    body: event.data ? event.data.text() : 'New test session updates available!',
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View Results',
        icon: '/assets/icons/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/assets/icons/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Usability Test Updates', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click event:', event.action);

  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/tools/usability-tester/')
    );
  }
});

// Helper function for background sync
async function syncTestResults() {
  try {
    // Get stored test results from IndexedDB or similar
    const testResults = await getStoredTestResults();

    if (testResults && testResults.length > 0) {
      // Sync with server
      const response = await fetch('/api/sync-test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testResults)
      });

      if (response.ok) {
        // Clear stored test results
        await clearStoredTestResults();
        console.log('[SW] Test results synced successfully');
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getStoredTestResults() {
  // Implementation would use IndexedDB to retrieve stored test results
  return null;
}

async function clearStoredTestResults() {
  // Implementation would clear IndexedDB storage
  return null;
}

// Periodic background sync for test session checks
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'test-session-check') {
    event.waitUntil(checkForTestSessionUpdates());
  }
});

async function checkForTestSessionUpdates() {
  try {
    const response = await fetch('/api/test-session-updates');
    const updates = await response.json();

    if (updates && updates.length > 0) {
      // Show notification about test session updates
      const notification = await self.registration.showNotification(
        'Test Session Updates',
        {
          body: `${updates.length} new test results and feedback available`,
          icon: '/assets/icons/icon-192.png',
          badge: '/assets/icons/icon-192.png',
          tag: 'test-session-updates',
          requireInteraction: true,
          actions: [
            { action: 'view', title: 'View Results' },
            { action: 'dismiss', title: 'Dismiss' }
          ]
        }
      );
    }
  } catch (error) {
    console.error('[SW] Test session update check failed:', error);
  }
}
