import { ZodError } from "zod";

export function jsonError(error: unknown, fallback = "REQUEST_FAILED") {
  if (error instanceof ZodError) return Response.json({ error: "VALIDATION_ERROR", issues: error.issues }, { status: 400 });
  const code = error instanceof Error ? error.message : fallback;
  const status = code === "UNAUTHORIZED" ? 401 : code === "FORBIDDEN" ? 403 : code.endsWith("_NOT_FOUND") ? 404 : code === "EMAIL_EXISTS" ? 409 : 400;
  return Response.json({ error: code }, { status });
}

export async function readJson(request: Request) {
  try { return await request.json(); } catch { throw new Error("INVALID_JSON"); }
}
