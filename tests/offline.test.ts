import { compare } from "bcryptjs";
import { describe, expect, it } from "vitest";
import { zhRuCourse } from "@/prisma/content/zh-ru-unit1";
import { zhUzCourse } from "@/prisma/content/zh-uz-unit1";
import { checkExerciseAnswer } from "@/src/lib/answer-check";
import { offlineSyncSchema } from "@/src/server/services/offline-service";

const exercises = [zhUzCourse, zhRuCourse].flatMap((course) => course.modules.flatMap((module) => module.lessons.flatMap((lesson) => lesson.exercises)));

describe("offline mode", () => {
  it("checks every exercise from the trimmed offline answer key", () => {
    for (const exercise of exercises) {
      const full = exercise as unknown as Record<string, unknown>;
      // Same subset getOfflinePack ships to the phone.
      const key = { acceptedAnswers: full.acceptedAnswers, correctWords: full.correctWords, pairs: full.pairs };
      const label = exercise.question.zh;
      if (exercise.type === "MULTIPLE_CHOICE") {
        expect(checkExerciseAnswer(exercise.type, key, "opt-correct", "opt-correct"), label).toBe(true);
        expect(checkExerciseAnswer(exercise.type, key, "opt-wrong", "opt-correct"), label).toBe(false);
      }
      if (exercise.type === "TRANSLATE") expect(checkExerciseAnswer(exercise.type, key, exercise.acceptedAnswers[0]), label).toBe(true);
      if (exercise.type === "ARRANGE_WORDS") expect(checkExerciseAnswer(exercise.type, key, exercise.correctWords), label).toBe(true);
      if (exercise.type === "MATCHING") {
        const answer = Object.fromEntries(exercise.pairs.map((pair) => [pair.left, pair.right]));
        expect(checkExerciseAnswer(exercise.type, key, answer), label).toBe(true);
      }
    }
  });

  it("limits what a sync request may contain", () => {
    expect(offlineSyncSchema.safeParse({ lessons: [{ lessonId: "l1", attempts: [{ exerciseId: "e1", answer: ["a"] }] }] }).success).toBe(true);
    expect(offlineSyncSchema.safeParse({ lessons: Array.from({ length: 51 }, (_, index) => ({ lessonId: `l${index}`, attempts: [] })) }).success).toBe(false);
    expect(offlineSyncSchema.safeParse({ lessons: [{ lessonId: "", attempts: [] }] }).success).toBe(false);
  });

  it("gives guests a password hash that no password can match", async () => {
    // createGuestUser stores "guest:<random hex>", which is not a bcrypt hash.
    expect(await compare("", "guest:0123456789abcdef0123456789abcdef")).toBe(false);
    expect(await compare("guest:0123456789abcdef0123456789abcdef", "guest:0123456789abcdef0123456789abcdef")).toBe(false);
  });
});
