import { consumeRateLimit } from "@/src/server/auth/rate-limit";
import { jsonError, readJson } from "@/src/server/http";
import { registerUser } from "@/src/server/services/auth-service";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const limit = consumeRateLimit(`register:${ip}`, 5);
  if (!limit.allowed) return Response.json({ error: "RATE_LIMITED" }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  try { return Response.json({ user: await registerUser(await readJson(request)) }, { status: 201 }); }
  catch (error) { return jsonError(error); }
}
