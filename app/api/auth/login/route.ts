import { consumeRateLimit, resetRateLimit } from "@/src/server/auth/rate-limit";
import { jsonError, readJson } from "@/src/server/http";
import { loginUser } from "@/src/server/services/auth-service";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const key = `login:${ip}`;
  const limit = consumeRateLimit(key, 10);
  if (!limit.allowed) return Response.json({ error: "RATE_LIMITED" }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  try {
    const user = await loginUser(await readJson(request));
    resetRateLimit(key);
    return Response.json({ user });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") return Response.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
    return jsonError(error);
  }
}
