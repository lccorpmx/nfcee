import { hasSession } from "@/lib/auth";
import { searchPlaces, STATUS_BY_KIND } from "@/lib/places";

/* ============================================================
   POST /api/places/search
   ------------------------------------------------------------
   Thin HTTP wrapper around the Places Text Search call. It
   exists so the Google key stays on the server: the browser
   talks to this route, this route talks to Google.

   Requiere sesión: cada búsqueda consume cuota facturable de
   Google, así que la puerta se cierra aquí y no sólo en la
   interfaz de /linkmap.

   Body:     { "query": string }
   Success:  { "places": [{ placeId, name, address }] }
   Failure:  { "error": { kind, message } }
   ============================================================ */

const MAX_QUERY_LENGTH = 200;

export async function POST(request: Request) {
  if (!(await hasSession())) {
    return Response.json(
      { error: { kind: "unauthorized", message: "Inicia sesión para buscar." } },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => null)) as { query?: unknown } | null;
  const query = typeof body?.query === "string" ? body.query.trim() : "";

  if (!query) {
    return Response.json(
      { error: { kind: "bad-request", message: "Escribe el nombre de un negocio." } },
      { status: 400 },
    );
  }

  const result = await searchPlaces(query.slice(0, MAX_QUERY_LENGTH));

  if (!result.ok) {
    return Response.json(
      { error: { kind: result.kind, message: result.message } },
      { status: STATUS_BY_KIND[result.kind] },
    );
  }

  return Response.json({ places: result.places });
}
