// ================================================================
// SERVICE WORKER — College Major Project
// Caches critical pages so app works on slow network & offline
// ================================================================

var CACHE = "college-disaster-v1";

var FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/Firstaid.html",
  "/Safezones.html",
  "/contact.html",
  "/style.css",
  "/script.js",
  "/admin.css"
];

// Install — cache all files
self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return Promise.allSettled(
        FILES_TO_CACHE.map(function(url) {
          return fetch(url).then(function(res) {
            if (res.ok) return cache.put(url, res);
          }).catch(function() {});
        })
      );
    }).then(function() { return self.skipWaiting(); })
  );
});

// Activate — remove old caches
self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// Fetch — serve from cache first, then network
self.addEventListener("fetch", function(e) {
  var url = new URL(e.request.url);

  // API calls — network only (never cache live data)
  if (url.pathname.startsWith("/api/") || url.origin.includes("onrender.com")) {
    e.respondWith(
      fetch(e.request).catch(function() {
        return new Response(
          JSON.stringify({ message: "You are offline. Please reconnect.", offline: true }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        );
      })
    );
    return;
  }

  // Pages and assets — cache first, network fallback
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) {
        // Serve cached version immediately
        // Also update cache in background (stale-while-revalidate)
       fetch(e.request).then(function(res) {
  if (res && res.status === 200 && e.request.method === "GET") {
            caches.open(CACHE).then(function(c) { c.put(e.request, res); });
          }
        }).catch(function() {});
        return cached;
      }
      // Not in cache — try network
  return fetch(e.request).then(function(res) {
  if (res && res.status === 200 && e.request.method === "GET") {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return res;
      }).catch(function() {
        // Offline fallback for HTML pages
        if (e.request.destination === "document") {
          return caches.match("/index.html");
        }
        return new Response("", { status: 408 });
      });
    })
  );
});