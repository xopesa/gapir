"use client";

import { ArrowClockwise, CloudSlash, UploadSimple } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Mascot } from "@/src/components/mascots/mascot";
import { LearningScreen, type LearningDashboardView } from "@/src/features/learning/components/learning-screen";
import { LessonPlayer } from "@/src/features/learning/components/lesson-player";
import { getDictionary } from "@/src/i18n/config";
import { flushOfflineQueue, isLessonCompleted, offlineStore, type OfflinePack } from "./offline-store";

const SOUND = { soundEnabled: true, soundVolume: 0.7, effectsEnabled: true, lessonSoundsEnabled: true };

function useOnline() {
  return useSyncExternalStore(
    (notify) => { window.addEventListener("online", notify); window.addEventListener("offline", notify); return () => { window.removeEventListener("online", notify); window.removeEventListener("offline", notify); }; },
    () => navigator.onLine,
    () => true,
  );
}

/** Path view built from the package plus lessons finished on this device. */
function dashboardFrom(pack: OfflinePack): LearningDashboardView {
  const done = offlineStore.done();
  let previousCompleted = true;
  const modules = pack.modules.map((module) => ({
    ...module,
    lessons: module.lessons.map((lesson) => {
      const completed = isLessonCompleted(pack, lesson.id, done);
      const status = completed ? "completed" as const : lesson.status === "in_progress" ? "in_progress" as const : previousCompleted ? "available" as const : "locked" as const;
      previousCompleted = completed;
      return { ...lesson, type: lesson.type as "VOCABULARY" | "GRAMMAR" | "CONVERSATION", status };
    }),
  }));
  const all = modules.flatMap((module) => module.lessons);
  return { course: pack.course, modules, progressPercent: all.length ? Math.round(all.filter((lesson) => lesson.status === "completed").length / all.length * 100) : 0 };
}

/**
 * The app without a network (served by the service worker when a page can't
 * load): the downloaded course, lessons checked on the device, results queued.
 */
export function OfflineApp() {
  const online = useOnline();
  // Read storage after mount: the server render has no localStorage.
  const [state, setState] = useState<{ pack: OfflinePack | null; pending: number } | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const refresh = useCallback(() => setState({ pack: offlineStore.pack(), pending: offlineStore.queue().length }), []);
  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);
    return () => window.clearTimeout(timer);
  }, [refresh]);
  useEffect(() => {
    if (online) void flushOfflineQueue().then(refresh);
  }, [online, refresh]);
  const dashboard = useMemo(() => (state?.pack ? dashboardFrom(state.pack) : null), [state]);

  const dictionary = state?.pack?.dictionary ?? getDictionary("zh");
  const t = dictionary.offline;
  const pack = state?.pack;
  const lesson = lessonId && pack ? pack.lessons[lessonId] : null;

  if (lesson) {
    return <LessonPlayer key={lesson.id} lesson={lesson} dictionary={dictionary} soundSettings={SOUND} theme="system" offline onExit={() => { setLessonId(null); refresh(); }} />;
  }
  if (!state) return <main className="guest-start"><Mascot kind="panda" mood="idle" size={120} /></main>;
  if (!pack || !dashboard) {
    return <main className="guest-start">
      <Mascot kind="panda" mood="sad" size={132} />
      <h1>{t.title}</h1>
      <p>{t.noPack}</p>
      <button type="button" className="duo-btn duo-btn-primary" onClick={() => window.location.replace("/")}><ArrowClockwise weight="bold" /> {t.retry}</button>
    </main>;
  }

  const banner = <div className="offline-banner" role="status">
    <CloudSlash weight="bold" />
    <div><strong>{online ? t.ready : t.title}</strong><span>{online ? t.subtitle.split("—")[0] : t.subtitle}</span>
      {state.pending > 0 && <span className="offline-pending"><UploadSimple weight="bold" /> {t.pending}: {state.pending}</span>}</div>
    {online && <button type="button" className="offline-banner-btn" onClick={() => window.location.replace("/")}>{t.goOnline}</button>}
  </div>;
  return <main className="offline-shell">
    <LearningScreen user={pack.user} dictionary={dictionary} dashboard={dashboard} onOpenLesson={setLessonId} banner={banner} />
  </main>;
}
