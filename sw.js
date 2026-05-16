const CACHE = 'voidfit-v3'
const SHELL = [
  '/VoidFit/',
  '/VoidFit/index.html',
  '/VoidFit/manifest.json',
  '/VoidFit/icon-192.png',
  '/VoidFit/icon-512.png',
]

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return

  const url = new URL(e.request.url)

  // Skip Firebase, Google Auth, and cross-origin requests
  if (
    url.hostname.includes('firestore') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('gstatic') ||
    url.hostname.includes('fonts.') ||
    url.origin !== self.location.origin
  ) return

  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        // Assets (hashed bundles): cache-first — they never change
        if (url.pathname.includes('/assets/')) {
          if (cached) return cached
          return fetch(e.request).then(res => {
            if (res.ok) cache.put(e.request, res.clone())
            return res
          })
        }

        // App shell: stale-while-revalidate
        const networkFetch = fetch(e.request).then(res => {
          if (res.ok) cache.put(e.request, res.clone())
          return res
        }).catch(() => cached || caches.match('/VoidFit/index.html'))

        return cached ? (networkFetch, cached) : networkFetch
      })
    )
  )
})

// Background sync: when network is back, update the shell
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting()
})
