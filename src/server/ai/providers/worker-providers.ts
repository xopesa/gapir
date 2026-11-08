import { AiError } from "../errors/ai-error";
import type {
  ProviderExecutionContext,
  ProviderExecutionResult,
  ProviderHealth,
  SpeechToTextInput,
  SpeechToTextOutput,
  SpeechToTextProvider,
  TextToSpeechInput,
  TextToSpeechOutput,
  TextToSpeechProvider,
} from "./contracts";

type WorkerOptions = {
  name: string;
  model: string;
  workerUrl: string | null;
  timeoutMs: number;
  maxRetries: number;
};

async function workerError(response: Response, fallback: string) {
  const body = await response.text();
  try {
    const parsed = JSON.parse(body) as { error?: { message?: unknown }; detail?: unknown };
    if (typeof parsed.error?.message === "string") return parsed.error.message.slice(0, 500);
    if (typeof parsed.detail === "string") return parsed.detail.slice(0, 500);
  } catch {
    // Use the bounded plain response below.
  }
  return body.replace(/\s+/g, " ").trim().slice(0, 500) || fallback;
}

abstract class WorkerProviderBase {
  readonly name: string;
  readonly model: string;
  readonly timeoutMs: number;
  readonly retryPolicy: { maxRetries: number; retryDelayMs: number };
  protected readonly workerUrl: string | null;

  constructor(options: WorkerOptions) {
    this.name = options.name;
    this.model = options.model;
    this.workerUrl = options.workerUrl;
    this.timeoutMs = options.timeoutMs;
    this.retryPolicy = { maxRetries: options.maxRetries, retryDelayMs: 250 };
  }

  async healthCheck(): Promise<ProviderHealth> {
    if (!this.workerUrl || !this.model) {
      return { healthy: false, configured: false, name: this.name, model: this.model, message: "Worker URL or model is missing." };
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(this.timeoutMs, 5_000));
    try {
      const response = await fetch(`${this.workerUrl}/health`, { signal: controller.signal });
      if (!response.ok) return { healthy: false, configured: true, name: this.name, model: this.model, message: await workerError(response, `Worker returned HTTP ${response.status}.`) };
      const body = await response.json() as { healthy?: unknown; configured?: unknown; model?: unknown; message?: unknown };
      return {
        healthy: body.healthy === true,
        configured: body.configured !== false,
        name: this.name,
        model: typeof body.model === "string" && body.model ? body.model : this.model,
        message: typeof body.message === "string" ? body.message.slice(0, 500) : undefined,
      };
    } catch (error) {
      return { healthy: false, configured: true, name: this.name, model: this.model, message: error instanceof Error ? error.message.slice(0, 500) : "Worker is unavailable." };
    } finally {
      clearTimeout(timer);
    }
  }

  protected requireUrl() {
    if (!this.workerUrl || !this.model) throw new AiError("AI_PROVIDER_NOT_CONFIGURED", `${this.name} worker URL or model is not configured.`, { retryable: false });
    return this.workerUrl;
  }
}

export class WorkerSpeechToTextProvider extends WorkerProviderBase implements SpeechToTextProvider {
  readonly capabilities = { type: "stt" as const, languages: ["uz", "zh-CN"], streaming: false, structuredOutput: false };

  async execute(input: SpeechToTextInput, context: ProviderExecutionContext): Promise<ProviderExecutionResult<SpeechToTextOutput>> {
    const started = Date.now();
    const form = new FormData();
    const audioBuffer = input.audio.slice().buffer as ArrayBuffer;
    form.set("audio", new Blob([audioBuffer], { type: input.mimeType }), input.fileName);
    form.set("language", input.language);
    form.set("requestId", context.requestId);
    form.set("provider", this.name);
    form.set("model", this.model);
    const response = await fetch(`${this.requireUrl()}/transcribe`, { method: "POST", body: form, signal: context.signal });
    if (!response.ok) {
      const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
      throw new AiError("AI_STT_FAILED", `${this.name} worker returned HTTP ${response.status}: ${await workerError(response, "Transcription failed.")}`, { retryable });
    }
    const body = await response.json() as { text?: unknown; confidence?: unknown };
    if (typeof body.text !== "string") throw new AiError("AI_STT_FAILED", `${this.name} worker returned malformed JSON.`, { retryable: false });
    return {
      data: { text: body.text, confidence: typeof body.confidence === "number" ? body.confidence : null },
      latencyMs: Date.now() - started,
      usage: { inputUnits: null, outputUnits: null },
    };
  }
}

export class FallbackSpeechToTextProvider implements SpeechToTextProvider {
  readonly name: string;
  readonly model: string;
  readonly capabilities = { type: "stt" as const, languages: ["zh-CN"], streaming: false, structuredOutput: false };
  readonly timeoutMs: number;
  readonly retryPolicy = { maxRetries: 0, retryDelayMs: 0 };

