// Generates the course audio and writes src/content/audio-manifest.generated.ts:
//  - phrases: every `speak`/`prompt` in the target language (Uzbek, Russian);
//  - narration: each lesson's theory, read in Chinese and Uzbek. Words in
//    other languages inside the text are read by that language's voice
//    (e.g. Russian «а», «ма́ма» in a Chinese explanation).
//
//   npx tsx scripts/generate-audio.ts --dry-run        # list what is missing
//   npx tsx scripts/generate-audio.ts [--force]        # synthesise (needs: pip install edge-tts)
//   npx tsx scripts/generate-audio.ts --manifest-only  # only rebuild the manifest
//
// Voices: Microsoft Edge neural TTS (no key). Existing files are kept unless
// --force, so hand-made recordings (e.g. public/audio/uz/*.wav) stay.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { zhRuCourse } from "../prisma/content/zh-ru-unit1";
import { zhUzCourse, type CourseContent } from "../prisma/content/zh-uz-unit1";
import { narrationKey, phraseKey } from "../src/lib/audio-keys";

const COURSES: CourseContent[] = [zhUzCourse, zhRuCourse];
const NARRATION_LOCALES = ["zh", "uz"] as const;
const PUBLIC = resolve("public");
const MANIFEST = resolve("src/content/audio-manifest.generated.ts");
const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");
const manifestOnly = process.argv.includes("--manifest-only");

const VOICES = { zh: "zh-CN-XiaoxiaoNeural", ru: "ru-RU-SvetlanaNeural", uz: "uz-UZ-MadinaNeural" } as const;
type Voice = keyof typeof VOICES;
interface Segment { voice: string; text: string; rate: string }

const HAN = /[\p{Script=Han}　-〿＀-￯]/u;
const CYRILLIC = /\p{Script=Cyrillic}/u;
const LATIN = /[\p{Script=Latin}ʼʻ]/u;

// The Uzbek voice knows the old spelling: Ö→Oʻ, Ğ→Gʻ, Ş→Sh, Ç→Ch.
const OLD: Record<string, string> = { Ö: "Oʻ", ö: "oʻ", Ğ: "Gʻ", ğ: "gʻ", Ş: "Sh", ş: "sh", Ç: "Ch", ç: "ch" };
const forVoice = (voice: Voice, text: string) => {
  const plain = text.normalize("NFD").replace(/́/g, "").normalize("NFC");
  return voice === "uz" ? plain.replace(/[ÖöĞğŞşÇç]/g, (letter) => OLD[letter]) : plain;
};

const CYR: Record<string, string> = { а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "eh", ю: "yu", я: "ya" };
const UZ: Record<string, string> = { ö: "oe", ğ: "gh", ş: "sh", ç: "ch" };
const slug = (lang: string, text: string) => phraseKey(lang, text).toLowerCase()
  .replace(/[а-яё]/g, (letter) => CYR[letter] ?? "").replace(/[öğşç]/g, (letter) => UZ[letter])
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "x";

/** Splits a text into runs per script, each read by its own voice. */
function segments(text: string, latinVoice: Voice): Segment[] {
  const runs: Array<{ voice: Voice; text: string }> = [];
  const cleaned = text.replace(/ʌ/g, "а").replace(/[[\]]/g, " ").replace(/\s*[—–]\s*/g, ", ");
  for (const char of cleaned) {
    const voice: Voice | null = HAN.test(char) ? "zh" : CYRILLIC.test(char) ? "ru" : LATIN.test(char) ? latinVoice : null;
    const last = runs[runs.length - 1];
    if (!last) runs.push({ voice: voice ?? latinVoice, text: char });
    else if (voice === null || voice === last.voice) last.text += char;
    else runs.push({ voice, text: char });
  }
  return runs
    // "Кто это?, Это мама." (a dash turned into a comma) gets no audio from the voice.
    .map((run) => ({ voice: run.voice, text: forVoice(run.voice, run.text).replace(/([?!.。？！])\s*[,，]/g, "$1").replace(/^[\s,，、.。:：;；]+/, "").trim() }))
    .filter((run) => /[\p{L}\p{N}]/u.test(run.text.replace(/[ʼʻ]/g, "")))
    .map((run) => ({ voice: VOICES[run.voice], text: run.text, rate: run.voice === "ru" ? "-15%" : "-5%" }));
}

interface Job { out: string; url: string; segments: Segment[] }

function phraseJobs() {
  const jobs = new Map<string, Job & { lang: string; key: string }>();
  for (const course of COURSES) {
    const lang = course.targetLanguage as Voice;
    const isTarget = (text: string) => (lang === "ru" ? CYRILLIC.test(text) : LATIN.test(text) && !HAN.test(text));
    for (const courseModule of course.modules) for (const lesson of courseModule.lessons) for (const exercise of lesson.exercises) {
      for (const text of ["speak" in exercise ? exercise.speak : undefined, "prompt" in exercise ? exercise.prompt : undefined]) {
        // Prompts with a blank ("Bu ___?") are not phrases to listen to.
        if (!text || !isTarget(text) || text.includes("_")) continue;
        const key = phraseKey(lang, text);
        const name = slug(lang, text);
        if (jobs.has(`${lang}|${key}`)) continue;
        jobs.set(`${lang}|${key}`, { lang, key, out: resolve(PUBLIC, "audio", lang, `${name}.mp3`), url: `/audio/${lang}/${name}.mp3`, segments: [{ voice: VOICES[lang], text: forVoice(lang, text.replace(/^[—–-]\s*/, "")), rate: "-15%" }] });
      }
    }
  }
  return [...jobs.values()];
}

