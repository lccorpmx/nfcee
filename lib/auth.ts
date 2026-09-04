import { cookies } from "next/headers";

/* ============================================================
   Sesión de un solo usuario — sin base de datos
   ------------------------------------------------------------
   Las credenciales viven en .env.local (ya ignorado por git) y
   la sesión es una cookie httpOnly firmada con HMAC-SHA256: no
   hay nada que guardar en disco y el servidor puede validarla
   sin consultar a nadie. Cambiar AUTH_SECRET cierra todas las
   sesiones abiertas.
   ============================================================ */

const COOKIE_NAME = "nfcee_session";

/** Doce horas: una jornada de trabajo sin volver a escribir la contraseña. */
const MAX_AGE_SECONDS = 60 * 60 * 12;

/** Versión del formato del token; subirla invalida los emitidos antes. */
const TOKEN_VERSION = "v1";

/* ------------------------------------------------------------
   Utilidades
   ------------------------------------------------------------ */

/**
 * Comparación en tiempo constante: siempre recorre la cadena
 * completa para no filtrar por cuánto tarda en fallar.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Web Crypto en vez de `node:crypto`: sirve igual en Node y en edge. */
async function sign(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return base64url(new Uint8Array(signature));
}

/* ------------------------------------------------------------
   Credenciales
   ------------------------------------------------------------ */

export type LoginOutcome = "ok" | "invalid" | "not-configured";

/** Valida el par email / contraseña contra las variables de entorno. */
export function checkCredentials(email: string, password: string): LoginOutcome {
  const expectedEmail = process.env.AUTH_EMAIL;
  const expectedPassword = process.env.AUTH_PASSWORD;

  if (!expectedEmail || !expectedPassword) return "not-configured";

  // El correo no distingue mayúsculas; la contraseña sí.
  const emailOk = safeEqual(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase());
  const passwordOk = safeEqual(password, expectedPassword);

  // Se evalúan ambos siempre, para no revelar cuál de los dos falló.
  return emailOk && passwordOk ? "ok" : "invalid";
}

/* ------------------------------------------------------------
   Token
   ------------------------------------------------------------ */

/** `v1.<expiración>.<firma>` — la firma cubre versión y expiración. */
async function createToken(secret: string): Promise<string> {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${TOKEN_VERSION}.${expiresAt}`;
  return `${payload}.${await sign(payload, secret)}`;
}

async function isTokenValid(token: string, secret: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [version, expiresAt, signature] = parts;
  if (version !== TOKEN_VERSION) return false;

  const expiry = Number(expiresAt);
  if (!Number.isFinite(expiry) || expiry <= Date.now()) return false;

  const expected = await sign(`${version}.${expiresAt}`, secret);
  return safeEqual(signature, expected);
}

/* ------------------------------------------------------------
   Sesión
   ------------------------------------------------------------ */

/** Emite la cookie de sesión. Sólo desde un Route Handler. */
export async function startSession(): Promise<boolean> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;

  const store = await cookies();
  store.set(COOKIE_NAME, await createToken(secret), {
    httpOnly: true, // fuera del alcance de cualquier script del cliente
    sameSite: "lax", // sobrevive a la navegación normal, no a un POST de otro sitio
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
  return true;
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/**
 * ¿Hay sesión válida? Es la única fuente de verdad: la consultan
 * tanto la página protegida como el endpoint de Places.
 */
export async function hasSession(): Promise<boolean> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;

  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  return isTokenValid(token, secret);
}
