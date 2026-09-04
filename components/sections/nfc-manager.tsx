"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeUrl, type NfcController } from "@/lib/nfc";
import { GlassPanel } from "../ui";
import {
  AlertIcon,
  ChipIcon,
  EyeIcon,
  LinkIcon,
  LinkOffIcon,
  NfcWaveIcon,
} from "../icons";

/* ============================================================
   Administrador de tags NFC
   ------------------------------------------------------------
   Cuatro operaciones sobre el mismo chip: probar que responde,
   leer lo que trae, grabarle un enlace y dejarlo en blanco.

   Toda la mecánica vive en `useNfc`; aquí sólo están los botones
   y el estado del formulario. El resultado de cada operación no
   se pinta en esta pantalla sino en <NfcSheet>, que es una sola
   superficie de respuesta para toda la página.
   ============================================================ */

/** Explicación de por qué la herramienta no puede correr aquí. */
const BLOCKED_COPY = {
  unsupported: {
    title: "Este navegador no puede usar NFC",
    body:
      "Web NFC sólo existe en Chrome para Android (89 o superior). En iPhone, en escritorio o en Firefox no hay forma de leer ni grabar tags desde la web, así que los botones quedan desactivados.",
  },
  insecure: {
    title: "Falta una conexión segura",
    body:
      "Chrome esconde Web NFC en las páginas servidas por http://. Abre este sitio con https:// —o desde localhost en el propio teléfono— y los botones se activan solos.",
  },
} as const;

