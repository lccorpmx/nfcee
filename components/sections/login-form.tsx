"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Reveal } from "../reveal";
import { GlassPanel, Pill } from "../ui";
import { AlertIcon, GoogleG, ShieldIcon } from "../icons";

/* ============================================================
   Acceso a /linkmap
   ------------------------------------------------------------
   El formulario sólo transporta credenciales; quien decide es
   el servidor (/api/auth/login), que responde con una cookie
   httpOnly. Aquí nunca se guarda la contraseña.
   ============================================================ */

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error?.message ?? "No se pudo iniciar sesión.");
        setPassword("");
        setBusy(false);
        return;
      }

      /* `refresh()` antes de navegar: /linkmap es un componente de
         servidor y sin esto el router podría servir la versión
         cacheada, la de antes de que existiera la cookie. */
      router.refresh();
      router.push("/linkmap");
    } catch {
      setError("No se pudo conectar con el servidor.");
      setBusy(false);
    }
  }

  const inputClass = `
    h-[52px] w-full rounded-full border border-black/[0.09] bg-white px-5
    text-[15px] text-foreground shadow-[0_2px_10px_rgba(16,26,58,0.05)]
    transition-[border-color,box-shadow] duration-200 ease-out
    placeholder:text-slate-400 hover:border-black/[0.14]
    focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-500/15
  `;

  return (
    <section className="px-5 pb-16 pt-16 sm:pt-24" aria-labelledby="login-title">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <Reveal variant="fade">
            <Pill tone="violet" icon={<GoogleG className="h-4 w-4" />}>
              Acceso privado
            </Pill>
          </Reveal>

          <Reveal delay={80} variant="mask">
            <h1
              id="login-title"
              className="
                mt-5 font-display text-[1.9rem] font-extrabold leading-[1.14]
                tracking-[-0.028em] text-foreground sm:text-[2.3rem]
              "
            >
              Inicia <span className="text-grad-violet">sesión</span>
            </h1>
          </Reveal>

          <Reveal delay={140} variant="blur">
            <p className="mx-auto mt-3 max-w-[24rem] text-[14.5px] leading-[1.6] text-muted-foreground">
              Esta herramienta es de uso interno.
            </p>
          </Reveal>
        </div>

        <Reveal delay={200} variant="scale">
          <GlassPanel className="mt-8">
            <form onSubmit={submit} noValidate>
              <label
                htmlFor="login-email"
                className="block font-display text-[13.5px] font-bold text-foreground"
              >
                Correo
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className={`mt-2 ${inputClass}`}
              />

              <label
                htmlFor="login-password"
                className="mt-4 block font-display text-[13.5px] font-bold text-foreground"
              >
                Contraseña
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`mt-2 ${inputClass}`}
              />

              {error && (
                <div
                  className="
                    mt-4 flex items-start gap-2.5 rounded-[18px] border border-red-200/80
                    bg-red-50/85 p-3.5 text-left
                  "
                >
                  <AlertIcon className="mt-px h-[18px] w-[18px] shrink-0 text-g-red" />
                  <p className="text-[13px] leading-snug text-red-700/90">{error}</p>
                </div>
              )}

              <p role="status" aria-live="polite" className="sr-only">
                {error}
              </p>

              <button
                type="submit"
                disabled={busy || !email || !password}
                className="
                  grad-cta mt-6 flex min-h-[52px] w-full cursor-pointer items-center
                  justify-center gap-2 rounded-full font-display text-[15px]
                  font-semibold text-white
                  shadow-[0_10px_22px_-10px_rgba(16,26,58,0.55)]
                  transition-[transform,filter,opacity] duration-200 ease-out
                  hover:brightness-[1.06] active:scale-[0.97]
                  disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:brightness-100
                  motion-reduce:transform-none
                "
              >
                {busy ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-[17px] w-[17px] animate-spin rounded-full border-2 border-white/35 border-t-white"
                    />
                    Entrando
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>
          </GlassPanel>
        </Reveal>

        <Reveal delay={260}>
          <p className="mt-5 flex items-center justify-center gap-2 text-center text-[12.5px] text-muted-foreground">
            <ShieldIcon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            Tu sesión permanece abierta 12 horas.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
