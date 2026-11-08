import { notFound } from "next/navigation";
import { LessonPlayer } from "@/src/features/learning/components/lesson-player";
import { getDictionary } from "@/src/i18n/config";
import { requireUser } from "@/src/server/auth/authorization";
import { getPublishedLesson } from "@/src/server/services/lesson-service";
import type { SoundSettings } from "@/src/lib/sound/sound-types";

export default async function LearnPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const user = await requireUser(`/learn/${(await params).lessonId}`);
  const lesson = await getPublishedLesson(user.id, (await params).lessonId, user.locale);
  if (!lesson) notFound();
  const soundSettings: SoundSettings = { soundEnabled: user.preference?.soundEnabled ?? true, soundVolume: user.preference?.soundVolume ?? 0.7, effectsEnabled: user.preference?.effectsEnabled ?? true, lessonSoundsEnabled: user.preference?.lessonSoundsEnabled ?? true };
  const theme = user.preference?.theme === "light" || user.preference?.theme === "dark" ? user.preference.theme : "system";
  return <LessonPlayer lesson={lesson} dictionary={getDictionary(user.locale)} soundSettings={soundSettings} theme={theme} />;
}
