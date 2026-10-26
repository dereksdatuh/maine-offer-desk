// Keeps the app working with no signal. Bump VERSION when any file changes.
const VERSION = 'offer-desk-v3';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'img/logo.png', 'img/eho.png', 'img/icon-192.png', 'img/icon-512.png', 'img/apple-touch-icon.png',
  'fonts/Archivo-400.ttf', 'fonts/Archivo-500.ttf', 'fonts/Archivo-600.ttf', 'fonts/Archivo-700.ttf', 'fonts/Archivo-800.ttf', 'fonts/ZillaSlab-700.ttf'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Network first so updates show up right away; fall back to the saved copy offline.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then((m) => m || caches.match('index.html'))));
});
