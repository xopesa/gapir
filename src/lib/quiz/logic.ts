// Pure rules of the live class quiz, shared by the server, the screens and tests.
// A teacher hosts a game; learners join with a PIN and answer on their phones.

export type QuizStatus = "LOBBY" | "QUESTION" | "REVEAL" | "FINISHED";
/** What a screen shows. COUNTDOWN = the question is announced but not open yet. */
export type QuizPhase = "LOBBY" | "COUNTDOWN" | "QUESTION" | "REVEAL" | "FINISHED";

export interface QuizQuestionData {
  text: string;
  options: string[];
  correctIndex: number;
  timeLimitSec: number;
}

/** A question opens this long after the teacher presses "next", so every phone shows it at the same moment. */
export const COUNTDOWN_MS = 4000;
/** Answers that left the phone in time but arrived a little late still count. */
export const ANSWER_GRACE_MS = 1500;
export const MAX_POINTS = 1000;
export const MIN_CORRECT_POINTS = 500;
/** A game nobody finished stops accepting players after this long. */
export const GAME_TTL_MS = 6 * 60 * 60 * 1000;
export const TIME_LIMITS = [10, 20, 30, 60] as const;
export const MAX_OPTIONS = 4;
export const MAX_QUESTIONS = 50;

/** Correct answers get 500–1000 points: the faster, the more. Wrong answers get 0. */
export function scoreAnswer(correct: boolean, elapsedMs: number, limitMs: number) {
  if (!correct) return 0;
  const left = limitMs > 0 ? Math.min(1, Math.max(0, 1 - elapsedMs / limitMs)) : 0;
  return Math.round(MIN_CORRECT_POINTS + (MAX_POINTS - MIN_CORRECT_POINTS) * left);
}

export function questionClosesAt(opensAt: number, timeLimitSec: number) {
  return opensAt + timeLimitSec * 1000;
}

export function phaseOf(status: QuizStatus, opensAt: number | null, now: number): QuizPhase {
  if (status !== "QUESTION") return status;
  return opensAt !== null && now < opensAt ? "COUNTDOWN" : "QUESTION";
}

/** True when the stored status is still QUESTION but its time is over. */
export function questionExpired(status: QuizStatus, opensAt: number | null, timeLimitSec: number, now: number) {
  return status === "QUESTION" && opensAt !== null && now >= questionClosesAt(opensAt, timeLimitSec);
}

export function canAnswerAt(opensAt: number, timeLimitSec: number, now: number) {
  return now >= opensAt && now <= questionClosesAt(opensAt, timeLimitSec) + ANSWER_GRACE_MS;
}

/** Six digits, never starting with 0, so it reads the same on every keyboard. */
export function generatePin(random: () => number = Math.random) {
  return String(100000 + Math.floor(random() * 900000));
}

/** Keeps only digits: learners may type spaces or full-width digits (１２３). */
export function normalizePin(input: string) {
  return input.normalize("NFKC").replace(/\D/g, "").slice(0, 6);
}

export function isQuizStatus(value: string): value is QuizStatus {
  return value === "LOBBY" || value === "QUESTION" || value === "REVEAL" || value === "FINISHED";
}

export function parseOptions(json: string): string[] {
  try {
    const value: unknown = JSON.parse(json);
    return Array.isArray(value) ? value.map(String) : [];
  } catch { return []; }
}

export function parseQuestions(json: string): QuizQuestionData[] {
  try {
    const value: unknown = JSON.parse(json);
    if (!Array.isArray(value)) return [];
    return value.flatMap((item) => {
      const question = item as Partial<QuizQuestionData>;
      if (typeof question.text !== "string" || !Array.isArray(question.options)) return [];
      return [{ text: question.text, options: question.options.map(String), correctIndex: Number(question.correctIndex) || 0, timeLimitSec: Number(question.timeLimitSec) || 20 }];
    });
  } catch { return []; }
}

