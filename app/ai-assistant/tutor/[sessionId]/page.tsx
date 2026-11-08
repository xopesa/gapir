import { AppShell } from "@/src/components/layout/app-shell";
import { AiTutorSessionScreen } from "@/src/features/ai-assistant/components/ai-tutor-session-screen";
import { getDictionary } from "@/src/i18n/config";
import { getPublicAiFlags } from "@/src/server/ai/config/public-flags";
import { requireUser } from "@/src/server/auth/authorization";
import { toAppUser } from "@/src/server/presenters";

export default async function AiTutorSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const returnTo = `/ai-assistant/tutor/${sessionId}`;
  const current = await requireUser(returnTo);
  const user = toAppUser(current);
  const dictionary = getDictionary(user.locale);
  const aiFlags = getPublicAiFlags();
  return <AppShell user={user} dictionary={dictionary} aiFlags={aiFlags}><AiTutorSessionScreen sessionId={sessionId} dictionary={dictionary} flags={aiFlags} /></AppShell>;
}
