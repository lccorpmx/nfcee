import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        /* El service worker no se cachea: si el navegador se queda con una
           copia vieja de este archivo, se queda también con la estrategia de
           caché vieja, y ya no hay forma de corregirla desde el servidor. */
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
