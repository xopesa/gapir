import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import type { TutorDirection } from "../languages/registry";
import type { TutorLevel, TutorTopic } from "../schemas/requests";

export type PromptContext = {
  direction: TutorDirection;
  nativeLanguage: string;
  targetLanguage: string;
  level: TutorLevel;
  topic: TutorTopic;
  history: Array<{ role: string; text: string }>;
  memorySummary: string;
  weakTopics: string[];
  learnedWords: string[];
  recognizedText: string;
};

export function selectTutorPromptPath(direction: TutorDirection, root = resolve(process.cwd(), "ai", "prompts")) {
  const selected = resolve(root, direction, "tutor", "v1.md");
  const safeRoot = `${resolve(root)}${sep}`;
  if (!selected.startsWith(safeRoot)) throw new Error("PROMPT_PATH_INVALID");
  return selected;
}

function escapePromptValue(value: unknown) {
  return JSON.stringify(value).replace(/<\/(user_context|conversation_history)>/gi, "");
}

export async function compileTutorPrompt(context: PromptContext, root?: string) {
  const template = await readFile(selectTutorPromptPath(context.direction, root), "utf8");
  const history = context.history.slice(-8);
  const systemPrompt = template
    .replaceAll("{{NATIVE_LANGUAGE}}", context.nativeLanguage)
    .replaceAll("{{TARGET_LANGUAGE}}", context.targetLanguage)
    .replaceAll("{{LEVEL}}", context.level)
    .replaceAll("{{TOPIC}}", context.topic)
    .replaceAll("{{MEMORY_SUMMARY}}", escapePromptValue(context.memorySummary))
    .replaceAll("{{WEAK_TOPICS}}", escapePromptValue(context.weakTopics.slice(0, 8)))
    .replaceAll("{{LEARNED_WORDS}}", escapePromptValue(context.learnedWords.slice(0, 20)))
    .replaceAll("{{CONVERSATION_HISTORY}}", escapePromptValue(history));
  return {
    version: "tutor-v1",
    systemPrompt,
    userPrompt: `<user_context>${escapePromptValue({ recognizedText: context.recognizedText })}</user_context>`,
  };
}
