"use client";

import { useCallback, useEffect, useState } from "react";
import { setSoundSettings } from "./sound-manager";
import { defaultSoundSettings, type SoundSettings } from "./sound-types";

const STORAGE_KEY = "gapir-sound-settings";

function loadSettings(initial?: SoundSettings): SoundSettings {
  if (typeof window === "undefined") return initial ?? defaultSoundSettings;
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<SoundSettings> | null;
    return { ...defaultSoundSettings, ...initial, ...saved };
  } catch { return { ...defaultSoundSettings, ...initial }; }
}

export function useSoundSettings(initial?: SoundSettings, authenticated = false) {
  const [value, setValue] = useState<SoundSettings>(() => initial ?? defaultSoundSettings);

  useEffect(() => {
    const loaded = authenticated && initial ? initial : loadSettings(initial);
    setSoundSettings(loaded);
    if (authenticated && initial) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  }, [authenticated, initial]);

  const update = useCallback((patch: Partial<SoundSettings>) => {
    setValue((current) => {
      const next = { ...current, ...patch };
      setSoundSettings(next);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      if (authenticated) void fetch("/api/preferences", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
      return next;
    });
  }, [authenticated]);

  return { settings: value, update };
}
