// Shared types and helpers for course content files.
// Texts: zh is required (primary explanation language for the zh→uz course);
// missing locales fall back to the course source language at runtime.
// Uzbek uses the new Latin alphabet (2026 law): Ö Ğ Ş Ç instead of Oʻ Gʻ Sh Ch;
// the tutuq belgisi is ʼ (U+02BC). Answer checking also accepts the old spelling.

export type ContentLocale = "zh" | "ru" | "uz" | "en";
export type Text = Partial<Record<ContentLocale, string>> & { zh: string };
export type Mascot = "panda" | "dragon" | "tiger";

/**
 * `teach`: a short explanation (one or two facts) the mascot gives — and reads
 * aloud — right before this exercise, so the lesson teaches step by step
 * instead of all theory up front.
 */
export type ExerciseContent = { teach?: Text } & (
  | { type: "MULTIPLE_CHOICE"; mascot?: Mascot; prompt?: string; speak?: string; /** Audio only: hear `speak`, pick it (book: 听录音). */ listen?: boolean; instruction: Text; question: Text; explanation: Text; options: Array<{ text: Text; correct?: boolean; image?: string }> }
  | { type: "MATCHING"; mascot?: Mascot; instruction: Text; question: Text; explanation: Text; pairs: Array<{ left: string; right: string }> }
  | { type: "ARRANGE_WORDS"; mascot?: Mascot; prompt?: string; instruction: Text; question: Text; explanation: Text; words: string[]; correctWords: string[] }
  /**
   * No keyboard: the answer is built from `tiles` (words, or letters for one
   * word), or — with `say` — spoken into the microphone after hearing `speak`.
   */
  | { type: "TRANSLATE"; mascot?: Mascot; prompt?: string; speak?: string; say?: boolean; tiles?: string[]; instruction: Text; question: Text; explanation: Text; acceptedAnswers: string[] }
);

export interface LessonContent {
  type: "VOCABULARY" | "GRAMMAR" | "CONVERSATION";
  xpReward: number;
  estimatedMinutes: number;
  title: Text;
  description: Text;
  theory: Text;
  exercises: ExerciseContent[];
}

export interface ModuleContent { title: Text; description: Text; lessons: LessonContent[] }

export interface CourseContent {
  slug: string;
  sourceLanguage: string;
  targetLanguage: string;
  level: string;
  order: number;
  title: Text;
  description: Text;
  modules: ModuleContent[];
}

/** The same string in every locale (numbers, Uzbek words, letters). */
export const same = (value: string): Text => ({ zh: value, ru: value, uz: value, en: value });

/** Standard exercise instructions. */
export const I = {
  choose: { zh: "选择正确答案", ru: "Выберите правильный ответ", uz: "Töğri javobni tanlang", en: "Choose the correct answer" },
  meaning: { zh: "选择正确的意思", ru: "Выберите правильное значение", uz: "Töğri maʼnoni tanlang", en: "Choose the correct meaning" },
  match: { zh: "点击配对", ru: "Соедините пары", uz: "Juftlarni toping", en: "Tap the matching pairs" },
  build: { zh: "用单词组成句子", ru: "Составьте фразу из слов", uz: "Sözlardan gap tuzing", en: "Build the sentence" },
  type: { zh: "用乌兹别克语回答", ru: "Составьте ответ по-узбекски", uz: "Özbekça javob tuzing", en: "Build the answer in Uzbek" },
  say: { zh: "大声说出来", ru: "Скажите вслух", uz: "Ovoz çiqarib ayting", en: "Say it aloud" },
  listen: { zh: "听一听，选出你听到的", ru: "Послушайте и выберите, что слышите", uz: "Tinglang va eşitganingizni tanlang", en: "Listen and choose what you hear" },
  gap: { zh: "选出缺少的字母", ru: "Выберите пропущенную букву", uz: "Tuşib qolgan harfni tanlang", en: "Choose the missing letter" },
  culture: { zh: "文化小知识", ru: "Культура", uz: "Madaniyat", en: "Culture" },
} satisfies Record<string, Text>;

/**
 * A word-meaning option. Only zh/ru are given on purpose: for the Uzbek
 * interface the option must not be the Uzbek word itself, so it falls back to zh.
 */
export const word = (zh: string, ru: string, image?: string, correct = false) => ({ text: { zh, ru }, image, correct });

/** Word-meaning option for a Russian-target course: zh/uz only, so the Russian interface falls back to zh. */
export const meaning = (zh: string, uz: string, image?: string, correct = false) => ({ text: { zh, uz }, image, correct });

/** One question for every speaking exercise, so it is voiced once. */
export const SAY_QUESTION: Text = { zh: "点击麦克风，跟着读", ru: "Нажмите на микрофон и повторите", uz: "Mikrofonni bosing va takrorlang", en: "Tap the microphone and repeat" };

/** Speaking exercise (book: 跟读): the mascot says `phrase`, the learner repeats it into the microphone. */
export function say(phrase: string, zh: string, uz: string, mascot: Mascot = "panda"): ExerciseContent {
  return {
    type: "TRANSLATE", mascot, say: true, speak: phrase, prompt: phrase, instruction: I.say, question: SAY_QUESTION,
    explanation: { zh: `${phrase} — ${zh}`, ru: phrase, uz: `${phrase} — ${uz}` },
    acceptedAnswers: [phrase],
  };
}

/** Listening exercise (book: 听录音): hear `heard`, pick it among `others`. */
export function hear(heard: string, others: string[], question: Text, explanation: Text, mascot: Mascot = "dragon"): ExerciseContent {
  return {
    type: "MULTIPLE_CHOICE", mascot, listen: true, speak: heard, instruction: I.listen, question, explanation,
    options: [{ text: same(heard), correct: true }, ...others.map((other) => ({ text: same(other) }))],
  };
}