function narrationJobs() {
  const jobs = new Map<string, Job & { key: string }>();
  for (const course of COURSES) for (const courseModule of course.modules) for (const lesson of courseModule.lessons) {
    for (const locale of NARRATION_LOCALES) {
      const text = lesson.theory[locale];
      if (!text) continue;
      const key = narrationKey(text);
      // Latin words are Uzbek in Uzbek texts and in the Uzbek course.
      const latinVoice: Voice = locale === "uz" || course.targetLanguage === "uz" ? "uz" : "zh";
      const parts = text.split("\n").flatMap((line) => segments(line, latinVoice));
      // Neighbouring runs of one voice become one request.
      const merged: Segment[] = [];
      for (const part of parts) {
        const last = merged[merged.length - 1];
        // The Russian voice returns nothing for "Пока!\nКак дела?": join its lines with a space.
        if (last && last.voice === part.voice) last.text += part.voice === VOICES.ru ? ` ${part.text}` : `\n${part.text}`;
        else merged.push({ ...part });
      }
      jobs.set(key, { key, out: resolve(PUBLIC, "audio", "narration", locale, `${key}.mp3`), url: `/audio/narration/${locale}/${key}.mp3`, segments: merged });
    }
  }
  return [...jobs.values()];
}

function existing(path: string) {
  const dir = resolve(path, "..");
  const base = path.slice(dir.length + 1).replace(/\.mp3$/, "");
  if (!existsSync(dir)) return null;
  const file = readdirSync(dir).find((name) => name.replace(/\.(mp3|wav)$/, "") === base);
  return file ? resolve(dir, file) : null;
}

/**
 * Exercise questions, read aloud by the mascot. Recorded by hand in Google AI
 * Studio (see the notes on the Desktop), so they are never synthesised here:
 * files only need to exist at the listed path to get into the manifest.
 */
function questionJobs() {
  const jobs = new Map<string, { key: string; locale: string; text: string; out: string; url: string }>();
  for (const course of COURSES) for (const courseModule of course.modules) for (const lesson of courseModule.lessons) for (const exercise of lesson.exercises) {
    for (const locale of NARRATION_LOCALES) {
      const text = exercise.question[locale];
      if (!text) continue;
      const key = narrationKey(text);
      jobs.set(`${locale}|${key}`, { key, locale, text, out: resolve(PUBLIC, "audio", "question", locale, `${key}.mp3`), url: `/audio/question/${locale}/${key}.mp3` });
    }
  }
  return [...jobs.values()];
}

function writeManifest(phrases: ReturnType<typeof phraseJobs>, narration: ReturnType<typeof narrationJobs>) {
  const phraseMap: Record<string, Record<string, string>> = {};
  for (const job of phrases) {
    const file = existing(job.out);
    if (!file) continue;
    (phraseMap[job.lang] ??= {})[job.key] = `/audio/${job.lang}/${file.split(/[\\/]/).pop()}`;
  }
  const narrationMap: Record<string, string> = {};
  for (const job of narration) if (existsSync(job.out)) narrationMap[job.key] = job.url;
  for (const job of questionJobs()) if (existsSync(job.out)) narrationMap[job.key] = job.url;
  writeFileSync(MANIFEST, [
    "// Generated by scripts/generate-audio.ts — do not edit.",
    "// phraseAudio: language → phraseKey(text) → file; narrationAudio: narrationKey(theory) → file.",
    `export const phraseAudio: Record<string, Record<string, string>> = ${JSON.stringify(phraseMap, null, 2)};`,
    `export const narrationAudio: Record<string, string> = ${JSON.stringify(narrationMap, null, 2)};`,
    "",
  ].join("\n"));
  console.log(`Manifest: ${Object.values(phraseMap).reduce((sum, map) => sum + Object.keys(map).length, 0)} phrase(s), ${Object.keys(narrationMap).length} narration(s)`);
}

function main() {
  const phrases = phraseJobs();
  const narration = narrationJobs();
  if (process.argv.includes("--list-questions")) { writeFileSync(process.argv[process.argv.indexOf("--list-questions") + 1], JSON.stringify(questionJobs().map(({ key, locale, text }) => ({ key, locale, text })))); return; }
  const todo = [...phrases, ...narration].filter((job) => force || !existing(job.out));
  console.log(`${phrases.length} phrase(s), ${narration.length} narration(s); ${todo.length} to synthesise`);
  if (dryRun) { for (const job of todo) console.log(`  ${job.url}: ${job.segments.map((s) => `[${s.voice.slice(0, 2)}] ${s.text.replace(/\n/g, " / ")}`).join(" ")}`); return; }
  if (!manifestOnly && todo.length) {
    const jobsFile = resolve(PUBLIC, "..", ".audio-jobs.json");
    writeFileSync(jobsFile, JSON.stringify(todo.map(({ out, segments: parts }) => ({ out, segments: parts }))));
    for (const job of todo) mkdirSync(resolve(job.out, ".."), { recursive: true });
    execFileSync(process.env.PYTHON ?? "python", [resolve("scripts/edge-tts-batch.py"), jobsFile], { stdio: "inherit", env: { ...process.env, PYTHONIOENCODING: "utf-8" } });
  }
  writeManifest(phrases, narration);
}

main();
