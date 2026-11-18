import responseJsonSchema from "@/ai/schemas/ai-tutor-response.v1.schema.json";
import { prisma } from "@/src/server/db";
import { nextStreakState } from "@/src/server/services/progress-service";
import type { AiConfig } from "../config/ai-config";
import { getAiConfig } from "../config/ai-config";
import { AiError, normalizeAiError } from "../errors/ai-error";
import { normalizeLanguageText, resolveDirection, type TutorDirection } from "../languages/registry";
import { buildMemorySummary, getOrCreateTutorMemory, getTutorMemoryContext, listTutorMemories } from "../memory/memory-service";
import { compileTutorPrompt } from "../prompts/prompt-manager";
import { createProviderManager, type AiProviderManager } from "../providers/provider-manager";
import type { AiProviderType, ProviderExecutionResult, ProviderUsage } from "../providers/contracts";
import { createAiSessionSchema, type CreateAiSessionInput, type TutorLevel, type TutorTopic } from "../schemas/requests";
import { aiTutorResponseSchema, parseTutorResponse, type AiTutorResponse } from "../schemas/response";
import { AiTelemetryService } from "../telemetry/telemetry-service";

type SessionForOwnership = { userId: string };
const MAX_INLINE_TTS_BYTES = 2 * 1024 * 1024;

function inlineAudioUrl(audio: Uint8Array | null, mimeType: string | null) {
  if (!audio || !mimeType || audio.byteLength > MAX_INLINE_TTS_BYTES) return null;
  return `data:${mimeType};base64,${Buffer.from(audio).toString("base64")}`;
}

export function assertAiSessionOwner<T extends SessionForOwnership>(session: T | null, userId: string): asserts session is T {
  if (!session) throw new AiError("AI_SESSION_NOT_FOUND", "AI session was not found.", { retryable: false });
  if (session.userId !== userId) throw new AiError("AI_SESSION_FORBIDDEN", "You cannot access this AI session.", { retryable: false });
}

export function calculateTutorRewards(score: number) {
  if (score < 40) return { xp: 0, coins: 0 };
  return { xp: Math.min(10, Math.max(1, Math.round(score / 10))), coins: score >= 90 ? 3 : score >= 75 ? 2 : 1 };
}

function uniqueRecent(values: string[], next: string, limit: number) {
  return next ? [next, ...values.filter((value) => value !== next)].slice(0, limit) : values.slice(0, limit);
}

type MessageInput = {
  clientMessageId: string;
  text?: string;
  audio?: { bytes: Uint8Array; fileName: string; mimeType: string };
  direction?: TutorDirection;
  level?: TutorLevel;
  topic?: TutorTopic;
};

export class ConversationEngine {
  private readonly telemetry: AiTelemetryService;

  constructor(
    private readonly config: AiConfig,
    private readonly providers: AiProviderManager,
  ) {
    this.telemetry = new AiTelemetryService(config);
  }

  private ensureTutorEnabled() {
    if (!this.config.flags.assistant || !this.config.flags.tutor) {
      throw new AiError("AI_FEATURE_DISABLED", "AI Tutor is disabled.", { retryable: false });
    }
  }

  async createSession(userId: string, rawInput: CreateAiSessionInput) {
    this.ensureTutorEnabled();
    const input = createAiSessionSchema.parse(rawInput);
    const direction = resolveDirection(input.direction);
    const session = await prisma.aiAssistantSession.create({
      data: {
        userId,
        feature: "tutor",
        direction: direction.id,
        nativeLanguage: direction.nativeLanguage,
        targetLanguage: direction.targetLanguage,
        level: input.level,
        topic: input.topic,
      },
    });
    await getOrCreateTutorMemory({
      userId,
      direction: direction.id,
      nativeLanguage: direction.nativeLanguage,
      targetLanguage: direction.targetLanguage,
      level: input.level,
    });
    return session;
  }

  async getSession(userId: string, sessionId: string) {
    this.ensureTutorEnabled();
    const session = await prisma.aiAssistantSession.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    assertAiSessionOwner(session, userId);
    return session;
  }

