const STATIC_CACHE = "budget-static-v2";
const API_CACHE = "budget-api-v2";

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.ico",
  "./icons/delete.svg",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png"
];

const API_URL = self.location.hostname === "127.0.0.1" || self.location.hostname === "localhost"
  ? "http://localhost:3000/budget-management/"
  : "https://my-endpoints.onrender.com/budget-management/";

// Installazione: salva i file statici nella cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Attivazione: pulisce le vecchie cache
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

// Gestione richieste GET (Network-First per le API, Cache-First per i file statici)
self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (request.url.includes("/budget-management/")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clonedResponse = response.clone();
          caches.open(API_CACHE).then(cache => cache.put(request, clonedResponse));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => cachedResponse || fetch(request))
  );
});

// --- Gestione Background Sync per inviare le spese salvate in IndexedDB ---
self.addEventListener("sync", event => {
  if (event.tag === "sync-expenses") {
    event.waitUntil(syncPendingExpensesFromSW());
  }
});

function openDBInSW() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BudgetOfflineDB", 1);
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("pendingExpenses")) {
        db.createObjectStore("pendingExpenses", { keyPath: "tempId", autoIncrement: true });
      }
    };
    request.onsuccess = event => resolve(event.target.result);
    request.onerror = event => reject(event.target.error);
  });
}

async function syncPendingExpensesFromSW() {
  const db = await openDBInSW();

  const pendingItems = await new Promise((resolve, reject) => {
    const tx = db.transaction("pendingExpenses", "readonly");
    const req = tx.objectStore("pendingExpenses").getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = e => reject(e.target.error);
  });

  for (const item of pendingItems) {
    const { tempId, ...payload } = item;
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    if (response.ok) {
      await new Promise((resolve, reject) => {
        const tx = db.transaction("pendingExpenses", "readwrite");
        tx.objectStore("pendingExpenses").delete(tempId);
        tx.oncomplete = () => resolve();
        tx.onerror = e => reject(e.target.error);
      });
    }
  }

  // Avvisa eventuali schede aperte di aggiornare la tabella
  const clients = await self.clients.matchAll();
  clients.forEach(client => client.postMessage({ type: "SYNC_COMPLETED" }));
}
