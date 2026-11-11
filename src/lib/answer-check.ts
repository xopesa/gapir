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
