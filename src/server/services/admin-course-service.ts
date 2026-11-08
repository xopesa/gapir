import { prisma } from "@/src/server/db";
import { createCourseSchema, createExerciseSchema, createLessonSchema, createModuleSchema, updateLessonSchema } from "@/src/server/validation/schemas";
import { validateLessonForPublication } from "./lesson-service";

export async function getAdminStats() {
  const [users, courses, publishedCourses, drafts, modules, lessons, exercises, recent] = await Promise.all([
    prisma.user.count(), prisma.course.count(), prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.course.count({ where: { status: "DRAFT" } }), prisma.module.count(), prisma.lesson.count(), prisma.exercise.count(),
    prisma.lesson.findMany({ take: 5, orderBy: { updatedAt: "desc" }, include: { translations: { where: { locale: "ru" } } } }),
  ]);
  return { users, courses, publishedCourses, drafts, modules, lessons, exercises, recent };
}

export async function createCourse(input: unknown) {
  const data = createCourseSchema.parse(input);
  const { translations, coverImageUrl, ...course } = data;
  return prisma.course.create({
    data: { ...course, coverImageUrl: coverImageUrl || null, translations: { create: translations } },
  });
}

export async function createModule(input: unknown) {
  const data = createModuleSchema.parse(input);
  const { translations, ...module } = data;
  return prisma.module.create({ data: { ...module, translations: { create: translations } } });
}

export async function createLesson(input: unknown) {
  const data = createLessonSchema.parse(input);
  const { translations, videoUrl, audioUrl, thumbnailUrl, ...lesson } = data;
  return prisma.lesson.create({
    data: { ...lesson, videoUrl: videoUrl || null, audioUrl: audioUrl || null, thumbnailUrl: thumbnailUrl || null, translations: { create: translations } },
  });
}

export async function createExercise(input: unknown) {
  const data = createExerciseSchema.parse(input);
  const { translations, options, payload, ...exercise } = data;
  return prisma.exercise.create({
    data: {
      ...exercise,
      payload: JSON.stringify(payload),
      translations: { create: translations },
      options: {
        create: options.map((option) => ({
          order: option.order,
          isCorrect: option.isCorrect,
          translations: { create: option.translations },
        })),
      },
    },
  });
}

export async function setLessonStatus(lessonId: string, status: "DRAFT" | "PUBLISHED") {
  if (status === "PUBLISHED") {
    const lesson = await prisma.lesson.findUniqueOrThrow({ where: { id: lessonId }, include: { translations: true, exercises: { include: { options: true } } } });
    const errors = validateLessonForPublication(lesson);
    if (errors.length) throw new Error(`PUBLISH_INVALID:${errors.join(",")}`);
  }
  return prisma.lesson.update({ where: { id: lessonId }, data: { status } });
}

export async function updateLesson(lessonId: string, input: unknown) {
  const data = updateLessonSchema.parse(input);
  const { translations, videoUrl, audioUrl, thumbnailUrl, ...lesson } = data;
  return prisma.$transaction(async (tx) => {
    await tx.lesson.update({
      where: { id: lessonId },
      data: {
        ...lesson,
        ...(videoUrl !== undefined ? { videoUrl: videoUrl || null } : {}),
        ...(audioUrl !== undefined ? { audioUrl: audioUrl || null } : {}),
        ...(thumbnailUrl !== undefined ? { thumbnailUrl: thumbnailUrl || null } : {}),
      },
    });
    for (const item of translations ?? []) {
      await tx.lessonTranslation.upsert({
        where: { lessonId_locale: { lessonId, locale: item.locale } },
        update: { title: item.title, description: item.description, theory: item.theory },
        create: { lessonId, ...item },
      });
    }
    return tx.lesson.findUniqueOrThrow({ where: { id: lessonId }, include: { translations: true } });
  });
}

export async function listCourses() {
  return prisma.course.findMany({ include: { translations: { where: { locale: "ru" } }, _count: { select: { modules: true } } }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
}

export async function getAdminCourse(courseId: string) {
  return prisma.course.findUnique({ where: { id: courseId }, include: { translations: true, modules: { orderBy: { order: "asc" }, include: { translations: true, lessons: { orderBy: { order: "asc" }, include: { translations: true } } } } } });
}

export async function getAdminLesson(lessonId: string) {
  return prisma.lesson.findUnique({ where: { id: lessonId }, include: { translations: true, exercises: { orderBy: { order: "asc" }, include: { translations: true, options: { orderBy: { order: "asc" }, include: { translations: true } } } } } });
}
