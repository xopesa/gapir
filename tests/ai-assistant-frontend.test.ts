import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { en } from "../src/i18n/dictionaries/en";
import { ru } from "../src/i18n/dictionaries/ru";
import { getPublicAiFlags } from "../src/server/ai/config/public-flags";
import { AiAssistantApiError, AiAssistantClient, createSubmissionGate } from "../src/features/ai-assistant/api/ai-assistant-client";
import type { AiMessage, AiSession, AiTutorResponse } from "../src/features/ai-assistant/types";
import { DIRECTIONS, LEVELS, MAX_AUDIO_BYTES, MAX_AUDIO_DURATION_MS, TOPICS, groupChatTurns, localizedAiError, microphoneErrorKind, parseTutorResponse, summarizeSession, visibleResponseSections } from "../src/features/ai-assistant/utils";

const response: AiTutorResponse = {
  recognizedText: "你好", correctedText: "你好", translation: "Salom", grammarExplanation: "", teacherReply: "你好！", nextQuestion: "你好吗？",
  newWords: [{ word: "你好", translation: "Salom", language: "zh-CN" }], pronunciationTips: ["nǐ hǎo"], grammarTopic: "greeting", score: 85, xp: 9, coins: 2,
  achievements: [], audioUrl: null, version: "1",
};

function json(value: unknown, status = 200) { return new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json" } }); }
function message(overrides: Partial<AiMessage> = {}): AiMessage { return { id: "m1", role: "ASSISTANT", recognizedText: null, correctedText: null, translation: null, grammarExplanation: null, teacherReply: "hello", nextQuestion: null, score: 80, xp: 8, coins: 2, audioUrl: null, responseJson: JSON.stringify(response), createdAt: new Date().toISOString(), ...overrides }; }
function session(messages: AiMessage[] = []): AiSession { return { id: "s1", feature: "tutor", direction: "uz_to_zh", nativeLanguage: "uz", targetLanguage: "zh-CN", level: "beginner", topic: "greeting", status: "ACTIVE", startedAt: new Date().toISOString(), finishedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), messages }; }

describe("Stage 3.2 public feature flags", () => {
  it("hides the assistant when its flag is disabled", () => expect(getPublicAiFlags({ NODE_ENV: "development" }).assistantEnabled).toBe(false));
  it("keeps the assistant available while disabling Tutor independently", () => expect(getPublicAiFlags({ ENABLE_AI_ASSISTANT: "true", ENABLE_AI_TUTOR: "false", NODE_ENV: "development" })).toMatchObject({ assistantEnabled: true, tutorEnabled: false }));
  it("shows Mock AI only outside production with all mock providers", () => expect(getPublicAiFlags({ ENABLE_AI_ASSISTANT: "true", ENABLE_AI_TUTOR: "true", AI_STT_PROVIDER: "mock", AI_LLM_PROVIDER: "mock", AI_TTS_PROVIDER: "mock", NODE_ENV: "development" }).mockMode).toBe(true));
  it("never shows Mock AI in production", () => expect(getPublicAiFlags({ ENABLE_AI_ASSISTANT: "true", ENABLE_AI_TUTOR: "true", NODE_ENV: "production" }).mockMode).toBe(false));
});

describe("Tutor setup", () => {
  it("offers both supported directions", () => expect(DIRECTIONS).toEqual(["uz_to_zh", "zh_to_uz"]));
  it("offers all levels and topics", () => { expect(LEVELS).toHaveLength(3); expect(TOPICS).toHaveLength(6); });
  it("blocks a duplicate create submission", () => { const gate = createSubmissionGate(); expect(gate.enter()).toBe(true); expect(gate.enter()).toBe(false); gate.leave(); expect(gate.enter()).toBe(true); });
  it("sends a typed session creation request", async () => {
    const fetcher = vi.fn(async (_input, init) => { expect(init?.method).toBe("POST"); expect(JSON.parse(String(init?.body))).toEqual({ direction: "uz_to_zh", level: "beginner", topic: "greeting" }); return json({ session: session() }, 201); }) as unknown as typeof fetch;
    const created = await new AiAssistantClient(fetcher).createSession({ direction: "uz_to_zh", level: "beginner", topic: "greeting" });
    expect(created.id).toBe("s1");
  });
});

