"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { applyTheme } from "@/src/lib/theme/theme-manager";
import { useSoundSettings } from "@/src/lib/sound/use-sound-settings";
import type { AppDictionary, AppUser } from "@/src/types/app";
import type { PublicAiFlags } from "@/src/server/ai/config/public-flags";
import { BottomNavigation } from "./navigation";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileHeader } from "./mobile-header";
import { RightSidebar } from "./right-sidebar";

export function AppShell({ children, user, dictionary, aiFlags }: { children: React.ReactNode; user: AppUser; dictionary: AppDictionary; aiFlags: PublicAiFlags }) {
  const reducedMotion = useReducedMotion();
  const soundSettings = useMemo(() => ({ soundEnabled: user.preference?.soundEnabled ?? true, soundVolume: user.preference?.soundVolume ?? 0.7, effectsEnabled: user.preference?.effectsEnabled ?? true, lessonSoundsEnabled: user.preference?.lessonSoundsEnabled ?? true }), [user.preference?.effectsEnabled, user.preference?.lessonSoundsEnabled, user.preference?.soundEnabled, user.preference?.soundVolume]);
  useSoundSettings(soundSettings, true);
  useEffect(() => { applyTheme(user.preference?.theme ?? "system", true); }, [user.preference?.theme]);
  return (
    <>
      <MobileHeader user={user} dictionary={dictionary} />
      <div className="app-shell">
        <DesktopSidebar dictionary={dictionary} user={user} aiFlags={aiFlags} />
        <motion.main
          className="main-content"
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {children}
        </motion.main>
        <RightSidebar user={user} dictionary={dictionary} />
      </div>
      <BottomNavigation dictionary={dictionary} user={user} aiFlags={aiFlags} />
    </>
  );
}
