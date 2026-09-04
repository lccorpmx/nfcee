/* ============================================================
   nfcee — service worker
   ------------------------------------------------------------
   Deliberadamente corto. La regla que manda es que /linkmap y
   /login están detrás de una cookie de sesión: guardar su HTML
   sería servir la pantalla de otra sesión, o una ya vencida.
   Así que aquí sólo se cachea lo que es idéntico para cualquiera
   —los estáticos con hash en el nombre— y se guarda una página
   de cortesía para cuando no hay red.
   ============================================================ */

const VERSION = "v1";
const SHELL = `nfcee-shell-${VERSION}`;
const ASSETS = `nfcee-assets-${VERSION}`;
const OFFLINE = "/offline.html";

/** Estáticos de `public/` que vale la pena conservar entre visitas. */
const CACHEABLE = /\.(?:png|jpe?g|svg|webp|avif|ico|woff2?)$/i;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.add(new Request(OFFLINE, { cache: "reload" })))
      // Sin espera: la versión nueva reemplaza a la vieja en la próxima carga.
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== SHELL && key !== ASSETS).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // La API lleva sesión y datos frescos: no se toca nunca.
  if (url.pathname.startsWith("/api/")) return;

  /* Navegaciones: siempre a la red. Si no hay, la página de cortesía —
     jamás una copia guardada de una pantalla con sesión dentro. */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const fallback = await caches.match(OFFLINE);
        return fallback ?? Response.error();
      }),
    );
    return;
  }

  /* El resto de /_next/static lleva hash en el nombre: si la URL coincide,
     el contenido coincide. Nada más se guarda; las peticiones RSC y todo lo
     demás caen al manejo normal del navegador. */
  if (url.pathname.startsWith("/_next/static/") || CACHEABLE.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    // Sólo respuestas completas y propias: un 206 o un opaco envenenan el caché.
    if (response.ok && response.type === "basic") {
      const cache = await caches.open(ASSETS);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return Response.error();
  }
}
