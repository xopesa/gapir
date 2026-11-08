import type { LanguageCode } from "../languages/registry";

export type AiProviderType = "stt" | "llm" | "tts";

export type ProviderCapabilities = {
  type: AiProviderType;
  languages: readonly string[];
  streaming: boolean;
  structuredOutput: boolean;
};

export type ProviderHealth = {
  healthy: boolean;
  configured: boolean;
  name: string;
  model: string;
  message?: string;
};

export type ProviderUsage = {
  inputUnits: number | null;
  outputUnits: number | null;
};

export type RetryPolicy = {
  maxRetries: number;
  retryDelayMs: number;
};

export type ProviderExecutionContext = {
  requestId: string;
  userId: string;
  sessionId: string;
  signal: AbortSignal;
};

export type ProviderExecutionResult<T> = {
  data: T;
  latencyMs: number;
  usage: ProviderUsage;
};

export interface BaseAiProvider<Input, Output> {
  readonly name: string;
  readonly model: string;
  readonly capabilities: ProviderCapabilities;
  readonly timeoutMs: number;
  readonly retryPolicy: RetryPolicy;
  healthCheck(): Promise<ProviderHealth>;
  execute(input: Input, context: ProviderExecutionContext): Promise<ProviderExecutionResult<Output>>;
}

export type SpeechToTextInput = {
  audio: Uint8Array;
  fileName: string;
  mimeType: string;
  language: LanguageCode;
  textFallback?: string;
};

export type SpeechToTextOutput = {
  text: string;
  confidence: number | null;
};

export type SpeechToTextProvider = BaseAiProvider<SpeechToTextInput, SpeechToTextOutput>;

export type TutorLlmInput = {
  systemPrompt: string;
  userPrompt: string;
  recognizedText: string;
  responseSchema: Record<string, unknown>;
  repairSource?: string;
};

export type TutorLlmOutput = { rawText: string };

export type TutorLLMProvider = BaseAiProvider<TutorLlmInput, TutorLlmOutput>;

export type TextToSpeechInput = {
  text: string;
  language: LanguageCode;
  voice: string;
};

export type TextToSpeechOutput = {
  audio: Uint8Array | null;
  mimeType: string | null;
  audioUrl: string | null;
};

export type TextToSpeechProvider = BaseAiProvider<TextToSpeechInput, TextToSpeechOutput>;
