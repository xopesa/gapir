import { prisma } from "@/src/server/db";
import { checkExerciseAnswer } from "./lesson-service";

export function calendarDateInTimezone(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
}

export function nextStreakState(lastActivity: Date | null, now: Date, timezone: string, current: number, longest: number) {
  const today = calendarDateInTimezone(now, timezone);
  if (lastActivity && calendarDateInTimezone(lastActivity, timezone) === today) return { streak: current, longestStreak: longest, changed: false };
  const yesterday = new Date(now.getTime() - 86_400_000);
  const continued = lastActivity && calendarDateInTimezone(lastActivity, timezone) === calendarDateInTimezone(yesterday, timezone);
  const streak = continued ? current + 1 : 1;
  return { streak, longestStreak: Math.max(longest, streak), changed: true };
}

export function lessonXpGrant(status: "AVAILABLE" | "IN_PROGRESS" | "COMPLETED", reward: number) {
  return status === "COMPLETED" ? 0 : reward;
}

export async function startLesson(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findFirst({ where: { id: lessonId, status: "PUBLISHED", module: { status: "PUBLISHED", course: { status: "PUBLISHED" } } } });
  if (!lesson) throw new Error("LESSON_NOT_FOUND");
  return prisma.userLessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { startedAt: new Date(), status: "IN_PROGRESS" },
    create: { userId, lessonId, startedAt: new Date(), status: "IN_PROGRESS" },
  });
}

export async function submitExerciseAnswer(userId: string, exerciseId: string, answer: unknown, locale = "ru") {
  const exercise = await prisma.exercise.findFirst({
    where: { id: exerciseId, status: "PUBLISHED", lesson: { status: "PUBLISHED" } },
    include: { options: true, translations: true },
  });
  if (!exercise) throw new Error("EXERCISE_NOT_FOUND");
  const progress = await prisma.userLessonProgress.findUnique({ where: { userId_lessonId: { userId, lessonId: exercise.lessonId } } });
  if (!progress) throw new Error("LESSON_NOT_STARTED");
  let payload: Record<string, unknown> = {};
  try { payload = JSON.parse(exercise.payload) as Record<string, unknown>; } catch {}
  const correctOptionId = exercise.options.find((option) => option.isCorrect)?.id;
  const isCorrect = checkExerciseAnswer(exercise.type, payload, answer, correctOptionId);
  const firstAttempt = !(await prisma.userExerciseAttempt.findFirst({ where: { userId, exerciseId } }));
  await prisma.$transaction([
    prisma.userExerciseAttempt.create({
      data: { userId, exerciseId, lessonProgressId: progress.id, submittedAnswer: JSON.stringify(answer), isCorrect, xpEarned: isCorrect && firstAttempt ? exercise.xpReward : 0 },
    }),
    prisma.userLessonProgress.update({
      where: { id: progress.id },
      data: {
        attempts: { increment: 1 },
        completedExercises: firstAttempt ? { increment: 1 } : undefined,
        correctAnswers: isCorrect && firstAttempt ? { increment: 1 } : undefined,
      },
    }),
  ]);
  const explanation = exercise.translations.find((item) => item.locale === locale)?.explanation
    ?? exercise.translations.find((item) => item.locale === "ru")?.explanation
    ?? "";
  return { isCorrect, explanation };
}

export async function completeLesson(userId: string, lessonId: string) {
  return prisma.$transaction(async (tx) => {
    const [user, lesson, progress] = await Promise.all([
      tx.user.findUniqueOrThrow({ where: { id: userId }, include: { preference: true } }),
      tx.lesson.findUniqueOrThrow({ where: { id: lessonId }, include: { exercises: { where: { status: "PUBLISHED" } } } }),
      tx.userLessonProgress.findUniqueOrThrow({ where: { userId_lessonId: { userId, lessonId } } }),
    ]);
    const attempted = await tx.userExerciseAttempt.groupBy({ by: ["exerciseId"], where: { userId, lessonProgressId: progress.id } });
    if (attempted.length < lesson.exercises.length) throw new Error("LESSON_INCOMPLETE");
    const xpGrant = lessonXpGrant(progress.status, lesson.xpReward);
    if (!xpGrant) return { earnedXp: progress.earnedXp, totalXp: user.xp, alreadyCompleted: true };
    const timezone = user.preference?.timezone ?? "Asia/Tashkent";
    const streak = nextStreakState(user.lastActivityDate, new Date(), timezone, user.streak, user.longestStreak);
    const updated = await tx.user.update({
      where: { id: userId },
      data: { xp: { increment: xpGrant }, streak: streak.streak, longestStreak: streak.longestStreak, lastActivityDate: new Date() },
    });
    await tx.userLessonProgress.update({
      where: { id: progress.id },
      data: { status: "COMPLETED", completedAt: new Date(), earnedXp: xpGrant },
    });
    return { earnedXp: xpGrant, totalXp: updated.xp, alreadyCompleted: false };
  });
}
