// Uzbek Latin alphabet reform (law of 21 Oct 2026, in force from 22 Apr 2027):
// Oʻ → Ö, Gʻ → Ğ, Sh → Ş, Ch → Ç; Ng is written as n + g and is no longer a letter.
// Course content uses the new letters. Learners (and old textbooks, signs,
// phone keyboards) still write the old way, so answers are compared after
// folding the old spelling into the new one.

// Marks people type for the old oʻ/gʻ: ʻ ‘ ’ ` ´ '. The tutuq belgisi (ʼ) stays.
const OLD_O_G = /([OoGg])[ʻ‘’`´']/g;
const NEW_FOR_OLD: Record<string, string> = { O: "Ö", o: "ö", G: "Ğ", g: "ğ" };

export function toNewUzbekLatin(text: string) {
  return text
    .normalize("NFC")
    .replace(OLD_O_G, (_, letter: string) => NEW_FOR_OLD[letter])
    .replace(/S[Hh]/g, "Ş")
    .replace(/sh/g, "ş")
    .replace(/C[Hh]/g, "Ç")
    .replace(/ch/g, "ç");
}
