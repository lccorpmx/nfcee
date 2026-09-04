import type { MetadataRoute } from "next";

/* ============================================================
   Manifiesto de la aplicación instalable
   ------------------------------------------------------------
   Next enlaza este archivo solo: no hace falta un <link rel="manifest">
   en el layout.

   `start_url` es la portada, no /linkmap: quien instala desde el sitio
   público no debería aterrizar en una pantalla de contraseña. El atajo
   de abajo lleva a las herramientas en un toque largo sobre el icono.
   ============================================================ */

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "nfcee — Tarjetas NFC para reseñas",
    short_name: "nfcee",
    description:
      "Tarjeta NFC para negocios: tus clientes dejan una reseña en Google en segundos con solo acercar su teléfono.",
    lang: "es-MX",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    // Los mismos tokens que --background en globals.css, para que la
    // pantalla de arranque no parpadee contra el fondo real del sitio.
    background_color: "#f7f5f3",
    theme_color: "#f7f5f3",
    categories: ["business", "productivity", "utilities"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      /* Android recorta el icono a la forma del sistema; el maskable va a
         sangre y con el glifo dentro de la zona segura para que no lo mutile. */
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Herramientas",
        short_name: "Herramientas",
        description: "Generar links de reseña y manejar los tags NFC.",
        url: "/linkmap",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
