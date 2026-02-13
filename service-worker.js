const CACHE_NAME = 'try-system-v5';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/responsive.css',
  '/js/app.js',
  '/js/questions.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((response) => response || fetch(e.request)));
});
