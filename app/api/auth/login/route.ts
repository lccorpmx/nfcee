import { checkCredentials, startSession } from "@/lib/auth";

/* ============================================================
   POST /api/auth/login
   ------------------------------------------------------------
   Body:    { "email": string, "password": string }
   Éxito:   { "ok": true }  + cookie de sesión httpOnly
   Fallo:   { "error": { message } }
   ============================================================ */

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: unknown; password?: unknown }
    | null;

  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return Response.json(
      { error: { message: "Escribe tu correo y contraseña." } },
      { status: 400 },
    );
  }

  const outcome = checkCredentials(email, password);

  if (outcome === "not-configured") {
    return Response.json(
      { error: { message: "Faltan AUTH_EMAIL y AUTH_PASSWORD en el servidor." } },
      { status: 500 },
    );
  }

  // Un solo mensaje para correo o contraseña incorrectos: decir cuál de los
  // dos falló le confirmaría a un extraño que el correo existe.
  if (outcome === "invalid") {
    return Response.json(
      { error: { message: "Correo o contraseña incorrectos." } },
      { status: 401 },
    );
  }

  if (!(await startSession())) {
    return Response.json(
      { error: { message: "Falta AUTH_SECRET en el servidor." } },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
