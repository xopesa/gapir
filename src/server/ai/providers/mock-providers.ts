import { createSafeTutorResponse } from "../schemas/response";
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

abstract class MockProviderBase {
  readonly name = "mock";
  readonly timeoutMs: number;
  readonly retryPolicy = { maxRetries: 0, retryDelayMs: 0 };

  constructor(readonly model: string, timeoutMs = 2_000) {
    this.timeoutMs = timeoutMs;
  }

  async healthCheck(): Promise<ProviderHealth> {
    return { healthy: true, configured: true, name: this.name, model: this.model };
  }
}

export class MockSpeechToTextProvider extends MockProviderBase implements SpeechToTextProvider {
  readonly capabilities = { type: "stt" as const, languages: ["uz", "zh-CN"], streaming: false, structuredOutput: false };

  async execute(input: SpeechToTextInput, context: ProviderExecutionContext): Promise<ProviderExecutionResult<SpeechToTextOutput>> {
    void context;
    const started = Date.now();
    const text = input.textFallback?.trim() || (input.language === "zh-CN" ? "你好" : "Salom");
    return { data: { text, confidence: 1 }, latencyMs: Date.now() - started, usage: { inputUnits: null, outputUnits: null } };
  }
}

export class MockTutorLlmProvider extends MockProviderBase implements TutorLLMProvider {
  readonly capabilities = { type: "llm" as const, languages: ["uz", "zh-CN"], streaming: false, structuredOutput: true };
  private readonly rawOverride?: string;

  constructor(model = "mock-llm-v1", options?: { rawOverride?: string; timeoutMs?: number }) {
    super(model, options?.timeoutMs);
    this.rawOverride = options?.rawOverride;
  }

  async execute(input: TutorLlmInput, context: ProviderExecutionContext): Promise<ProviderExecutionResult<TutorLlmOutput>> {
    void context;
    const started = Date.now();
    const targetChinese = input.systemPrompt.includes("TARGET_LANGUAGE=zh-CN");
    const response = createSafeTutorResponse({
      recognizedText: input.recognizedText,
      correctedText: input.recognizedText,
      translation: targetChinese ? "Salom!" : "你好！",
      grammarExplanation: targetChinese ? "Jumla tushunarli va qisqa." : "句子简短且表达清楚。",
      teacherReply: targetChinese ? "你好！今天你想聊什么？" : "Salom! Bugun nima haqida gaplashmoqchisiz?",
      nextQuestion: targetChinese ? "你今天过得怎么样？" : "Bugun kuningiz qanday o‘tdi?",
      score: 85,
    });
    return {
      data: { rawText: this.rawOverride ?? JSON.stringify(response) },
      latencyMs: Date.now() - started,
      usage: { inputUnits: Math.ceil((input.systemPrompt.length + input.userPrompt.length) / 4), outputUnits: 120 },
    };
  }
}

export class MockTextToSpeechProvider extends MockProviderBase implements TextToSpeechProvider {
  readonly capabilities = { type: "tts" as const, languages: ["uz", "zh-CN"], streaming: false, structuredOutput: false };

  async execute(input: TextToSpeechInput, context: ProviderExecutionContext): Promise<ProviderExecutionResult<TextToSpeechOutput>> {
    void input;
    void context;
    const started = Date.now();
    return {
      data: { audio: null, mimeType: null, audioUrl: null },
      latencyMs: Date.now() - started,
      usage: { inputUnits: null, outputUnits: null },
    };
  }
}
