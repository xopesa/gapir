"use client";

import { useEffect } from "react";
import { applyTheme, getStoredTheme } from "@/src/lib/theme/theme-manager";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme(getStoredTheme(), false);
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => {
      if (getStoredTheme() === "system") applyTheme("system", false);
    };
    query.addEventListener("change", syncSystemTheme);
    return () => query.removeEventListener("change", syncSystemTheme);
  }, []);
  return children;
}
