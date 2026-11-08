import { randomUUID } from "node:crypto";
import { ZodError } from "zod";
import { AiError, aiErrorResponse } from "../errors/ai-error";

export function aiRequestId(request: Request) {
  const supplied = request.headers.get("x-request-id")?.trim();
  return supplied && /^[a-zA-Z0-9._:-]{1,128}$/.test(supplied) ? supplied : randomUUID();
}

export function aiUnauthorizedResponse(requestId: string) {
  return Response.json({ error: { code: "UNAUTHORIZED", message: "Authentication is required.", requestId } }, { status: 401 });
}

export function aiRouteErrorResponse(error: unknown, requestId: string) {
  if (error instanceof AiError) return aiErrorResponse(error, requestId);
  if (error instanceof ZodError) {
    return Response.json({ error: { code: "VALIDATION_ERROR", message: "Request validation failed.", requestId } }, { status: 400 });
  }
  return Response.json({ error: { code: "INTERNAL_ERROR", message: "The AI request could not be completed.", requestId } }, { status: 500 });
}