  constructor(private readonly primary: SpeechToTextProvider, private readonly fallback: SpeechToTextProvider) {
    this.name = primary.name;
    this.model = `${primary.model} -> ${fallback.name}:${fallback.model}`;
    this.timeoutMs = primary.timeoutMs + fallback.timeoutMs;
  }

  async healthCheck(): Promise<ProviderHealth> {
    const primary = await this.primary.healthCheck();
    if (primary.healthy) return primary;
    const fallback = await this.fallback.healthCheck();
    return {
      healthy: fallback.healthy,
      configured: primary.configured || fallback.configured,
      name: this.name,
      model: this.model,
      message: fallback.healthy ? `${this.primary.name} unavailable; ${this.fallback.name} fallback is ready.` : `${this.primary.name} and ${this.fallback.name} are unavailable.`,
    };
  }

  async execute(input: SpeechToTextInput, context: ProviderExecutionContext) {
    try {
      return await this.primary.execute(input, context);
    } catch (error) {
      if (context.signal.aborted) throw error;
      return this.fallback.execute(input, context);
    }
  }
}

export class WorkerTextToSpeechProvider extends WorkerProviderBase implements TextToSpeechProvider {
  readonly capabilities = { type: "tts" as const, languages: ["uz", "zh-CN"], streaming: false, structuredOutput: false };

  async execute(input: TextToSpeechInput, context: ProviderExecutionContext): Promise<ProviderExecutionResult<TextToSpeechOutput>> {
    const started = Date.now();
    const response = await fetch(`${this.requireUrl()}/synthesize`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-request-id": context.requestId },
      signal: context.signal,
      body: JSON.stringify({ text: input.text, language: input.language, voice: input.voice, provider: this.name, model: this.model, requestId: context.requestId }),
    });
    if (!response.ok) {
      const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
      throw new AiError("AI_TTS_FAILED", `${this.name} worker returned HTTP ${response.status}: ${await workerError(response, "Synthesis failed.")}`, { retryable });
    }
    const body = await response.json() as { audioUrl?: unknown; audioBase64?: unknown; mimeType?: unknown };
    const mimeType = typeof body.mimeType === "string" ? body.mimeType : null;
    const audio = typeof body.audioBase64 === "string" && body.audioBase64 ? new Uint8Array(Buffer.from(body.audioBase64, "base64")) : null;
    const audioUrl = typeof body.audioUrl === "string" && body.audioUrl ? body.audioUrl : null;
    if (!audio && !audioUrl) throw new AiError("AI_TTS_FAILED", `${this.name} worker returned no audio.`, { retryable: false });
    return { data: { audio, mimeType, audioUrl }, latencyMs: Date.now() - started, usage: { inputUnits: null, outputUnits: null } };
  }
}

export class FallbackTextToSpeechProvider implements TextToSpeechProvider {
  readonly name: string;
  readonly model: string;
  readonly capabilities = { type: "tts" as const, languages: ["uz", "zh-CN"], streaming: false, structuredOutput: false };
  readonly timeoutMs: number;
  readonly retryPolicy = { maxRetries: 0, retryDelayMs: 0 };

  constructor(private readonly primary: TextToSpeechProvider, private readonly fallback: TextToSpeechProvider) {
    this.name = primary.name;
    this.model = `${primary.model} -> ${fallback.name}:${fallback.model}`;
    this.timeoutMs = primary.timeoutMs + fallback.timeoutMs;
  }

  async healthCheck(): Promise<ProviderHealth> {
    const primary = await this.primary.healthCheck();
    if (primary.healthy) return primary;
    const fallback = await this.fallback.healthCheck();
    return {
      healthy: fallback.healthy,
      configured: primary.configured || fallback.configured,
      name: this.name,
      model: this.model,
      message: fallback.healthy ? `${this.primary.name} unavailable; ${this.fallback.name} fallback is ready.` : `${this.primary.name} and ${this.fallback.name} are unavailable.`,
    };
  }

  async execute(input: TextToSpeechInput, context: ProviderExecutionContext) {
    try {
      return await this.primary.execute(input, context);
    } catch (error) {
      if (context.signal.aborted) throw error;
      return this.fallback.execute(input, context);
    }
  }
}

export class DisabledTextToSpeechProvider implements TextToSpeechProvider {
  readonly name = "disabled";
  readonly model = "none";
  readonly capabilities = { type: "tts" as const, languages: ["uz", "zh-CN"], streaming: false, structuredOutput: false };
  readonly timeoutMs = 1_000;
  readonly retryPolicy = { maxRetries: 0, retryDelayMs: 0 };

  async healthCheck(): Promise<ProviderHealth> {
    return { healthy: true, configured: true, name: this.name, model: this.model, message: "Text-only mode; TTS is disabled." };
  }

  async execute(): Promise<ProviderExecutionResult<TextToSpeechOutput>> {
    return { data: { audio: null, mimeType: null, audioUrl: null }, latencyMs: 0, usage: { inputUnits: null, outputUnits: null } };
  }
}
