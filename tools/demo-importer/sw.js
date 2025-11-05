// Service Worker for Website Template Library Demo Importer
const CACHE_NAME = 'template-library-v1.0.0';
const STATIC_CACHE = 'template-library-static-v1.0.0';
const DYNAMIC_CACHE = 'template-library-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/tools/demo-importer/',
  '/tools/demo-importer/index.html',
  '/tools/demo-importer/manifest.json',
  '/tools/demo-importer/scripts/demo-importer.js',
  '/assets/css/main.css',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
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
  console.log('[SW] Activate event');
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

  // Handle template assets (cache first strategy)
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
              // Return offline fallback for templates
              return caches.match('/tools/demo-importer/index.html');
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
            return cachedResponse || caches.match('/tools/demo-importer/index.html');
          });
      })
  );
});

// Background sync for template customizations
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync event:', event.tag);

  if (event.tag === 'template-customization-sync') {
    event.waitUntil(syncTemplateCustomizations());
  }
});

// Push notifications for template updates
self.addEventListener('push', (event) => {
  console.log('[SW] Push event received');

  const options = {
    body: event.data ? event.data.text() : 'New template updates available!',
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Updates',
        icon: '/assets/icons/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Template Library Updates', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click event:', event.action);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/tools/demo-importer/')
    );
  }
});

// Helper function for background sync
async function syncTemplateCustomizations() {
  try {
    // Get stored customizations from IndexedDB or similar
    const customizations = await getStoredCustomizations();

    if (customizations && customizations.length > 0) {
      // Sync with server
      const response = await fetch('/api/sync-customizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customizations)
      });

      if (response.ok) {
        // Clear stored customizations
        await clearStoredCustomizations();
        console.log('[SW] Customizations synced successfully');
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Placeholder functions for IndexedDB operations
async function getStoredCustomizations() {
  // Implementation would use IndexedDB to retrieve stored customizations
  return null;
}

async function clearStoredCustomizations() {
  // Implementation would clear IndexedDB storage
  return null;
}

// Periodic background sync for template updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'template-update-check') {
    event.waitUntil(checkForTemplateUpdates());
  }
});

async function checkForTemplateUpdates() {
  try {
    const response = await fetch('/api/template-updates');
    const updates = await response.json();

    if (updates && updates.length > 0) {
      // Show notification about updates
      const notification = await self.registration.showNotification(
        'Template Updates Available',
        {
          body: `${updates.length} new templates and updates available`,
          icon: '/assets/icons/icon-192.png',
          badge: '/assets/icons/icon-192.png',
          tag: 'template-updates',
          requireInteraction: true,
          actions: [
            { action: 'view', title: 'View Updates' },
            { action: 'dismiss', title: 'Dismiss' }
          ]
        }
      );
    }
  } catch (error) {
    console.error('[SW] Template update check failed:', error);
  }
}