describe("Typed chat client", () => {
  it("calls the browser fetch function without an illegal receiver", async () => {
    const browserLikeFetch = vi.fn(async function (this: unknown) { expect(this).toBeUndefined(); return json({ memories: [] }); }) as unknown as typeof fetch;
    await expect(new AiAssistantClient(browserLikeFetch).memory()).resolves.toEqual([]);
  });
  it("restores a session from its id", async () => { const fetcher = vi.fn(async (input) => { expect(String(input)).toContain("/sessions/s1"); return json({ session: session() }); }) as unknown as typeof fetch; expect((await new AiAssistantClient(fetcher).getSession("s1")).id).toBe("s1"); });
  it("does not send surrounding whitespace in text", async () => { const fetcher = vi.fn(async (_input, init) => { expect(JSON.parse(String(init?.body)).text).toBe("你好"); return json(response); }) as unknown as typeof fetch; await new AiAssistantClient(fetcher).sendText("s1", "  你好  "); });
  it("uses multipart form data for a voice message", async () => { const fetcher = vi.fn(async (_input, init) => { expect(init?.body).toBeInstanceOf(FormData); expect((init?.body as FormData).get("durationMs")).toBe("900"); return json(response); }) as unknown as typeof fetch; await new AiAssistantClient(fetcher).sendAudio("s1", { blob: new Blob(["audio"], { type: "audio/webm" }), mimeType: "audio/webm", durationMs: 900, fileName: "voice.webm" }); });
  it("maps an unauthorized response to a typed error", async () => { const fetcher = vi.fn(async () => json({ error: { code: "UNAUTHORIZED", message: "No" } }, 401)) as unknown as typeof fetch; await expect(new AiAssistantClient(fetcher).history()).rejects.toMatchObject({ code: "UNAUTHORIZED", status: 401 }); });
  it("aborts on frontend timeout and allows a later retry", async () => { const stuck = vi.fn((_input, init) => new Promise<Response>((_resolve, reject) => init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError"))))) as unknown as typeof fetch; await expect(new AiAssistantClient(stuck, 5).memory()).rejects.toMatchObject({ code: "AI_TIMEOUT" }); const ok = vi.fn(async () => json({ memories: [] })) as unknown as typeof fetch; await expect(new AiAssistantClient(ok).memory()).resolves.toEqual([]); });
});

describe("Response, errors and summaries", () => {
  it("hides correction when recognized and corrected text are equal", () => expect(visibleResponseSections(response).corrected).toBeNull());
  it("shows correction when the text changed", () => expect(visibleResponseSections({ ...response, correctedText: "您好" }).corrected).toBe("您好"));
  it("hides empty blocks and keeps valid score", () => { const sections = visibleResponseSections(response); expect(sections.explanation).toBeNull(); expect(sections.score).toBe(85); });
  it("rejects an out-of-range score from the view model", () => expect(visibleResponseSections({ ...response, score: 101 }).score).toBeNull());
  it("parses a stored versioned AI response safely", () => expect(parseTutorResponse(message())?.teacherReply).toBe("你好！"));
  it("does not render malformed stored JSON", () => expect(parseTutorResponse(message({ responseJson: "{" }))).toBeNull());
  it("maps backend and microphone errors to localized messages", () => { expect(localizedAiError(new AiAssistantApiError("AI_RATE_LIMITED", "", 429), ru)).toBe(ru.aiAssistant.errors.rateLimited); expect(microphoneErrorKind(new DOMException("denied", "NotAllowedError"))).toBe("denied"); });
  it("summarizes rewards from assistant messages only", () => { const result = summarizeSession(session([message(), message({ id: "u", role: "USER", xp: 100, coins: 100 })])); expect(result).toEqual({ messageCount: 2, xp: 8, coins: 2 }); });
  it("supports empty history and memory responses", async () => { const fetcher = vi.fn(async (input) => json(String(input).endsWith("history") ? { sessions: [] } : { memories: [] })) as unknown as typeof fetch; const client = new AiAssistantClient(fetcher); expect(await client.history()).toEqual([]); expect(await client.memory()).toEqual([]); });
  it("contains complete English localization keys", () => expect(Object.keys(en.aiAssistant.errors)).toEqual(Object.keys(ru.aiAssistant.errors)));
  it("groups each assistant answer with the user message it evaluates", () => {
    const user = message({ id: "u1", role: "USER", responseJson: null });
    const assistant = message({ id: "a1" });
    expect(groupChatTurns([user, assistant])).toEqual([{ id: "turn-u1", user, assistant }]);
  });
  it("keeps a leading assistant prompt as its own chat turn", () => {
    const assistant = message({ id: "a1" });
    expect(groupChatTurns([assistant])).toEqual([{ id: "turn-a1", user: null, assistant }]);
  });
});

describe("Voice and responsive safety", () => {
  it("keeps the frontend voice limits aligned with Stage 3.1 defaults", () => { expect(MAX_AUDIO_DURATION_MS).toBe(60_000); expect(MAX_AUDIO_BYTES).toBe(15 * 1024 * 1024); });
  it("keeps the mobile chat viewport above navigation and safe areas", () => { const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8"); expect(css).toContain("height: calc(100dvh - 168px - env(safe-area-inset-top) - env(safe-area-inset-bottom))"); expect(css).toContain("@media (max-width: 420px)"); });
});
