"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { locales, type Locale } from "@/src/i18n/config";
import { LanguageOption } from "./language-option";

export function LanguagePopover({ locale, label, onSelect, onClose }: { locale: Locale; label: string; onSelect: (locale: Locale) => void; onClose: () => void }) {
  const listRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const selected = listRef.current?.querySelector<HTMLElement>("[aria-selected='true']");
    selected?.focus();
  }, []);
  const onKeyDown = (event: React.KeyboardEvent) => {
    const options = [...(listRef.current?.querySelectorAll<HTMLButtonElement>("[role='option']") ?? [])];
    const current = options.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      options[(current + direction + options.length) % options.length]?.focus();
    }
    if (event.key === "Enter" && current >= 0) { event.preventDefault(); options[current].click(); }
    if (event.key === "Escape") { event.preventDefault(); onClose(); }
  };
  return <motion.div ref={listRef} className="language-popover" role="listbox" aria-label={label} onKeyDown={onKeyDown} initial={reducedMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
    {locales.map((item) => <LanguageOption key={item} locale={item} selected={item === locale} onSelect={() => onSelect(item)} />)}
  </motion.div>;
}
