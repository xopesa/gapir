// Answer checking shared by the server (lesson-service) and the offline lesson
// player in the browser / Android app. Pure functions only — no database.
import { toNewUzbekLatin } from "./uzbek-latin";

export type ExerciseKind = "MULTIPLE_CHOICE" | "ARRANGE_WORDS" | "MATCHING" | "TRANSLATE";
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

/** Sent instead of speech when the learner cannot talk now, or the device has no speech recognition. */
export const SPEAK_SKIP = "__cannot_speak__";

function distance(a: string, b: string) {
  let row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const next = [i];
    for (let j = 1; j <= b.length; j += 1) next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    row = next;
  }
  return row[b.length];
}

/**
 * Speech recognisers are imprecise with a learner's accent, so each word of the
 * phrase only has to be heard closely enough (a letter or two off), in order;
 * extra words around it do not matter.
 */
export function heardPhrase(expected: unknown, heard: unknown) {
  const words = (value: unknown) => normalizeText(value).replace(/[—–-]/g, " ").split(/\s+/).filter(Boolean);
  const want = words(expected);
  const got = words(heard);
  if (!want.length || !got.length) return false;
  let from = 0;
  return want.every((word) => {
    const slack = word.length <= 2 ? 0 : word.length <= 5 ? 1 : 2;
    const at = got.findIndex((item, index) => index >= from && distance(word, item) <= slack);
    if (at < 0) return false;
    from = at + 1;
    return true;
  });
}

export function exerciseSolution(type: ExerciseKind | string, payload: ExercisePayload, correctOptionText?: string) {
  if (type === "MULTIPLE_CHOICE") return correctOptionText ?? "";
  if (type === "TRANSLATE") return Array.isArray(payload.acceptedAnswers) ? String(payload.acceptedAnswers[0] ?? "") : "";
  if (type === "ARRANGE_WORDS") return Array.isArray(payload.correctWords) ? payload.correctWords.join(" ") : "";
  if (type === "MATCHING" && Array.isArray(payload.pairs)) {
    return payload.pairs.map((pair) => `${(pair as { left: string }).left} — ${(pair as { right: string }).right}`).join(" · ");
  }
  return "";
}

export function checkExerciseAnswer(type: ExerciseKind | string, payload: ExercisePayload, answer: unknown, correctOptionId?: string) {
  if (type === "MULTIPLE_CHOICE") return String(answer) === correctOptionId;
  if (type === "TRANSLATE") {
    const accepted = Array.isArray(payload.acceptedAnswers) ? payload.acceptedAnswers : [];
    if (payload.say) {
      // Spoken: every alternative the recogniser returned may match.
      if (answer === SPEAK_SKIP) return true;
      const heard = Array.isArray(answer) ? answer : [answer];
      return accepted.some((value) => heard.some((item) => heardPhrase(value, item)));
    }
    // Built from tiles: words are joined with spaces, letters without.
    const candidates = Array.isArray(answer) ? [answer.join(" "), answer.join("")] : [answer];
    return accepted.some((value) => candidates.some((candidate) => normalizeText(value) === normalizeText(candidate)));
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
