/* ===========================================
TRY GAME SERVICE WORKER — SMART OFFLINE SYSTEM
=========================================== */

const CACHE_NAME = "try-game-cache-v1";

/* ================= CACHE FILE LIST ================= */

const FILES_TO_CACHE = [

"./",
"./index.html",
"./css/style.css",
"./css/responsive.css",
"./js/app.js",
"./js/questions.js",
"./manifest.json",

"./assets/icons/icon-192.png",
"./assets/icons/icon-512.png"

];


/* ================= INSTALL ================= */

self.addEventListener("install", e => {

e.waitUntil(
caches.open(CACHE_NAME).then(cache => {
return cache.addAll(FILES_TO_CACHE);
})
);

self.skipWaiting();

});


/* ================= ACTIVATE ================= */

self.addEventListener("activate", e => {

e.waitUntil(
caches.keys().then(keys =>
Promise.all(
keys.map(key => {
if(key !== CACHE_NAME){
return caches.delete(key);
}
})
)
)
);

self.clients.claim();

});


/* ================= FETCH ================= */

self.addEventListener("fetch", e => {

e.respondWith(

caches.match(e.request).then(res => {

return res || fetch(e.request).then(fetchRes => {

return caches.open(CACHE_NAME).then(cache => {
cache.put(e.request, fetchRes.clone());
return fetchRes;
});

}).catch(() => {

if(e.request.mode === "navigate"){
return caches.match("./index.html");
}

});

})

);

});
