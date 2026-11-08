import type { AppDictionary } from "@/src/types/app";
import { AiAssistantApiError } from "./api/ai-assistant-client";
import type { AiMessage, AiSession, AiTutorResponse } from "./types";

export type AiChatTurn<T extends AiMessage = AiMessage> = {
  id: string;
  user: T | null;
  assistant: T | null;
};

export const DIRECTIONS = ["uz_to_zh", "zh_to_uz"] as const;
export const LEVELS = ["beginner", "intermediate", "advanced"] as const;
export const TOPICS = ["free_conversation", "greeting", "shopping", "restaurant", "travel", "work"] as const;
export const MAX_AUDIO_BYTES = 15 * 1024 * 1024;
export const MAX_AUDIO_DURATION_MS = 60_000;

export function localizedAiError(error: unknown, dictionary: AppDictionary) {
  const code = error instanceof AiAssistantApiError ? error.code : "UNKNOWN";
  const messages: Record<string, string> = {
    UNAUTHORIZED: dictionary.aiAssistant.errors.unauthorized,
    VALIDATION_ERROR: dictionary.aiAssistant.errors.validation,
    AI_FEATURE_DISABLED: dictionary.aiAssistant.errors.featureDisabled,
    AI_PROVIDER_NOT_CONFIGURED: dictionary.aiAssistant.errors.provider,
    AI_STT_FAILED: dictionary.aiAssistant.errors.stt,
    AI_LLM_FAILED: dictionary.aiAssistant.errors.provider,
    AI_TTS_FAILED: dictionary.aiAssistant.errors.provider,
    AI_INVALID_RESPONSE: dictionary.aiAssistant.errors.invalidResponse,
    AI_AUDIO_TOO_LARGE: dictionary.aiAssistant.errors.audioTooLarge,
    AI_AUDIO_TOO_LONG: dictionary.aiAssistant.errors.audioTooLong,
    AI_AUDIO_UNSUPPORTED: dictionary.aiAssistant.errors.audioUnsupported,
    AI_RATE_LIMITED: dictionary.aiAssistant.errors.rateLimited,
    AI_TIMEOUT: dictionary.aiAssistant.errors.timeout,
    AI_SESSION_NOT_FOUND: dictionary.aiAssistant.errors.sessionNotFound,
    AI_SESSION_FORBIDDEN: dictionary.aiAssistant.errors.forbidden,
  };
  return messages[code] ?? dictionary.aiAssistant.errors.generic;
}

export function parseTutorResponse(message: AiMessage): AiTutorResponse | null {
  if (!message.responseJson) return null;
  try {
    const value = JSON.parse(message.responseJson) as AiTutorResponse;
    return value && value.version === "1" ? value : null;
  } catch {
    return null;
  }
}

export function visibleResponseSections(response: AiTutorResponse) {
  return {
    recognized: response.recognizedText.trim() || null,
    corrected: response.correctedText.trim() && response.correctedText.trim() !== response.recognizedText.trim() ? response.correctedText.trim() : null,
    translation: response.translation.trim() || null,
    explanation: response.grammarExplanation.trim() || null,
    teacher: response.teacherReply.trim() || null,
    nextQuestion: response.nextQuestion.trim() || null,
    newWords: response.newWords.filter((word) => word.word.trim() && word.translation.trim()),
    pronunciation: response.pronunciationTips.filter((tip) => tip.trim()),
    score: Number.isInteger(response.score) && response.score >= 0 && response.score <= 100 ? response.score : null,
  };
}

export function groupChatTurns<T extends AiMessage>(messages: T[]): AiChatTurn<T>[] {
  const turns: AiChatTurn<T>[] = [];

  for (const message of messages) {
    if (message.role === "USER") {
      turns.push({ id: `turn-${message.id}`, user: message, assistant: null });
      continue;
    }

    const currentTurn = turns.at(-1);
    if (currentTurn && !currentTurn.assistant) {
      currentTurn.assistant = message;
    } else {
      turns.push({ id: `turn-${message.id}`, user: null, assistant: message });
    }
  }

  return turns;
}

export function summarizeSession(session: AiSession) {
  const messages = session.messages ?? [];
  return {
    messageCount: messages.length,
    xp: messages.reduce((sum, message) => sum + (message.role === "ASSISTANT" ? message.xp : 0), 0),
    coins: messages.reduce((sum, message) => sum + (message.role === "ASSISTANT" ? message.coins : 0), 0),
  };
}

export function microphoneErrorKind(error: unknown) {
  return error instanceof DOMException && ["NotAllowedError", "SecurityError"].includes(error.name) ? "denied" : "failed";
}
