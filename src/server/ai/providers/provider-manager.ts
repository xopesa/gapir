import type { AiConfig } from "../config/ai-config";
import { AiError } from "../errors/ai-error";
import type { LanguageCode } from "../languages/registry";
import { MockSpeechToTextProvider, MockTextToSpeechProvider, MockTutorLlmProvider } from "./mock-providers";
import { OpenAiSpeechToTextProvider, OpenAiTextToSpeechProvider, OpenAiTutorLlmProvider } from "./openai-providers";
import { runProvider } from "./provider-runner";
import { DisabledTextToSpeechProvider, FallbackSpeechToTextProvider, FallbackTextToSpeechProvider, WorkerSpeechToTextProvider, WorkerTextToSpeechProvider } from "./worker-providers";
import type {
  ProviderExecutionContext,
  SpeechToTextInput,
  SpeechToTextProvider,
  TextToSpeechInput,
  TextToSpeechProvider,
  TutorLlmInput,
  TutorLLMProvider,
} from "./contracts";

type ContextWithoutSignal = Omit<ProviderExecutionContext, "signal">;

export class AiProviderManager {
  private readonly stt = new Map<string, SpeechToTextProvider>();
  private readonly llm = new Map<string, TutorLLMProvider>();
  private readonly tts = new Map<string, TextToSpeechProvider>();

  constructor(private readonly config: AiConfig) {}

  registerStt(provider: SpeechToTextProvider) { this.stt.set(provider.name, provider); return this; }
  registerLlm(provider: TutorLLMProvider) { this.llm.set(provider.name, provider); return this; }
  registerTts(provider: TextToSpeechProvider) { this.tts.set(provider.name, provider); return this; }

  selectedStt(language?: LanguageCode) { return this.require(this.stt, language ? this.config.providers.sttByLanguage[language].name : this.config.providers.stt.name); }
  selectedLlm() { return this.require(this.llm, this.config.providers.llm.name); }
  selectedTts(language?: LanguageCode) { return this.require(this.tts, language ? this.config.providers.ttsByLanguage[language].name : this.config.providers.tts.name); }

  private require<T>(registry: Map<string, T>, name: string) {
    const provider = registry.get(name);
    if (!provider) throw new AiError("AI_PROVIDER_NOT_CONFIGURED", `AI provider '${name}' is not registered.`, { retryable: false });
    return provider;
  }

  transcribe(input: SpeechToTextInput, context: ContextWithoutSignal) {
    return runProvider(this.selectedStt(input.language), input, context, "AI_STT_FAILED");
  }

  generate(input: TutorLlmInput, context: ContextWithoutSignal) {
    return runProvider(this.selectedLlm(), input, context, "AI_LLM_FAILED");
  }

  synthesize(input: TextToSpeechInput, context: ContextWithoutSignal) {
    return runProvider(this.selectedTts(input.language), input, context, "AI_TTS_FAILED");
  }

  async health() {
    const providers = [
      this.selectedStt("uz"), this.selectedStt("zh-CN"), this.selectedLlm(),
      this.selectedTts("uz"), this.selectedTts("zh-CN"),
    ].filter((provider, index, values) => values.indexOf(provider) === index);
    return Promise.all(providers.map((provider) => provider.healthCheck()));
  }
}

export function createProviderManager(config: AiConfig) {
  const legacyOpenAi = {
    providerName: "openai",
    apiKey: config.external.openAiApiKey,
    baseUrl: config.external.openAiBaseUrl,
    timeoutMs: config.limits.providerTimeoutMs,
    maxRetries: config.limits.providerMaxRetries,
  };
  const compatibleLlm = {
    apiKey: config.external.llmApiKey,
    baseUrl: config.external.llmBaseUrl,
    timeoutMs: config.limits.providerTimeoutMs,
    maxRetries: config.limits.providerMaxRetries,
    model: config.providers.llm.model,
  };
  const fasterWhisper = new WorkerSpeechToTextProvider({
    name: "faster_whisper",
    model: config.providers.sttByLanguage.uz.model || config.providers.stt.model,
    workerUrl: config.external.sttWorkerUrl,
    timeoutMs: config.limits.workerTimeoutMs,
    maxRetries: config.limits.providerMaxRetries,
  });
  const funAsr = new WorkerSpeechToTextProvider({
    name: "funasr",
    model: config.providers.sttByLanguage["zh-CN"].model || "fun-asr-nano",
    workerUrl: config.external.sttWorkerUrl,
    timeoutMs: config.limits.workerTimeoutMs,
    maxRetries: 0,
  });
  const funAsrWithFallback = new FallbackSpeechToTextProvider(funAsr, fasterWhisper);
  const externalTts = {
    providerName: "external",
    apiKey: config.external.ttsApiKey,
    baseUrl: config.external.ttsBaseUrl,
    timeoutMs: config.limits.providerTimeoutMs,
    maxRetries: config.limits.providerMaxRetries,
    model: config.providers.tts.model,
    voice: config.external.ttsVoice,
  };
  const externalTtsProvider = new OpenAiTextToSpeechProvider(externalTts);
  const cosyVoice = new WorkerTextToSpeechProvider({ name: "cosyvoice", model: config.providers.ttsByLanguage["zh-CN"].model || "cosyvoice", workerUrl: config.external.ttsWorkerUrl, timeoutMs: config.limits.workerTimeoutMs, maxRetries: 0 });
  return new AiProviderManager(config)
    .registerStt(new MockSpeechToTextProvider(config.providers.stt.name === "mock" ? config.providers.stt.model : "mock-stt-v1"))
    .registerLlm(new MockTutorLlmProvider(config.providers.llm.name === "mock" ? config.providers.llm.model : "mock-llm-v1"))
    .registerTts(new MockTextToSpeechProvider(config.providers.tts.name === "mock" ? config.providers.tts.model : "mock-tts-v1"))
    .registerStt(new OpenAiSpeechToTextProvider({ ...legacyOpenAi, model: config.providers.stt.model }))
    .registerStt(fasterWhisper)
    .registerStt(funAsrWithFallback)
    .registerLlm(new OpenAiTutorLlmProvider({ ...legacyOpenAi, model: config.providers.llm.model }))
    .registerLlm(new OpenAiTutorLlmProvider({ ...compatibleLlm, providerName: "openai_compatible" }))
    .registerLlm(new OpenAiTutorLlmProvider({ ...compatibleLlm, providerName: "gemini" }))
    .registerTts(new OpenAiTextToSpeechProvider({ ...legacyOpenAi, model: config.providers.tts.model, voice: config.external.ttsVoice }))
    .registerTts(externalTtsProvider)
    .registerTts(new FallbackTextToSpeechProvider(cosyVoice, externalTtsProvider))
    .registerTts(new DisabledTextToSpeechProvider());
}
