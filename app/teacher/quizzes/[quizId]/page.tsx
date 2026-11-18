import { notFound } from "next/navigation";
import { QuizEditor } from "@/src/features/quiz/components/quiz-editor";
import { getDictionary } from "@/src/i18n/config";
import { requireUser } from "@/src/server/auth/authorization";
import { getQuiz } from "@/src/server/services/quiz-service";

export default async function QuizEditorPage({ params }: { params: Promise<{ quizId: string }> }) {
  const user = await requireUser("/teacher");
  const quiz = await getQuiz(user.id, (await params).quizId).catch(() => null);
  if (!quiz) notFound();
  return <QuizEditor quiz={quiz} dictionary={getDictionary(user.locale)} />;
}