  async listHistory(userId: string) {
    this.ensureTutorEnabled();
    return prisma.aiAssistantSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
    });
  }

  async getMemory(userId: string) {
    this.ensureTutorEnabled();
    return listTutorMemories(userId);
  }

  async finishSession(userId: string, sessionId: string) {
    this.ensureTutorEnabled();
    const session = await prisma.aiAssistantSession.findUnique({ where: { id: sessionId } });
    assertAiSessionOwner(session, userId);
    if (session.status === "FINISHED") return session;
    return prisma.aiAssistantSession.update({
      where: { id: sessionId },
      data: { status: "FINISHED", finishedAt: new Date() },
    });
  }

  private async recordProviderCall(input: {
    type: AiProviderType;
    providerName: string;
    model: string;
    success: boolean;
    latencyMs: number;
    errorCode?: string;
    requestId: string;
    sessionId: string;
    userId: string;
    usage?: ProviderUsage;
  }) {
    await this.telemetry.record({
      providerType: input.type,
      providerName: input.providerName,
      model: input.model,
      success: input.success,
      latencyMs: input.latencyMs,
      errorCode: input.errorCode,
      requestId: input.requestId,
      sessionId: input.sessionId,
      userId: input.userId,
      usage: input.usage ?? { inputUnits: null, outputUnits: null },
    });
  }

  private async trackedCall<T>(input: {
    type: AiProviderType;
    providerName: string;
    model: string;
    requestId: string;
    sessionId: string;
    userId: string;
    fallbackCode: "AI_STT_FAILED" | "AI_LLM_FAILED" | "AI_TTS_FAILED";
    action: () => Promise<ProviderExecutionResult<T>>;
  }) {
    const started = Date.now();
    try {
      const result = await input.action();
      await this.recordProviderCall({ ...input, success: true, latencyMs: result.latencyMs, usage: result.usage });
      return result;
    } catch (error) {
      const normalized = normalizeAiError(error, input.fallbackCode);
      await this.recordProviderCall({ ...input, success: false, latencyMs: Date.now() - started, errorCode: normalized.code });
      throw normalized;
    }
  }

  async processMessage(userId: string, sessionId: string, requestId: string, input: MessageInput): Promise<AiTutorResponse> {
    this.ensureTutorEnabled();
    const started = Date.now();
    const session = await prisma.aiAssistantSession.findUnique({ where: { id: sessionId } });
    assertAiSessionOwner(session, userId);
    if (session.status !== "ACTIVE") throw new AiError("AI_SESSION_NOT_FOUND", "AI session is not active.", { retryable: false });
    if (input.direction && input.direction !== session.direction) throw new AiError("AI_INVALID_RESPONSE", "Message direction does not match the session.", { retryable: false });
    if (input.level && input.level !== session.level) throw new AiError("AI_INVALID_RESPONSE", "Message level does not match the session.", { retryable: false });
    if (input.topic && input.topic !== session.topic) throw new AiError("AI_INVALID_RESPONSE", "Message topic does not match the session.", { retryable: false });

    const existing = await prisma.aiAssistantMessage.findUnique({
      where: { sessionId_clientMessageId: { sessionId, clientMessageId: input.clientMessageId } },
    });
    if (existing?.responseJson) return aiTutorResponseSchema.parse(JSON.parse(existing.responseJson));
    const messageCount = await prisma.aiAssistantMessage.count({ where: { sessionId, role: "USER" } });
    if (messageCount >= this.config.limits.maxMessagesPerSession) throw new AiError("AI_RATE_LIMITED", "Session message limit reached.", { retryable: false });

    const direction = resolveDirection(session.direction);
    const contextBase = { requestId, userId, sessionId };
    let sttMs = 0;
    let recognizedText = input.text?.trim() ?? "";
    let sttProviderName = "text";
    let sttModel = "text-fallback";
    if (input.audio) {
      const provider = this.providers.selectedStt(direction.targetLanguage);
      const result = await this.trackedCall({
        type: "stt",
        providerName: provider.name,
        model: provider.model,
        ...contextBase,
        fallbackCode: "AI_STT_FAILED",
        action: () => this.providers.transcribe({
          audio: input.audio!.bytes,
          fileName: input.audio!.fileName,
          mimeType: input.audio!.mimeType,
          language: direction.targetLanguage,
          textFallback: input.text,
        }, contextBase),
      });
      recognizedText = result.data.text.trim();
      sttMs = result.latencyMs;
      sttProviderName = provider.name;
      sttModel = provider.model;
    }
    if (!recognizedText) throw new AiError("AI_STT_FAILED", "No speech or text was recognized.", { retryable: false });
    recognizedText = normalizeLanguageText(direction.targetLanguage, recognizedText);

    const userMessage = existing ?? await prisma.aiAssistantMessage.create({
      data: { sessionId, clientMessageId: input.clientMessageId, role: "USER", recognizedText },
    });
    const memory = await getTutorMemoryContext(userId, direction.id)
      ?? { memory: await getOrCreateTutorMemory({ userId, direction: direction.id, nativeLanguage: direction.nativeLanguage, targetLanguage: direction.targetLanguage, level: session.level as TutorLevel }), weakTopics: [], frequentMistakes: [], recentTopics: [], learnedWords: [] };
    const historyRows = await prisma.aiAssistantMessage.findMany({ where: { sessionId }, orderBy: { createdAt: "desc" }, take: 8 });
    const prompt = await compileTutorPrompt({
      direction: direction.id,
      nativeLanguage: direction.nativeLanguage,
      targetLanguage: direction.targetLanguage,
      level: session.level as TutorLevel,
      topic: session.topic as TutorTopic,
      history: historyRows.reverse().map((message) => ({ role: message.role, text: message.teacherReply ?? message.recognizedText ?? "" })),
      memorySummary: memory.memory.summary,
      weakTopics: memory.weakTopics,
      learnedWords: memory.learnedWords,
      recognizedText,
    });

    const llmProvider = this.providers.selectedLlm();
    const llmRequest = {
      systemPrompt: prompt.systemPrompt,
      userPrompt: prompt.userPrompt,
      recognizedText,
      responseSchema: responseJsonSchema as Record<string, unknown>,
    };
    let llmMs = 0;
    let llmRaw = "";
    const firstLlm = await this.trackedCall({
      type: "llm", providerName: llmProvider.name, model: llmProvider.model, ...contextBase,
      fallbackCode: "AI_LLM_FAILED", action: () => this.providers.generate(llmRequest, contextBase),
    });
    llmMs += firstLlm.latencyMs;
    llmRaw = firstLlm.data.rawText;
    let candidate: AiTutorResponse;
    try {
      candidate = parseTutorResponse(llmRaw);
    } catch {
      const repaired = await this.trackedCall({
        type: "llm", providerName: llmProvider.name, model: llmProvider.model, ...contextBase,
        fallbackCode: "AI_LLM_FAILED",
        action: () => this.providers.generate({ ...llmRequest, repairSource: llmRaw }, contextBase),
      });
      llmMs += repaired.latencyMs;
      try {
        candidate = parseTutorResponse(repaired.data.rawText);
      } catch (error) {
        throw new AiError("AI_INVALID_RESPONSE", "LLM response remained invalid after one repair attempt.", { retryable: false, cause: error });
      }
    }

    const ttsProvider = this.providers.selectedTts(direction.targetLanguage);
    let ttsMs = 0;
    let audioUrl: string | null = null;
    try {
      const tts = await this.trackedCall({
        type: "tts", providerName: ttsProvider.name, model: ttsProvider.model, ...contextBase,
        fallbackCode: "AI_TTS_FAILED",
        action: () => this.providers.synthesize({ text: candidate.teacherReply, language: direction.targetLanguage, voice: this.config.external.ttsVoice }, contextBase),
      });
      ttsMs = tts.latencyMs;
      audioUrl = tts.data.audioUrl ?? inlineAudioUrl(tts.data.audio, tts.data.mimeType);
    } catch {
      // Text result remains valid when optional TTS is unavailable.
    }

    const rewards = calculateTutorRewards(candidate.score);
    const result = aiTutorResponseSchema.parse({
      ...candidate,
      recognizedText,
      xp: rewards.xp,
      coins: rewards.coins,
      achievements: [],
      audioUrl,
      latency: { sttMs, llmMs, ttsMs, totalMs: Date.now() - started },
      provider: { stt: sttProviderName, llm: llmProvider.name, tts: ttsProvider.name },
      model: { stt: sttModel, llm: llmProvider.model, tts: ttsProvider.model },
      version: "1",
    });

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId }, include: { preference: true } });
    const now = new Date();
    const streak = nextStreakState(user.lastActivityDate, now, user.preference?.timezone ?? "Asia/Tashkent", user.streak, user.longestStreak);
    const correctionChanged = result.correctedText.trim() !== result.recognizedText.trim();
    const weakTopics = uniqueRecent(memory.weakTopics, correctionChanged ? result.grammarTopic : "", 20);
    const frequentMistakes = uniqueRecent(
      memory.frequentMistakes,
      correctionChanged ? `${result.recognizedText} → ${result.correctedText}`.slice(0, 500) : "",
      20,
    );
    const recentTopics = uniqueRecent(memory.recentTopics, session.topic, 12);
    const learnedWords = [...result.newWords.map((word) => word.word), ...memory.learnedWords]
      .filter((word, index, values) => word && values.indexOf(word) === index)
      .slice(0, 30);
    const summary = buildMemorySummary({ level: session.level, weakTopics, frequentMistakes, recentTopics, learnedWords });

    // Batch form only: Cloudflare D1 rejects interactive transactions.
    const learnedWordWrites = result.newWords.flatMap((word) => {
      const normalizedWord = word.word.normalize("NFKC").trim().toLocaleLowerCase();
      if (!normalizedWord) return [];
      return [prisma.aiLearnedWord.upsert({
        where: { memoryId_language_normalizedWord: { memoryId: memory.memory.id, language: word.language, normalizedWord } },
        update: { word: word.word, translation: word.translation, timesSeen: { increment: 1 }, lastSeenAt: now },
        create: { memoryId: memory.memory.id, word: word.word, normalizedWord, translation: word.translation, language: word.language },
      })];
    });
    await prisma.$transaction([
        prisma.aiAssistantMessage.update({ where: { id: userMessage.id }, data: { recognizedText, responseJson: JSON.stringify(result) } }),
        prisma.aiAssistantMessage.create({
          data: {
            sessionId, role: "ASSISTANT", correctedText: result.correctedText, translation: result.translation,
            grammarExplanation: result.grammarExplanation, teacherReply: result.teacherReply, nextQuestion: result.nextQuestion,
            score: result.score, xp: result.xp, coins: result.coins, audioUrl: result.audioUrl, responseJson: JSON.stringify(result),
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { xp: { increment: result.xp }, streak: streak.streak, longestStreak: streak.longestStreak, lastActivityDate: now },
        }),
        prisma.aiTutorMemory.update({
          where: { id: memory.memory.id },
          data: {
            level: session.level,
            summary,
            weakTopicsJson: JSON.stringify(weakTopics),
            frequentMistakesJson: JSON.stringify(frequentMistakes),
            recentTopicsJson: JSON.stringify(recentTopics),
            coins: { increment: result.coins },
            lastSessionId: sessionId,
            lastLessonAt: now,
          },
        }),
        ...learnedWordWrites,
    ]);
    return result;
  }

  async providerHealth() {
    this.ensureTutorEnabled();
    return this.providers.health();
  }
}

export function createConversationEngine() {
  const config = getAiConfig();
  return new ConversationEngine(config, createProviderManager(config));
}
