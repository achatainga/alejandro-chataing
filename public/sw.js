const CACHE_VERSION = 'ac-portfolio-v1'
const STATIC_ASSETS = ['/', '/index.html']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  // Network-first for API calls, cache-first for static
  const isStatic = event.request.destination === 'script'
    || event.request.destination === 'style'
    || event.request.destination === 'font'
    || event.request.url.includes('/assets/')

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then((cached) =>
        cached ?? fetch(event.request).then((res) => {
          const clone = res.clone()
          caches.open(CACHE_VERSION).then((c) => c.put(event.request, clone))
          return res
        })
      )
    )
  } else {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    )
  }
})
