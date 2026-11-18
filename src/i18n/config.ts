import { en } from "./dictionaries/en";
import { ru } from "./dictionaries/ru";
import { uz } from "./dictionaries/uz";
import { zh } from "./dictionaries/zh";

export const locales = ["uz", "ru", "zh", "en"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  uz: "Özbekça",
  ru: "Русский",
  zh: "中文",
  en: "English",
};

export type Dictionary = typeof ru;

const dictionaries: Record<Locale, Dictionary> = { uz, ru, zh, en };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function getDictionary(locale: string | null | undefined): Dictionary {
  return dictionaries[isLocale(locale) ? locale : "ru"];
}

export function detectLocale(language: string | undefined): Locale {
  const normalized = language?.toLowerCase() ?? "";
  if (normalized.startsWith("uz")) return "uz";
  if (normalized.startsWith("zh")) return "zh";
  if (normalized.startsWith("en")) return "en";
  return "ru";
}
