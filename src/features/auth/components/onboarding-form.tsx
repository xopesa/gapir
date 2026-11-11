"use client";

import { ArrowRight, Globe, Target } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LocaleSwitcher } from "@/src/components/i18n/locale-switcher";
import { ThemeSwitcher } from "@/src/components/theme/theme-switcher";
import { Button, Card } from "@/src/components/ui";
import { getDictionary, localeLabels, type Locale } from "@/src/i18n/config";
import type { ThemePreference } from "@/src/lib/theme/theme-types";

export function OnboardingForm({ initialLocale, initialTheme = "system" }: { initialLocale: Locale; initialTheme?: ThemePreference }) {
  const router = useRouter();
  const [locale, setLocale] = useState(initialLocale);
  const [targetLanguage, setTarget] = useState<"uz" | "zh" | "ru">("uz");
  const [sourceLanguage, setSource] = useState<"ru" | "en" | "zh" | "uz">("ru");
  const [dailyGoalMinutes, setGoal] = useState<5 | 10 | 15 | 20>(10);
  const [error, setError] = useState("");
  const dictionary = getDictionary(locale);
  // Directions with published courses; Russian is taught to Chinese speakers.
  const allowedSources = targetLanguage === "uz" ? ["ru", "en", "zh"] : targetLanguage === "ru" ? ["zh"] : ["uz", "ru", "en"];
  const defaultSource = (target: "uz" | "zh" | "ru") => (target === "uz" ? "ru" : target === "ru" ? "zh" : "uz");
  const submit = async () => {
    const response = await fetch("/api/preferences", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale, targetLanguage, sourceLanguage, dailyGoalMinutes, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Tashkent" }) });
    if (!response.ok) { setError(dictionary.common.error); return; }
    router.replace("/"); router.refresh();
  };
  return <main className="onboarding-page"><div className="onboarding-wrap"><div className="onboarding-toolbar"><ThemeSwitcher initialTheme={initialTheme} authenticated label={dictionary.settings.theme} locale={locale} /></div><div className="onboarding-heading"><span className="onboarding-icon"><Target weight="duotone" /></span><p className="eyebrow">Gapir Start</p><h1>{dictionary.onboarding.title}</h1><p>{dictionary.onboarding.subtitle}</p></div><Card className="onboarding-card">
    <div className="onboarding-language-row"><span><Globe /> {dictionary.onboarding.interfaceLanguage}</span><LocaleSwitcher locale={locale} onChange={setLocale} /></div>
    <label><span>{dictionary.onboarding.targetLanguage}</span><select value={targetLanguage} onChange={(event) => { const next = event.target.value as "uz" | "zh" | "ru"; setTarget(next); setSource(defaultSource(next)); }}><option value="uz">{localeLabels.uz}</option><option value="zh">{localeLabels.zh}</option><option value="ru">{localeLabels.ru}</option></select></label>
    <label><span>{dictionary.onboarding.sourceLanguage}</span><select value={sourceLanguage} onChange={(event) => setSource(event.target.value as typeof sourceLanguage)}>{allowedSources.map((item) => <option key={item} value={item}>{localeLabels[item as Locale]}</option>)}</select></label>
    <fieldset><legend>{dictionary.onboarding.dailyGoal}</legend><div className="goal-options">{([5,10,15,20] as const).map((value) => <button type="button" key={value} className={dailyGoalMinutes === value ? "selected" : ""} onClick={() => setGoal(value)}><strong>{value}</strong><span>{dictionary.onboarding.minutes}</span></button>)}</div></fieldset>
    {error && <p className="login-error">{error}</p>}<Button size="lg" onClick={() => void submit()}>{dictionary.onboarding.start} <ArrowRight /></Button>
  </Card></div></main>;
}
