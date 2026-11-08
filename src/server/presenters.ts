import { isLocale } from "@/src/i18n/config";
import type { CurrentUser } from "@/src/server/auth/session";
import type { AppUser } from "@/src/types/app";

export function toAppUser(user: CurrentUser): AppUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    locale: isLocale(user.locale) ? user.locale : "ru",
    xp: user.xp,
    streak: user.streak,
    longestStreak: user.longestStreak,
    preference: user.preference ? {
      sourceLanguage: user.preference.sourceLanguage,
      targetLanguage: user.preference.targetLanguage,
      dailyGoalMinutes: user.preference.dailyGoalMinutes,
      notificationsEnabled: user.preference.notificationsEnabled,
      timezone: user.preference.timezone,
      theme: user.preference.theme === "light" || user.preference.theme === "dark" ? user.preference.theme : "system",
      soundEnabled: user.preference.soundEnabled,
      soundVolume: user.preference.soundVolume,
      effectsEnabled: user.preference.effectsEnabled,
      lessonSoundsEnabled: user.preference.lessonSoundsEnabled,
    } : null,
  };
}
