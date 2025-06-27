// Service Worker for Performance Optimization
const CACHE_NAME = 'fortune-love-v1'
const STATIC_CACHE_URLS = [
  '/',
  '/ranking',
  '/premium',
  '/weekly',
  '/analysis',
  '/manifest.json',
]

// API endpoints to cache
const API_CACHE_URLS = [
  '/api/fortune',
  '/api/ranking',
]

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        self.skipWaiting()
      })
  )
})

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      self.clients.claim()
    })
  )
})

// Fetch event
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(request).then(response => {
          if (response) {
            // Return cached version and update in background
            fetch(request).then(fetchResponse => {
              cache.put(request, fetchResponse.clone())
            }).catch(() => {})
            return response
          }
          
          // Fetch from network and cache
          return fetch(request).then(fetchResponse => {
            // Only cache successful responses
            if (fetchResponse.status === 200) {
              cache.put(request, fetchResponse.clone())
            }
            return fetchResponse
          })
        })
      })
    )
    return
  }

  // Handle static resources
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response
        }

        return fetch(request).then(fetchResponse => {
          // Don't cache unsuccessful responses
          if (!fetchResponse.ok) {
            return fetchResponse
          }

          const responseClone = fetchResponse.clone()
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone)
          })

          return fetchResponse
        })
      })
    )
  }
})