import { AiError, normalizeAiError, type AiErrorCode } from "../errors/ai-error";
import type { BaseAiProvider, ProviderExecutionContext } from "./contracts";

function wait(milliseconds: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, milliseconds);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new AiError("AI_TIMEOUT", "AI provider request timed out."));
    }, { once: true });
  });
}

export async function runProvider<Input, Output>(
  provider: BaseAiProvider<Input, Output>,
  input: Input,
  context: Omit<ProviderExecutionContext, "signal">,
  fallbackCode: AiErrorCode,
) {
  let lastError: AiError | null = null;
  for (let attempt = 0; attempt <= provider.retryPolicy.maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), provider.timeoutMs);
    try {
      return await provider.execute(input, { ...context, signal: controller.signal });
    } catch (error) {
      lastError = normalizeAiError(error, fallbackCode);
      if (!lastError.retryable || attempt >= provider.retryPolicy.maxRetries) throw lastError;
      await wait(provider.retryPolicy.retryDelayMs);
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError ?? new AiError(fallbackCode);
}
