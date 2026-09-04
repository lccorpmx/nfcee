import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { ScrollProgress } from "@/components/scroll-progress";
import { ServiceWorker } from "@/components/service-worker";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "nfcee",
  title: "nfcee — Convierte cada visita en una reseña de 5 estrellas",
  description:
    "Tarjeta NFC para negocios: tus clientes dejan una reseña en Google en segundos con solo acercar su teléfono. Sin apps, uso ilimitado, envíos a todo México.",
  /* Instalada en la pantalla de inicio de un iPhone, la app se abre sin la
     barra de Safari. En Android eso lo decide `display` del manifiesto. */
  appleWebApp: {
    capable: true,
    title: "nfcee",
    statusBarStyle: "default",
  },
  openGraph: {
    siteName: "nfcee",
    title: "nfcee — Convierte cada visita en una reseña de 5 estrellas",
    description:
      "Tarjeta NFC para reseñas de Google, Instagram y Facebook. Una reseña en menos de 10 segundos.",
    locale: "es_MX",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f5f3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {/*
          Marks the document as script-enabled before the rest of the body paints.
          Scroll-reveal only hides content under `.js`, so with JS off — or if
          hydration never runs — the page renders fully visible instead of blank.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
        <ScrollProgress />
        <ServiceWorker />
        {children}
      </body>
    </html>
  );
}
