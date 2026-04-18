const CACHE_NAME = "scout-pwa-v3";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
];

// INSTALL
self.addEventListener("install", (event) => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );

});

// ACTIVATE
self.addEventListener("activate", (event) => {

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();

});

// FETCH (Network first)
self.addEventListener("fetch", (event) => {

  if (event.request.method !== "GET") return;

  event.respondWith(

    fetch(event.request)
      .then((response) => {

        const clone = response.clone();

        if (event.request.url.startsWith(self.location.origin)) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }

        return response;

      })
      .catch(() => {

        return caches.match(event.request).then((response) => {
          return response || caches.match("/index.html");
        });

      })

  );

});