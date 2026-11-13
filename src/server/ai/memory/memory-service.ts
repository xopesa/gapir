import { prisma } from "@/src/server/db";
import type { TutorDirection } from "../languages/registry";
import type { AiTutorResponse } from "../schemas/response";
import type { TutorLevel, TutorTopic } from "../schemas/requests";

function parseStringArray(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(0, 50) : [];
  } catch {
    return [];
  }
}

function uniqueRecent(values: string[], next: string, limit: number) {
  return [next, ...values.filter((value) => value !== next)].slice(0, limit);
}

export function buildMemorySummary(input: {
  level: string;
  weakTopics: string[];
  frequentMistakes: string[];
  recentTopics: string[];
  learnedWords: string[];
}) {
  return JSON.stringify({
    level: input.level,
    weakGrammarTopics: input.weakTopics.slice(0, 8),
    frequentMistakes: input.frequentMistakes.slice(0, 8),
    recentTopics: input.recentTopics.slice(0, 6),
    learnedWords: input.learnedWords.slice(0, 20),
  });
}

export async function getOrCreateTutorMemory(input: {
  userId: string;
  direction: TutorDirection;
  nativeLanguage: string;
  targetLanguage: string;
  level: TutorLevel;
}) {
  return prisma.aiTutorMemory.upsert({
    where: { userId_direction: { userId: input.userId, direction: input.direction } },
    update: { level: input.level },
    create: input,
    include: { learnedWords: { orderBy: { lastSeenAt: "desc" }, take: 20 } },
  });
}

export async function getTutorMemoryContext(userId: string, direction: TutorDirection) {
  const memory = await prisma.aiTutorMemory.findUnique({
    where: { userId_direction: { userId, direction } },
    include: { learnedWords: { orderBy: { lastSeenAt: "desc" }, take: 20 } },
  });
  if (!memory) return null;
  return {
    memory,
    weakTopics: parseStringArray(memory.weakTopicsJson),
    frequentMistakes: parseStringArray(memory.frequentMistakesJson),
    recentTopics: parseStringArray(memory.recentTopicsJson),
    learnedWords: memory.learnedWords.map((word) => word.word),
  };
}

export async function updateTutorMemoryAfterTurn(input: {
  userId: string;
  direction: TutorDirection;
  level: TutorLevel;
  topic: TutorTopic;
  sessionId: string;
  response: AiTutorResponse;
}) {
  const context = await getTutorMemoryContext(input.userId, input.direction);
  if (!context) return;
  const correctionChanged = input.response.correctedText.trim() !== input.response.recognizedText.trim();
  const weakTopic = correctionChanged && input.response.grammarTopic ? input.response.grammarTopic : null;
  const weakTopics = weakTopic ? uniqueRecent(context.weakTopics, weakTopic, 20) : context.weakTopics;
  const mistake = correctionChanged ? `${input.response.recognizedText} → ${input.response.correctedText}`.slice(0, 500) : null;
  const frequentMistakes = mistake ? uniqueRecent(context.frequentMistakes, mistake, 20) : context.frequentMistakes;
  const recentTopics = uniqueRecent(context.recentTopics, input.topic, 12);
  const learnedWords = uniqueRecent(context.learnedWords, input.response.newWords[0]?.word ?? "", 30).filter(Boolean);
  const summary = buildMemorySummary({ level: input.level, weakTopics, frequentMistakes, recentTopics, learnedWords });

  // Batch form only: Cloudflare D1 rejects interactive transactions.
  const learnedWordWrites = input.response.newWords.flatMap((word) => {
    const normalizedWord = word.word.normalize("NFKC").trim().toLocaleLowerCase();
    if (!normalizedWord) return [];
    return [prisma.aiLearnedWord.upsert({
      where: { memoryId_language_normalizedWord: { memoryId: context.memory.id, language: word.language, normalizedWord } },
      update: { word: word.word, translation: word.translation, timesSeen: { increment: 1 }, lastSeenAt: new Date() },
      create: { memoryId: context.memory.id, word: word.word, normalizedWord, translation: word.translation, language: word.language },
    })];
  });
  await prisma.$transaction([
    prisma.aiTutorMemory.update({
      where: { id: context.memory.id },
      data: {
        level: input.level,
        summary,
        weakTopicsJson: JSON.stringify(weakTopics),
        frequentMistakesJson: JSON.stringify(frequentMistakes),
        recentTopicsJson: JSON.stringify(recentTopics),
        coins: { increment: input.response.coins },
        lastSessionId: input.sessionId,
        lastLessonAt: new Date(),
      },
    }),
    ...learnedWordWrites,
  ]);
}

export async function listTutorMemories(userId: string) {
  const [user, memories] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { xp: true, streak: true, lastActivityDate: true } }),
    prisma.aiTutorMemory.findMany({ where: { userId }, include: { learnedWords: { orderBy: { lastSeenAt: "desc" }, take: 50 } } }),
  ]);
  return memories.map((memory) => ({
    ...memory,
    totalXp: user.xp,
    streak: user.streak,
    lastActivityDate: user.lastActivityDate,
    weakGrammarTopics: parseStringArray(memory.weakTopicsJson),
    frequentMistakes: parseStringArray(memory.frequentMistakesJson),
    recentTopics: parseStringArray(memory.recentTopicsJson),
  }));
}
