const CACHE_NAME = "my-pwa-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
];

self.addEventListener("install", (event) => {
  console.log("[SW] Service Worker instalándose...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Cacheando archivos...");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
  console.log("[SW] Service Worker instalado correctamente");
});

// Activate - limpiar caches viejos
self.addEventListener("activate", (event) => {
  console.log("[SW] Service Worker activándose...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[SW] Eliminando cache viejo:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
  console.log("[SW] Service Worker activado y listo");
});

// Fetch - estrategia cache first, fallback a red
self.addEventListener("fetch", (event) => {
  console.log("[SW] Interceptando petición:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("[SW] Sirviendo desde cache:", event.request.url);
        return response;
      }
      console.log("[SW]  Pidiendo a la red:", event.request.url);
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type === "error") {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => {
        console.log("[SW] Recurso no disponible offline:", event.request.url);
        return caches.match("./index.html");
      });
    })
  );
});