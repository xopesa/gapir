import type { Locale } from "@/src/i18n/config";
import { prisma } from "@/src/server/db";
import { onboardingSchema, userPreferenceSettingsSchema } from "@/src/server/validation/schemas";

export async function updateOnboarding(userId: string, input: unknown) {
  const data = onboardingSchema.parse(input);
  return prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: userId }, data: { locale: data.locale } });
    const preference = await tx.userPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
    const course = await tx.course.findFirst({
      where: {
        sourceLanguage: data.sourceLanguage,
        targetLanguage: data.targetLanguage,
        status: "PUBLISHED",
      },
      orderBy: { order: "asc" },
    });
    if (course) {
      await tx.userCourse.upsert({
        where: { userId_courseId: { userId, courseId: course.id } },
        update: {},
        create: { userId, courseId: course.id },
      });
    }
    return preference;
  });
}

export async function updateLocale(userId: string, locale: Locale) {
  return prisma.user.update({ where: { id: userId }, data: { locale } });
}

export async function updateUserPreferences(userId: string, input: unknown) {
  const data = userPreferenceSettingsSchema.parse(input);
  const { locale, ...preferenceData } = data;
  return prisma.$transaction(async (tx) => {
    if (locale) await tx.user.update({ where: { id: userId }, data: { locale } });
    const preference = Object.keys(preferenceData).length
      ? await tx.userPreference.upsert({
          where: { userId },
          update: preferenceData,
          create: { userId, ...preferenceData },
        })
      : await tx.userPreference.findUnique({ where: { userId } });
    return { locale, preference };
  });
}

export async function listUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, locale: true, xp: true, streak: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}
