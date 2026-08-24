/*
 * Offline shell for Streaks. A habit app has to open with no network, so the
 * document and every build asset (the Outfit font files included, which Next
 * self-hosts under /_next/static/media) are served from the cache.
 */
const CACHE = 'streaks-v1';

const PRECACHE = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
  '/icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

/**
 * The page reports the exact assets this build loaded — hashed chunks and the
 * self-hosted Outfit files. They can't be listed at install time because their
 * names change every build, and a first visit is normally uncontrolled, so the
 * font would otherwise never make it into the cache.
 */
self.addEventListener('message', (event) => {
  const { data } = event;
  if (!data || data.type !== 'cache-assets' || !Array.isArray(data.urls)) return;

  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      await Promise.all(
        data.urls.map(async (url) => {
          try {
            if (await cache.match(url)) return;
            const response = await fetch(url, { cache: 'no-cache' });
            if (response.ok) await cache.put(url, response);
          } catch {
            // One asset failing to cache shouldn't take the rest down.
          }
        }),
      );
    }),
  );
});

/** Build assets are content-hashed, so a cache hit is always correct. */
function isImmutable(url) {
  return url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Future API routes must never be served from a stale cache.
  if (url.pathname.startsWith('/api/')) return;

  if (isImmutable(url)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
            return response;
          }),
      ),
    );
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(() => caches.match('/').then((hit) => hit || Response.error())),
    );
    return;
  }

  event.respondWith(fetch(request).catch(() => caches.match(request).then((hit) => hit || Response.error())));
});
