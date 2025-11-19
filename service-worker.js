self.addEventListener("install", e => {
    self.skipWaiting();
});

self.addEventListener("activate", e => {
    clients.claim();
});

// No cacheamos nada para evitar errores
self.addEventListener("fetch", () => { });
