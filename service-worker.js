const cacheName = 'tap-tap-cache-v1';
const filesToCache = [
  './',
  './index.html',
  './main.js',
  './manifest.json',
  './icon.png',
  './favicon.ico',
  './space-bg.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== cacheName) return caches.delete(k);
        })
      )
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
