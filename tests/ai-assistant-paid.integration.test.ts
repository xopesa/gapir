import responseJsonSchema from "@/ai/schemas/ai-tutor-response.v1.schema.json";
import { describe, expect, it } from "vitest";
import { getAiConfig } from "@/src/server/ai/config/ai-config";
import { compileTutorPrompt } from "@/src/server/ai/prompts/prompt-manager";
import { createProviderManager } from "@/src/server/ai/providers/provider-manager";
import { runProvider } from "@/src/server/ai/providers/provider-runner";
import { parseTutorResponse } from "@/src/server/ai/schemas/response";

const paid = process.env.RUN_PAID_AI_TESTS === "true";

describe.skipIf(!paid)("Gapir Stage 3.3 paid Gemini integration", () => {
  it.each([
    { direction: "uz_to_zh" as const, nativeLanguage: "uz" as const, targetLanguage: "zh-CN" as const, recognizedText: "你好" },
    { direction: "zh_to_uz" as const, nativeLanguage: "zh-CN" as const, targetLanguage: "uz" as const, recognizedText: "Salom" },
  ])("returns schema-valid tutor JSON for $direction", async (turn) => {
    const config = getAiConfig(process.env);
    expect(config.providers.llm.name).toBe("gemini");
    expect(config.external.llmApiKey).toBeTruthy();
    const provider = createProviderManager(config).selectedLlm();
    const prompt = await compileTutorPrompt({
      ...turn,
      level: "beginner",
      topic: "greeting",
      history: [],
      memorySummary: "{}",
      weakTopics: [],
      learnedWords: [],
    });
    const result = await runProvider(provider, {
      systemPrompt: prompt.systemPrompt,
      userPrompt: prompt.userPrompt,
      recognizedText: turn.recognizedText,
      responseSchema: responseJsonSchema as Record<string, unknown>,
    }, { requestId: `paid-${turn.direction}`, userId: "integration", sessionId: "integration" }, "AI_LLM_FAILED");
    const parsed = parseTutorResponse(result.data.rawText);
    expect(parsed.teacherReply.length).toBeGreaterThan(0);
    expect(parsed.version).toBe("1");
    if (turn.targetLanguage === "zh-CN") {
      expect(parsed.teacherReply).toMatch(/[\u3400-\u9fff]/u);
      expect(parsed.grammarExplanation).toMatch(/[A-Za-z]/u);
    } else {
      expect(parsed.teacherReply).toMatch(/[A-Za-z]/u);
      expect(parsed.grammarExplanation).toMatch(/[\u3400-\u9fff]/u);
    }
  }, 90_000);
});
