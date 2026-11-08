"use client";

import { useEffect } from "react";
import { unlockSound } from "@/src/lib/sound/sound-manager";
import { useSoundSettings } from "@/src/lib/sound/use-sound-settings";

export function SoundProvider({ children }: { children: React.ReactNode }) {
  useSoundSettings();
  useEffect(() => {
    const unlock = () => unlockSound();
    window.addEventListener("pointerdown", unlock, { once: true, capture: true });
    window.addEventListener("keydown", unlock, { once: true, capture: true });
    return () => {
      window.removeEventListener("pointerdown", unlock, { capture: true });
      window.removeEventListener("keydown", unlock, { capture: true });
    };
  }, []);
  return children;
}
