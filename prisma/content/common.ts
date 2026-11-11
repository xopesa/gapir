// Shared types and helpers for course content files.
// Texts: zh is required (primary explanation language for the zh→uz course);
// missing locales fall back to the course source language at runtime.
// Uzbek uses the new Latin alphabet (2026 law): Ö Ğ Ş Ç instead of Oʻ Gʻ Sh Ch;
// the tutuq belgisi is ʼ (U+02BC). Answer checking also accepts the old spelling.

export type ContentLocale = "zh" | "ru" | "uz" | "en";
export type Text = Partial<Record<ContentLocale, string>> & { zh: string };
export type Mascot = "panda" | "dragon" | "tiger";

export type ExerciseContent =
  | { type: "MULTIPLE_CHOICE"; mascot?: Mascot; prompt?: string; speak?: string; instruction: Text; question: Text; explanation: Text; options: Array<{ text: Text; correct?: boolean; image?: string }> }
  | { type: "MATCHING"; mascot?: Mascot; instruction: Text; question: Text; explanation: Text; pairs: Array<{ left: string; right: string }> }
  | { type: "ARRANGE_WORDS"; mascot?: Mascot; prompt?: string; instruction: Text; question: Text; explanation: Text; words: string[]; correctWords: string[] }
  | { type: "TRANSLATE"; mascot?: Mascot; prompt?: string; instruction: Text; question: Text; explanation: Text; acceptedAnswers: string[] };

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
  type: { zh: "用乌兹别克语输入", ru: "Напишите по-узбекски", uz: "Özbekça yozing", en: "Type in Uzbek" },
  culture: { zh: "文化小知识", ru: "Культура", uz: "Madaniyat", en: "Culture" },
} satisfies Record<string, Text>;

/**
 * A word-meaning option. Only zh/ru are given on purpose: for the Uzbek
 * interface the option must not be the Uzbek word itself, so it falls back to zh.
 */
export const word = (zh: string, ru: string, image?: string, correct = false) => ({ text: { zh, ru }, image, correct });

/** Word-meaning option for a Russian-target course: zh/uz only, so the Russian interface falls back to zh. */
export const meaning = (zh: string, uz: string, image?: string, correct = false) => ({ text: { zh, uz }, image, correct });
