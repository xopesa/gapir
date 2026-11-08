import type { ExerciseType } from "@/generated/prisma/client";
import { prisma } from "@/src/server/db";

export type ExercisePayload = Record<string, unknown>;

export function normalizeText(value: unknown) {
  return String(value ?? "").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function parsePayload(payload: string): ExercisePayload {
  try { return JSON.parse(payload) as ExercisePayload; } catch { return {}; }
}

export function checkExerciseAnswer(
  type: ExerciseType,
  payload: ExercisePayload,
  answer: unknown,
  correctOptionId?: string,
) {
  if (type === "MULTIPLE_CHOICE") return String(answer) === correctOptionId;
  if (type === "TRANSLATE") {
    const accepted = Array.isArray(payload.acceptedAnswers) ? payload.acceptedAnswers : [];
    return accepted.some((value) => normalizeText(value) === normalizeText(answer));
  }
  if (type === "ARRANGE_WORDS") {
    const expected = Array.isArray(payload.correctWords) ? payload.correctWords.join(" ") : "";
    const actual = Array.isArray(answer) ? answer.join(" ") : answer;
    return normalizeText(actual) === normalizeText(expected);
  }
  if (type === "MATCHING") {
    const pairs = Array.isArray(payload.pairs) ? payload.pairs : [];
    if (!answer || typeof answer !== "object" || Array.isArray(answer)) return false;
    const submitted = answer as Record<string, unknown>;
    return pairs.every((pair) => {
      if (!pair || typeof pair !== "object") return false;
      const typedPair = pair as { left?: unknown; right?: unknown };
      return normalizeText(submitted[String(typedPair.left)]) === normalizeText(typedPair.right);
    });
  }
  return false;
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

function localized<T extends { locale: string }>(items: T[], locale: string) {
  return items.find((item) => item.locale === locale) ?? items.find((item) => item.locale === "ru") ?? items[0];
}

export async function getPublishedLesson(userId: string, lessonId: string, locale: string) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      status: "PUBLISHED",
      module: { status: "PUBLISHED", course: { status: "PUBLISHED" } },
    },
    include: {
      translations: true,
      module: { include: { course: true } },
      exercises: {
        where: { status: "PUBLISHED" },
        orderBy: { order: "asc" },
        include: { translations: true, options: { orderBy: { order: "asc" }, include: { translations: true } } },
      },
    },
  });
  if (!lesson) return null;
  const preference = await prisma.userPreference.findUnique({ where: { userId } });
  if (preference && (preference.sourceLanguage !== lesson.module.course.sourceLanguage || preference.targetLanguage !== lesson.module.course.targetLanguage)) return null;
  const translation = localized(lesson.translations, locale);
  return {
    id: lesson.id,
    title: translation?.title ?? "",
    description: translation?.description ?? "",
    theory: translation?.theory ?? "",
    xpReward: lesson.xpReward,
    estimatedMinutes: lesson.estimatedMinutes,
    exercises: lesson.exercises.map((exercise) => {
      const payload = parsePayload(exercise.payload);
      const text = localized(exercise.translations, locale);
      const safePayload: ExercisePayload = {};
      if (exercise.type === "ARRANGE_WORDS") safePayload.words = Array.isArray(payload.words) ? payload.words : [];
      if (exercise.type === "MATCHING" && Array.isArray(payload.pairs)) {
        safePayload.left = payload.pairs.map((pair) => (pair as { left: string }).left);
        safePayload.right = payload.pairs.map((pair) => (pair as { right: string }).right).reverse();
      }
      return {
        id: exercise.id,
        type: exercise.type,
        instruction: text?.instruction ?? "",
        question: text?.question ?? "",
        xpReward: exercise.xpReward,
        payload: safePayload,
        options: exercise.options.map((option) => ({ id: option.id, text: localized(option.translations, locale)?.text ?? "" })),
      };
    }),
  };
}
