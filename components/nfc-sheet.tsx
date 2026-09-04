"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { hasContent, type NfcController, type NfcJobKind, type NfcRecord } from "@/lib/nfc";
import {
  AlertIcon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  LinkOffIcon,
  NfcWaveIcon,
  XIcon,
} from "./icons";

/* ============================================================
   Hoja NFC
   ------------------------------------------------------------
   Un único lugar donde aterriza cualquier operación de NFC, la
   haya disparado el generador de links o el administrador de
   tags. Vive abajo de la pantalla porque es justo el momento en
   que el teléfono está boca abajo sobre el tag: el pulgar llega
   ahí, no al centro de la página.
   ============================================================ */

const WAITING_COPY: Record<NfcJobKind, { title: string; hint: string }> = {
  test: {
    title: "Probando el tag",
    hint: "Acerca el tag para comprobar que el teléfono lo detecta.",
  },
  read: {
    title: "Leyendo el tag",
    hint: "Acerca el tag para ver qué tiene grabado.",
  },
  write: {
    title: "Vinculando el tag",
    hint: "Mantén el tag pegado hasta que aparezca la confirmación.",
  },
  erase: {
    title: "Desvinculando el tag",
    hint: "Mantén el tag pegado hasta que aparezca la confirmación.",
  },
};