function shuffle<T>(values: T[], random: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

/** A ready quiz (one per course unit) has this many questions; units with fewer usable exercises get none. */
export const READY_QUIZ_MIN = 10;
export const READY_QUIZ_MAX = 20;

/** How many questions a ready quiz of a unit gets, or 0 when the unit has too few usable exercises. */
export function readyQuizSize(available: number) {
  return available < READY_QUIZ_MIN ? 0 : Math.min(READY_QUIZ_MAX, available);
}

/** Upper estimate of the questions one exercise can give (see questionsFromExercises). */
export function questionYield(type: string, payload: Record<string, unknown>) {
  if (type === "MULTIPLE_CHOICE") return payload.listen ? 0 : 1;
  if (type === "MATCHING" && Array.isArray(payload.pairs)) return payload.pairs.length >= 3 ? payload.pairs.length : 0;
  return 0;
}

/** A lesson exercise reduced to what a quiz question can be built from. */
export interface ExerciseSource {
  type: string;
  /** Parsed exercise payload: prompt, listen, optionImages, pairs… */
  payload: Record<string, unknown>;
  question: string;
  options: Array<{ text: string; isCorrect: boolean }>;
}

/**
 * Turns lesson exercises into quiz questions:
 * - "choose the answer" exercises are taken as they are (audio-only ones are skipped);
 * - "match the pairs" exercises give one question per pair (the word plus the task), the other pairs are the wrong answers.
 * Building phrases and speaking have no four-button form and are skipped.
 */
export function questionsFromExercises(exercises: ExerciseSource[], limit = 20, random: () => number = Math.random): QuizQuestionData[] {
  const questions: QuizQuestionData[] = [];
  const seen = new Set<string>();
  const add = (text: string, correct: string, wrong: string[]) => {
    const others = [...new Set(wrong.map((item) => item.trim()).filter((item) => item && item !== correct))].slice(0, MAX_OPTIONS - 1);
    const key = `${text}|${correct}`;
    if (!text.trim() || !correct.trim() || !others.length || seen.has(key)) return;
    seen.add(key);
    const options = shuffle([correct, ...others], random);
    questions.push({ text: text.trim(), options, correctIndex: options.indexOf(correct), timeLimitSec: 20 });
  };

  for (const exercise of exercises) {
    if (exercise.type === "MULTIPLE_CHOICE") {
      if (exercise.payload.listen) continue;
      const images = Array.isArray(exercise.payload.optionImages) ? exercise.payload.optionImages : [];
      const texts = exercise.options.map((option, index) => {
        const image = typeof images[index] === "string" ? `${images[index]} ` : "";
        return { text: `${image}${option.text}`.trim(), isCorrect: option.isCorrect };
      });
      const correct = texts.filter((option) => option.isCorrect);
      if (correct.length !== 1) continue;
      const prompt = typeof exercise.payload.prompt === "string" ? exercise.payload.prompt.trim() : "";
      add(prompt ? `${prompt} — ${exercise.question}` : exercise.question, correct[0].text, texts.filter((option) => !option.isCorrect).map((option) => option.text));
    } else if (exercise.type === "MATCHING" && Array.isArray(exercise.payload.pairs)) {
      const pairs = exercise.payload.pairs.flatMap((pair) => {
        const { left, right } = pair as { left?: unknown; right?: unknown };
        return typeof left === "string" && typeof right === "string" ? [{ left, right }] : [];
      });
      if (pairs.length < 3) continue;
      // The task ("match the word and its plural") tells what is asked about the word.
      const task = exercise.question.trim();
      for (const pair of pairs) add(task ? `${pair.left} — ${task}` : pair.left, pair.right, shuffle(pairs.filter((other) => other !== pair).map((other) => other.right), random));
    }
  }
  return shuffle(questions, random).slice(0, Math.max(1, limit));
}

/** Places with ties: equal scores share a place. `players` must be sorted by score, highest first. */
export function withPlaces<T extends { score: number }>(players: T[]): Array<T & { place: number }> {
  let place = 0;
  let previous: number | null = null;
  return players.map((player, index) => {
    if (player.score !== previous) { place = index + 1; previous = player.score; }
    return { ...player, place };
  });
}
