const STATIC_CACHE = "budget-static-v1";
const API_CACHE = "budget-api-v1";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.ico",
  "./icons/delete.svg",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png"
];

// Installazione: salva i file statici nella cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Attivazione: pulisce eventuali vecchie cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE && key !== API_CACHE)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Gestione delle richieste di rete
self.addEventListener("fetch", event => {
  const { request } = event;

  // Ignora richieste POST e DELETE (vanno sempre direttamente al server)
  if (request.method !== "GET") {
    return;
  }

  // Strategia Network-First per le API del backend
  if (request.url.includes("/budget-management/")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clonedResponse = response.clone();
          caches.open(API_CACHE).then(cache => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Strategia Cache-First per i file statici dell'app
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      return cachedResponse || fetch(request);
    })
  );
});
