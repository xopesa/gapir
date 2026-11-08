import { access } from "node:fs/promises";
import responseJsonSchema from "@/ai/schemas/ai-tutor-response.v1.schema.json";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getAiConfig } from "@/src/server/ai/config/ai-config";
import { getAiFeatureFlags } from "@/src/server/ai/config/feature-flags";
import { calculateEstimatedCost } from "@/src/server/ai/cost/cost-tracker";
import { AiError } from "@/src/server/ai/errors/ai-error";
import { resolveDirection } from "@/src/server/ai/languages/registry";
import { compileTutorPrompt, selectTutorPromptPath } from "@/src/server/ai/prompts/prompt-manager";
import type { SpeechToTextProvider } from "@/src/server/ai/providers/contracts";
import { MockSpeechToTextProvider, MockTextToSpeechProvider, MockTutorLlmProvider } from "@/src/server/ai/providers/mock-providers";
import { OpenAiTutorLlmProvider } from "@/src/server/ai/providers/openai-providers";
import { createProviderManager } from "@/src/server/ai/providers/provider-manager";
import { runProvider } from "@/src/server/ai/providers/provider-runner";
import { DisabledTextToSpeechProvider, FallbackSpeechToTextProvider, WorkerSpeechToTextProvider } from "@/src/server/ai/providers/worker-providers";
import { createSafeTutorResponse, parseTutorResponse } from "@/src/server/ai/schemas/response";
import { detectAudioMime, validateAudio, withTemporaryAudioFile } from "@/src/server/ai/speech/audio-security";
import { createProviderTelemetryRecord } from "@/src/server/ai/telemetry/telemetry-service";
import { aiUnauthorizedResponse } from "@/src/server/ai/http/route-helpers";
import { assertAiSessionOwner } from "@/src/server/ai/tutor/conversation-engine";

const providerContext = { requestId: "request-1", userId: "user-1", sessionId: "session-1", signal: new AbortController().signal };

afterEach(() => vi.unstubAllGlobals());

function mockEnv(overrides: Partial<NodeJS.ProcessEnv> = {}): NodeJS.ProcessEnv {
  return { NODE_ENV: "test", ENABLE_AI_ASSISTANT: "true", ENABLE_AI_TUTOR: "true", ...overrides };
}

function wavBytes(dataBytes = 16) {
  const bytes = new Uint8Array(44 + dataBytes);
  const view = new DataView(bytes.buffer);
  const put = (offset: number, value: string) => [...value].forEach((character, index) => { bytes[offset + index] = character.charCodeAt(0); });
  put(0, "RIFF"); view.setUint32(4, 36 + dataBytes, true); put(8, "WAVE"); put(12, "fmt ");
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, 16_000, true); view.setUint32(28, 32_000, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  put(36, "data"); view.setUint32(40, dataBytes, true);
  return bytes;
}

