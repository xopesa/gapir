import { AppShell } from "@/src/components/layout/app-shell";
import { AiAssistantScreen } from "@/src/features/ai-assistant/components/ai-assistant-screen";
import { getDictionary } from "@/src/i18n/config";
import { getPublicAiFlags } from "@/src/server/ai/config/public-flags";
import { requireUser } from "@/src/server/auth/authorization";
import { toAppUser } from "@/src/server/presenters";

export default async function AiAssistantPage() {
  const current = await requireUser("/ai-assistant");
  const user = toAppUser(current);
  const dictionary = getDictionary(user.locale);
  const aiFlags = getPublicAiFlags();
  return <AppShell user={user} dictionary={dictionary} aiFlags={aiFlags}><AiAssistantScreen dictionary={dictionary} flags={aiFlags} /></AppShell>;
}
