export type AiFeatureFlags = {
  assistant: boolean;
  tutor: boolean;
  translation: boolean;
  grammar: boolean;
  pronunciation: boolean;
  vocabulary: boolean;
  offline: boolean;
  localStt: boolean;
  localTts: boolean;
};

export function readBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined || value.trim() === "") return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return fallback;
}

export function getAiFeatureFlags(env: NodeJS.ProcessEnv = process.env): AiFeatureFlags {
  return {
    assistant: readBoolean(env.ENABLE_AI_ASSISTANT, false),
    tutor: readBoolean(env.ENABLE_AI_TUTOR, false),
    translation: readBoolean(env.ENABLE_AI_TRANSLATION, false),
    grammar: readBoolean(env.ENABLE_AI_GRAMMAR, false),
    pronunciation: readBoolean(env.ENABLE_AI_PRONUNCIATION, false),
    vocabulary: readBoolean(env.ENABLE_AI_VOCABULARY, false),
    offline: readBoolean(env.ENABLE_AI_OFFLINE, false),
    localStt: readBoolean(env.ENABLE_AI_LOCAL_STT, false),
    localTts: readBoolean(env.ENABLE_AI_LOCAL_TTS, false),
  };
}
