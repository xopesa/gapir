// Idempotent loader for course content files (prisma/content/*.ts).
// Re-running updates texts in place and removes exercises/options that were
// dropped from the content, keeping user progress rows for lessons that remain.
import type { PrismaClient } from "../../generated/prisma/client";
import type { ContentLocale, CourseContent, ExerciseContent, Text } from "./common";

const LOCALES: ContentLocale[] = ["zh", "ru", "uz", "en"];

function pick(text: Text | undefined, locale: ContentLocale) {
  return text?.[locale];
}

function payloadOf(exercise: ExerciseContent) {
  const display = { mascot: exercise.mascot, ...(exercise.teach ? { teach: exercise.teach } : {}), ...("prompt" in exercise && exercise.prompt ? { prompt: exercise.prompt } : {}) };
  switch (exercise.type) {
    case "MULTIPLE_CHOICE":
      return {
        ...display,
        ...(exercise.speak ? { speak: exercise.speak } : {}),
        ...(exercise.listen ? { listen: true } : {}),
        ...(exercise.options.some((option) => option.image) ? { optionImages: exercise.options.map((option) => option.image ?? null) } : {}),
      };
    case "MATCHING":
      return { ...display, pairs: exercise.pairs };
    case "ARRANGE_WORDS":
      return { ...display, words: exercise.words, correctWords: exercise.correctWords };
    case "TRANSLATE":
      return { ...display, acceptedAnswers: exercise.acceptedAnswers };
  }
}

export async function seedCourseContent(prisma: PrismaClient, content: CourseContent) {
  const courseData = { sourceLanguage: content.sourceLanguage, targetLanguage: content.targetLanguage, level: content.level, status: "PUBLISHED" as const, order: content.order, isPremium: false };
  const course = await prisma.course.upsert({ where: { slug: content.slug }, update: courseData, create: { slug: content.slug, ...courseData } });
  for (const locale of LOCALES) {
    const title = pick(content.title, locale);
    if (!title) continue;
    const description = pick(content.description, locale) ?? "";
    await prisma.courseTranslation.upsert({ where: { courseId_locale: { courseId: course.id, locale } }, update: { title, description }, create: { courseId: course.id, locale, title, description } });
  }

  for (const [moduleIndex, moduleContent] of content.modules.entries()) {
    const courseModule = await prisma.module.upsert({
      where: { courseId_order: { courseId: course.id, order: moduleIndex + 1 } },
      update: { status: "PUBLISHED" },
      create: { courseId: course.id, order: moduleIndex + 1, status: "PUBLISHED" },
    });
    for (const locale of LOCALES) {
      const title = pick(moduleContent.title, locale);
      if (!title) continue;
      const description = pick(moduleContent.description, locale) ?? "";
      await prisma.moduleTranslation.upsert({ where: { moduleId_locale: { moduleId: courseModule.id, locale } }, update: { title, description }, create: { moduleId: courseModule.id, locale, title, description } });
    }

    for (const [lessonIndex, lessonContent] of moduleContent.lessons.entries()) {
      const lessonData = { type: lessonContent.type, xpReward: lessonContent.xpReward, estimatedMinutes: lessonContent.estimatedMinutes, status: "PUBLISHED" as const };
      const lesson = await prisma.lesson.upsert({
        where: { moduleId_order: { moduleId: courseModule.id, order: lessonIndex + 1 } },
        update: lessonData,
        create: { moduleId: courseModule.id, order: lessonIndex + 1, ...lessonData },
      });
      for (const locale of LOCALES) {
        const title = pick(lessonContent.title, locale);
        if (!title) continue;
        const data = { title, description: pick(lessonContent.description, locale) ?? "", theory: pick(lessonContent.theory, locale) ?? "" };
        await prisma.lessonTranslation.upsert({ where: { lessonId_locale: { lessonId: lesson.id, locale } }, update: data, create: { lessonId: lesson.id, locale, ...data } });
      }

      for (const [exerciseIndex, exerciseContent] of lessonContent.exercises.entries()) {
        const order = exerciseIndex + 1;
        const exerciseData = { type: exerciseContent.type, payload: JSON.stringify(payloadOf(exerciseContent)), xpReward: 5, status: "PUBLISHED" as const };
        const exercise = await prisma.exercise.upsert({
          where: { lessonId_order: { lessonId: lesson.id, order } },
          update: exerciseData,
          create: { lessonId: lesson.id, order, ...exerciseData },
        });
        for (const locale of LOCALES) {
          const question = pick(exerciseContent.question, locale);
          if (!question) continue;
          const data = {
            instruction: pick(exerciseContent.instruction, locale) ?? exerciseContent.instruction.zh,
            question,
            explanation: pick(exerciseContent.explanation, locale) ?? exerciseContent.explanation.zh,
          };
          await prisma.exerciseTranslation.upsert({ where: { exerciseId_locale: { exerciseId: exercise.id, locale } }, update: data, create: { exerciseId: exercise.id, locale, ...data } });
        }

        const options = exerciseContent.type === "MULTIPLE_CHOICE" ? exerciseContent.options : [];
        for (const [optionIndex, optionContent] of options.entries()) {
          const option = await prisma.exerciseOption.upsert({
            where: { exerciseId_order: { exerciseId: exercise.id, order: optionIndex + 1 } },
            update: { isCorrect: Boolean(optionContent.correct) },
            create: { exerciseId: exercise.id, order: optionIndex + 1, isCorrect: Boolean(optionContent.correct) },
          });
          for (const locale of LOCALES) {
            const text = pick(optionContent.text, locale);
            if (!text) continue;
            await prisma.exerciseOptionTranslation.upsert({ where: { optionId_locale: { optionId: option.id, locale } }, update: { text }, create: { optionId: option.id, locale, text } });
          }
        }
        await prisma.exerciseOption.deleteMany({ where: { exerciseId: exercise.id, order: { gt: options.length } } });
      }
      await prisma.exercise.deleteMany({ where: { lessonId: lesson.id, order: { gt: lessonContent.exercises.length } } });
    }
  }
  return course;
}