export function NfcSheet({ nfc }: { nfc: NfcController }) {
  const { job, outcome } = nfc;
  const open = job !== null || outcome !== null;

  const panel = useRef<HTMLDivElement>(null);

  /* Escape hace lo que corresponda al estado: cancelar la espera
     si hay una operación viva, o cerrar el resultado si ya terminó. */
  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (job !== null) nfc.cancel();
      else nfc.clear();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, job, nfc]);

  // Con el teclado abierto, el foco tiene que entrar a la hoja.
  useEffect(() => {
    if (open) panel.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center">
      {/* Telón: cerrar tocando fuera sólo cuando ya no hay nada corriendo,
          para no abortar una escritura con un roce accidental. */}
      <div
        aria-hidden="true"
        onClick={() => (job !== null ? nfc.cancel() : nfc.clear())}
        className="anim-fade absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]"
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-live="polite"
        tabIndex={-1}
        className="
          anim-sheet relative max-h-[86vh] w-full max-w-[30rem] overflow-y-auto overscroll-contain
          rounded-t-[28px] border border-white/70 bg-white p-6
          shadow-[0_-18px_50px_-20px_rgba(16,26,58,0.45)]
          outline-none sm:rounded-[28px] sm:shadow-[0_28px_70px_-28px_rgba(16,26,58,0.5)]
        "
      >
        {/* Asa: en móvil la hoja sube desde abajo y esto lo anuncia. */}
        <span
          aria-hidden="true"
          className="mx-auto mb-4 block h-1 w-10 rounded-full bg-slate-200 sm:hidden"
        />

        {job !== null ? (
          <Waiting kind={job} onCancel={nfc.cancel} />
        ) : outcome ? (
          <Outcome nfc={nfc} />
        ) : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   Esperando el tag
   ------------------------------------------------------------ */

function Waiting({ kind, onCancel }: { kind: NfcJobKind; onCancel: () => void }) {
  const copy = WAITING_COPY[kind];

  return (
    <div className="text-center">
      <span className="relative mx-auto flex h-20 w-20 items-center justify-center">
        {/* Dos anillos desfasados sobre el mismo keyframe del resto del sitio. */}
        {[0, 1].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-violet-500/25"
            style={{ animation: `nfc-ping 1.6s ease-out ${i * 0.55}s infinite` }}
          />
        ))}
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white">
          <NfcWaveIcon className="h-7 w-7" />
        </span>
      </span>

      <p className="mt-5 font-display text-[17px] font-extrabold tracking-[-0.01em] text-foreground">
        {copy.title}
      </p>
      <p className="mx-auto mt-1.5 max-w-[22rem] text-[13.5px] leading-[1.6] text-muted-foreground">
        {copy.hint}
      </p>
      <p className="mt-2 text-[12.5px] leading-snug text-slate-400">
        El lector suele estar en la parte de atrás, cerca de la cámara.
      </p>

      <button
        type="button"
        onClick={onCancel}
        className="
          mt-6 inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-2
          rounded-full border border-black/[0.1] bg-white px-6
          font-display text-[14px] font-semibold text-foreground
          transition-[transform,border-color] duration-200 ease-out
          hover:border-black/[0.18] active:scale-[0.98] motion-reduce:transform-none
        "
      >
        <XIcon className="h-4 w-4 text-slate-500" />
        Cancelar
      </button>
    </div>
  );
}

/* ------------------------------------------------------------
   Resultado
   ------------------------------------------------------------ */

function Outcome({ nfc }: { nfc: NfcController }) {
  const outcome = nfc.outcome;
  if (!outcome) return null;

  const ok = outcome.tone === "ok";
  const records = outcome.records ?? [];
  const written = hasContent(records);

  return (
    <div>
      <div className="flex items-start gap-3.5">
        <span
          className={`
            flex h-11 w-11 shrink-0 items-center justify-center rounded-full
            ${ok ? "bg-green-ink text-white" : "bg-red-50 text-g-red"}
          `}
        >
          {ok ? <CheckIcon className="h-5 w-5" /> : <AlertIcon className="h-6 w-6" />}
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-display text-[16px] font-extrabold leading-snug tracking-[-0.01em] text-foreground">
            {outcome.title}
          </p>
          {outcome.detail && (
            <p className="mt-1 break-words text-[13.5px] leading-[1.55] text-muted-foreground">
              {outcome.detail}
            </p>
          )}
        </div>
      </div>

      {outcome.serialNumber && (
        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-muted-foreground">
          <span className="font-semibold text-foreground">Serie del chip</span>
          <code className="font-mono text-[12px] text-slate-500">{outcome.serialNumber}</code>
        </p>
      )}

      {/* La lista sólo aparece en las operaciones de lectura. */}
      {outcome.records && (
        <div className="mt-4">
          {written ? (
            <ul className="space-y-2.5">
              {records.map((record, i) => (
                <RecordRow key={`${record.recordType}-${i}`} record={record} />
              ))}
            </ul>
          ) : (
            <p className="rounded-[18px] border border-black/[0.07] bg-surface-muted px-4 py-3.5 text-[13px] leading-snug text-muted-foreground">
              El tag no tiene nada grabado. Está listo para vincular.
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2.5">
        {/* Desvincular se ofrece justo donde se acaba de comprobar que hay algo
            que borrar, en vez de mandar al visitante a buscar el botón. */}
        {outcome.records && written && (
          <button
            type="button"
            onClick={nfc.erase}
            className="
              flex min-h-[48px] cursor-pointer items-center justify-center gap-2
              rounded-full border border-red-200 bg-red-50/70 px-6
              font-display text-[14px] font-semibold text-red-700
              transition-[transform,background-color] duration-200 ease-out
              hover:bg-red-50 active:scale-[0.98] motion-reduce:transform-none
            "
          >
            <LinkOffIcon className="h-[17px] w-[17px]" />
            Desvincular este tag
          </button>
        )}

        <button
          type="button"
          onClick={nfc.clear}
          className="
            grad-cta flex min-h-[48px] cursor-pointer items-center justify-center gap-2
            rounded-full px-6 font-display text-[14.5px] font-semibold text-white
            shadow-[0_10px_22px_-10px_rgba(16,26,58,0.55)]
            transition-[transform,filter] duration-200 ease-out
            hover:brightness-[1.06] active:scale-[0.97] motion-reduce:transform-none
          "
        >
          Listo
        </button>
      </div>
    </div>
  );
}

/** Una fila por registro del mensaje NDEF. */
function RecordRow({ record }: { record: NfcRecord }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    await copyText(record.value);
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  }

  return (
    <li className="rounded-[18px] border border-black/[0.07] bg-surface-muted p-3.5">
      <p className="font-display text-[11.5px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
        {record.label}
      </p>

      {record.value ? (
        <code className="mt-1.5 block overflow-x-auto scrollbar-none whitespace-nowrap font-mono text-[12.5px] text-foreground">
          {record.value}
        </code>
      ) : (
        <p className="mt-1.5 text-[12.5px] text-slate-400">
          {record.bytes > 0
            ? `${record.bytes} bytes que no se pueden mostrar como texto.`
            : "Sin contenido."}
        </p>
      )}

      {record.value && (
        <div className="mt-3 flex flex-wrap gap-2">
          {record.url && (
            <a
              href={record.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full
                border border-black/[0.1] bg-white px-3.5 text-[12.5px] font-semibold text-foreground
                transition-colors duration-200 hover:border-black/[0.18]
              "
            >
              <ExternalLinkIcon className="h-[15px] w-[15px] text-slate-500" />
              Abrir
            </a>
          )}

          <button
            type="button"
            onClick={copy}
            className={`
              inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-full
              border px-3.5 text-[12.5px] font-semibold transition-colors duration-200
              ${
                copied
                  ? "border-green-ink/30 bg-green-ink/10 text-green-ink"
                  : "border-black/[0.1] bg-white text-foreground hover:border-black/[0.18]"
              }
            `}
          >
            {copied ? (
              <>
                <CheckIcon className="h-[14px] w-[14px]" />
                ¡Copiado!
              </>
            ) : (
              <>
                <CopyIcon className="h-[15px] w-[15px] text-slate-500" />
                Copiar
              </>
            )}
          </button>
        </div>
      )}
    </li>
  );
}
