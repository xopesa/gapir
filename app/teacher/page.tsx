import { TeacherHome } from "@/src/features/quiz/components/teacher-home";
import { getDictionary } from "@/src/i18n/config";
import { canTeach, requireUser } from "@/src/server/auth/authorization";
import { listHostGames } from "@/src/server/services/quiz-game-service";
import { listLessonTree, listQuizzes } from "@/src/server/services/quiz-service";

const DATE_LOCALES: Record<string, string> = { ru: "ru-RU", uz: "uz-UZ", zh: "zh-CN", en: "en-GB" };

export default async function TeacherPage() {
  const user = await requireUser("/teacher", "/login");
  // The layout shows the "no access" page for other roles.
  if (!canTeach(user.role)) return null;
  const [quizzes, games, lessonTree] = await Promise.all([listQuizzes(user.id), listHostGames(user.id), listLessonTree(user.locale)]);
  // Formatted here: the server and the browser may be in different time zones.
  const format = new Intl.DateTimeFormat(DATE_LOCALES[user.locale] ?? "ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: user.preference?.timezone || "Asia/Tashkent" });
  return <TeacherHome dictionary={getDictionary(user.locale)} quizzes={quizzes} lessonTree={lessonTree} games={games.map((game) => ({ ...game, createdLabel: format.format(new Date(game.createdAt)) }))} />;
}
