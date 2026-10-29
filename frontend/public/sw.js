/* HSK Learning - Service Worker (PWA offline).
 * Tăng CACHE_VERSION mỗi khi đổi chiến lược cache để xóa cache cũ. */
const CACHE_VERSION = "hsk-v1"
const STATIC_CACHE = `${CACHE_VERSION}-static`
const PAGES_CACHE = `${CACHE_VERSION}-pages`
const OFFLINE_URL = "/offline.html"

const STATIC_PREFIXES = ["/_next/static/", "/content/", "/books/", "/icons/"]
const STATIC_EXT = /\.(?:svg|png|jpg|jpeg|webp|avif|ico|woff2?|json)$/i

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL, "/icons/icon-192.png", "/chibi-loading.svg"]))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE)
  const hit = await cache.match(request)
  if (hit) return hit
  const res = await fetch(request)
  if (res.ok && res.status === 200) cache.put(request, res.clone())
  return res
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGES_CACHE)
  try {
    const res = await fetch(request)
    if (res.ok) cache.put(request, res.clone())
    return res
  } catch {
    const hit = await cache.match(request)
    if (hit) return hit
    const offline = await caches.match(OFFLINE_URL)
    return offline || Response.error()
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return // không đụng tới Supabase / CDN
  if (url.pathname.startsWith("/api/") || url.pathname === "/sw.js") return // API & audio: để HTTP cache xử lý

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request))
    return
  }

  if (STATIC_PREFIXES.some((p) => url.pathname.startsWith(p)) || STATIC_EXT.test(url.pathname)) {
    event.respondWith(cacheFirst(request))
  }
})

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting()
})
