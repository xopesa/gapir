// Gapir service worker: keeps the app usable without a network.
// - Static files (/_next/static, audio, images): cache first.
// - Pages: network first; when offline the cached /offline app is shown,
//   which plays lessons from the course package stored on the device.
const CACHE = "gapir-offline-v2";
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add(OFFLINE_URL)).catch(() => undefined));
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
    await self.clients.claim();
  })());
});

function isStatic(url) {
  return url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/audio/") || /\.(?:png|svg|ico|webp|woff2?)$/.test(url.pathname);
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isStatic(url)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request, { ignoreSearch: url.pathname.startsWith("/audio/") });
      if (cached) return cached;
      const response = await fetch(request);
      // Audio is requested with Range headers (206); only full responses are cacheable.
      if (response.ok && response.status === 200) cache.put(request, response.clone()).catch(() => undefined);
      return response;
    })());
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        return await fetch(request);
      } catch {
        const cache = await caches.open(CACHE);
        return (await cache.match(OFFLINE_URL)) ?? new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
      }
    })());
  }
});
