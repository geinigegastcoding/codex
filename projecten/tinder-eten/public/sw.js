const SHELL_CACHE = 'hap-shell-v1'
const IMAGE_CACHE = 'hap-images-v1'
const CORE_ASSETS = ['/', '/index.html', '/manifest.webmanifest', '/icons/hap-192.png', '/icons/hap-512.png', '/icons/hap-maskable-512.png']

async function cacheBuiltShell() {
  const cache = await caches.open(SHELL_CACHE)
  const response = await fetch('/', { cache: 'no-store' })
  if (!response.ok) throw new Error('App-shell kon niet worden opgehaald')
  const html = await response.clone().text()
  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((match) => match[1])
  await cache.put('/', response.clone())
  await cache.put('/index.html', response)
  await cache.addAll([...CORE_ASSETS.slice(2), ...new Set(assets)])
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheBuiltShell().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('hap-') && ![SHELL_CACHE, IMAGE_CACHE].includes(key)).map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]))
})

async function cacheFirst(request, cacheName = SHELL_CACHE) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok || response.type === 'opaque') await cache.put(request, response.clone())
  return response
}

async function navigationResponse(request) {
  const cache = await caches.open(SHELL_CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) {
      await cache.put('/', response.clone())
      await cache.put('/index.html', response.clone())
    }
    return response
  } catch {
    return (await cache.match('/index.html')) || (await cache.match('/')) || Response.error()
  }
}

async function cachedRecipeImage(request) {
  const cache = await caches.open(IMAGE_CACHE)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok || response.type === 'opaque') {
    await cache.put(request, response.clone())
    const keys = await cache.keys()
    if (keys.length > 120) await cache.delete(keys[0])
  }
  return response
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith('/api/')) return
    if (request.mode === 'navigate') return event.respondWith(navigationResponse(request))
    if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/') || url.pathname === '/manifest.webmanifest') {
      return event.respondWith(cacheFirst(request))
    }
    return
  }

  if (request.destination === 'image') event.respondWith(cachedRecipeImage(request))
})
