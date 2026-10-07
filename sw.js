// Αύξηση της έκδοσης σε v2 για να αναγκάσουμε τον browser να ανανεώσει την προσωρινή μνήμη
const CACHE_NAME = 'triliza-v2';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png',
  'https://cdn.tailwindcss.com'
];

// Εγκατάσταση και προ-φόρτωση αρχείων
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ενεργοποίηση και διαγραφή παλιάς μνήμης (v1)
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

// Σερβίρισμα από cache αν υπάρχει, αλλιώς λήψη από δίκτυο
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
