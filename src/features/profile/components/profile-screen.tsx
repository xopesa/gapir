"use client";

import { BookOpen, Fire, GearSix, Palette, SignOut, Star } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { LocaleSwitcher } from "@/src/components/i18n/locale-switcher";
import { SoundSettingsPanel } from "@/src/components/sound/sound-settings-panel";
import { ThemeSwitcher } from "@/src/components/theme/theme-switcher";
import { Avatar, Badge, Button, Card, SectionHeader, StatCard } from "@/src/components/ui";
import type { AppDictionary, AppUser } from "@/src/types/app";

export function ProfileScreen({ user, dictionary, completedLessons }: { user: AppUser; dictionary: AppDictionary; completedLessons: number }) {
  const router = useRouter();
  const initials = user.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.replace("/login"); router.refresh(); };
  return <div className="page-stack">
    <Card className="profile-hero" tone="ice"><Avatar initials={initials} size="xl" /><div className="profile-main-copy"><Badge tone="blue">{dictionary.profile.level} · A1</Badge><h1>{user.name}</h1><p>{user.email}</p></div><div className="profile-actions"><LocaleSwitcher locale={user.locale} authenticated /><Button variant="ghost" onClick={() => void logout()}><SignOut weight="bold" /> {dictionary.common.logout}</Button></div></Card>
    <div className="stats-grid"><StatCard icon={<Fire weight="fill" />} label={dictionary.profile.currentStreak} value={String(user.streak)} /><StatCard icon={<Star weight="fill" />} label={dictionary.profile.longestStreak} value={String(user.longestStreak)} /><StatCard icon={<BookOpen weight="duotone" />} label={dictionary.profile.lessons} value={String(completedLessons)} /><StatCard icon={<Star weight="duotone" />} label={dictionary.profile.totalXp} value={String(user.xp)} /></div>
    <section><SectionHeader eyebrow={dictionary.profile.preferences} title={`${user.preference?.sourceLanguage?.toUpperCase() ?? "RU"} → ${user.preference?.targetLanguage?.toUpperCase() ?? "UZ"}`} /><Card className="settings-card"><div className="settings-heading"><GearSix weight="duotone" /><div><h3>{dictionary.profile.preferences}</h3><p>{dictionary.onboarding.dailyGoal}: {user.preference?.dailyGoalMinutes ?? 10} {dictionary.onboarding.minutes}</p></div></div><div className="profile-preference-grid"><span><strong>{dictionary.profile.timezone}</strong><small>{user.preference?.timezone ?? "Asia/Tashkent"}</small></span><span><strong>{dictionary.profile.notifications}</strong><small>{user.preference?.notificationsEnabled ? "ON" : "OFF"}</small></span></div></Card></section>
    <section className="profile-settings-grid">
      <Card className="settings-card appearance-settings-card"><div className="settings-heading"><span className="settings-icon"><Palette weight="duotone" /></span><div><h3>{dictionary.settings.appearance}</h3><p>{dictionary.settings.theme}</p></div></div><ThemeSwitcher initialTheme={user.preference?.theme ?? "system"} authenticated label={dictionary.settings.theme} locale={user.locale} /></Card>
      <SoundSettingsPanel initial={{ soundEnabled: user.preference?.soundEnabled ?? true, soundVolume: user.preference?.soundVolume ?? 0.7, effectsEnabled: user.preference?.effectsEnabled ?? true, lessonSoundsEnabled: user.preference?.lessonSoundsEnabled ?? true }} labels={{ title: dictionary.settings.sound, all: dictionary.settings.allSounds, volume: dictionary.settings.volume, effects: dictionary.settings.interfaceSounds, lessons: dictionary.settings.lessonSounds, test: dictionary.settings.testSound }} />
    </section>
  </div>;
}
