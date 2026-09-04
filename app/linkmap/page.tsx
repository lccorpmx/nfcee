import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Backdrop } from "@/components/backdrop";
import { LinkMap } from "@/components/sections/linkmap";
import { TrustFooter } from "@/components/sections/final-cta";
import { hasSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "nfcee — Generador de links de reseña de Google",
  description:
    "Busca tu negocio en Google, confírmalo en Maps y obtén el link directo para que tus clientes dejen su reseña en un solo toque.",
  // Herramienta interna: útil de compartir por link, no de indexar.
  robots: { index: false, follow: false },
};

export default async function LinkMapPage() {
  /* La puerta real. Al ser un componente de servidor, el redirect
     ocurre antes de enviar nada al navegador: la interfaz protegida
     no llega a pintarse ni por un instante. */
  if (!(await hasSession())) redirect("/login");

  return (
    <div className="relative isolate w-full overflow-x-hidden">
      <Backdrop />
      <main className="relative w-full">
        <LinkMap />
      </main>
      <TrustFooter />
    </div>
  );
}
