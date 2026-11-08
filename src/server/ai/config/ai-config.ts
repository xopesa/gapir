import { getAiFeatureFlags } from "./feature-flags";

export type AiProviderKind = "stt" | "llm" | "tts" | "translation";

export type AiPricingEntry = {
  inputPerMillion?: number;
  outputPerMillion?: number;
  currency?: string;
};

function safeInteger(value: string | undefined, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

export function parsePricingConfig(value: string | undefined): Record<string, AiPricingEntry> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const result: Record<string, AiPricingEntry> = {};
    for (const [key, entry] of Object.entries(parsed)) {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
      const candidate = entry as Record<string, unknown>;
      const input = typeof candidate.inputPerMillion === "number" && candidate.inputPerMillion >= 0
        ? candidate.inputPerMillion : undefined;
      const output = typeof candidate.outputPerMillion === "number" && candidate.outputPerMillion >= 0
        ? candidate.outputPerMillion : undefined;
      const currency = typeof candidate.currency === "string" && candidate.currency.length <= 8
        ? candidate.currency.toUpperCase() : "USD";
      result[key] = { inputPerMillion: input, outputPerMillion: output, currency };
    }
    return result;
  } catch {
    return {};
  }
}

export function getAiConfig(env: NodeJS.ProcessEnv = process.env) {
  const timeoutMs = safeInteger(env.AI_PROVIDER_TIMEOUT_MS, 20_000, 1_000, 120_000);
  const providerSelection = (providerValue: string | undefined, modelValue: string | undefined, mockModel: string) => {
    const name = providerValue?.trim().toLowerCase() || "mock";
    return { name, model: modelValue?.trim() || (name === "mock" ? mockModel : "") };
  };
  const stt = providerSelection(env.AI_STT_PROVIDER, env.AI_STT_MODEL, "mock-stt-v1");
  const llm = providerSelection(env.AI_LLM_PROVIDER, env.AI_LLM_MODEL, "mock-llm-v1");
  const tts = providerSelection(env.AI_TTS_PROVIDER, env.AI_TTS_MODEL, "mock-tts-v1");
  const llmBaseUrl = env.AI_LLM_BASE_URL?.trim()
    || (llm.name === "gemini" ? "https://generativelanguage.googleapis.com/v1beta/openai" : env.OPENAI_BASE_URL?.trim())
    || "https://api.openai.com/v1";
  return {
    flags: getAiFeatureFlags(env),
    providers: {
      stt,
      llm,
      tts,
      sttByLanguage: {
        uz: providerSelection(env.AI_STT_UZ_PROVIDER ?? env.AI_STT_PROVIDER, env.AI_STT_UZ_MODEL ?? env.AI_STT_MODEL, "mock-stt-v1"),
        "zh-CN": providerSelection(env.AI_STT_ZH_PROVIDER ?? env.AI_STT_PROVIDER, env.AI_STT_ZH_MODEL ?? env.AI_STT_MODEL, "mock-stt-v1"),
      },
      ttsByLanguage: {
        uz: providerSelection(env.AI_TTS_UZ_PROVIDER ?? env.AI_TTS_PROVIDER, env.AI_TTS_UZ_MODEL ?? env.AI_TTS_MODEL, "mock-tts-v1"),
        "zh-CN": providerSelection(env.AI_TTS_ZH_PROVIDER ?? env.AI_TTS_PROVIDER, env.AI_TTS_ZH_MODEL ?? env.AI_TTS_MODEL, "mock-tts-v1"),
      },
      translation: { name: env.AI_TRANSLATION_PROVIDER?.trim().toLowerCase() || "mock", model: "" },
    },
    external: {
      llmApiKey: env.AI_LLM_API_KEY?.trim() || env.OPENAI_API_KEY?.trim() || null,
      llmBaseUrl: llmBaseUrl.replace(/\/$/, ""),
      ttsApiKey: env.AI_TTS_API_KEY?.trim() || env.OPENAI_API_KEY?.trim() || null,
      ttsBaseUrl: (env.AI_TTS_BASE_URL?.trim() || env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1").replace(/\/$/, ""),
      openAiApiKey: env.OPENAI_API_KEY?.trim() || null,
      openAiBaseUrl: (env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1").replace(/\/$/, ""),
      sttWorkerUrl: env.AI_STT_WORKER_URL?.trim().replace(/\/$/, "") || null,
      ttsWorkerUrl: env.AI_TTS_WORKER_URL?.trim().replace(/\/$/, "") || null,
      localModelDir: env.AI_LOCAL_MODEL_DIR?.trim() || null,
      ttsVoice: env.AI_TTS_VOICE?.trim() || "alloy",
    },
    limits: {
      providerTimeoutMs: timeoutMs,
      workerTimeoutMs: safeInteger(env.AI_WORKER_TIMEOUT_MS, timeoutMs, 1_000, 300_000),
      providerMaxRetries: safeInteger(env.AI_PROVIDER_MAX_RETRIES, 1, 0, 2),
      maxAudioBytes: safeInteger(env.AI_MAX_AUDIO_BYTES, 15 * 1024 * 1024, 1_024, 50 * 1024 * 1024),
      maxAudioDurationMs: env.AI_AUDIO_MAX_SECONDS
        ? safeInteger(env.AI_AUDIO_MAX_SECONDS, 60, 1, 300) * 1_000
        : safeInteger(env.AI_MAX_AUDIO_DURATION_MS, 60_000, 1_000, 300_000),
      maxMessagesPerSession: safeInteger(env.AI_MAX_MESSAGES_PER_SESSION, 40, 1, 200),
      rateLimitPerMinute: safeInteger(env.AI_RATE_LIMIT_PER_MINUTE, 20, 1, 600),
      maxConcurrentTurnsPerUser: safeInteger(env.AI_MAX_CONCURRENT_TURNS_PER_USER, 1, 1, 4),
    },
    pricing: parsePricingConfig(env.AI_PRICING_JSON),
  } as const;
}

export type AiConfig = ReturnType<typeof getAiConfig>;
