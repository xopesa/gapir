// Keys that link lesson texts to pre-generated audio files. Shared by the
// generator (scripts/generate-audio.ts) and the player, so both sides agree.
import { toNewUzbekLatin } from "./uzbek-latin";

/** Stress marks (U+0301) are for the eyes only; Uzbek old spellings fold into the new alphabet. */
export function phraseKey(lang: string, text: string) {
  const plain = text.normalize("NFD").replace(/́/g, "").normalize("NFC").trim();
  return lang === "uz" ? toNewUzbekLatin(plain) : plain;
}

/** Short stable hash of a theory text (FNV-1a, 32 bit) plus its length. */
export function narrationKey(text: string) {
  const value = text.trim().normalize("NFC");
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `${hash.toString(16).padStart(8, "0")}${value.length.toString(16)}`;
}
