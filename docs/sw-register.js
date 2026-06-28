// Registers the network-first service worker (sw.js) for the Shard web build.
//
// Injected into the exported index.html via the Web preset's "Head Include" so it
// survives re-exports. On the visit where the worker first installs, it takes control
// (skipWaiting + clients.claim in sw.js) which fires `controllerchange`; we reload once
// so that visit also gets fresh assets. After that, the worker revalidates every file
// against the server on each load, so returning players always land on the latest build.
// Harmless where service workers aren't available (e.g. the itch.io iframe): it no-ops.
if ("serviceWorker" in navigator) {
	let refreshing = false;
	navigator.serviceWorker.addEventListener("controllerchange", () => {
		if (refreshing) return;
		refreshing = true;
		window.location.reload();
	});
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("sw.js").catch(() => {});
	});
}
