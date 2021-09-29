// SERVICE WORKER
const cacheName = '##CACHENAME##';
const essenials = [
    "./",
    "index.html"
];
self.addEventListener('install', e => {
    //@ts-ignore
    e.waitUntil(caches.open(cacheName).then(cache => {
        return cache.addAll(essenials);
    }));
});
self.addEventListener('activate', e => {
    console.log("SW: Activated!!!");
});
self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then(res => {
        return res || fetch(e.request);
    }));
});

//# sourceMappingURL=maps/sw.js.map
