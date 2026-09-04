import { endSession } from "@/lib/auth";

/** POST /api/auth/logout — borra la cookie de sesión. */
export async function POST() {
  await endSession();
  return Response.json({ ok: true });
}
