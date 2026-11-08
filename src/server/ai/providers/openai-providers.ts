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
  TutorLlmInput,
  TutorLlmOutput,
  TutorLLMProvider,
} from "./contracts";

export type OpenAiProviderOptions = {
  providerName?: string;
  apiKey: string | null;
  baseUrl: string;
  model: string;
  timeoutMs: number;
  maxRetries: number;
};

abstract class OpenAiProviderBase {
  readonly name: string;
  readonly model: string;
  readonly timeoutMs: number;
  readonly retryPolicy: { maxRetries: number; retryDelayMs: number };
  protected readonly apiKey: string | null;
  protected readonly baseUrl: string;

  constructor(options: OpenAiProviderOptions) {
    this.name = options.providerName ?? "openai";
    this.apiKey = options.apiKey;
    Object.defineProperty(this, "apiKey", { value: options.apiKey, enumerable: false, writable: false });
    this.baseUrl = options.baseUrl;
    this.model = options.model;
    this.timeoutMs = options.timeoutMs;
    this.retryPolicy = { maxRetries: options.maxRetries, retryDelayMs: 250 };
  }

  async healthCheck(): Promise<ProviderHealth> {
    const configured = Boolean(this.apiKey && this.model);
    return {
      healthy: configured,
      configured,
      name: this.name,
      model: this.model,
      message: configured ? undefined : "AI_LLM_API_KEY (or legacy OPENAI_API_KEY) or provider model is missing.",
    };
  }

  protected headers(json = true) {
    if (!this.apiKey || !this.model) throw new AiError("AI_PROVIDER_NOT_CONFIGURED", "OpenAI-compatible API key or model is not configured.", { retryable: false });
    return { Authorization: `Bearer ${this.apiKey}`, ...(json ? { "Content-Type": "application/json" } : {}) };
  }

  protected async ensureSuccess(response: Response, code: "AI_STT_FAILED" | "AI_LLM_FAILED" | "AI_TTS_FAILED") {
    if (response.ok) return;
    const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
    const body = await response.text();
    let detail = "";
    try {
      const parsed = JSON.parse(body) as { error?: { message?: unknown } };
      detail = typeof parsed.error?.message === "string" ? parsed.error.message.slice(0, 500) : "";
    } catch {
      detail = body.replace(/\s+/g, " ").trim().slice(0, 500);
    }
    throw new AiError(code, `OpenAI-compatible provider returned HTTP ${response.status}${detail ? `: ${detail}` : "."}`, { retryable });
  }
}

export class OpenAiSpeechToTextProvider extends OpenAiProviderBase implements SpeechToTextProvider {
  readonly capabilities = { type: "stt" as const, languages: ["uz", "zh-CN"], streaming: false, structuredOutput: false };

  async execute(input: SpeechToTextInput, context: ProviderExecutionContext): Promise<ProviderExecutionResult<SpeechToTextOutput>> {
    const started = Date.now();
    const form = new FormData();
    form.set("model", this.model);
    form.set("language", input.language === "zh-CN" ? "zh" : "uz");
    const audioBuffer = input.audio.slice().buffer as ArrayBuffer;
    form.set("file", new Blob([audioBuffer], { type: input.mimeType }), input.fileName);
    const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
      method: "POST",
      headers: this.headers(false),
      body: form,
      signal: context.signal,
    });
    await this.ensureSuccess(response, "AI_STT_FAILED");
    const body = await response.json() as { text?: unknown };
    if (typeof body.text !== "string" || !body.text.trim()) throw new AiError("AI_STT_FAILED", "STT provider returned no text.");
    return { data: { text: body.text, confidence: null }, latencyMs: Date.now() - started, usage: { inputUnits: null, outputUnits: null } };
  }
}

export class OpenAiTutorLlmProvider extends OpenAiProviderBase implements TutorLLMProvider {
  readonly capabilities = { type: "llm" as const, languages: ["uz", "zh-CN"], streaming: false, structuredOutput: true };

  async execute(input: TutorLlmInput, context: ProviderExecutionContext): Promise<ProviderExecutionResult<TutorLlmOutput>> {
    const started = Date.now();
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: this.headers(),
      signal: context.signal,
      body: JSON.stringify({
        model: this.model,
        temperature: input.repairSource ? 0 : 0.4,
        response_format: {
          type: "json_schema",
          json_schema: { name: "gapir_ai_tutor_response", strict: true, schema: input.responseSchema },
        },
        messages: [
          { role: "system", content: input.systemPrompt },
          { role: "user", content: input.repairSource
            ? `${input.userPrompt}\n\nRepair this invalid response and return only valid JSON:\n${input.repairSource.slice(0, 12000)}`
            : input.userPrompt },
        ],
      }),
    });
    await this.ensureSuccess(response, "AI_LLM_FAILED");
    const body = await response.json() as {
      choices?: Array<{ message?: { content?: unknown } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const rawText = body.choices?.[0]?.message?.content;
    if (typeof rawText !== "string" || !rawText.trim()) throw new AiError("AI_LLM_FAILED", "LLM provider returned no content.");
    return {
      data: { rawText },
      latencyMs: Date.now() - started,
      usage: { inputUnits: body.usage?.prompt_tokens ?? null, outputUnits: body.usage?.completion_tokens ?? null },
    };
  }
}

export class OpenAiTextToSpeechProvider extends OpenAiProviderBase implements TextToSpeechProvider {
  readonly capabilities = { type: "tts" as const, languages: ["uz", "zh-CN"], streaming: false, structuredOutput: false };
  private readonly voice: string;

  constructor(options: OpenAiProviderOptions & { voice: string }) {
    super(options);
    this.voice = options.voice;
  }

  async execute(input: TextToSpeechInput, context: ProviderExecutionContext): Promise<ProviderExecutionResult<TextToSpeechOutput>> {
    const started = Date.now();
    const response = await fetch(`${this.baseUrl}/audio/speech`, {
      method: "POST",
      headers: this.headers(),
      signal: context.signal,
      body: JSON.stringify({ model: this.model, voice: this.voice, input: input.text, response_format: "mp3" }),
    });
    await this.ensureSuccess(response, "AI_TTS_FAILED");
    const audio = new Uint8Array(await response.arrayBuffer());
    return {
      data: { audio, mimeType: response.headers.get("content-type") ?? "audio/mpeg", audioUrl: null },
      latencyMs: Date.now() - started,
      usage: { inputUnits: null, outputUnits: null },
    };
  }
}
