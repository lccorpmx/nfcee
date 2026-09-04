/* ============================================================
   Web NFC — declaraciones de ambiente
   ------------------------------------------------------------
   TypeScript no incluye Web NFC en `lib.dom` porque sólo la
   implementa Chrome en Android. Estas firmas siguen la
   especificación del W3C (w3c.github.io/web-nfc) para que el
   compilador conozca `NDEFReader` sin arrastrar una dependencia.

   Que el tipo exista NO significa que el objeto exista en
   tiempo de ejecución: siempre hay que comprobar
   `"NDEFReader" in window` antes de construirlo.
   ============================================================ */

interface NDEFMessageInit {
  records: NDEFRecordInit[];
}

/** Lo que se le puede pasar a `write()`: texto plano, bytes o un mensaje. */
type NDEFMessageSource = string | BufferSource | NDEFMessageInit;

interface NDEFRecordInit {
  /** "text" | "url" | "absolute-url" | "mime" | "smart-poster" | "empty" | tipo externo */
  recordType: string;
  mediaType?: string;
  id?: string;
  encoding?: string;
  lang?: string;
  data?: NDEFMessageSource;
}

declare class NDEFRecord {
  constructor(recordInit: NDEFRecordInit);
  readonly recordType: string;
  readonly mediaType: string | null;
  readonly id: string | null;
  readonly encoding: string | null;
  readonly lang: string | null;
  readonly data: DataView | null;
  /** Sólo para "smart-poster" y tipos locales: expande los registros que anida. */
  toRecords(): NDEFRecord[];
}

declare class NDEFMessage {
  constructor(messageInit: NDEFMessageInit);
  readonly records: readonly NDEFRecord[];
}

interface NDEFReadingEvent extends Event {
  /** Serie del chip, en hexadecimal separado por ":". Vacío si el tag no la expone. */
  readonly serialNumber: string;
  readonly message: NDEFMessage;
}

interface NDEFScanOptions {
  signal?: AbortSignal;
}

interface NDEFWriteOptions {
  /** `false` hace que la escritura falle si el tag ya trae un mensaje NDEF. */
  overwrite?: boolean;
  signal?: AbortSignal;
}

interface NDEFMakeReadOnlyOptions {
  signal?: AbortSignal;
}

interface NDEFReaderEventMap {
  reading: NDEFReadingEvent;
  readingerror: Event;
}

declare class NDEFReader extends EventTarget {
  constructor();

  onreading: ((this: NDEFReader, event: NDEFReadingEvent) => unknown) | null;
  onreadingerror: ((this: NDEFReader, event: Event) => unknown) | null;

  /** Pide permiso (requiere gesto del usuario) y deja el lector escuchando. */
  scan(options?: NDEFScanOptions): Promise<void>;
  /** Se resuelve cuando un tag entra en rango y termina de recibir el mensaje. */
  write(message: NDEFMessageSource, options?: NDEFWriteOptions): Promise<void>;
  /** Bloqueo permanente del tag. No tiene vuelta atrás. */
  makeReadOnly(options?: NDEFMakeReadOnlyOptions): Promise<void>;

  addEventListener<K extends keyof NDEFReaderEventMap>(
    type: K,
    listener: (this: NDEFReader, event: NDEFReaderEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof NDEFReaderEventMap>(
    type: K,
    listener: (this: NDEFReader, event: NDEFReaderEventMap[K]) => unknown,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}
