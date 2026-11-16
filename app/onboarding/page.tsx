import { OnboardingForm } from "@/src/features/auth/components/onboarding-form";
import { isLocale } from "@/src/i18n/config";
import { redirect } from "next/navigation";
import { requireUser } from "@/src/server/auth/authorization";
import { isTeacherSite } from "@/src/server/site";

export default async function OnboardingPage() {
  // A teacher who has just registered does not choose a course.
  if (await isTeacherSite()) redirect("/teacher");
  const user = await requireUser("/onboarding");
  const theme = user.preference?.theme === "light" || user.preference?.theme === "dark" ? user.preference.theme : "system";
  return <OnboardingForm initialLocale={isLocale(user.locale) ? user.locale : "ru"} initialTheme={theme} />;
}
