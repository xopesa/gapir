import type { Dictionary, Locale } from "@/src/i18n/config";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "CONTENT_EDITOR" | "ADMIN" | "OWNER";
  locale: Locale;
  xp: number;
  streak: number;
  longestStreak: number;
  preference: {
    sourceLanguage: string;
    targetLanguage: string;
    dailyGoalMinutes: number;
    notificationsEnabled: boolean;
    timezone: string;
    theme: "light" | "dark" | "system";
    soundEnabled: boolean;
    soundVolume: number;
    effectsEnabled: boolean;
    lessonSoundsEnabled: boolean;
  } | null;
}

export type AppDictionary = Dictionary;
