import { AppShell } from "@/src/components/layout/app-shell";
import { AiHistoryScreen } from "@/src/features/ai-assistant/components/ai-history-screen";
import { getDictionary } from "@/src/i18n/config";
import { getPublicAiFlags } from "@/src/server/ai/config/public-flags";
import { requireUser } from "@/src/server/auth/authorization";
import { toAppUser } from "@/src/server/presenters";

export default async function AiHistoryPage() {
  const current = await requireUser("/ai-assistant/history");
  const user = toAppUser(current);
  const dictionary = getDictionary(user.locale);
  const aiFlags = getPublicAiFlags();
  return <AppShell user={user} dictionary={dictionary} aiFlags={aiFlags}><AiHistoryScreen dictionary={dictionary} flags={aiFlags} locale={user.locale} /></AppShell>;
}
