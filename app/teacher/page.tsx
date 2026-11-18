import { TeacherHome } from "@/src/features/quiz/components/teacher-home";
import { getDictionary } from "@/src/i18n/config";
import { listClassQuizzes } from "@/src/lib/quiz/class-quizzes";
import { requireUser } from "@/src/server/auth/authorization";
import { GUEST_EMAIL_DOMAIN } from "@/src/server/services/auth-service";
import { listHostGames } from "@/src/server/services/quiz-game-service";
import { listLessonTree, listQuizzes } from "@/src/server/services/quiz-service";

const DATE_LOCALES: Record<string, string> = { ru: "ru-RU", uz: "uz-UZ", zh: "zh-CN", en: "en-GB" };

export default async function TeacherPage() {
  const user = await requireUser("/teacher");
  const [quizzes, games, lessonTree] = await Promise.all([listQuizzes(user.id), listHostGames(user.id), listLessonTree(user.locale)]);
  // Formatted here: the server and the browser may be in different time zones.
  const format = new Intl.DateTimeFormat(DATE_LOCALES[user.locale] ?? "ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: user.preference?.timezone || "Asia/Tashkent" });
  return <TeacherHome guest={user.email.endsWith(`@${GUEST_EMAIL_DOMAIN}`)} dictionary={getDictionary(user.locale)} quizzes={quizzes} classQuizzes={listClassQuizzes()} lessonTree={lessonTree} games={games.map((game) => ({ ...game, createdLabel: format.format(new Date(game.createdAt)) }))} />;
}
