import { QuizHostScreen } from "@/src/features/quiz/components/quiz-host-screen";
import { getDictionary } from "@/src/i18n/config";
import { requireUser } from "@/src/server/auth/authorization";
import { learnerOrigin } from "@/src/server/site";

export default async function QuizHostPage({ params }: { params: Promise<{ gameId: string }> }) {
  const user = await requireUser("/teacher");
  return <QuizHostScreen gameId={(await params).gameId} dictionary={getDictionary(user.locale)} learnerSite={`${new URL(learnerOrigin()).host}/quiz`} />;
}
