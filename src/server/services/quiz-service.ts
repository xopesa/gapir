import { READY_QUIZ_MAX, parseOptions, questionYield, questionsFromExercises, readyQuizSize, type ExerciseSource, type QuizQuestionData } from "@/src/lib/quiz/logic";
import { prisma } from "@/src/server/db";
import { quizFromLessonsSchema, quizSchema } from "@/src/server/validation/schemas";
import { lessonInclude, localized, parsePayload } from "./lesson-service";

// A teacher's own quizzes. Every function takes the owner's id: one teacher
// never sees or changes another teacher's quiz.

function toQuestionRows(quizId: string, questions: QuizQuestionData[]) {
  return questions.map((question, index) => ({
    quizId, order: index + 1, text: question.text, options: JSON.stringify(question.options),
    correctIndex: question.correctIndex, timeLimitSec: question.timeLimitSec,
  }));
}

export async function listQuizzes(ownerId: string) {
  const quizzes = await prisma.quiz.findMany({
    where: { ownerId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, description: true, updatedAt: true, _count: { select: { questions: true, games: true } } },
  });
  return quizzes.map((quiz) => ({
    id: quiz.id, title: quiz.title, description: quiz.description, updatedAt: quiz.updatedAt.toISOString(),
    questionCount: quiz._count.questions, gameCount: quiz._count.games,
  }));
}

export async function getQuiz(ownerId: string, quizId: string) {
  const quiz = await prisma.quiz.findFirst({ where: { id: quizId, ownerId }, include: { questions: { orderBy: { order: "asc" } } } });
  if (!quiz) throw new Error("QUIZ_NOT_FOUND");
  return {
    id: quiz.id, title: quiz.title, description: quiz.description,
    questions: quiz.questions.map((question): QuizQuestionData => ({
      text: question.text, options: parseOptions(question.options), correctIndex: question.correctIndex, timeLimitSec: question.timeLimitSec,
    })),
  };
}

export type QuizView = Awaited<ReturnType<typeof getQuiz>>;
export type QuizListItem = Awaited<ReturnType<typeof listQuizzes>>[number];

export async function createQuiz(ownerId: string, input: unknown) {
  const data = quizSchema.parse(input);
  const quiz = await prisma.quiz.create({ data: { ownerId, title: data.title, description: data.description } });
  // One statement per question: Cloudflare D1 allows few bound values per statement.
  if (data.questions.length) await prisma.$transaction(toQuestionRows(quiz.id, data.questions).map((row) => prisma.quizQuestion.create({ data: row })));
  return { id: quiz.id };
}

/** Saves the whole quiz as the editor shows it: the question list is replaced. */
export async function updateQuiz(ownerId: string, quizId: string, input: unknown) {
  const data = quizSchema.parse(input);
  const quiz = await prisma.quiz.findFirst({ where: { id: quizId, ownerId }, select: { id: true } });
  if (!quiz) throw new Error("QUIZ_NOT_FOUND");
  await prisma.$transaction([
    prisma.quiz.update({ where: { id: quizId }, data: { title: data.title, description: data.description } }),
    prisma.quizQuestion.deleteMany({ where: { quizId } }),
    ...toQuestionRows(quizId, data.questions).map((row) => prisma.quizQuestion.create({ data: row })),
  ]);
  return { id: quizId };
}

export async function deleteQuiz(ownerId: string, quizId: string) {
  const result = await prisma.quiz.deleteMany({ where: { id: quizId, ownerId } });
  if (!result.count) throw new Error("QUIZ_NOT_FOUND");
}

