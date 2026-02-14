const CACHE_NAME = 'try-system-v5.1';

const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css?v=5.1',
  '/css/responsive.css?v=5.1',
  '/js/app.js?v=5.1',
  '/js/questions.js?v=5.1'
];

// INSTALL
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// ACTIVATE (Delete Old Cache)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;

        return fetch(event.request).catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
