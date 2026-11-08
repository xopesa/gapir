import { z } from "zod";
import { AiError } from "../errors/ai-error";

export const aiTutorResponseSchema = z.object({
  recognizedText: z.string().max(4000),
  correctedText: z.string().max(4000),
  translation: z.string().max(4000),
  grammarExplanation: z.string().max(6000),
  teacherReply: z.string().min(1).max(4000),
  nextQuestion: z.string().max(2000),
  newWords: z.array(z.object({
    word: z.string().min(1).max(200),
    translation: z.string().min(1).max(500),
    language: z.enum(["uz", "zh-CN"]),
  }).strict()).max(5),
  pronunciationTips: z.array(z.string().max(1000)).max(5),
  grammarTopic: z.string().max(300),
  score: z.number().int().min(0).max(100),
  xp: z.number().int().min(0).max(1000),
  coins: z.number().int().min(0).max(1000),
  achievements: z.array(z.string().max(100)).max(10),
  audioUrl: z.string().url().max(3_000_000).nullable(),
  latency: z.object({
    sttMs: z.number().int().min(0),
    llmMs: z.number().int().min(0),
    ttsMs: z.number().int().min(0),
    totalMs: z.number().int().min(0),
  }).strict(),
  provider: z.object({ stt: z.string().max(200), llm: z.string().max(200), tts: z.string().max(200) }).strict(),
  model: z.object({ stt: z.string().max(300), llm: z.string().max(300), tts: z.string().max(300) }).strict(),
  version: z.literal("1"),
}).strict();

export type AiTutorResponse = z.infer<typeof aiTutorResponseSchema>;

export function createSafeTutorResponse(input?: Partial<AiTutorResponse>): AiTutorResponse {
  return aiTutorResponseSchema.parse({
    recognizedText: "",
    correctedText: "",
    translation: "",
    grammarExplanation: "",
    teacherReply: "Please try again.",
    nextQuestion: "",
    newWords: [],
    pronunciationTips: [],
    grammarTopic: "",
    score: 0,
    xp: 0,
    coins: 0,
    achievements: [],
    audioUrl: null,
    latency: { sttMs: 0, llmMs: 0, ttsMs: 0, totalMs: 0 },
    provider: { stt: "", llm: "", tts: "" },
    model: { stt: "", llm: "", tts: "" },
    version: "1",
    ...input,
  });
}

export function extractJsonObject(raw: string) {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const source = (fenced ?? raw).trim();
  const start = source.indexOf("{");
  if (start < 0) throw new AiError("AI_INVALID_RESPONSE", "LLM response does not contain JSON.", { retryable: false });
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new AiError("AI_INVALID_RESPONSE", "LLM JSON is incomplete.", { retryable: false });
}

export function parseTutorResponse(raw: string) {
  try {
    const parsed = JSON.parse(extractJsonObject(raw)) as unknown;
    return aiTutorResponseSchema.parse(parsed);
  } catch (error) {
    if (error instanceof AiError) throw error;
    throw new AiError("AI_INVALID_RESPONSE", "LLM response failed schema validation.", { retryable: false, cause: error });
  }
}
