import { describe, expect, it } from "vitest";
import { canAccessAdmin } from "@/src/server/auth/authorization";
import {
  ANSWER_GRACE_MS, canAnswerAt, generatePin, normalizePin, parseQuestions, phaseOf, questionExpired,
  questionsFromExercises, scoreAnswer, withPlaces, type ExerciseSource,
} from "@/src/lib/quiz/logic";
import { getClassQuiz, listClassQuizzes } from "@/src/lib/quiz/class-quizzes";
import { isTeacherHost } from "@/src/server/site";
import { quizAnswerSchema, quizJoinSchema, quizSchema } from "@/src/server/validation/schemas";
import { en } from "@/src/i18n/dictionaries/en";
import { ru } from "@/src/i18n/dictionaries/ru";
import { uz } from "@/src/i18n/dictionaries/uz";
import { zh } from "@/src/i18n/dictionaries/zh";

/** Repeatable "random" numbers, so shuffles are the same on every run. */
function seeded(seed = 1) {
  let state = seed;
  return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 2 ** 32; };
}

describe("hand-written class quizzes", () => {
  it("are valid quizzes whose correct answer survives the shuffle", () => {
    const first = listClassQuizzes(() => 0);
    const again = listClassQuizzes(seeded(7));
    expect(first.length).toBeGreaterThanOrEqual(3);
    expect(new Set(first.map((quiz) => quiz.id)).size).toBe(first.length);
    first.forEach((quiz, quizIndex) => {
      expect(quizSchema.safeParse(quiz).success).toBe(true);
      expect(quiz.questions.length).toBeGreaterThanOrEqual(10);
      quiz.questions.forEach((question, index) => {
        const other = again[quizIndex].questions[index];
        expect(other.options[other.correctIndex]).toBe(question.options[question.correctIndex]);
      });
    });
    expect(getClassQuiz("ru-whose")?.title).toBe("Чей? Чья? Чьё? Чьи?");
    expect(getClassQuiz("missing")).toBeUndefined();
  });
});

describe("class quiz rules", () => {
  it("gives 500–1000 points for a correct answer, more for a faster one, none for a wrong one", () => {
    expect(scoreAnswer(true, 0, 20_000)).toBe(1000);
    expect(scoreAnswer(true, 10_000, 20_000)).toBe(750);
    expect(scoreAnswer(true, 20_000, 20_000)).toBe(500);
    // Arrived inside the grace period: still the minimum, never less.
    expect(scoreAnswer(true, 21_000, 20_000)).toBe(500);
    expect(scoreAnswer(false, 0, 20_000)).toBe(0);
  });

  it("shows a countdown until the question opens and closes it when its time is over", () => {
    const opensAt = 100_000;
    expect(phaseOf("QUESTION", opensAt, opensAt - 1)).toBe("COUNTDOWN");
    expect(phaseOf("QUESTION", opensAt, opensAt)).toBe("QUESTION");
    expect(phaseOf("LOBBY", null, opensAt)).toBe("LOBBY");
    expect(questionExpired("QUESTION", opensAt, 20, opensAt + 19_999)).toBe(false);
    expect(questionExpired("QUESTION", opensAt, 20, opensAt + 20_000)).toBe(true);
    expect(questionExpired("REVEAL", opensAt, 20, opensAt + 30_000)).toBe(false);
  });

  it("accepts answers only while the question is open, with a short grace for slow networks", () => {
    const opensAt = 100_000;
    expect(canAnswerAt(opensAt, 20, opensAt - 1)).toBe(false);
    expect(canAnswerAt(opensAt, 20, opensAt + 5_000)).toBe(true);
    expect(canAnswerAt(opensAt, 20, opensAt + 20_000 + ANSWER_GRACE_MS)).toBe(true);
    expect(canAnswerAt(opensAt, 20, opensAt + 20_001 + ANSWER_GRACE_MS)).toBe(false);
  });

  it("makes six-digit codes and reads them however they are typed", () => {
    expect(generatePin(() => 0)).toBe("100000");
    expect(generatePin(() => 0.999999)).toBe("999999");
    expect(normalizePin(" 123 456 ")).toBe("123456");
    expect(normalizePin("１２３４５６")).toBe("123456");
    expect(normalizePin("12ab34")).toBe("1234");
  });

  it("gives equal scores the same place", () => {
    expect(withPlaces([{ score: 900 }, { score: 900 }, { score: 500 }, { score: 0 }]).map((item) => item.place)).toEqual([1, 1, 3, 4]);
  });

  it("reads a stored game snapshot and survives a broken one", () => {
    expect(parseQuestions('[{"text":"Q","options":["a","b"],"correctIndex":1,"timeLimitSec":10}]')).toEqual([{ text: "Q", options: ["a", "b"], correctIndex: 1, timeLimitSec: 10 }]);
    expect(parseQuestions("not json")).toEqual([]);
  });
});

