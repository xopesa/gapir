import { getAiConfig } from "./ai-config";
import { readBoolean } from "./feature-flags";

export type PublicAiFlags = {
  assistantEnabled: boolean;
  tutorEnabled: boolean;
  voiceInputEnabled: boolean;
  mockMode: boolean;
};

export function getPublicAiFlags(env: NodeJS.ProcessEnv = process.env): PublicAiFlags {
  const config = getAiConfig(env);
  const assistantEnabled = config.flags.assistant;
  const tutorEnabled = assistantEnabled && config.flags.tutor;
  return {
    assistantEnabled,
    tutorEnabled,
    voiceInputEnabled: tutorEnabled && readBoolean(env.ENABLE_AI_VOICE_INPUT, true),
    mockMode: env.NODE_ENV !== "production"
      && Object.values(config.providers.sttByLanguage).every((provider) => provider.name === "mock")
      && config.providers.llm.name === "mock"
      && Object.values(config.providers.ttsByLanguage).every((provider) => provider.name === "mock"),
  };
}
