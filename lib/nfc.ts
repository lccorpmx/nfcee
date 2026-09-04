"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ============================================================
   Web NFC — motor compartido
   ------------------------------------------------------------
   Todo lo que toca `NDEFReader` vive aquí: la detección de
   soporte, la traducción de errores del navegador a español y
   el hook que serializa las operaciones (nunca hay dos a la vez).

   Sólo Chrome en Android implementa esta API, y sólo en contexto
   seguro. Ese límite no se esconde: se detecta y se explica.
   ============================================================ */

/** Cuánto esperamos a que aparezca un tag antes de rendirnos. */
const TAG_TIMEOUT_MS = 30_000;

/* ------------------------------------------------------------
   Soporte
   ------------------------------------------------------------ */

export type NfcSupport =
  /** Todavía en el servidor o antes del primer efecto. */
  | "checking"
  /** Hay `NDEFReader`: Chrome en Android sobre HTTPS. */
  | "ready"
  /** Navegador sin Web NFC (iOS, escritorio, Firefox…). */
  | "unsupported"
  /** El navegador podría soportarlo, pero la página no es contexto seguro. */
  | "insecure";

function detectSupport(): NfcSupport {
  if (typeof window === "undefined") return "checking";
  // Si el constructor está, no hay nada más que averiguar.
  if ("NDEFReader" in window) return "ready";
  /* Sin `NDEFReader` la causa más común y más accionable es servir por
     http://: Chrome oculta la API entera fuera de un contexto seguro. */
  if (!window.isSecureContext) return "insecure";
  return "unsupported";
}

/* ------------------------------------------------------------
   Lectura de registros
   ------------------------------------------------------------ */

export type NfcRecord = {
  /** Cómo lo pinta la interfaz. */
  kind: "url" | "text" | "mime" | "empty" | "other";
  /** `recordType` crudo, tal como lo reporta el navegador. */
  recordType: string;
  /** Etiqueta en español para el encabezado de la fila. */
  label: string;
  /** Contenido ya decodificado. Cadena vacía si no se pudo leer. */
  value: string;
  /** Presente sólo cuando el contenido se puede abrir en el navegador. */
  url?: string;
  /** Tamaño en bytes del payload, para los tipos que no se muestran como texto. */
  bytes: number;
};

/** `record.data` es un DataView; el navegador dice en qué codificación viene. */
function decodeText(record: NDEFRecord): string {
  if (!record.data) return "";
  try {
    return new TextDecoder(record.encoding ?? "utf-8").decode(record.data).trim();
  } catch {
    // Codificación desconocida — mejor vacío que reventar la lectura entera.
    return "";
  }
}

