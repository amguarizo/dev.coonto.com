const STATIC_CACHE = "coonto-shell-v2";
const PROTECTED_CACHE = "coonto-protected-v1";
const SHELL = ["/", "/catalogo", "/obra/o-alienista", "/manifest.webmanifest", "/favicon.png", "/images/coonto-logo.png"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(STATIC_CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => event.waitUntil(Promise.all([
  self.clients.claim(),
  caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("coonto-shell-") && key !== STATIC_CACHE).map(key => caches.delete(key)))),
])));

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname === "/offline/o-alienista.html") {
    event.respondWith(caches.open(PROTECTED_CACHE).then(cache => cache.match(event.request)).then(response => response || new Response("Conecte-se à internet e prepare esta obra novamente.", { status: 503 })));
    return;
  }
  if (url.pathname.startsWith("/api/")) return;
  if (event.request.mode === "navigate" && ["/minha-biblioteca", "/leitura/o-alienista", "/backoffice"].includes(url.pathname)) {
    event.respondWith(fetch(event.request).catch(() => caches.open(PROTECTED_CACHE).then(cache => cache.match(event.request)).then(response => response || new Response("Conecte-se à internet para validar sua conta.", { status: 503 }))));
    return;
  }
  if (event.request.mode === "navigate" || url.pathname.startsWith("/_next/") || url.pathname.startsWith("/assets/")) {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) caches.open(STATIC_CACHE).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => caches.match(event.request).then(response => response || caches.match("/"))));
  }
});
