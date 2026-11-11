import { consumeRateLimit } from "@/src/server/auth/rate-limit";
import { jsonError, readJson } from "@/src/server/http";
import { createGuestUser } from "@/src/server/services/auth-service";

// "Start without an account": a guest user with a session, no email or password.
export async function POST(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const limit = consumeRateLimit(`guest:${ip}`, 20);
  if (!limit.allowed) return Response.json({ error: "RATE_LIMITED" }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  try {
    const body = await readJson(request).catch(() => ({}));
    return Response.json({ user: await createGuestUser(body) });
  } catch (error) { return jsonError(error); }
}