/** Published courses with their units and lessons, for "build a quiz from lessons". */
export async function listLessonTree(locale: string) {
  // One query per course, as on the learner's dashboard: Cloudflare D1 caps the
  // bound values of a query (~100), and all courses at once would exceed it.
  const ids = await prisma.course.findMany({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" }, select: { id: true } });
  const courses = [];
  for (const { id } of ids) {
    const course = await prisma.course.findFirst({
      where: { id },
      include: {
        translations: true,
        modules: {
          where: { status: "PUBLISHED" }, orderBy: { order: "asc" },
          include: { translations: true, lessons: { where: { status: "PUBLISHED" }, orderBy: { order: "asc" }, include: { translations: true } } },
        },
      },
    });
    if (course) courses.push(course);
  }
  // Ready quizzes: how many questions each unit can give. Only the exercise rows are read, not their texts.
  const exercises = await prisma.exercise.findMany({
    where: { status: "PUBLISHED", type: { in: ["MULTIPLE_CHOICE", "MATCHING"] } },
    select: { type: true, payload: true, lessonId: true },
  });
  const moduleOfLesson = new Map(courses.flatMap((course) => course.modules.flatMap((courseModule) => courseModule.lessons.map((lesson) => [lesson.id, courseModule.id] as const))));
  const available = new Map<string, number>();
  for (const exercise of exercises) {
    const moduleId = moduleOfLesson.get(exercise.lessonId);
    if (moduleId) available.set(moduleId, (available.get(moduleId) ?? 0) + questionYield(exercise.type, parsePayload(exercise.payload) as Record<string, unknown>));
  }
  return courses.map((course) => ({
    id: course.id,
    title: localized(course.translations, locale, course.sourceLanguage)?.title ?? course.slug,
    modules: course.modules.map((courseModule) => ({
      id: courseModule.id,
      title: localized(courseModule.translations, locale, course.sourceLanguage)?.title ?? "",
      /** Questions in this unit's ready quiz; 0 = the unit has too few exercises for one. */
      readyQuestions: readyQuizSize(available.get(courseModule.id) ?? 0),
      lessons: courseModule.lessons.map((lesson) => ({ id: lesson.id, title: localized(lesson.translations, locale, course.sourceLanguage)?.title ?? "" })),
    })).filter((courseModule) => courseModule.lessons.length),
  })).filter((course) => course.modules.length);
}

export type LessonTree = Awaited<ReturnType<typeof listLessonTree>>;

/**
 * Builds a quiz from the exercises of the chosen lessons. Texts are taken in the
 * course's explanation language (Chinese for our courses): that is the language
 * the learners read, whatever language the teacher's own interface is in.
 */
export async function createQuizFromLessons(ownerId: string, input: unknown) {
  const data = quizFromLessonsSchema.parse(input);
  const { questions, lessons } = await questionsFromLessons({ id: { in: data.lessonIds } }, data.limit);
  if (!lessons.length) throw new Error("LESSON_NOT_FOUND");
  if (!questions.length) throw new Error("NO_QUESTIONS_IN_LESSONS");
  const first = lessons.find((lesson) => lesson.id === data.lessonIds[0]) ?? lessons[0];
  const language = first.module.course.sourceLanguage;
  const title = data.title || localized(first.translations, language, language)?.title || "Quiz";
  return createQuiz(ownerId, { title: title.slice(0, 120), description: "", questions });
}

/**
 * The ready quiz of a unit: up to 20 questions picked at random from the unit's
 * exercises, so every game is a little different. Nothing is stored; the game
 * keeps its own copy of the questions.
 */
export async function buildReadyQuiz(moduleId: string) {
  const courseModule = await prisma.module.findFirst({ where: { id: moduleId, status: "PUBLISHED", course: { status: "PUBLISHED" } }, include: { translations: true, course: true } });
  if (!courseModule) throw new Error("MODULE_NOT_FOUND");
  const { questions } = await questionsFromLessons({ moduleId }, READY_QUIZ_MAX);
  if (!questions.length) throw new Error("NO_QUESTIONS_IN_LESSONS");
  const language = courseModule.course.sourceLanguage;
  return { title: (localized(courseModule.translations, language, language)?.title || "Quiz").slice(0, 120), questions };
}

async function questionsFromLessons(where: { id: { in: string[] } } | { moduleId: string }, limit: number) {
  const ids = await prisma.lesson.findMany({ where: { ...where, status: "PUBLISHED" }, orderBy: { order: "asc" }, select: { id: true } });
  // One query per lesson: D1 caps bound values per query, and the nested
  // includes of several lessons in one findMany exceed it (see offline-service).
  const lessons = [];
  for (const { id } of ids) {
    const lesson = await prisma.lesson.findFirst({ where: { id, status: "PUBLISHED" }, include: lessonInclude });
    if (lesson) lessons.push(lesson);
  }
  const sources: ExerciseSource[] = lessons.flatMap((lesson) => {
    const language = lesson.module.course.sourceLanguage;
    return lesson.exercises.map((exercise) => ({
      type: exercise.type,
      payload: parsePayload(exercise.payload) as Record<string, unknown>,
      question: localized(exercise.translations, language, language)?.question ?? "",
      options: exercise.options.map((option) => ({ text: localized(option.translations, language, language)?.text ?? "", isCorrect: option.isCorrect })),
    }));
  });
  return { lessons, questions: sources.length ? questionsFromExercises(sources, limit) : [] };
}
