import { isThemePreference, THEME_COOKIE, THEME_STORAGE_KEY, type ResolvedTheme, type ThemePreference } from "./theme-types";

export const THEME_INIT_SCRIPT = `(() => {
  try {
    const cookie = document.cookie.match(/(?:^|; )gapir_theme=([^;]+)/)?.[1];
    const stored = localStorage.getItem("gapir-theme");
    const preference = ["light", "dark", "system"].includes(stored || "") ? stored : (["light", "dark", "system"].includes(cookie || "") ? cookie : "system");
    const resolved = preference === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : preference;
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  } catch (_) {}
})();`;

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(preference: ThemePreference, persist = true) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const resolved = resolveTheme(preference);
  root.dataset.themePreference = preference;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  if (persist) {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    document.cookie = `${THEME_COOKIE}=${preference}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }
  window.dispatchEvent(new CustomEvent("gapir-theme-change", { detail: preference }));
}

export function getStoredTheme(fallback: ThemePreference = "system"): ThemePreference {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemePreference(stored) ? stored : fallback;
}
