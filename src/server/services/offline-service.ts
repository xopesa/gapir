// Offline mode for the phone app: the learner's whole course in one package
// (lesson views + answers, so lessons can be checked without a network), and a
// sync step that replays lessons finished offline through the normal progress
// flow — the server re-checks every answer and grants XP itself.
import { z } from "zod";
import { getDictionary } from "@/src/i18n/config";
import { exerciseSolution, type ExercisePayload } from "@/src/lib/answer-check";
import { prisma } from "@/src/server/db";
import { getLearningDashboard } from "./course-service";
import { lessonInclude, localized, parsePayload, toLessonView } from "./lesson-service";
import { completeLesson, startLesson, submitExerciseAnswer } from "./progress-service";

export interface OfflineAnswerKey {
  type: string;
  payload: ExercisePayload;
  correctOptionId?: string;
  explanation: string;
  solution: string;
}

export async function getOfflinePack(userId: string, locale: string) {
  const dashboard = await getLearningDashboard(userId, locale);
  if (!dashboard.course) return null;
  // One query per lesson: D1 caps bound parameters per query (~100), and the
  // nested includes of a whole course in one findMany exceed it.
  const lessons = [];
  for (const id of dashboard.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id))) {
    const lesson = await prisma.lesson.findFirst({ where: { id, status: "PUBLISHED" }, include: lessonInclude });
    if (lesson) lessons.push(lesson);
  }
  const fallback = dashboard.course.sourceLanguage;
  const answers: Record<string, OfflineAnswerKey> = {};
  for (const lesson of lessons) {
    for (const exercise of lesson.exercises) {
      const payload = parsePayload(exercise.payload);
      const correct = exercise.options.find((option) => option.isCorrect);
      const correctText = correct ? localized(correct.translations, locale, fallback)?.text : undefined;
      answers[exercise.id] = {
        type: exercise.type,
        // Only what checking needs; display fields come with the lesson view.
        payload: { acceptedAnswers: payload.acceptedAnswers, correctWords: payload.correctWords, pairs: payload.pairs },
        correctOptionId: correct?.id,
        explanation: localized(exercise.translations, locale, fallback)?.explanation ?? "",
        solution: exerciseSolution(exercise.type, payload, correctText),
      };
    }
  }
  const updatedAt = lessons.reduce((latest, lesson) => Math.max(latest, lesson.updatedAt.getTime()), 0);
  return {
    version: `${dashboard.course.id}:${locale}:${updatedAt}`,
    generatedAt: new Date().toISOString(),
    locale,
    user: { name: dashboard.user.name, xp: dashboard.user.xp, streak: dashboard.user.streak },
    dictionary: getDictionary(locale),
    course: dashboard.course,
    modules: dashboard.modules,
    lessons: Object.fromEntries(lessons.map((lesson) => [lesson.id, toLessonView(lesson, locale)])),
    answers,
  };
}

export type OfflinePack = NonNullable<Awaited<ReturnType<typeof getOfflinePack>>>;

export const offlineSyncSchema = z.object({
  lessons: z.array(z.object({
    lessonId: z.string().min(1).max(64),
    attempts: z.array(z.object({ exerciseId: z.string().min(1).max(64), answer: z.unknown() })).max(200),
  })).max(50),
});

export async function syncOfflineProgress(userId: string, input: unknown, locale: string) {
  const { lessons } = offlineSyncSchema.parse(input);
  const results: Array<{ lessonId: string; ok: boolean; earnedXp: number; error?: string }> = [];
  for (const item of lessons) {
    try {
      await startLesson(userId, item.lessonId);
      for (const attempt of item.attempts) {
        // An exercise that no longer exists must not block the rest of the lesson.
        await submitExerciseAnswer(userId, attempt.exerciseId, attempt.answer, locale).catch(() => null);
      }
      const done = await completeLesson(userId, item.lessonId);
      results.push({ lessonId: item.lessonId, ok: true, earnedXp: done.alreadyCompleted ? 0 : done.earnedXp });
    } catch (error) {
      results.push({ lessonId: item.lessonId, ok: false, earnedXp: 0, error: error instanceof Error ? error.message : "SYNC_FAILED" });
    }
  }
  return { results };
}
