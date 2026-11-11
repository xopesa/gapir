import type { ExerciseType } from "@/generated/prisma/client";
import { toNewUzbekLatin } from "@/src/lib/uzbek-latin";
import { prisma } from "@/src/server/db";

export type ExercisePayload = Record<string, unknown>;

// The tutuq belgisi (ʼ) is typed with several look-alike marks; old-alphabet
// spellings (oʻ, gʻ, sh, ch) are folded into the new letters (ö, ğ, ş, ç).
const APOSTROPHES = /[ʻʼ‘’`´']/g;

export function normalizeText(value: unknown) {
  // Russian: stress marks (а́) are teaching aids, never required in answers;
  // ё may be typed as е. NFD→strip U+0301→NFC keeps й/ё/ö/ğ otherwise intact.
  const text = String(value ?? "").normalize("NFD").replace(/́/g, "").normalize("NFC").replace(/ё/g, "е").replace(/Ё/g, "Е");
  return toNewUzbekLatin(text)
    .replace(APOSTROPHES, "'")
    .replace(/[.!?,;:。！？，；：]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();
}

// Display-only payload fields that are safe to send to the browser (no answers).
const DISPLAY_FIELDS = ["prompt", "speak", "mascot", "optionImages", "image"] as const;

export function exerciseSolution(
  type: ExerciseType,
  payload: ExercisePayload,
  correctOptionText?: string,
) {
  if (type === "MULTIPLE_CHOICE") return correctOptionText ?? "";
  if (type === "TRANSLATE") return Array.isArray(payload.acceptedAnswers) ? String(payload.acceptedAnswers[0] ?? "") : "";
  if (type === "ARRANGE_WORDS") return Array.isArray(payload.correctWords) ? payload.correctWords.join(" ") : "";
  if (type === "MATCHING" && Array.isArray(payload.pairs)) {
    return payload.pairs.map((pair) => `${(pair as { left: string }).left} — ${(pair as { right: string }).right}`).join(" · ");
  }
  return "";
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