/** Sólo http/https se ofrecen como enlace: nada de `javascript:` ni esquemas raros. */
function openableUrl(value: string): string | undefined {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function decodeRecord(record: NDEFRecord): NfcRecord {
  const bytes = record.data?.byteLength ?? 0;
  const base = { recordType: record.recordType, bytes };

  switch (record.recordType) {
    case "url":
    case "absolute-url": {
      const value = decodeText(record);
      return { ...base, kind: "url", label: "Enlace", value, url: openableUrl(value) };
    }

    case "text": {
      const value = decodeText(record);
      return {
        ...base,
        kind: "text",
        label: record.lang ? `Texto (${record.lang})` : "Texto",
        value,
      };
    }

    case "empty":
      return { ...base, kind: "empty", label: "Registro vacío", value: "" };

    case "mime": {
      const mediaType = record.mediaType ?? "desconocido";
      /* Sólo se intenta mostrar lo que de verdad es texto; un PNG decodificado
         como UTF-8 sería un muro de basura. */
      const readable = /^text\/|json|xml|urlencoded/i.test(mediaType);
      return {
        ...base,
        kind: "mime",
        label: mediaType,
        value: readable ? decodeText(record) : "",
      };
    }

    default:
      return {
        ...base,
        kind: "other",
        label: record.recordType,
        value: decodeText(record),
      };
  }
}

/** Aplana el mensaje: un smart-poster trae otros registros dentro. */
export function readMessage(message: NDEFMessage): NfcRecord[] {
  const out: NfcRecord[] = [];

  for (const record of message.records) {
    if (record.recordType === "smart-poster") {
      try {
        for (const nested of record.toRecords()) out.push(decodeRecord(nested));
        continue;
      } catch {
        // Si no se deja expandir, cae al tratamiento genérico de abajo.
      }
    }
    out.push(decodeRecord(record));
  }

  return out;
}

/** Un tag recién borrado sigue trayendo un registro "empty": eso no es contenido. */
export function hasContent(records: NfcRecord[]): boolean {
  return records.some((record) => record.kind !== "empty");
}

/* ------------------------------------------------------------
   Escritura
   ------------------------------------------------------------ */

/**
 * Normaliza lo que se teclea en el campo de vincular.
 * `nfcee.com` se convierte en `https://nfcee.com`; lo que no
 * sea http/https se rechaza para no grabar basura en el tag.
 */
export function normalizeUrl(input: string): string | null {
  const text = input.trim();
  if (!text) return null;

  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(text) ? text : `https://${text}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.href;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------
   Errores
   ------------------------------------------------------------
   Chrome distingue los casos por `DOMException.name`. Cada uno
   se traduce a una frase que dice qué hacer, y el mensaje crudo
   se conserva aparte para no perder información al depurar.
   ------------------------------------------------------------ */

const ERROR_COPY: Record<string, string> = {
  NotAllowedError:
    "Chrome no tiene permiso para usar NFC aquí. Acéptalo cuando lo pida, o habilítalo en Configuración del sitio.",
  NotSupportedError:
    "El NFC no está disponible. Revisa que esté encendido en los ajustes del teléfono.",
  NotReadableError:
    "No se pudo leer el tag. Acércalo de nuevo y mantenlo quieto un segundo.",
  NetworkError:
    "El tag se separó antes de terminar. Mantenlo pegado hasta ver la confirmación.",
  InvalidStateError: "Ya hay una operación NFC en curso. Espera a que termine.",
  TimeoutError:
    "No se detectó ningún tag. Acércalo a la parte de atrás del teléfono, cerca de la cámara.",
  TypeError: "El contenido no se pudo preparar para escribirlo en el tag.",
};

function describeError(error: unknown): { title: string; detail?: string } {
  if (error instanceof DOMException || error instanceof Error) {
    const copy = ERROR_COPY[error.name];
    if (copy) {
      // El mensaje del navegador sólo se muestra si aporta algo distinto.
      return { title: copy, detail: error.message || undefined };
    }
    return { title: error.message || "Falló la operación NFC.", detail: error.name };
  }
  return { title: "Falló la operación NFC." };
}

/* ------------------------------------------------------------
   Permiso
   ------------------------------------------------------------
   `scan()` y `write()` levantan el aviso de permiso de Chrome y
   no arman el lector hasta que alguien lo acepta. Cronometrar la
   espera del tag desde antes le descuenta a la operación todo el
   tiempo que tardas en decir que sí — y si te tardabas, la espera
   se cancelaba sola justo cuando el lector acababa de encenderse.
   ------------------------------------------------------------ */

/**
 * Se resuelve cuando el permiso de NFC deja de estar en "prompt".
 * `onPrompt` sólo se llama si de verdad hay un aviso en pantalla,
 * para que la interfaz pida aceptarlo en vez de pedir el tag.
 *
 * Si el navegador no sabe responder por el permiso, se resuelve de
 * inmediato: se prefiere un cronómetro de más a una espera eterna.
 */
async function awaitPermission(signal: AbortSignal, onPrompt: () => void): Promise<void> {
  if (!navigator.permissions) return;

  let status: PermissionStatus;
  try {
    // "nfc" no está en el union `PermissionName` que trae TypeScript.
    status = await navigator.permissions.query({ name: "nfc" as PermissionName });
  } catch {
    return;
  }

  if (status.state !== "prompt" || signal.aborted) return;
  onPrompt();

  await new Promise<void>((resolve) => {
    function done() {
      status.removeEventListener("change", onChange);
      signal.removeEventListener("abort", done);
      resolve();
    }
    function onChange() {
      // "denied" también cierra la espera: `scan()` ya viene en camino a fallar.
      if (status.state !== "prompt") done();
    }

    status.addEventListener("change", onChange);
    signal.addEventListener("abort", done, { once: true });
  });
}

/* ------------------------------------------------------------
   Hook
   ------------------------------------------------------------ */

export type NfcJobKind = "test" | "read" | "write" | "erase";

export type NfcOutcome = {
  tone: "ok" | "error";
  /** Qué operación produjo este resultado — la interfaz lo usa para ubicarlo. */
  kind: NfcJobKind;
  title: string;
  detail?: string;
  /** Serie del chip, cuando la operación fue una lectura. */
  serialNumber?: string;
  /** Contenido leído. `undefined` si la operación no fue de lectura. */
  records?: NfcRecord[];
};

export type NfcController = {
  support: NfcSupport;
  /** Operación en curso, o `null` si no hay ninguna. */
  job: NfcJobKind | null;
  /** El aviso de permiso de Chrome está en pantalla: aún no se busca el tag. */
  awaitingPermission: boolean;
  outcome: NfcOutcome | null;
  /** Comprueba que el teléfono ve el tag y responde. */
  test: () => void;
  /** Lee y devuelve el contenido del tag. */
  read: () => void;
  /** Graba una URL. La cadena ya debe venir normalizada. */
  write: (url: string) => void;
  /** Sobrescribe el tag con un registro vacío. */
  erase: () => void;
  cancel: () => void;
  clear: () => void;
};

export function useNfc(): NfcController {
  const [support, setSupport] = useState<NfcSupport>("checking");
  const [job, setJob] = useState<NfcJobKind | null>(null);
  const [awaitingPermission, setAwaitingPermission] = useState(false);
  const [outcome, setOutcome] = useState<NfcOutcome | null>(null);

  /* Una sola operación a la vez. El controlador vive en un ref porque
     lo tienen que alcanzar tanto el temporizador como el desmontaje. */
  const pending = useRef<AbortController | null>(null);

  useEffect(() => setSupport(detectSupport()), []);

  const cancel = useCallback(() => {
    pending.current?.abort();
    pending.current = null;
  }, []);

  // Salir de la página no deja un lector NFC escuchando de fondo.
  useEffect(() => cancel, [cancel]);

  const clear = useCallback(() => setOutcome(null), []);

  /**
   * Envoltura común: cancela lo anterior, arma el temporizador,
   * corre la operación y aterriza el resultado en un solo lugar.
   */
  const run = useCallback(
    (kind: NfcJobKind, task: (signal: AbortSignal) => Promise<NfcOutcome>) => {
      if (support !== "ready") return;

      pending.current?.abort();
      const controller = new AbortController();
      pending.current = controller;

      setJob(kind);
      setOutcome(null);
      setAwaitingPermission(false);

      /* El cronómetro se arma una sola vez, y no antes de que el permiso
         esté resuelto: los 30 s son para encontrar el tag, no para leer
         el aviso de Chrome. */
      let timer: ReturnType<typeof setTimeout> | null = null;
      const armTimeout = () => {
        if (timer !== null || controller.signal.aborted) return;
        timer = setTimeout(() => {
          controller.abort(new DOMException("Se agotó el tiempo de espera.", "TimeoutError"));
        }, TAG_TIMEOUT_MS);
      };

      const current = () => pending.current === controller;

      void awaitPermission(controller.signal, () => {
        if (current()) setAwaitingPermission(true);
      })
        .catch(() => {})
        .finally(() => {
          if (current()) setAwaitingPermission(false);
          armTimeout();
        });

      void task(controller.signal)
        .then((result) => {
          if (controller.signal.aborted) return;
          setOutcome(result);
        })
        .catch((error: unknown) => {
          /* Cancelar a mano no es un fallo: se limpia la pantalla y ya.
             Un timeout sí llega como abort, pero con `name` propio. */
          const reason = controller.signal.aborted ? controller.signal.reason : error;
          const named = reason instanceof DOMException ? reason.name : "";
          if (named === "AbortError" || (controller.signal.aborted && !named)) return;

          const { title, detail } = describeError(reason ?? error);
          setOutcome({ tone: "error", kind, title, detail });
        })
        .finally(() => {
          if (timer !== null) clearTimeout(timer);
          if (current()) setAwaitingPermission(false);
          /* `scan()` no se detiene sola: sin este abort, el lector de una
             lectura ya resuelta se queda sondeando el chip para siempre.
             Los manejadores ya corrieron, así que abortar aquí no altera
             el resultado. */
          controller.abort();
          if (pending.current === controller) {
            pending.current = null;
            setJob(null);
          }
        });
    },
    [support],
  );

  /**
   * Escucha hasta la primera lectura y corta.
   * `scan()` se resuelve en cuanto hay permiso: lo que interesa
   * es el evento `reading` que llega después.
   */
  const scanOnce = useCallback((signal: AbortSignal): Promise<NDEFReadingEvent> => {
    const reader = new NDEFReader();

    return new Promise<NDEFReadingEvent>((resolve, reject) => {
      signal.addEventListener("abort", () => reject(signal.reason), { once: true });

      reader.onreading = (event) => resolve(event);
      reader.onreadingerror = () =>
        reject(
          new DOMException(
            "El tag respondió pero el mensaje no se pudo leer.",
            "NotReadableError",
          ),
        );

      reader.scan({ signal }).catch(reject);
    });
  }, []);

  const test = useCallback(() => {
    run("test", async (signal) => {
      const event = await scanOnce(signal);
      const records = readMessage(event.message);
      const written = hasContent(records);

      return {
        tone: "ok",
        kind: "test",
        title: "El tag responde correctamente.",
        detail: written
          ? `Tiene contenido grabado (${records.length} ${records.length === 1 ? "registro" : "registros"}).`
          : "Está vacío y listo para vincular.",
        serialNumber: event.serialNumber,
        records,
      };
    });
  }, [run, scanOnce]);

  const read = useCallback(() => {
    run("read", async (signal) => {
      const event = await scanOnce(signal);
      const records = readMessage(event.message);

      return {
        tone: "ok",
        kind: "read",
        title: hasContent(records) ? "Tag leído." : "El tag está vacío.",
        serialNumber: event.serialNumber,
        records,
      };
    });
  }, [run, scanOnce]);

  const write = useCallback(
    (url: string) => {
      run("write", async (signal) => {
        const reader = new NDEFReader();
        // `overwrite` explícito: vincular siempre reemplaza lo que hubiera.
        await reader.write({ records: [{ recordType: "url", data: url }] }, {
          overwrite: true,
          signal,
        });

        return {
          tone: "ok",
          kind: "write",
          title: "Tag vinculado.",
          detail: url,
        };
      });
    },
    [run],
  );

  const erase = useCallback(() => {
    run("erase", async (signal) => {
      /* Un registro "empty" es la forma estándar de dejar el tag en blanco
         sin desformatearlo: sigue siendo NDEF y se puede volver a grabar. */
      await new NDEFReader().write({ records: [{ recordType: "empty" }] }, {
        overwrite: true,
        signal,
      });

      return {
        tone: "ok",
        kind: "erase",
        title: "Tag desvinculado.",
        detail: "Quedó en blanco y se puede volver a vincular.",
      };
    });
  }, [run]);

  return {
    support,
    job,
    awaitingPermission,
    outcome,
    test,
    read,
    write,
    erase,
    cancel,
    clear,
  };
}
