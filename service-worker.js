const CACHE_NAME = "asteroid-defense-cache-v1";
const urlsToCache = [
  "index.html",
  "main.js",
  "manifest.json",
  "icon.png",
  "favicon.ico"
];

// Servis worker kurulunca gerekli dosyaları önbelleğe al
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching app files");
        return cache.addAll(urlsToCache);
      })
  );
});

// İsteklerde önce önbellekten sonra internetten çek
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

// Yeni sürüm geldiğinde eski cache’i temizle
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              console.log("[Service Worker] Deleting old cache:", name);
              return caches.delete(name);
            }
          })
        )
      )
  );
});
