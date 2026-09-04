"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { PlaceCandidate } from "@/lib/places";
import { Reveal } from "../reveal";
import { GlassPanel, Pill } from "../ui";
import {
  AlertIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  GoogleG,
  LogoutIcon,
  MapPinIcon,
  SearchIcon,
  StarIcon,
} from "../icons";

/* ============================================================
   Link builder
   ------------------------------------------------------------
   Buscar → elegir → confirmar en Maps → crear el link de reseña.
   La API key vive en el servidor: este componente sólo habla con
   /api/places/search.
   ============================================================ */

/** Confirmación visual: abre la ficha del negocio en Google Maps. */
function mapsUrl(placeId: string) {
  return `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(placeId)}`;
}

/** El link que se imprime en la tarjeta: abre el formulario de reseña. */
function reviewUrl(placeId: string) {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}

type Status = "idle" | "loading" | "ready" | "error";

export function LinkMap() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [results, setResults] = useState<PlaceCandidate[]>([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<PlaceCandidate | null>(null);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  /* Cada búsqueda recibe un folio. Si el visitante busca otra cosa antes de
     que llegue la respuesta anterior, la vieja se descarta en vez de pisar
     los resultados nuevos. */
  const requestId = useRef(0);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function search(event: React.FormEvent) {
    event.preventDefault();

    const text = query.trim();
    if (!text || status === "loading") return;

    const id = ++requestId.current;
    setStatus("loading");
    setError("");
    setSelected(null);
    setLink("");
    setCopied(false);

    try {
      const response = await fetch("/api/places/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });

      const data = await response.json().catch(() => null);
      if (id !== requestId.current) return;

      /* La cookie dura 12 h: si venció a media sesión, la búsqueda
         vuelve 401 y lo correcto es mandar a iniciar sesión, no
         mostrar un error que el visitante no puede resolver. */
      if (response.status === 401) {
        router.refresh();
        router.push("/login");
        return;
      }

      if (!response.ok) {
        setError(data?.error?.message ?? "No pudimos completar la búsqueda.");
        setResults([]);
        setStatus("error");
        return;
      }

      setResults(data?.places ?? []);
      setStatus("ready");
    } catch {
      if (id !== requestId.current) return;
      setError("No pudimos completar la búsqueda. Revisa tu conexión.");
      setResults([]);
      setStatus("error");
    }
  }

  function choose(place: PlaceCandidate) {
    setSelected(place);
    setLink("");
    setCopied(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      /* clipboard falla en contextos no seguros (http) — copiado manual */
      const field = document.createElement("textarea");
      field.value = link;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }

    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2200);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.refresh();
    router.push("/login");
  }

  const isLoading = status === "loading";
  const isEmpty = status === "ready" && results.length === 0;

  return (
    <section className="px-5 pb-16 pt-14 sm:pt-20" aria-labelledby="linkmap-title">
      <div className="mx-auto max-w-2xl">
        {/* --- Salir --- */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={logout}
            className="
              inline-flex cursor-pointer items-center gap-1.5 rounded-full
              border border-black/[0.07] bg-white/70 px-3.5 py-2
              text-[12.5px] font-semibold text-muted-foreground backdrop-blur-md
              transition-colors duration-200 ease-out
              hover:border-black/[0.14] hover:text-foreground
            "
          >
            <LogoutIcon className="h-4 w-4" />
            Salir
          </button>
        </div>

        {/* --- Encabezado --- */}
        <div className="text-center">
          <Reveal variant="fade">
            <Pill tone="violet" icon={<GoogleG className="h-4 w-4" />}>
              Generador de links
            </Pill>
          </Reveal>

          <Reveal delay={80} variant="mask">
            <h1
              id="linkmap-title"
              className="
                mt-5 font-display text-[2rem] font-extrabold leading-[1.14]
                tracking-[-0.028em] text-foreground sm:text-[2.6rem]
              "
            >
              Crea el link de <span className="text-grad-violet">reseña</span>{" "}
              de tu negocio.
            </h1>
          </Reveal>

          <Reveal delay={150} variant="blur">
            <p className="mx-auto mt-4 max-w-[36rem] text-[15px] leading-[1.65] text-muted-foreground sm:text-base">
              Busca el negocio, confírmalo en Google Maps y copia el link que
              abre la reseña de 5 estrellas en un solo toque.
            </p>
          </Reveal>
        </div>

        {/* --- Buscador --- */}
        <Reveal delay={210} variant="scale">
          <GlassPanel className="mt-9">
            <form onSubmit={search} noValidate>
              <label
                htmlFor="linkmap-query"
                className="block font-display text-[13.5px] font-bold text-foreground"
              >
                Nombre del negocio
              </label>
              <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
                Agrega la ciudad o la calle si hay varios con el mismo nombre.
              </p>

              <div className="mt-3.5 flex flex-col gap-2.5 sm:flex-row">
                <div className="relative flex-1">
                  <SearchIcon
                    className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="linkmap-query"
                    name="query"
                    type="search"
                    autoComplete="off"
                    enterKeyHint="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Café Aurora, Monterrey"
                    className="
                      h-[52px] w-full rounded-full border border-black/[0.09] bg-white
                      pl-11 pr-4 text-[15px] text-foreground
                      shadow-[0_2px_10px_rgba(16,26,58,0.05)]
                      transition-[border-color,box-shadow] duration-200 ease-out
                      placeholder:text-slate-400
                      hover:border-black/[0.14]
                      focus:border-violet-400 focus:outline-none
                      focus:ring-4 focus:ring-violet-500/15
                      [&::-webkit-search-cancel-button]:cursor-pointer
                    "
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || query.trim() === ""}
                  className="
                    grad-cta flex h-[52px] shrink-0 cursor-pointer items-center justify-center gap-2
                    rounded-full px-7 font-display text-[15px] font-semibold text-white
                    shadow-[0_10px_22px_-10px_rgba(16,26,58,0.55)]
                    transition-[transform,filter,opacity] duration-200 ease-out
                    hover:brightness-[1.06] active:scale-[0.97]
                    disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:brightness-100
                    motion-reduce:transform-none
                  "
                >
                  {isLoading ? (
                    <>
                      <Spinner />
                      Buscando
                    </>
                  ) : (
                    <>
                      <SearchIcon className="h-[18px] w-[18px]" />
                      Buscar
                    </>
                  )}
                </button>
              </div>
            </form>
          </GlassPanel>
        </Reveal>

        {/* --- Estado en vivo, para lectores de pantalla --- */}
        <p role="status" aria-live="polite" className="sr-only">
          {isLoading
            ? "Buscando negocios."
            : status === "error"
              ? error
              : isEmpty
                ? "Sin resultados."
                : results.length > 0
                  ? `${results.length} negocios encontrados.`
                  : ""}
        </p>

        {/* --- Error --- */}
        {status === "error" && (
          <div
            className="
              mt-5 flex items-start gap-3 rounded-[20px] border border-red-200/80
              bg-red-50/85 p-4 text-left backdrop-blur-sm
            "
          >
            <AlertIcon className="mt-px h-5 w-5 shrink-0 text-g-red" />
            <div className="min-w-0">
              <p className="font-display text-[13.5px] font-bold text-red-800">
                No se pudo buscar
              </p>
              <p className="mt-0.5 text-[13px] leading-snug text-red-700/90">{error}</p>
            </div>
          </div>
        )}

        {/* --- Sin resultados --- */}
        {isEmpty && (
          <div className="mt-5 rounded-[20px] border border-black/[0.07] bg-white/70 p-6 text-center backdrop-blur-sm">
            <MapPinIcon className="mx-auto h-7 w-7 text-slate-300" />
            <p className="mt-2.5 font-display text-[14px] font-bold text-foreground">
              Sin resultados
            </p>
            <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
              Revisa el nombre o agrega la ciudad para acotar la búsqueda.
            </p>
          </div>
        )}

        {/* --- Resultados --- */}
        {results.length > 0 && (
          /* `key` por búsqueda: la lista se vuelve a montar y a revelar en
             cada consulta en vez de quedarse con la animación ya gastada. */
          <Reveal key={requestId.current} variant="up">
            <div className="mt-7">
              <p className="px-1 font-display text-[13px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                Elige tu negocio
              </p>

              <ul className="stagger mt-3 space-y-2.5">
                {results.map((place, i) => {
                  const active = selected?.placeId === place.placeId;
                  return (
                    <li key={place.placeId} style={{ "--i": i } as React.CSSProperties}>
                      <button
                        type="button"
                        onClick={() => choose(place)}
                        aria-pressed={active}
                        className={`
                          flex w-full cursor-pointer items-center gap-3.5 rounded-[20px] border
                          bg-white/80 p-4 text-left backdrop-blur-sm
                          transition-[border-color,box-shadow,transform] duration-200 ease-out
                          hover:-translate-y-px hover:shadow-[0_10px_28px_-18px_rgba(16,26,58,0.5)]
                          active:scale-[0.995] motion-reduce:transform-none
                          ${
                            active
                              ? "border-violet-400 shadow-[0_10px_30px_-16px_rgba(109,59,245,0.6)] ring-2 ring-violet-500/25"
                              : "border-black/[0.07] hover:border-black/[0.13]"
                          }
                        `}
                      >
                        <span
                          className={`
                            flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                            transition-colors duration-200
                            ${active ? "bg-violet-600 text-white" : "bg-surface-muted text-slate-400"}
                          `}
                        >
                          {active ? (
                            <CheckIcon className="h-[18px] w-[18px]" />
                          ) : (
                            <MapPinIcon className="h-[18px] w-[18px]" />
                          )}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-[14.5px] font-bold text-foreground">
                            {place.name}
                          </span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                            {place.address}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        )}

        {/* --- Acciones sobre el negocio elegido --- */}
        {selected && (
          <GlassPanel className="mt-6">
            <div className="flex items-start gap-2.5">
              <StarIcon className="mt-px h-[18px] w-[18px] shrink-0 text-amber-brand" />
              <div className="min-w-0">
                <p className="font-display text-[14.5px] font-bold text-foreground">
                  {selected.name}
                </p>
                <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
                  {selected.address}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <a
                href={mapsUrl(selected.placeId)}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex min-h-[50px] flex-1 cursor-pointer items-center justify-center gap-2
                  rounded-full border border-black/[0.1] bg-white
                  font-display text-[14.5px] font-semibold text-foreground
                  shadow-[0_2px_10px_rgba(16,26,58,0.05)]
                  transition-[transform,border-color,box-shadow] duration-200 ease-out
                  hover:-translate-y-px hover:border-black/[0.18]
                  active:scale-[0.98] motion-reduce:transform-none
                "
              >
                <ExternalLinkIcon className="h-[17px] w-[17px] text-slate-500" />
                Visitar
              </a>

              <button
                type="button"
                onClick={() => {
                  setLink(reviewUrl(selected.placeId));
                  setCopied(false);
                }}
                className="
                  grad-cta flex min-h-[50px] flex-1 cursor-pointer items-center justify-center gap-2
                  rounded-full font-display text-[14.5px] font-semibold text-white
                  shadow-[0_10px_22px_-10px_rgba(16,26,58,0.55)]
                  transition-[transform,filter] duration-200 ease-out
                  hover:brightness-[1.06] active:scale-[0.97]
                  motion-reduce:transform-none
                "
              >
                <StarIcon className="h-[17px] w-[17px]" />
                Crear
              </button>
            </div>

            <p className="mt-3 text-center text-[12.5px] leading-snug text-muted-foreground">
              Abre <strong className="font-semibold text-foreground">Visitar</strong> para
              confirmar que es el negocio correcto antes de crear el link.
            </p>

            {/* --- Link generado --- */}
            {link && (
              <div className="mt-5 rounded-[20px] border border-violet-200/70 bg-violet-50/60 p-4">
                <p className="font-display text-[12.5px] font-bold uppercase tracking-[0.08em] text-violet-700">
                  Tu link de reseña
                </p>

                <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                  <code
                    className="
                      min-w-0 flex-1 overflow-x-auto scrollbar-none whitespace-nowrap
                      rounded-full border border-black/[0.07] bg-white px-4 py-3
                      font-mono text-[12.5px] text-foreground
                    "
                  >
                    {link}
                  </code>

                  <button
                    type="button"
                    onClick={copy}
                    className={`
                      flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center gap-2
                      rounded-full px-5 font-display text-[13.5px] font-semibold text-white
                      transition-[transform,filter] duration-200 ease-out
                      hover:brightness-[1.06] active:scale-[0.97]
                      motion-reduce:transform-none
                      ${copied ? "bg-green-ink" : "bg-violet-600"}
                    `}
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        ¡Copiado!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-4 w-4" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>

                <p aria-live="polite" className="sr-only">
                  {copied ? "Link copiado al portapapeles." : ""}
                </p>
              </div>
            )}
          </GlassPanel>
        )}
      </div>
    </section>
  );
}

/** Spinner del botón — sólo transform, se queda en el compositor. */
function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="
        h-[17px] w-[17px] animate-spin rounded-full
        border-2 border-white/35 border-t-white
      "
    />
  );
}
