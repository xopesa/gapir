import { AppShell } from "@/src/components/layout/app-shell";
import { PracticeScreen } from "@/src/features/practice/components/practice-screen";
import { getDictionary } from "@/src/i18n/config";
import { requireUser } from "@/src/server/auth/authorization";
import { toAppUser } from "@/src/server/presenters";
import { getPublicAiFlags } from "@/src/server/ai/config/public-flags";

export default async function PracticePage() {
  const current = await requireUser("/practice"); const user = toAppUser(current); const dictionary = getDictionary(user.locale);
  return <AppShell user={user} dictionary={dictionary} aiFlags={getPublicAiFlags()}><PracticeScreen /></AppShell>;
}
