// Network-first service worker for the Shard web build (GitHub Pages).
//
// GitHub Pages serves static files (index.html / index.wasm / index.pck ...) from a
// cache window, and the Godot loader reuses the same filenames every build, so a
// returning player's browser can keep serving the OLD build. This worker fixes that:
// every same-origin GET is re-fetched with `cache: 'no-cache'`, which forces the
// browser to revalidate against the server. Unchanged files come back 304 (served
// from the local cache, no re-download), changed files come back fresh -- so a new
// deploy reaches returning players on their next load, without re-downloading the
// whole ~multi-MB wasm/pck every time. The Cache API copy is kept only as an OFFLINE
// fallback. skipWaiting + clients.claim let a new worker take over immediately.

const CACHE = "shard-runtime";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
	const req = event.request;
	// Only handle our own same-origin GETs; leave cross-origin and Range (media) requests alone.
	if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin || req.headers.has("range")) {
		return;
	}
	event.respondWith((async () => {
		try {
			// 'no-cache' = always revalidate with the server (ETag). 304 reuses the cached
			// bytes locally; 200 brings the new build. This is what keeps players up to date.
			const fresh = await fetch(req, { cache: "no-cache" });
			if (fresh && fresh.status === 200) {
				const cache = await caches.open(CACHE);
				cache.put(req, fresh.clone()).catch(() => {});
			}
			return fresh;
		} catch (err) {
			// Offline (or the server is unreachable): fall back to the last cached copy.
			const cached = await caches.match(req);
			if (cached) return cached;
			throw err;
		}
	})());
});
