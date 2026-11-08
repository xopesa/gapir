import { OnboardingForm } from "@/src/features/auth/components/onboarding-form";
import { isLocale } from "@/src/i18n/config";
import { requireUser } from "@/src/server/auth/authorization";

export default async function OnboardingPage() {
  const user = await requireUser("/onboarding");
  const theme = user.preference?.theme === "light" || user.preference?.theme === "dark" ? user.preference.theme : "system";
  return <OnboardingForm initialLocale={isLocale(user.locale) ? user.locale : "ru"} initialTheme={theme} />;
}
