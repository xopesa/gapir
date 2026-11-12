"use client";

import { useEffect } from "react";
import { narrationAudio, phraseAudio } from "@/src/content/audio-manifest.generated";
import { narrationKey } from "@/src/lib/audio-keys";
import { flushOfflineQueue, refreshOfflinePack } from "./offline-store";

const CACHE = "gapir-offline-v2";
const REFRESH_KEY = "gapir-offline-refreshed";
const REFRESH_EVERY_MS = 10 * 60 * 1000;

type Pack = NonNullable<Awaited<ReturnType<typeof refreshOfflinePack>>>;

/** Audio of the learner's course: its words, each lesson's theory and step explanations, and the questions. */
function packAudio(pack: Pack) {
  const target = (pack.course as { targetLanguage?: string }).targetLanguage ?? "uz";
  const narration = Object.values(pack.lessons as Record<string, { theory?: string; exercises?: Array<{ question?: string; payload?: { teach?: string } }> }>)
    .flatMap((lesson) => [lesson.theory, ...(lesson.exercises ?? []).flatMap((exercise) => [exercise.payload?.teach, exercise.question])])
    .map((text) => (text ? narrationAudio[narrationKey(text)] : undefined))
    .filter((url): url is string => Boolean(url));
  return [...Object.values(phraseAudio[target] ?? {}), ...narration];
}

/** Stores the offline page with its scripts/styles and the lesson audio. */
async function warmCache(pack: Pack) {
  if (!("caches" in window)) return;
  const cache = await caches.open(CACHE);
  const page = await fetch("/offline", { cache: "no-store" }).catch(() => null);
  if (!page?.ok) return;
  const html = await page.clone().text();
  await cache.put("/offline", page);
  const assets = new Set<string>(["/gapir-logo.png", ...packAudio(pack)]);
  for (const match of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)) assets.add(match[1]);
  await Promise.all([...assets].map(async (url) => {
    if (await cache.match(url)) return;
    await cache.add(url).catch(() => undefined);
  }));
}

/**
 * Runs on every page while online: registers the service worker, sends lessons
 * finished offline, and keeps the course package and offline files fresh.
 */
export function OfflineAgent() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  useEffect(() => {
    const sync = async () => {
      if (!navigator.onLine || window.location.pathname === "/offline") return;
      await flushOfflineQueue();
      let last = 0;
      try { last = Number(window.localStorage.getItem(REFRESH_KEY) ?? 0); } catch { /* ignore */ }
      // The path page is where progress changes show up: always refresh there.
      if (window.location.pathname !== "/" && Date.now() - last < REFRESH_EVERY_MS) return;
      const pack = await refreshOfflinePack();
      if (!pack) return; // signed out or no course yet
      try { window.localStorage.setItem(REFRESH_KEY, String(Date.now())); } catch { /* ignore */ }
      await warmCache(pack).catch(() => undefined);
    };
    void sync();
    window.addEventListener("online", sync);
    return () => window.removeEventListener("online", sync);
  }, []);
  return null;
}

/** Forces the next page load to download a fresh package (after onboarding, a lesson…). */
export function invalidateOfflinePack() {
  try { window.localStorage.removeItem(REFRESH_KEY); } catch { /* ignore */ }
}
