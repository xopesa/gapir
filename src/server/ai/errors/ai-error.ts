export const AI_ERROR_CODES = [
  "AI_FEATURE_DISABLED",
  "AI_PROVIDER_NOT_CONFIGURED",
  "AI_STT_FAILED",
  "AI_LLM_FAILED",
  "AI_TTS_FAILED",
  "AI_INVALID_RESPONSE",
  "AI_AUDIO_TOO_LARGE",
  "AI_AUDIO_TOO_LONG",
  "AI_AUDIO_UNSUPPORTED",
  "AI_RATE_LIMITED",
  "AI_TIMEOUT",
  "AI_SESSION_NOT_FOUND",
  "AI_SESSION_FORBIDDEN",
] as const;

export type AiErrorCode = typeof AI_ERROR_CODES[number];

const statusByCode: Record<AiErrorCode, number> = {
  AI_FEATURE_DISABLED: 404,
  AI_PROVIDER_NOT_CONFIGURED: 503,
  AI_STT_FAILED: 502,
  AI_LLM_FAILED: 502,
  AI_TTS_FAILED: 502,
  AI_INVALID_RESPONSE: 502,
  AI_AUDIO_TOO_LARGE: 413,
  AI_AUDIO_TOO_LONG: 413,
  AI_AUDIO_UNSUPPORTED: 415,
  AI_RATE_LIMITED: 429,
  AI_TIMEOUT: 504,
  AI_SESSION_NOT_FOUND: 404,
  AI_SESSION_FORBIDDEN: 403,
};

export class AiError extends Error {
  readonly code: AiErrorCode;
  readonly status: number;
  readonly retryable: boolean;
  readonly cause?: unknown;

  constructor(code: AiErrorCode, message?: string, options?: { retryable?: boolean; cause?: unknown }) {
    super(message ?? code);
    this.name = "AiError";
    this.code = code;
    this.status = statusByCode[code];
    this.retryable = options?.retryable ?? ["AI_STT_FAILED", "AI_LLM_FAILED", "AI_TTS_FAILED", "AI_TIMEOUT", "AI_RATE_LIMITED"].includes(code);
    this.cause = options?.cause;
  }
}

export function normalizeAiError(error: unknown, fallback: AiErrorCode) {
  if (error instanceof AiError) return error;
  if (error instanceof Error && (error.name === "AbortError" || error.message === "AI_TIMEOUT")) {
    return new AiError("AI_TIMEOUT", "AI provider request timed out.", { cause: error, retryable: true });
  }
  return new AiError(fallback, "AI provider request failed.", { cause: error, retryable: true });
}

export function aiErrorResponse(error: unknown, requestId: string) {
  const normalized = normalizeAiError(error, "AI_LLM_FAILED");
  return Response.json({
    error: { code: normalized.code, message: normalized.message, requestId },
  }, { status: normalized.status });
}
