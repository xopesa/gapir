import { redirect } from "next/navigation";
import { QuizPlayScreen } from "@/src/features/quiz/components/quiz-play-screen";
import { getDictionary } from "@/src/i18n/config";
import { requireUser } from "@/src/server/auth/authorization";
import { normalizePin } from "@/src/lib/quiz/logic";
import { isTeacherSite } from "@/src/server/site";

export default async function QuizGamePage({ params }: { params: Promise<{ pin: string }> }) {
  if (await isTeacherSite()) redirect("/teacher");
  const pin = normalizePin((await params).pin);
  if (pin.length !== 6) redirect("/quiz");
  const user = await requireUser(`/quiz?pin=${pin}`);
  return <QuizPlayScreen pin={pin} dictionary={getDictionary(user.locale)} />;
}
