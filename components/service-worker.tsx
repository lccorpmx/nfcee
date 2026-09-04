"use client";

import { useEffect } from "react";

/* ============================================================
   Registro del service worker
   ------------------------------------------------------------
   No pinta nada: sólo engancha /sw.js una vez que la página
   terminó de cargar, para no competir por ancho de banda con lo
   que el visitante sí está esperando ver.

   En desarrollo hace lo contrario —da de baja lo que hubiera—
   porque un service worker vivo sirve estáticos guardados por
   encima de los que acaba de recompilar Turbopack, y el efecto
   es un cambio que "no se aplica" sin ninguna pista de por qué.
   ============================================================ */

export function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => registrations.forEach((r) => void r.unregister()))
        .catch(() => {});
      return;
    }

    function register() {
      // `updateViaCache: none` obliga a revalidar el propio sw.js en cada
      // arranque: sin eso, una versión vieja puede quedarse meses.
      void navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => {});
    }

    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
