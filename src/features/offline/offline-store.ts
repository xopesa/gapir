"use client";

// On-device storage for offline mode: the downloaded course package, lessons
// finished without a network (waiting to be sent), and local completions so the
// offline path shows progress. localStorage is enough: a package is ~100–300 KB.
import { checkExerciseAnswer, type ExercisePayload } from "@/src/lib/answer-check";
import type { AppDictionary } from "@/src/types/app";

export type OfflineExerciseType = "MULTIPLE_CHOICE" | "ARRANGE_WORDS" | "MATCHING" | "TRANSLATE";

export interface OfflineLessonView {
  id: string; title: string; description: string; theory: string; xpReward: number; estimatedMinutes: number; targetLanguage?: string;
  exercises: Array<{ id: string; type: OfflineExerciseType; instruction: string; question: string; xpReward: number; payload: Record<string, unknown>; options: { id: string; text: string }[] }>;
}

export interface OfflineLessonSummary { id: string; title: string; description: string; status: "completed" | "in_progress" | "available" | "locked"; type: string; xpReward: number; estimatedMinutes: number }

export interface OfflinePack {
  version: string;
  generatedAt: string;
  locale: string;
  user: { name: string; xp: number; streak: number };
  dictionary: AppDictionary;
  course: { id: string; title: string; description: string; level: string; sourceLanguage: string; targetLanguage: string };
  modules: Array<{ id: string; title: string; description: string; lessons: OfflineLessonSummary[] }>;
  lessons: Record<string, OfflineLessonView>;
  answers: Record<string, { type: string; payload: ExercisePayload; correctOptionId?: string; explanation: string; solution: string }>;
}

export interface QueuedLesson { lessonId: string; attempts: Array<{ exerciseId: string; answer: unknown }>; finishedAt: string; xp: number }

const PACK_KEY = "gapir-offline-pack";
const QUEUE_KEY = "gapir-offline-queue";
const DONE_KEY = "gapir-offline-done";

function read<T>(key: string, fallback: T): T {
  try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}

function write(key: string, value: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or blocked */ }
}

export const offlineStore = {
  pack: () => read<OfflinePack | null>(PACK_KEY, null),
  savePack: (pack: OfflinePack) => write(PACK_KEY, pack),
  queue: () => read<QueuedLesson[]>(QUEUE_KEY, []),
  saveQueue: (queue: QueuedLesson[]) => write(QUEUE_KEY, queue),
  /** Lessons finished on this device (offline), shown as completed until the server says so. */
  done: () => new Set(read<string[]>(DONE_KEY, [])),
  markDone(lessonId: string) { const done = this.done(); done.add(lessonId); write(DONE_KEY, [...done]); },
  enqueue(item: QueuedLesson) {
    const queue = this.queue().filter((entry) => entry.lessonId !== item.lessonId);
    queue.push(item);
    this.saveQueue(queue);
    this.markDone(item.lessonId);
  },
  clear() { for (const key of [PACK_KEY, QUEUE_KEY, DONE_KEY]) { try { window.localStorage.removeItem(key); } catch { /* ignore */ } } },
};

/** Checks an answer against the downloaded package (same rules as the server). */
export function checkOffline(pack: OfflinePack, exerciseId: string, answer: unknown) {
  const key = pack.answers[exerciseId];
  if (!key) return null;
  return { isCorrect: checkExerciseAnswer(key.type, key.payload, answer, key.correctOptionId), explanation: key.explanation, solution: key.solution };
}

/** A completed lesson the server already knows about, or one finished offline here. */
export function isLessonCompleted(pack: OfflinePack, lessonId: string, done = offlineStore.done()) {
  if (done.has(lessonId)) return true;
  return pack.modules.some((module) => module.lessons.some((lesson) => lesson.id === lessonId && lesson.status === "completed"));
}

let syncing: Promise<void> | null = null;

/** Sends lessons finished offline; the server re-checks answers and grants XP. */
export function flushOfflineQueue() {
  if (syncing) return syncing;
  syncing = (async () => {
    const queue = offlineStore.queue();
    if (!queue.length || (typeof navigator !== "undefined" && !navigator.onLine)) return;
    const response = await fetch("/api/offline/sync", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessons: queue.map(({ lessonId, attempts }) => ({ lessonId, attempts })) }),
    }).catch(() => null);
    if (!response?.ok) return; // offline or signed out: try again later
    const sent = new Set(queue.map((item) => item.lessonId));
    // Keep anything queued while the request was in flight.
    offlineStore.saveQueue(offlineStore.queue().filter((item) => !sent.has(item.lessonId)));
  })().finally(() => { syncing = null; });
  return syncing;
}

/** Downloads the learner's course package (needs a session). */
export async function refreshOfflinePack() {
  const response = await fetch("/api/offline/pack", { cache: "no-store" }).catch(() => null);
  if (!response?.ok) return null;
  const pack = await response.json() as OfflinePack;
  offlineStore.savePack(pack);
  return pack;
}
