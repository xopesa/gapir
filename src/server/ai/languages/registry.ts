import { AiError } from "../errors/ai-error";

export type LanguageCode = "uz" | "zh-CN";
export type TutorDirection = "uz_to_zh" | "zh_to_uz";

export type LanguageDefinition = {
  code: LanguageCode;
  script: string;
  displayNames: Record<"uz" | "ru" | "en" | "zh", string>;
  sttSupported: boolean;
  ttsSupported: boolean;
  normalize: (value: string) => string;
};

function normalizeWhitespace(value: string) {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim();
}

function normalizeUzbek(value: string) {
  return normalizeWhitespace(value)
    .replace(/[’'`ʻ]/g, "‘")
    .replace(/O‘/g, "O‘")
    .replace(/G‘/g, "G‘");
}

function normalizeChinese(value: string) {
  return normalizeWhitespace(value)
    .replace(/\s*([，。！？；：、])\s*/g, "$1");
}

const registry = new Map<LanguageCode, LanguageDefinition>([
  ["uz", {
    code: "uz",
    script: "Latin",
    displayNames: { uz: "O‘zbekcha", ru: "Узбекский", en: "Uzbek", zh: "乌兹别克语" },
    sttSupported: true,
    ttsSupported: true,
    normalize: normalizeUzbek,
  }],
  ["zh-CN", {
    code: "zh-CN",
    script: "Simplified Chinese",
    displayNames: { uz: "Xitoycha", ru: "Китайский", en: "Chinese", zh: "简体中文" },
    sttSupported: true,
    ttsSupported: true,
    normalize: normalizeChinese,
  }],
]);

const directions: Record<TutorDirection, { nativeLanguage: LanguageCode; targetLanguage: LanguageCode }> = {
  uz_to_zh: { nativeLanguage: "uz", targetLanguage: "zh-CN" },
  zh_to_uz: { nativeLanguage: "zh-CN", targetLanguage: "uz" },
};

export function getLanguage(code: string) {
  return registry.get(code as LanguageCode) ?? null;
}

export function listLanguages() {
  return [...registry.values()];
}

export function resolveDirection(direction: string) {
  const resolved = directions[direction as TutorDirection];
  if (!resolved) throw new AiError("AI_INVALID_RESPONSE", "Unsupported AI Tutor direction.", { retryable: false });
  return { id: direction as TutorDirection, ...resolved };
}

export function normalizeLanguageText(language: LanguageCode, text: string) {
  const definition = getLanguage(language);
  if (!definition) return normalizeWhitespace(text);
  return definition.normalize(text);
}

export const SUPPORTED_TUTOR_DIRECTIONS = Object.freeze(Object.keys(directions) as TutorDirection[]);
