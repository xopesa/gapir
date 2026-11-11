import { describe, expect, it } from "vitest";
import { zhRuCourse } from "@/prisma/content/zh-ru-unit1";
import { zhUzCourse } from "@/prisma/content/zh-uz-unit1";
import { checkExerciseAnswer, normalizeText, validateLessonForPublication } from "@/src/server/services/lesson-service";

const lessons = [zhUzCourse, zhRuCourse].flatMap((course) => course.modules.flatMap((module) => module.lessons));

describe("course content (zh→uz, zh→ru)", () => {
  it("has lessons that pass publication validation", () => {
    for (const lesson of lessons) {
      const errors = validateLessonForPublication({
        translations: [{ title: lesson.title.zh }],
        exercises: lesson.exercises.map((exercise) => ({
          type: exercise.type,
          payload: JSON.stringify(
            exercise.type === "MATCHING" ? { pairs: exercise.pairs }
              : exercise.type === "ARRANGE_WORDS" ? { words: exercise.words, correctWords: exercise.correctWords }
                : exercise.type === "TRANSLATE" ? { acceptedAnswers: exercise.acceptedAnswers } : {},
          ),
          options: exercise.type === "MULTIPLE_CHOICE" ? exercise.options.map((option) => ({ isCorrect: Boolean(option.correct) })) : [],
        })),
      });
      expect(errors, lesson.title.zh).toEqual([]);
    }
  });

  it("has well-formed exercises", () => {
    for (const lesson of lessons) {
      for (const exercise of lesson.exercises) {
        const label = `${lesson.title.zh}: ${exercise.question.zh}`;
        expect(exercise.question.ru, label).toBeTruthy();
        expect(exercise.question.uz, label).toBeTruthy();
        // Content is written in the new alphabet (explanations may cite the old spelling).
        expect(JSON.stringify({ ...exercise, explanation: undefined }), label).not.toMatch(/[OoGg][ʻ‘]/);
        if (exercise.type === "MATCHING") {
          // Tap-to-pair tiles need unique labels on both sides.
          expect(new Set(exercise.pairs.map((pair) => pair.left)).size, label).toBe(exercise.pairs.length);
          expect(new Set(exercise.pairs.map((pair) => pair.right)).size, label).toBe(exercise.pairs.length);
        }
        if (exercise.type === "ARRANGE_WORDS") {
          const bank = [...exercise.words];
          for (const word of exercise.correctWords) {
            const at = bank.indexOf(word);
            expect(at, `${label}: "${word}" missing from tiles`).toBeGreaterThanOrEqual(0);
            bank.splice(at, 1);
          }
          expect(checkExerciseAnswer("ARRANGE_WORDS", { correctWords: exercise.correctWords }, exercise.correctWords), label).toBe(true);
        }
        if (exercise.type === "MULTIPLE_CHOICE") {
          expect(exercise.options.filter((option) => option.correct).length, label).toBe(1);
          // Besides zh every option needs at least one more translation
          // (meaning options deliberately omit the target language itself).
          expect(exercise.options.every((option) => option.text.ru || option.text.uz), label).toBe(true);
        }
      }
    }
  });

  it("accepts the new alphabet and every old spelling of ö / ğ / ş / ç", () => {
    const accepted = { acceptedAnswers: ["Körişgunça xayr"] };
    for (const typed of ["Körişgunça xayr", "Koʻrishguncha xayr", "Ko'rishguncha xayr!", "ko‘rishguncha  xayr.", "Ko’rishguncha xayr", "Ko`rishguncha xayr", "KÖRIŞGUNÇA XAYR"]) {
      expect(checkExerciseAnswer("TRANSLATE", accepted, typed), typed).toBe(true);
    }
    expect(normalizeText("Vaalaykum assalom!")).toBe("vaalaykum assalom");
    expect(checkExerciseAnswer("TRANSLATE", accepted, "Xayr")).toBe(false);
    expect(normalizeText("Ğalaba, Şahar, Çoy")).toBe(normalizeText("Gʻalaba, Shahar, Choy"));
    expect(normalizeText("maʼno")).toBe(normalizeText("ma'no"));
  });

  it("ignores Russian stress marks and treats ё as е", () => {
    expect(normalizeText("Э́то ма́ма.")).toBe("это мама");
    expect(normalizeText("ёж")).toBe("еж");
    expect(normalizeText("Здравствуйте!")).toBe("здравствуйте");
    expect(normalizeText("йод")).toBe("йод");
    expect(checkExerciseAnswer("ARRANGE_WORDS", { correctWords: ["До", "свида́ния!"] }, ["До", "свида́ния!"])).toBe(true);
  });
});
