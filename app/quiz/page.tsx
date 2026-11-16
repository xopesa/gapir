import { redirect } from "next/navigation";
import { AppShell } from "@/src/components/layout/app-shell";
import { QuizJoinScreen } from "@/src/features/quiz/components/quiz-join-screen";
import { getDictionary } from "@/src/i18n/config";
import { getPublicAiFlags } from "@/src/server/ai/config/public-flags";
import { requireUser } from "@/src/server/auth/authorization";
import { GUEST_EMAIL_DOMAIN } from "@/src/server/services/auth-service";
import { toAppUser } from "@/src/server/presenters";
import { isTeacherSite } from "@/src/server/site";

export default async function QuizPage({ searchParams }: { searchParams: Promise<{ pin?: string }> }) {
  if (await isTeacherSite()) redirect("/teacher");
  const pin = (await searchParams).pin ?? "";
  const current = await requireUser(pin ? `/quiz?pin=${encodeURIComponent(pin)}` : "/quiz");
  const user = toAppUser(current);
  const dictionary = getDictionary(user.locale);
  // Guests are all called "Guest": they type a real name for the scoreboard.
  const initialName = user.email.endsWith(`@${GUEST_EMAIL_DOMAIN}`) ? "" : user.name.slice(0, 20);
  return <AppShell user={user} dictionary={dictionary} aiFlags={getPublicAiFlags()}><QuizJoinScreen dictionary={dictionary} initialPin={pin} initialName={initialName} /></AppShell>;
}
