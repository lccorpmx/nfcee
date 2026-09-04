import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Backdrop } from "@/components/backdrop";
import { LoginForm } from "@/components/sections/login-form";
import { hasSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "nfcee — Iniciar sesión",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Con sesión abierta, la pantalla de acceso no tiene nada que ofrecer.
  if (await hasSession()) redirect("/linkmap");

  return (
    <div className="relative isolate w-full overflow-x-hidden">
      <Backdrop />
      <main className="relative w-full">
        <LoginForm />
      </main>
    </div>
  );
}