export function NfcManager({
  nfc,
  suggestedUrl,
}: {
  nfc: NfcController;
  /** Último link generado en la otra herramienta: llega ya escrito en el campo. */
  suggestedUrl: string;
}) {
  const [url, setUrl] = useState(suggestedUrl);
  const [confirmErase, setConfirmErase] = useState(false);

  /* El link recién creado se copia al campo, pero sólo una vez por link:
     así no pisa lo que el visitante esté escribiendo a mano. */
  const applied = useRef(suggestedUrl);
  useEffect(() => {
    if (!suggestedUrl || suggestedUrl === applied.current) return;
    applied.current = suggestedUrl;
    setUrl(suggestedUrl);
  }, [suggestedUrl]);

  // El paso de confirmación caduca solo: un "¿seguro?" olvidado en pantalla
  // es un borrado accidental esperando a ocurrir.
  useEffect(() => {
    if (!confirmErase) return;
    const timer = setTimeout(() => setConfirmErase(false), 6000);
    return () => clearTimeout(timer);
  }, [confirmErase]);

  const ready = nfc.support === "ready";
  const busy = nfc.job !== null;
  const locked = !ready || busy;

  const target = normalizeUrl(url);
  const invalid = url.trim() !== "" && target === null;
  const blocked =
    nfc.support === "unsupported" || nfc.support === "insecure"
      ? BLOCKED_COPY[nfc.support]
      : null;

  return (
    <div className="mt-9 space-y-5">
      {/* --- Por qué no se puede --- */}
      {blocked && (
        <div className="flex items-start gap-3 rounded-[20px] border border-amber-200/80 bg-amber-50/80 p-4 backdrop-blur-sm">
          <AlertIcon className="mt-px h-5 w-5 shrink-0 text-amber-ink" />
          <div className="min-w-0">
            <p className="font-display text-[13.5px] font-bold text-amber-ink">{blocked.title}</p>
            <p className="mt-1 text-[13px] leading-[1.6] text-amber-900/80">{blocked.body}</p>
          </div>
        </div>
      )}

      {/* --- Diagnóstico --- */}
      <GlassPanel>
        <PanelHead
          icon={<ChipIcon className="h-[18px] w-[18px]" />}
          title="Estado del tag"
          hint="Comprueba que el teléfono lo detecta y mira qué trae grabado."
        />

        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <ActionButton
            tone="ghost"
            disabled={locked}
            onClick={nfc.test}
            icon={<NfcWaveIcon className="h-[17px] w-[17px] text-violet-600" />}
          >
            Probar tag
          </ActionButton>

          <ActionButton
            tone="ghost"
            disabled={locked}
            onClick={nfc.read}
            icon={<EyeIcon className="h-[17px] w-[17px] text-violet-600" />}
          >
            Leer contenido
          </ActionButton>
        </div>
      </GlassPanel>

      {/* --- Vincular --- */}
      <GlassPanel>
        <PanelHead
          icon={<LinkIcon className="h-[18px] w-[18px]" />}
          title="Vincular"
          hint="Graba un enlace en el tag. Reemplaza lo que tuviera antes."
        />

        <label
          htmlFor="nfc-url"
          className="mt-4 block font-display text-[12.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground"
        >
          Enlace de destino
        </label>

        <input
          id="nfc-url"
          name="url"
          type="url"
          inputMode="url"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://search.google.com/local/writereview?placeid=…"
          aria-invalid={invalid}
          aria-describedby="nfc-url-note"
          className={`
            mt-2 h-[52px] w-full rounded-full border bg-white px-5 text-[14px] text-foreground
            shadow-[0_2px_10px_rgba(16,26,58,0.05)]
            transition-[border-color,box-shadow] duration-200 ease-out
            placeholder:text-slate-400
            focus:outline-none focus:ring-4
            ${
              invalid
                ? "border-red-300 focus:border-red-400 focus:ring-red-500/15"
                : "border-black/[0.09] hover:border-black/[0.14] focus:border-violet-400 focus:ring-violet-500/15"
            }
          `}
        />

        <p
          id="nfc-url-note"
          className={`mt-2 min-h-[18px] break-words text-[12.5px] leading-snug ${
            invalid ? "text-red-700" : "text-muted-foreground"
          }`}
        >
          {invalid
            ? "Escribe una dirección web válida, por ejemplo https://tunegocio.com."
            : /* Sólo vale la pena avisar cuando lo que se graba no es literal
                 lo que se tecleó — al completar el https:// que falta. */
              target && target !== url.trim()
              ? `Se grabará ${target}`
              : "Sólo enlaces http o https."}
        </p>

        <div className="mt-3">
          <ActionButton
            tone="primary"
            disabled={locked || target === null}
            onClick={() => target && nfc.write(target)}
            icon={<LinkIcon className="h-[17px] w-[17px]" />}
          >
            Vincular tag
          </ActionButton>
        </div>
      </GlassPanel>

      {/* --- Desvincular --- */}
      <GlassPanel>
        <PanelHead
          icon={<LinkOffIcon className="h-[18px] w-[18px]" />}
          title="Desvincular"
          hint="Deja el tag en blanco. Se puede volver a vincular cuando quieras."
        />

        <div className="mt-4">
          {confirmErase ? (
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <ActionButton
                tone="danger"
                disabled={locked}
                onClick={() => {
                  setConfirmErase(false);
                  nfc.erase();
                }}
                icon={<LinkOffIcon className="h-[17px] w-[17px]" />}
              >
                Sí, borrar el tag
              </ActionButton>

              <ActionButton tone="ghost" onClick={() => setConfirmErase(false)}>
                Mejor no
              </ActionButton>
            </div>
          ) : (
            <ActionButton
              tone="ghost"
              disabled={locked}
              onClick={() => setConfirmErase(true)}
              icon={<LinkOffIcon className="h-[17px] w-[17px] text-red-600" />}
            >
              Desvincular tag
            </ActionButton>
          )}
        </div>
      </GlassPanel>

      <p className="px-1 text-center text-[12.5px] leading-[1.6] text-muted-foreground">
        Si el teléfono no reacciona, revisa que el NFC esté encendido en los
        ajustes de Android y acerca el tag a la parte de atrás, cerca de la cámara.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------
   Piezas
   ------------------------------------------------------------ */

function PanelHead({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-600">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-display text-[15px] font-extrabold tracking-[-0.01em] text-foreground">
          {title}
        </p>
        <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}

const TONE = {
  primary:
    "grad-cta text-white shadow-[0_10px_22px_-10px_rgba(16,26,58,0.55)] hover:brightness-[1.06]",
  ghost:
    "border border-black/[0.1] bg-white text-foreground shadow-[0_2px_10px_rgba(16,26,58,0.05)] hover:border-black/[0.18]",
  danger: "bg-red-600 text-white shadow-[0_10px_22px_-12px_rgba(220,38,38,0.7)] hover:brightness-[1.06]",
} as const;

function ActionButton({
  children,
  onClick,
  icon,
  tone,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ReactNode;
  tone: keyof typeof TONE;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        flex min-h-[50px] flex-1 cursor-pointer items-center justify-center gap-2
        rounded-full px-6 font-display text-[14.5px] font-semibold
        transition-[transform,filter,border-color,opacity] duration-200 ease-out
        active:scale-[0.98] motion-reduce:transform-none
        disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:brightness-100
        ${TONE[tone]}
      `}
    >
      {icon}
      {children}
    </button>
  );
}
