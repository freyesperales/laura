/**
 * LAURA Digital Agency - Service Worker
 * Provides offline functionality and caching strategies
 * Version: 1.0.0
 */

const CACHE_NAME = 'laura-digital-v1.0.0';
const OFFLINE_URL = './offline.html';

// Assets to cache immediately
const CACHE_ASSETS = [
  './',
  './index.html',
  './blog.html', 
  './assets/css/main.css',
  './assets/js/config.js',
  './assets/js/components.js',
  './assets/js/animations.js',
  './assets/js/forms.js',
  './assets/js/main.js',
  './assets/images/favicon.ico',
  // Add critical images here
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching app assets');
        return cache.addAll(CACHE_ASSETS);
      })
      .catch((error) => {
        console.error('❌ Cache installation failed:', error);
      })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
            .then((cache) => {
              return cache.match('./index.html');
            });
        })
    );
    return;
  }
  
  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Don't cache non-successful responses
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }
            
            // Clone the response
            const responseToCache = fetchResponse.clone();
            
            // Add to cache for future use
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return fetchResponse;
          })
          .catch(() => {
            // If both cache and network fail, return offline page for navigation
            if (event.request.destination === 'document') {
              return caches.match('./offline.html');
            }
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    console.log('🔄 Background sync: contact-form');
    event.waitUntil(syncContactForms());
  }
});

// Sync offline form submissions
async function syncContactForms() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (request.url.includes('contact-form-offline')) {
        const response = await cache.match(request);
        const formData = await response.json();
        
        // Try to submit the form
        try {
          const submitResponse = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });
          
          if (submitResponse.ok) {
            // Remove from cache after successful submission
            await cache.delete(request);
            console.log('✅ Offline form submitted successfully');
          }
        } catch (error) {
          console.log('📡 Still offline, will retry later');
        }
      }
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Push notifications (if implemented)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: './assets/images/icon-192x192.png',
    badge: './assets/images/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || './'
    },
    actions: [
      {
        action: 'view',
        title: 'Ver',
        icon: './assets/images/view-icon.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: './assets/images/close-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(event.data.payload);
        })
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

// Sync content in background
async function syncContent() {
  try {
    // Update blog articles manifest
    const response = await fetch('./articles/manifest.json');
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put('./articles/manifest.json', response);
      console.log('📰 Blog content synced');
    }
  } catch (error) {
    console.log('📡 Content sync failed:', error);
  }
}

// Log service worker events
console.log('🚀 LAURA Service Worker loaded successfully');