/* ============================================================
   Google Places API (New) — Text Search
   ------------------------------------------------------------
   Server-only. `GOOGLE_PLACES_API_KEY` must never reach the
   browser, so this module is imported by the route handler
   alone. The client may pull `PlaceCandidate` in with
   `import type`, which is erased at compile time.
   ============================================================ */

const TEXT_SEARCH_ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

/** Only what the picker renders — the field mask is also what Google bills on. */
const FIELD_MASK = "places.id,places.displayName,places.formattedAddress";

const MAX_RESULTS = 8;

/** How long we wait on Google before giving the visitor an answer of our own. */
const TIMEOUT_MS = 10_000;

/** A business the visitor can pick. `placeId` is what both links are built from. */
export type PlaceCandidate = {
  placeId: string;
  name: string;
  address: string;
};

export type PlacesErrorKind =
  | "missing-key"
  | "invalid-key"
  | "quota"
  | "upstream"
  | "network";

export type PlacesResult =
  | { ok: true; places: PlaceCandidate[] }
  | { ok: false; kind: PlacesErrorKind; message: string };

/** User-facing copy, in the page's language. Never leaks Google's raw message. */
const MESSAGES: Record<PlacesErrorKind, string> = {
  "missing-key":
    "Falta configurar GOOGLE_PLACES_API_KEY en el servidor.",
  "invalid-key":
    "La API key de Google no es válida o la Places API no está habilitada.",
  quota:
    "Se agotó la cuota de la Places API. Vuelve a intentarlo más tarde.",
  upstream: "Google no pudo procesar la búsqueda. Inténtalo de nuevo.",
  network: "No se pudo conectar con Google. Revisa tu conexión.",
};

/** HTTP status this route answers with for each failure. */
export const STATUS_BY_KIND: Record<PlacesErrorKind, number> = {
  "missing-key": 500,
  "invalid-key": 502,
  quota: 429,
  upstream: 502,
  network: 504,
};

function fail(kind: PlacesErrorKind): PlacesResult {
  return { ok: false, kind, message: MESSAGES[kind] };
}

/* ------------------------------------------------------------
   Error classification
   ------------------------------------------------------------
   The HTTP status alone is not enough: a bad key comes back as
   400 INVALID_ARGUMENT, the same status as a malformed request.
   The `details[].reason` field is what actually separates them,
   so it is read first and the status is only the fallback.
   ------------------------------------------------------------ */

type GoogleError = {
  error?: {
    code?: number;
    status?: string;
    details?: { reason?: string }[];
  };
};

const KEY_REASONS = new Set([
  "API_KEY_INVALID",
  "API_KEY_SERVICE_BLOCKED",
  "API_KEY_HTTP_REFERRER_BLOCKED",
  "API_KEY_IP_ADDRESS_BLOCKED",
  "SERVICE_DISABLED",
  "PERMISSION_DENIED",
]);

const QUOTA_REASONS = new Set([
  "RATE_LIMIT_EXCEEDED",
  "RESOURCE_EXHAUSTED",
  "QUOTA_EXCEEDED",
]);

function classify(status: number, body: GoogleError): PlacesErrorKind {
  const reasons = body.error?.details?.map((d) => d.reason) ?? [];

  if (reasons.some((r) => r && QUOTA_REASONS.has(r))) return "quota";
  if (reasons.some((r) => r && KEY_REASONS.has(r))) return "invalid-key";

  if (body.error?.status === "RESOURCE_EXHAUSTED") return "quota";
  if (body.error?.status === "PERMISSION_DENIED") return "invalid-key";

  if (status === 429) return "quota";
  if (status === 401 || status === 403) return "invalid-key";

  return "upstream";
}

/* ------------------------------------------------------------
   Search
   ------------------------------------------------------------ */

/** Text Search against the Places API (New). Never throws. */
export async function searchPlaces(query: string): Promise<PlacesResult> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return fail("missing-key");

  let response: Response;
  try {
    response = await fetch(TEXT_SEARCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery: query,
        languageCode: "es",
        regionCode: "MX",
        maxResultCount: MAX_RESULTS,
      }),
      // Results shift with the query; nothing here is worth a cache entry.
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    return fail("network");
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as GoogleError;
    return fail(classify(response.status, body));
  }

  const data = (await response.json().catch(() => null)) as {
    places?: { id?: string; displayName?: { text?: string }; formattedAddress?: string }[];
  } | null;

  if (!data) return fail("upstream");

  // A place with no id can't produce either link, so it never reaches the picker.
  const places: PlaceCandidate[] = (data.places ?? [])
    .filter((place) => typeof place.id === "string" && place.id.length > 0)
    .slice(0, MAX_RESULTS)
    .map((place) => ({
      placeId: place.id as string,
      name: place.displayName?.text?.trim() || "Negocio sin nombre",
      address: place.formattedAddress?.trim() || "Dirección no disponible",
    }));

  return { ok: true, places };
}