describe("Gapir AI Assistant Stage 3.1", () => {
  it("loads safe feature flags and ignores malformed booleans", () => {
    expect(getAiFeatureFlags(mockEnv()).assistant).toBe(true);
    expect(getAiFeatureFlags(mockEnv({ ENABLE_AI_ASSISTANT: "definitely" })).assistant).toBe(false);
    expect(getAiFeatureFlags(mockEnv({ ENABLE_AI_OFFLINE: "1" })).offline).toBe(true);
  });

  it("selects providers from environment configuration", () => {
    const manager = createProviderManager(getAiConfig(mockEnv({ AI_LLM_PROVIDER: "openai", AI_LLM_MODEL: "configured-model" })));
    expect(manager.selectedLlm()).toMatchObject({ name: "openai", model: "configured-model" });
  });

  it("configures Gemini through its OpenAI-compatible endpoint without exposing the key", () => {
    const config = getAiConfig(mockEnv({ AI_LLM_PROVIDER: "gemini", AI_LLM_MODEL: "gemini-3.6-flash", AI_LLM_API_KEY: "secret-value" }));
    const manager = createProviderManager(config);
    expect(manager.selectedLlm()).toMatchObject({ name: "gemini", model: "gemini-3.6-flash" });
    expect(config.external.llmBaseUrl).toBe("https://generativelanguage.googleapis.com/v1beta/openai");
    expect(JSON.stringify(manager.selectedLlm())).not.toContain("secret-value");
  });

  it("routes speech providers by target language", () => {
    const manager = createProviderManager(getAiConfig(mockEnv({
      AI_STT_UZ_PROVIDER: "faster_whisper", AI_STT_UZ_MODEL: "whisper-small",
      AI_STT_ZH_PROVIDER: "funasr", AI_STT_ZH_MODEL: "fun-asr-nano",
      AI_TTS_UZ_PROVIDER: "disabled", AI_TTS_ZH_PROVIDER: "cosyvoice", AI_TTS_ZH_MODEL: "cosyvoice",
    })));
    expect(manager.selectedStt("uz")).toMatchObject({ name: "faster_whisper" });
    expect(manager.selectedStt("zh-CN")).toMatchObject({ name: "funasr" });
    expect(manager.selectedTts("uz")).toMatchObject({ name: "disabled" });
    expect(manager.selectedTts("zh-CN")).toMatchObject({ name: "cosyvoice" });
  });

  it("selects and compiles a versioned prompt for each direction", async () => {
    expect(selectTutorPromptPath("uz_to_zh")).toMatch(/uz_to_zh[\\/]tutor[\\/]v1\.md$/);
    const prompt = await compileTutorPrompt({
      direction: "zh_to_uz", nativeLanguage: "zh-CN", targetLanguage: "uz", level: "beginner",
      topic: "greeting", history: [], memorySummary: "{}", weakTopics: [], learnedWords: [], recognizedText: "Salom",
    });
    expect(prompt.version).toBe("tutor-v1");
    expect(prompt.systemPrompt).toContain("TARGET_LANGUAGE=uz");
    expect(prompt.userPrompt).toContain("Salom");
  });

  it("validates only supported tutor directions", () => {
    expect(resolveDirection("uz_to_zh")).toMatchObject({ nativeLanguage: "uz", targetLanguage: "zh-CN" });
    expect(() => resolveDirection("uz_to_en")).toThrow(AiError);
  });

  it("parses strict JSON, including a markdown fence", () => {
    const value = createSafeTutorResponse({ teacherReply: "你好" });
    expect(parseTutorResponse(`\n\`\`\`json\n${JSON.stringify(value)}\n\`\`\``).teacherReply).toBe("你好");
    expect(responseJsonSchema.additionalProperties).toBe(false);
  });

  it("rejects malformed LLM JSON without crashing", () => {
    expect(() => parseTutorResponse("```json\n{broken\n```")).toThrowError(AiError);
  });

  it("returns a normalized unauthorized response", async () => {
    const response = aiUnauthorizedResponse("request-1");
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({ error: { code: "UNAUTHORIZED", requestId: "request-1" } });
  });

  it("forbids access to another user's session", () => {
    expect(() => assertAiSessionOwner({ userId: "owner" }, "intruder")).toThrowError(/cannot access/i);
    expect(() => assertAiSessionOwner(null, "owner")).toThrowError(/not found/i);
  });

  it("rejects oversized audio and unsupported MIME content", () => {
    expect(() => validateAudio({ bytes: new Uint8Array(20), fileName: "voice.wav", declaredMimeType: "audio/wav", maxBytes: 10, maxDurationMs: 60_000 })).toThrowError(/too large/i);
    expect(() => validateAudio({ bytes: new Uint8Array([1, 2, 3, 4]), fileName: "voice.wav", declaredMimeType: "audio/wav", maxBytes: 100, maxDurationMs: 60_000 })).toThrowError(/does not match/i);
    expect(detectAudioMime(wavBytes())).toBe("audio/wav");
  });

  it("reports a missing external API key without making a request", async () => {
    const provider = new OpenAiTutorLlmProvider({ apiKey: null, baseUrl: "https://api.openai.com/v1", model: "configured-model", timeoutMs: 100, maxRetries: 0 });
    await expect(provider.execute({ systemPrompt: "Return JSON", userPrompt: "Hi", recognizedText: "Hi", responseSchema: {} }, providerContext)).rejects.toMatchObject({ code: "AI_PROVIDER_NOT_CONFIGURED" });
    await expect(provider.healthCheck()).resolves.toMatchObject({ healthy: false, configured: false });
  });

  it("normalizes provider timeout", async () => {
    const provider: SpeechToTextProvider = {
      name: "timeout", model: "timeout-v1", timeoutMs: 10,
      retryPolicy: { maxRetries: 0, retryDelayMs: 0 },
      capabilities: { type: "stt", languages: ["uz"], streaming: false, structuredOutput: false },
      healthCheck: async () => ({ healthy: true, configured: true, name: "timeout", model: "timeout-v1" }),
      execute: async (_input, context) => new Promise((_resolve, reject) => {
        context.signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
      }),
    };
    await expect(runProvider(provider, { audio: wavBytes(), fileName: "voice.wav", mimeType: "audio/wav", language: "uz" }, { requestId: "r", userId: "u", sessionId: "s" }, "AI_STT_FAILED"))
      .rejects.toMatchObject({ code: "AI_TIMEOUT" });
  });

  it("reports a local worker HTTP error without inventing transcript text", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ detail: "model is not loaded" }), { status: 503 })));
    const provider = new WorkerSpeechToTextProvider({ name: "faster_whisper", model: "local", workerUrl: "http://127.0.0.1:8101", timeoutMs: 100, maxRetries: 0 });
    await expect(provider.execute({ audio: wavBytes(), fileName: "voice.wav", mimeType: "audio/wav", language: "uz" }, providerContext))
      .rejects.toMatchObject({ code: "AI_STT_FAILED", retryable: true });
  });

  it("checks worker health and rejects malformed transcription JSON", async () => {
    const request = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ healthy: true, configured: true, model: "local" }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ confidence: 0.5 }), { status: 200 }));
    vi.stubGlobal("fetch", request);
    const provider = new WorkerSpeechToTextProvider({ name: "faster_whisper", model: "local", workerUrl: "http://127.0.0.1:8101", timeoutMs: 100, maxRetries: 0 });
    await expect(provider.healthCheck()).resolves.toMatchObject({ healthy: true, configured: true });
    await expect(provider.execute({ audio: wavBytes(), fileName: "voice.wav", mimeType: "audio/wav", language: "uz" }, providerContext))
      .rejects.toMatchObject({ code: "AI_STT_FAILED", retryable: false });
  });

  it("applies the configured timeout to a local worker request", async () => {
    vi.stubGlobal("fetch", vi.fn((_url: string | URL | Request, init?: RequestInit) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
    })));
    const provider = new WorkerSpeechToTextProvider({ name: "faster_whisper", model: "local", workerUrl: "http://127.0.0.1:8101", timeoutMs: 10, maxRetries: 0 });
    await expect(runProvider(provider, { audio: wavBytes(), fileName: "voice.wav", mimeType: "audio/wav", language: "uz" }, { requestId: "r", userId: "u", sessionId: "s" }, "AI_STT_FAILED"))
      .rejects.toMatchObject({ code: "AI_TIMEOUT" });
  });

  it("uses only the declared real STT fallback when the primary worker fails", async () => {
    const primary = new WorkerSpeechToTextProvider({ name: "funasr", model: "funasr-local", workerUrl: "http://127.0.0.1:8101", timeoutMs: 100, maxRetries: 0 });
    const fallback = new WorkerSpeechToTextProvider({ name: "faster_whisper", model: "whisper-local", workerUrl: "http://127.0.0.1:8101", timeoutMs: 100, maxRetries: 0 });
    const request = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const providerName = (init?.body as FormData).get("provider");
      return providerName === "funasr"
        ? new Response(JSON.stringify({ detail: "unavailable" }), { status: 503 })
        : new Response(JSON.stringify({ text: "你好", confidence: 0.9 }), { status: 200 });
    });
    vi.stubGlobal("fetch", request);
    const composite = new FallbackSpeechToTextProvider(primary, fallback);
    await expect(composite.execute({ audio: wavBytes(), fileName: "voice.wav", mimeType: "audio/wav", language: "zh-CN" }, providerContext))
      .resolves.toMatchObject({ data: { text: "你好" } });
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("runs mock STT, LLM and TTS without paid APIs", async () => {
    const stt = new MockSpeechToTextProvider("mock-stt-v1");
    const llm = new MockTutorLlmProvider("mock-llm-v1");
    const tts = new MockTextToSpeechProvider("mock-tts-v1");
    await expect(stt.execute({ audio: wavBytes(), fileName: "voice.wav", mimeType: "audio/wav", language: "uz", textFallback: "Test" }, providerContext))
      .resolves.toMatchObject({ data: { text: "Test" } });
    const llmResult = await llm.execute({ systemPrompt: "TARGET_LANGUAGE=zh-CN", userPrompt: "Test", recognizedText: "Test", responseSchema: {} }, providerContext);
    expect(parseTutorResponse(llmResult.data.rawText).teacherReply).toContain("你好");
    await expect(tts.execute({ text: "你好", language: "zh-CN", voice: "test" }, providerContext))
      .resolves.toMatchObject({ data: { audioUrl: null } });
  });

  it("keeps TTS explicitly disabled as a successful text-only mode", async () => {
    const tts = new DisabledTextToSpeechProvider();
    await expect(tts.healthCheck()).resolves.toMatchObject({ healthy: true, configured: true, name: "disabled" });
    await expect(tts.execute()).resolves.toMatchObject({ data: { audio: null, audioUrl: null } });
  });

  it("calculates configured cost and preserves unknown cost as null", () => {
    expect(calculateEstimatedCost("mock", "model", { inputUnits: 1_000, outputUnits: 2_000 }, {
      "mock:model": { inputPerMillion: 1, outputPerMillion: 2, currency: "USD" },
    })).toMatchObject({ estimatedCost: 0.005, currency: "USD" });
    expect(calculateEstimatedCost("unknown", "model", { inputUnits: null, outputUnits: null }, {})).toMatchObject({ estimatedCost: null });
  });

  it("creates content-free telemetry metadata", () => {
    const record = createProviderTelemetryRecord({
      providerType: "llm", providerName: "mock", model: "mock-llm-v1", success: true, latencyMs: 10.4,
      requestId: "request-1", sessionId: "session-1", userId: "user-1", usage: { inputUnits: 1, outputUnits: 2 },
    });
    expect(record).toMatchObject({ latencyMs: 10, requestId: "request-1", success: true });
    expect(record).not.toHaveProperty("prompt");
  });

  it("always removes temporary audio after an error", async () => {
    let path = "";
    await expect(withTemporaryAudioFile({ bytes: wavBytes(), extension: ".wav" }, async (temporaryPath) => {
      path = temporaryPath;
      await expect(access(path)).resolves.toBeUndefined();
      throw new Error("test failure");
    })).rejects.toThrow("test failure");
    await expect(access(path)).rejects.toThrow();
  });
});
