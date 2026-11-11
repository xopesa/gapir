import type { Locale } from "@/src/i18n/config";
import { prisma } from "@/src/server/db";
import { onboardingSchema, userPreferenceSettingsSchema } from "@/src/server/validation/schemas";

export async function updateOnboarding(userId: string, input: unknown) {
  // `locale` belongs to User, not UserPreference (passing it there made Prisma reject the write).
  const { locale, ...data } = onboardingSchema.parse(input);
  // Read first, then write in one batch: Cloudflare D1 rejects interactive transactions.
  const course = await prisma.course.findFirst({
    where: {
      sourceLanguage: data.sourceLanguage,
      targetLanguage: data.targetLanguage,
      status: "PUBLISHED",
    },
    orderBy: { order: "asc" },
  });
  const [, preference] = await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { locale } }),
    prisma.userPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    }),
    ...(course
      ? [prisma.userCourse.upsert({
          where: { userId_courseId: { userId, courseId: course.id } },
          update: {},
          create: { userId, courseId: course.id },
        })]
      : []),
  ]);
  return preference;
}

export async function updateLocale(userId: string, locale: Locale) {
  return prisma.user.update({ where: { id: userId }, data: { locale } });
}

export async function updateUserPreferences(userId: string, input: unknown) {
  const data = userPreferenceSettingsSchema.parse(input);
  const { locale, ...preferenceData } = data;
  // No interactive transaction: Cloudflare D1 rejects them. Each write is independent.
  if (locale) await prisma.user.update({ where: { id: userId }, data: { locale } });
  const preference = Object.keys(preferenceData).length
    ? await prisma.userPreference.upsert({
        where: { userId },
        update: preferenceData,
        create: { userId, ...preferenceData },
      })
    : await prisma.userPreference.findUnique({ where: { userId } });
  return { locale, preference };
}

export async function listUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, locale: true, xp: true, streak: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}
