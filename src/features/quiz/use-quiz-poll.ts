"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Keeps a live game on screen by asking the server for its state again and
 * again. `delayFor` says how long to wait before the next request (0 = stop);
 * it depends on the phase, so a waiting room asks less often than a question.
 * The server's clock is the game clock: `serverNow` is that clock, ticking
 * locally between requests.
 */
export function useQuizPoll<T extends { now: number }>(url: string, delayFor: (state: T | null, failed: boolean) => number) {
  const [state, setState] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [serverNow, setServerNow] = useState(0);
  const offset = useRef(0);
  const delay = useRef(delayFor);
  useEffect(() => { delay.current = delayFor; });

  /** Also used with the state an action returns, so the screen changes without waiting for the next poll. */
  const apply = useCallback((game: T) => {
    offset.current = game.now - Date.now();
    setServerNow(game.now);
    setState(game);
    setError(null);
  }, []);

  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = async () => {
      let next: T | null = null;
      let failed = false;
      try {
        const response = await fetch(url, { cache: "no-store" });
        const payload = await response.json() as { game?: T; error?: string };
        if (stopped) return;
        if (response.ok && payload.game) { next = payload.game; apply(next); }
        else { failed = true; setError(payload.error ?? "REQUEST_FAILED"); }
      } catch {
        // A lost connection: keep what is on screen and try again.
        failed = true;
      }
      if (stopped) return;
      const wait = delay.current(next, failed);
      if (wait > 0) timer = setTimeout(() => void tick(), wait);
    };
    void tick();
    return () => { stopped = true; clearTimeout(timer); };
  }, [url, apply]);

  useEffect(() => {
    const timer = setInterval(() => setServerNow(Date.now() + offset.current), 200);
    return () => clearInterval(timer);
  }, []);

  return { state, error, serverNow: serverNow || state?.now || 0, apply };
}

/** Whole seconds left until `until`, never negative. */
export function secondsLeft(until: number | null, now: number) {
  return until === null ? 0 : Math.max(0, Math.ceil((until - now) / 1000));
}

export const OPTION_LETTERS = ["A", "B", "C", "D"] as const;
