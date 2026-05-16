const CACHE = 'voidfit-v5'
const SHELL = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png']

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return

  const url = new URL(e.request.url)

  // Skip cross-origin requests (Firebase, Google fonts, etc.)
  if (url.origin !== self.location.origin) return

  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request)

      // Hashed asset bundles: cache-first
      if (url.pathname.startsWith('/assets/')) {
        if (cached) return cached
        const res = await fetch(e.request)
        if (res.ok) cache.put(e.request, res.clone())
        return res
      }

      // App shell: stale-while-revalidate
      const networkPromise = fetch(e.request)
        .then(res => { if (res.ok) cache.put(e.request, res.clone()); return res })
        .catch(() => null)

      if (cached) {
        networkPromise.catch(() => {})
        return cached
      }

      const res = await networkPromise
      if (res) return res
      const fallback = await caches.match('/index.html')
      return fallback || new Response('Offline', { status: 503 })
    })
  )
})

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting()
})
