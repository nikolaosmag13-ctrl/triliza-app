// Όνομα της προσωρινής μνήμης (cache)
const CACHE_NAME = 'triliza-v1';

// Λίστα αρχείων που θα αποθηκευτούν τοπικά
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com'
];

// Εγκατάσταση του Service Worker και αποθήκευση των αρχείων
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ενεργοποίηση και καθαρισμός παλιών εκδόσεων cache αν υπάρξουν
self.addEventListener('activate', (event) => {
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

// Ανάκτηση δεδομένων: Πρώτα από την cache, αλλιώς από το δίκτυο
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
