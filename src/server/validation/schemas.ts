import { z } from "zod";
import { locales } from "@/src/i18n/config";

export const passwordSchema = z
  .string()
  .min(8, "Пароль должен содержать минимум 8 символов")
  .regex(/[\p{L}]/u, "Добавьте хотя бы одну букву")
  .regex(/\d/, "Добавьте хотя бы одну цифру");

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
  locale: z.enum(locales).optional(),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().toLowerCase().email(),
    password: passwordSchema,
    confirmPassword: z.string(),
    locale: z.enum(locales),
    acceptedTerms: z.literal(true),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
  });

export const onboardingSchema = z
  .object({
    locale: z.enum(locales),
    sourceLanguage: z.enum(["ru", "en", "zh", "uz"]),
    targetLanguage: z.enum(["uz", "zh", "ru"]),
    dailyGoalMinutes: z.union([z.literal(5), z.literal(10), z.literal(15), z.literal(20)]),
    timezone: z.string().min(1).default("Asia/Tashkent"),
  })
  .refine(
    (value) =>
      ["ru:uz", "en:uz", "zh:uz", "uz:zh", "ru:zh", "en:zh", "zh:ru"].includes(
        `${value.sourceLanguage}:${value.targetLanguage}`,
      ),
    { message: "Это направление пока недоступно", path: ["sourceLanguage"] },
  );

const translationSchema = z.object({
  locale: z.enum(locales),
  title: z.string().trim().min(1),
  description: z.string().trim().default(""),
});

export const createCourseSchema = z.object({
  sourceLanguage: z.enum(["ru", "en", "zh", "uz"]),
  targetLanguage: z.enum(["uz", "zh", "ru"]),
  level: z.string().trim().min(1).max(16),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  order: z.coerce.number().int().min(0).default(0),
  isPremium: z.boolean().default(false),
  coverImageUrl: z.union([z.string().url(), z.literal("")]).optional(),
  translations: z.array(translationSchema).length(4),
});

export const createModuleSchema = z.object({
  courseId: z.string().min(1),
  order: z.coerce.number().int().min(0),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  translations: z.array(translationSchema).length(4),
});

export const lessonTranslationSchema = translationSchema.extend({ theory: z.string().default("") });

export const createLessonSchema = z.object({
  moduleId: z.string().min(1),
  type: z.enum(["VOCABULARY", "GRAMMAR", "CONVERSATION"]),
  order: z.coerce.number().int().min(0),
  xpReward: z.coerce.number().int().min(0).max(1000),
  estimatedMinutes: z.coerce.number().int().min(1).max(180),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  videoUrl: z.union([z.string().url(), z.literal("")]).optional(),
  audioUrl: z.union([z.string().url(), z.literal("")]).optional(),
  thumbnailUrl: z.union([z.string().url(), z.literal("")]).optional(),
  translations: z.array(lessonTranslationSchema).length(4),
});

export const updateLessonSchema = z.object({
  type: z.enum(["VOCABULARY", "GRAMMAR", "CONVERSATION"]).optional(),
  xpReward: z.coerce.number().int().min(0).max(1000).optional(),
  estimatedMinutes: z.coerce.number().int().min(1).max(180).optional(),
  videoUrl: z.union([z.string().url(), z.literal("")]).optional(),
  audioUrl: z.union([z.string().url(), z.literal("")]).optional(),
  thumbnailUrl: z.union([z.string().url(), z.literal("")]).optional(),
  translations: z.array(lessonTranslationSchema).length(4).optional(),
});

export const createExerciseSchema = z.object({
  lessonId: z.string().min(1),
  type: z.enum(["MULTIPLE_CHOICE", "ARRANGE_WORDS", "MATCHING", "TRANSLATE"]),
  order: z.coerce.number().int().min(0),
  xpReward: z.coerce.number().int().min(0).max(100),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  payload: z.record(z.string(), z.unknown()).default({}),
  translations: z.array(z.object({
    locale: z.enum(locales), instruction: z.string().trim().min(1), question: z.string().trim().min(1), explanation: z.string().default(""),
  })).length(4),
  options: z.array(z.object({
    order: z.number().int().min(0), isCorrect: z.boolean(),
    translations: z.array(z.object({ locale: z.enum(locales), text: z.string().trim().min(1) })).length(4),
  })).default([]),
});

export const answerSchema = z.object({ answer: z.unknown() });

export const userPreferenceSettingsSchema = z.object({
  locale: z.enum(locales).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  soundEnabled: z.boolean().optional(),
  soundVolume: z.number().min(0).max(1).optional(),
  effectsEnabled: z.boolean().optional(),
  lessonSoundsEnabled: z.boolean().optional(),
}).refine((value) => Object.values(value).some((item) => item !== undefined), {
  message: "EMPTY_PREFERENCES",
});
