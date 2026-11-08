import { prisma } from "@/src/server/db";

function localized<T extends { locale: string }>(items: T[], locale: string) {
  return items.find((item) => item.locale === locale) ?? items.find((item) => item.locale === "ru") ?? items[0];
}

export async function getLearningDashboard(userId: string, locale: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { preference: true, lessonProgress: true },
  });
  const preference = user.preference ?? { sourceLanguage: "ru", targetLanguage: "uz" };
  const course = await prisma.course.findFirst({
    where: {
      sourceLanguage: preference.sourceLanguage,
      targetLanguage: preference.targetLanguage,
      status: "PUBLISHED",
    },
    orderBy: { order: "asc" },
    include: {
      translations: true,
      modules: {
        where: { status: "PUBLISHED" },
        orderBy: { order: "asc" },
        include: {
          translations: true,
          lessons: {
            where: { status: "PUBLISHED" },
            orderBy: { order: "asc" },
            include: { translations: true },
          },
        },
      },
    },
  });
  if (!course) return { user, course: null, modules: [], progressPercent: 0 };

  const progressByLesson = new Map(user.lessonProgress.map((item) => [item.lessonId, item]));
  let previousCompleted = true;
  const modules = course.modules.map((module) => ({
    id: module.id,
    title: localized(module.translations, locale)?.title ?? "",
    lessons: module.lessons.map((lesson) => {
      const progress = progressByLesson.get(lesson.id);
      const status: "completed" | "in_progress" | "available" | "locked" = progress?.status === "COMPLETED"
        ? "completed"
        : progress?.status === "IN_PROGRESS"
          ? "in_progress"
          : previousCompleted
            ? "available"
            : "locked";
      previousCompleted = status === "completed";
      const translation = localized(lesson.translations, locale);
      return {
        id: lesson.id,
        title: translation?.title ?? "",
        description: translation?.description ?? "",
        status,
        xpReward: lesson.xpReward,
        estimatedMinutes: lesson.estimatedMinutes,
      };
    }),
  }));
  const allLessons = modules.flatMap((module) => module.lessons);
  const completed = allLessons.filter((lesson) => lesson.status === "completed").length;
  return {
    user,
    course: {
      id: course.id,
      title: localized(course.translations, locale)?.title ?? course.slug,
      description: localized(course.translations, locale)?.description ?? "",
      level: course.level,
      sourceLanguage: course.sourceLanguage,
      targetLanguage: course.targetLanguage,
    },
    modules,
    progressPercent: allLessons.length ? Math.round((completed / allLessons.length) * 100) : 0,
  };
}
