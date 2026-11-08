import { destroySession } from "@/src/server/auth/session";

export async function POST() {
  await destroySession();
  return Response.json({ ok: true });
}
