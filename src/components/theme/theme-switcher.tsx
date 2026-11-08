"use client";

import { Check, Desktop, Moon, Sun, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getDictionary, type Locale } from "@/src/i18n/config";
import { applyTheme, getStoredTheme } from "@/src/lib/theme/theme-manager";
import { type ThemePreference } from "@/src/lib/theme/theme-types";

const options = [
  { value: "light" as const, label: "light" as const, icon: Sun },
  { value: "dark" as const, label: "dark" as const, icon: Moon },
  { value: "system" as const, label: "system" as const, icon: Desktop },
];

function useMobileSheet() {
  return useSyncExternalStore(
    (notify) => { const query = window.matchMedia("(max-width: 767px)"); query.addEventListener("change", notify); return () => query.removeEventListener("change", notify); },
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );
}

export function ThemeSwitcher({ initialTheme = "system", authenticated = false, label = "Theme", locale = "ru" }: { initialTheme?: ThemePreference; authenticated?: boolean; label?: string; locale?: Locale }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const mobile = useMobileSheet();
  const theme = useSyncExternalStore(
    (notify) => { window.addEventListener("storage", notify); window.addEventListener("gapir-theme-change", notify); return () => { window.removeEventListener("storage", notify); window.removeEventListener("gapir-theme-change", notify); }; },
    () => getStoredTheme(initialTheme),
    () => initialTheme,
  );
  const dictionary = getDictionary(locale);
  const CurrentIcon = options.find((item) => item.value === theme)?.icon ?? Desktop;
  const close = useCallback(() => { setOpen(false); window.requestAnimationFrame(() => triggerRef.current?.focus()); }, []);

  useEffect(() => {
    applyTheme(authenticated ? initialTheme : getStoredTheme(initialTheme), authenticated);
  }, [authenticated, initialTheme]);

  useEffect(() => {
    if (!open) return;
    if (!mobile) {
      const closeOutside = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) close(); };
      const closeEscape = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
      document.addEventListener("pointerdown", closeOutside);
      document.addEventListener("keydown", closeEscape);
      return () => { document.removeEventListener("pointerdown", closeOutside); document.removeEventListener("keydown", closeEscape); };
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => [...(sheetRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])") ?? [])];
    focusable()[0]?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close(); return; }
      if (event.key !== "Tab") return;
      const items = focusable(); const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", trap);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", trap); };
  }, [close, mobile, open]);

  const selectTheme = async (next: ThemePreference) => {
    applyTheme(next); close();
    if (authenticated) await fetch("/api/preferences", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ theme: next }) });
  };
  const optionButtons = options.map(({ value, label: labelKey, icon: Icon }) => <button key={value} type="button" role="menuitemradio" aria-checked={theme === value} className={theme === value ? "active" : ""} onClick={() => void selectTheme(value)}><Icon weight="duotone" /><span>{dictionary.settings[labelKey]}</span>{theme === value && <Check weight="bold" />}</button>);

  return <div className="theme-switcher" ref={rootRef}>
    <button ref={triggerRef} type="button" className="settings-trigger theme-trigger" aria-haspopup="menu" aria-expanded={open} aria-label={label} onClick={() => setOpen((value) => !value)}><CurrentIcon weight="bold" /><span>{label}</span></button>
    <AnimatePresence>{open && (mobile
      ? <motion.div className="sheet-backdrop" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget) close(); }} initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reducedMotion ? undefined : { opacity: 0 }}><motion.div ref={sheetRef} className="theme-sheet" role="dialog" aria-modal="true" aria-label={label} drag={reducedMotion ? false : "y"} dragConstraints={{ top: 0, bottom: 160 }} onDragEnd={(_, info) => { if (info.offset.y > 90 || info.velocity.y > 700) close(); }} initial={reducedMotion ? false : { y: "100%" }} animate={{ y: 0 }} exit={reducedMotion ? undefined : { y: "100%" }} transition={{ type: "spring", stiffness: 360, damping: 34 }}><div className="sheet-drag-indicator" /><header><h2>{label}</h2><button type="button" className="sheet-close" aria-label={dictionary.settings.close} onClick={close}><X weight="bold" /></button></header><div className="theme-sheet-options" role="menu">{optionButtons}</div></motion.div></motion.div>
      : <motion.div className="theme-menu" role="menu" aria-label={label} initial={reducedMotion ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>{optionButtons}</motion.div>
    )}</AnimatePresence>
  </div>;
}
