import type { ExerciseType } from "@/generated/prisma/client";
import { checkExerciseAnswer, exerciseSolution, normalizeText, type ExercisePayload } from "@/src/lib/answer-check";
import { prisma } from "@/src/server/db";

// Pure checking lives in src/lib/answer-check.ts so the offline player can use it too.
export { checkExerciseAnswer, exerciseSolution, normalizeText };
export type { ExercisePayload };

// Display-only payload fields that are safe to send to the browser (no answers).
const DISPLAY_FIELDS = ["prompt", "speak", "listen", "mascot", "optionImages", "image"] as const;

export function parsePayload(payload: string): ExercisePayload {
  try { return JSON.parse(payload) as ExercisePayload; } catch { return {}; }
}

export function validateLessonForPublication(input: {
  translations: { title: string }[];
  exercises: { type: ExerciseType; payload: string; options: { isCorrect: boolean }[] }[];
}) {
  const errors: string[] = [];
  if (!input.translations.some((item) => item.title.trim())) errors.push("LESSON_TITLE_REQUIRED");
  if (!input.exercises.length) errors.push("EXERCISE_REQUIRED");
  input.exercises.forEach((exercise, index) => {
    const payload = parsePayload(exercise.payload);
    if (exercise.type === "MULTIPLE_CHOICE") {
      if (exercise.options.length < 2 || exercise.options.filter((item) => item.isCorrect).length !== 1) errors.push(`EXERCISE_${index + 1}_INVALID_OPTIONS`);
    } else if (exercise.type === "TRANSLATE" && (!Array.isArray(payload.acceptedAnswers) || !payload.acceptedAnswers.length)) {
      errors.push(`EXERCISE_${index + 1}_ANSWER_REQUIRED`);
    } else if (exercise.type === "ARRANGE_WORDS" && (!Array.isArray(payload.correctWords) || !payload.correctWords.length)) {
      errors.push(`EXERCISE_${index + 1}_WORDS_REQUIRED`);
    } else if (exercise.type === "MATCHING" && (!Array.isArray(payload.pairs) || payload.pairs.length < 2)) {
      errors.push(`EXERCISE_${index + 1}_PAIRS_REQUIRED`);
    }
  });
  return errors;
}

export function localized<T extends { locale: string }>(items: T[], locale: string, fallback = "ru") {
  return items.find((item) => item.locale === locale)
    ?? items.find((item) => item.locale === fallback)
    ?? items.find((item) => item.locale === "ru")
    ?? items[0];
}

function shuffled<T>(values: T[], seed: string) {
  // Deterministic per exercise so server and client render the same order.
  let state = [...seed].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const swap = state % (index + 1);
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

export const lessonInclude = {
  translations: true,
  module: { include: { course: true } },
  exercises: {
    where: { status: "PUBLISHED" as const },
    orderBy: { order: "asc" as const },
    include: { translations: true, options: { orderBy: { order: "asc" as const }, include: { translations: true } } },
  },
};

type LessonRecord = NonNullable<Awaited<ReturnType<typeof prisma.lesson.findFirst<{ include: typeof lessonInclude }>>>>;

/** What the lesson player gets: texts in the learner's locale, no answers. */
export function toLessonView(lesson: LessonRecord, locale: string) {
  // Content falls back to the course's explanation language (e.g. zh for zh→uz).
  const fallback = lesson.module.course.sourceLanguage;
  const translation = localized(lesson.translations, locale, fallback);
  return {
    id: lesson.id,
    title: translation?.title ?? "",
    description: translation?.description ?? "",
    theory: translation?.theory ?? "",
    xpReward: lesson.xpReward,
    estimatedMinutes: lesson.estimatedMinutes,
    targetLanguage: lesson.module.course.targetLanguage,
    exercises: lesson.exercises.map((exercise) => {
      const payload = parsePayload(exercise.payload);
      const text = localized(exercise.translations, locale, fallback);
      const safePayload: ExercisePayload = {};
      for (const field of DISPLAY_FIELDS) if (payload[field] !== undefined) safePayload[field] = payload[field];
      // A step-by-step explanation shown before the exercise, in the learner's locale.
      const teach = payload.teach as Record<string, string> | undefined;
      if (teach && typeof teach === "object") safePayload.teach = teach[locale] ?? teach[fallback] ?? teach.zh;
      if (exercise.type === "ARRANGE_WORDS") safePayload.words = Array.isArray(payload.words) ? payload.words : [];
      if (exercise.type === "MATCHING" && Array.isArray(payload.pairs)) {
        safePayload.left = payload.pairs.map((pair) => (pair as { left: string }).left);
        safePayload.right = shuffled(payload.pairs.map((pair) => (pair as { right: string }).right), exercise.id);
      }
      // Shuffle choices (with their images) so the right answer isn't always first.
      const images = Array.isArray(payload.optionImages) ? payload.optionImages : null;
      const options = shuffled(exercise.options.map((option, index) => ({
        option: { id: option.id, text: localized(option.translations, locale, fallback)?.text ?? "" },
        image: images?.[index] ?? null,
      })), exercise.id);
      if (images) safePayload.optionImages = options.map((item) => item.image);
      return {
        id: exercise.id,
        type: exercise.type,
        instruction: text?.instruction ?? "",
        question: text?.question ?? "",
        xpReward: exercise.xpReward,
        payload: safePayload,
        options: options.map((item) => item.option),
      };
    }),
  };
}

export type LessonView = ReturnType<typeof toLessonView>;

export async function getPublishedLesson(userId: string, lessonId: string, locale: string) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      status: "PUBLISHED",
      module: { status: "PUBLISHED", course: { status: "PUBLISHED" } },
    },
    include: lessonInclude,
  });
  if (!lesson) return null;
  const preference = await prisma.userPreference.findUnique({ where: { userId } });
  if (preference && (preference.sourceLanguage !== lesson.module.course.sourceLanguage || preference.targetLanguage !== lesson.module.course.targetLanguage)) return null;
  return toLessonView(lesson, locale);
}
