"use client";

import { CaretDown, GlobeSimple } from "@phosphor-icons/react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { detectLocale, getDictionary, isLocale, localeLabels, type Locale } from "@/src/i18n/config";
import { LanguageBottomSheet } from "./language-bottom-sheet";
import { LanguagePopover } from "./language-popover";

function persistLocale(next: Locale) {
  window.localStorage.setItem("gapir-locale", next);
  document.cookie = `gapir_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
  window.dispatchEvent(new Event("gapir-locale-change"));
}

function useMobileSheet() {
  return useSyncExternalStore(
    (notify) => { const query = window.matchMedia("(max-width: 767px)"); query.addEventListener("change", notify); return () => query.removeEventListener("change", notify); },
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );
}

export function usePublicLocale(initial: Locale = "ru") {
  const locale = useSyncExternalStore(
    (notify) => {
      window.addEventListener("storage", notify);
      window.addEventListener("gapir-locale-change", notify);
      return () => { window.removeEventListener("storage", notify); window.removeEventListener("gapir-locale-change", notify); };
    },
    () => { const saved = window.localStorage.getItem("gapir-locale"); return isLocale(saved) ? saved : detectLocale(window.navigator.language); },
    () => initial,
  );
  return { locale, setLocale: persistLocale };
}

export function LocaleSwitcher({ locale, authenticated = false, onChange }: { locale: Locale; authenticated?: boolean; onChange?: (locale: Locale) => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const mobile = useMobileSheet();
  const dictionary = getDictionary(locale);
  const close = useCallback(() => { setOpen(false); window.requestAnimationFrame(() => triggerRef.current?.focus()); }, []);

  useEffect(() => {
    if (!open || mobile) return;
    const outside = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) close(); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [close, mobile, open]);

  const change = async (next: Locale) => {
    persistLocale(next);
    onChange?.(next);
    close();
    if (authenticated) {
      await fetch("/api/preferences", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale: next }) });
      router.refresh();
    }
  };

  return <div className="language-switcher" ref={rootRef}>
    <button ref={triggerRef} type="button" className="settings-trigger language-trigger" aria-label={dictionary.common.language} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((value) => !value)}><GlobeSimple weight="bold" aria-hidden="true" /><span>{localeLabels[locale]}</span><CaretDown className={open ? "open" : ""} weight="bold" aria-hidden="true" /></button>
    <AnimatePresence>{open && (mobile
      ? <LanguageBottomSheet locale={locale} title={dictionary.settings.chooseLanguage} closeLabel={dictionary.settings.close} onSelect={(next) => void change(next)} onClose={close} />
      : <LanguagePopover locale={locale} label={dictionary.settings.chooseLanguage} onSelect={(next) => void change(next)} onClose={close} />
    )}</AnimatePresence>
  </div>;
}
