// Anime Log service worker: offline app shell + cached poster art.
const SHELL = 'animelog-shell-v1';
const ART = 'animelog-art-v1';
const SHELL_FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => ![SHELL, ART].includes(k)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Catalogue APIs: always network (search needs to be live).
  if (/jikan\.moe|anilist\.co$/.test(url.hostname) && !req.destination.includes('image')) return;
  // Poster images: cache-first so your library looks right offline.
  if (req.destination === 'image' && url.origin !== location.origin) {
    e.respondWith(caches.open(ART).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      try { const res = await fetch(req); if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; }
      catch (err) { return hit || Response.error(); }
    }));
    return;
  }
  // App shell: network-first (to pick up updates), fall back to cache offline.
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(SHELL).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
  }
});
