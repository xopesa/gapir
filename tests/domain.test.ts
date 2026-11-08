import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/src/server/auth/password";
import { canAccessAdmin } from "@/src/server/auth/authorization";
import { checkExerciseAnswer, validateLessonForPublication } from "@/src/server/services/lesson-service";
import { lessonXpGrant, nextStreakState } from "@/src/server/services/progress-service";
import { createCourseSchema, registerSchema, userPreferenceSettingsSchema } from "@/src/server/validation/schemas";
import { isThemePreference } from "@/src/lib/theme/theme-types";

describe("Gapir domain", () => {
  it("validates and normalizes registration data", () => {
    const result = registerSchema.parse({ name: " Test User ", email: " TEST@Example.COM ", password: "secret123", confirmPassword: "secret123", locale: "ru", acceptedTerms: true });
    expect(result.name).toBe("Test User");
    expect(result.email).toBe("test@example.com");
  });

  it("hashes passwords and verifies without exposing plaintext", async () => {
    const passwordHash = await hashPassword("secret123");
    expect(passwordHash).not.toContain("secret123");
    expect(await verifyPassword("secret123", passwordHash)).toBe(true);
    expect(await verifyPassword("wrong123", passwordHash)).toBe(false);
  });

  it("enforces admin roles", () => {
    expect(canAccessAdmin("USER")).toBe(false);
    expect(canAccessAdmin("CONTENT_EDITOR")).toBe(true);
    expect(canAccessAdmin("ADMIN")).toBe(true);
    expect(canAccessAdmin("OWNER")).toBe(true);
  });

  it("validates course creation", () => {
    const translations = ["uz", "ru", "zh", "en"].map((locale) => ({ locale, title: "Course", description: "Description" }));
    expect(createCourseSchema.parse({ sourceLanguage: "ru", targetLanguage: "uz", level: "A1", slug: "uzbek-a1", status: "DRAFT", order: 1, isPremium: false, coverImageUrl: "", translations }).slug).toBe("uzbek-a1");
  });

  it("rejects publishing an invalid lesson", () => {
    const errors = validateLessonForPublication({ translations: [{ title: "" }], exercises: [] });
    expect(errors).toContain("LESSON_TITLE_REQUIRED");
    expect(errors).toContain("EXERCISE_REQUIRED");
  });

  it("normalizes translate answers", () => {
    expect(checkExerciseAnswer("TRANSLATE", { acceptedAnswers: ["Rahmat"] }, "  RAHMAT  ")).toBe(true);
  });

  it("grants lesson XP only once", () => {
    expect(lessonXpGrant("IN_PROGRESS", 20)).toBe(20);
    expect(lessonXpGrant("COMPLETED", 20)).toBe(0);
  });

  it("updates streak once per calendar day", () => {
    const now = new Date("2026-08-01T08:00:00.000Z");
    const yesterday = new Date("2026-07-31T08:00:00.000Z");
    expect(nextStreakState(yesterday, now, "Asia/Tashkent", 4, 7)).toMatchObject({ streak: 5, longestStreak: 7, changed: true });
    expect(nextStreakState(now, now, "Asia/Tashkent", 5, 7)).toMatchObject({ streak: 5, changed: false });
  });

  it("accepts valid appearance and sound preferences", () => {
    const result = userPreferenceSettingsSchema.parse({ theme: "dark", soundEnabled: true, soundVolume: 0.65, effectsEnabled: false, lessonSoundsEnabled: true });
    expect(result).toMatchObject({ theme: "dark", soundVolume: 0.65, effectsEnabled: false });
    expect(() => userPreferenceSettingsSchema.parse({ soundVolume: 1.2 })).toThrow();
  });

  it("recognizes only supported theme modes", () => {
    expect(isThemePreference("system")).toBe(true);
    expect(isThemePreference("midnight")).toBe(false);
  });
});
