import { AppShell } from "@/src/components/layout/app-shell";
import { ProfileScreen } from "@/src/features/profile/components/profile-screen";
import { getDictionary } from "@/src/i18n/config";
import { requireUser } from "@/src/server/auth/authorization";
import { prisma } from "@/src/server/db";
import { toAppUser } from "@/src/server/presenters";
import { getPublicAiFlags } from "@/src/server/ai/config/public-flags";

export default async function ProfilePage() {
  const current = await requireUser("/profile");
  const user = toAppUser(current);
  const dictionary = getDictionary(user.locale);
  const completedLessons = await prisma.userLessonProgress.count({ where: { userId: user.id, status: "COMPLETED" } });
  return <AppShell user={user} dictionary={dictionary} aiFlags={getPublicAiFlags()}><ProfileScreen user={user} dictionary={dictionary} completedLessons={completedLessons} /></AppShell>;
}