describe("quiz from lessons", () => {
  const choice: ExerciseSource = {
    type: "MULTIPLE_CHOICE", payload: { prompt: "го́род", optionImages: ["🏙️", "🏠", "🏦"] }, question: "这个词是什么意思？",
    options: [{ text: "城市", isCorrect: true }, { text: "房子", isCorrect: false }, { text: "银行", isCorrect: false }],
  };
  const listening: ExerciseSource = { ...choice, payload: { listen: true, speak: "го́род" } };
  const matching: ExerciseSource = {
    type: "MATCHING", payload: { pairs: [{ left: "сад", right: "花园" }, { left: "друг", right: "朋友" }, { left: "заво́д", right: "工厂" }] }, question: "配对", options: [],
  };
  const arrange: ExerciseSource = { type: "ARRANGE_WORDS", payload: { words: ["Вот", "дом"] }, question: "…", options: [] };

  it("keeps the word, the pictures and exactly one right answer", () => {
    const [question] = questionsFromExercises([choice], 10, seeded());
    expect(question.text).toBe("го́род — 这个词是什么意思？");
    expect([...question.options].sort()).toEqual(["🏙️ 城市", "🏠 房子", "🏦 银行"].sort());
    expect(question.options[question.correctIndex]).toBe("🏙️ 城市");
  });

  it("turns each matching pair into a question and skips what has no four-button form", () => {
    const questions = questionsFromExercises([listening, matching, arrange], 10, seeded(7));
    expect(questions).toHaveLength(3);
    for (const question of questions) {
      const pair = (matching.payload.pairs as Array<{ left: string; right: string }>).find((item) => question.text === `${item.left} — 配对`);
      expect(question.options[question.correctIndex]).toBe(pair?.right);
      expect(new Set(question.options).size).toBe(question.options.length);
    }
  });

  it("drops repeated questions and respects the limit", () => {
    expect(questionsFromExercises([choice, choice], 10, seeded())).toHaveLength(1);
    expect(questionsFromExercises([choice, matching], 2, seeded())).toHaveLength(2);
  });

  it("builds questions the quiz form accepts", () => {
    const questions = questionsFromExercises([choice, matching], 10, seeded(3));
    expect(() => quizSchema.parse({ title: "Юнит 4", questions })).not.toThrow();
  });
});

describe("quiz input", () => {
  const question = { text: "2 + 2?", options: ["3", "4"], correctIndex: 1, timeLimitSec: 20 };

  it("accepts a normal quiz and trims texts", () => {
    const quiz = quizSchema.parse({ title: "  Счёт ", questions: [{ ...question, text: " 2 + 2? " }] });
    expect(quiz.title).toBe("Счёт");
    expect(quiz.questions[0].text).toBe("2 + 2?");
  });

  it("rejects a question without a valid right answer, with one option or with equal options", () => {
    expect(() => quizSchema.parse({ title: "T", questions: [{ ...question, correctIndex: 2 }] })).toThrow();
    expect(() => quizSchema.parse({ title: "T", questions: [{ ...question, options: ["4"], correctIndex: 0 }] })).toThrow();
    expect(() => quizSchema.parse({ title: "T", questions: [{ ...question, options: ["4", "4"] }] })).toThrow();
    expect(() => quizSchema.parse({ title: "T", questions: [{ ...question, timeLimitSec: 7 }] })).toThrow();
  });

  it("limits the player's name and the answer to four options", () => {
    expect(quizJoinSchema.parse({ pin: "123456", nickname: "  Ли Вэй " }).nickname).toBe("Ли Вэй");
    expect(() => quizJoinSchema.parse({ pin: "123456", nickname: "   " })).toThrow();
    expect(() => quizJoinSchema.parse({ pin: "123456", nickname: "x".repeat(21) })).toThrow();
    expect(() => quizAnswerSchema.parse({ questionIndex: 0, optionIndex: 4 })).toThrow();
  });
});

describe("teacher's site and role", () => {
  it("keeps the admin panel closed for the old teacher role", () => {
    expect(canAccessAdmin("TEACHER")).toBe(false);
  });

  it("recognises the teacher's address and nothing else", () => {
    const origin = "https://gapir-teacher.gapir-web.workers.dev";
    expect(isTeacherHost("gapir-teacher.gapir-web.workers.dev", origin)).toBe(true);
    expect(isTeacherHost("GAPIR-TEACHER.gapir-web.workers.dev:443", origin)).toBe(true);
    expect(isTeacherHost("gapir.gapir-web.workers.dev", origin)).toBe(false);
    expect(isTeacherHost(null, origin)).toBe(false);
    expect(isTeacherHost("teacher.localhost:3001", "http://teacher.localhost:3000")).toBe(true);
    expect(isTeacherHost("localhost:3000", "http://teacher.localhost:3000")).toBe(false);
  });

  it("has every quiz text in all four interface languages", () => {
    const keys = Object.keys(ru.quiz).sort();
    for (const dictionary of [uz, zh, en]) {
      expect(Object.keys(dictionary.quiz).sort()).toEqual(keys);
      expect(Object.values(dictionary.quiz).every((text) => text.trim().length > 0)).toBe(true);
    }
  });
});

describe("ready quizzes", () => {
  it("offers a ready quiz only for units with at least 10 usable questions, 20 at most", async () => {
    const { questionYield, readyQuizSize } = await import("@/src/lib/quiz/logic");
    expect(readyQuizSize(9)).toBe(0);
    expect(readyQuizSize(10)).toBe(10);
    expect(readyQuizSize(14)).toBe(14);
    expect(readyQuizSize(63)).toBe(20);
    expect(questionYield("MULTIPLE_CHOICE", {})).toBe(1);
    expect(questionYield("MULTIPLE_CHOICE", { listen: true })).toBe(0);
    expect(questionYield("MATCHING", { pairs: [1, 2, 3, 4] })).toBe(4);
    expect(questionYield("MATCHING", { pairs: [1, 2] })).toBe(0);
    expect(questionYield("TRANSLATE", {})).toBe(0);
  });
});
