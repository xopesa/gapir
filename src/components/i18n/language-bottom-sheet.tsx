"use client";

import { X } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { locales, type Locale } from "@/src/i18n/config";
import { LanguageOption } from "./language-option";

export function LanguageBottomSheet({ locale, title, closeLabel, onSelect, onClose }: { locale: Locale; title: string; closeLabel: string; onSelect: (locale: Locale) => void; onClose: () => void }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () => [...(sheetRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])") ?? [])];
    focusable()[0]?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", trap);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", trap); };
  }, [onClose]);
  return <motion.div className="sheet-backdrop" role="presentation" onPointerDown={(event) => { if (event.target === event.currentTarget) onClose(); }} initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reducedMotion ? undefined : { opacity: 0 }}>
    <motion.div ref={sheetRef} className="language-sheet" role="dialog" aria-modal="true" aria-labelledby="language-sheet-title" drag={reducedMotion ? false : "y"} dragConstraints={{ top: 0, bottom: 160 }} dragElastic={{ top: 0, bottom: 0.35 }} onDragEnd={(_, info) => { if (info.offset.y > 90 || info.velocity.y > 700) onClose(); }} initial={reducedMotion ? false : { y: "100%" }} animate={{ y: 0 }} exit={reducedMotion ? undefined : { y: "100%" }} transition={{ type: "spring", stiffness: 360, damping: 34 }}>
      <div className="sheet-drag-indicator" aria-hidden="true" />
      <header><h2 id="language-sheet-title">{title}</h2><button type="button" className="sheet-close" aria-label={closeLabel} onClick={onClose}><X weight="bold" /></button></header>
      <div className="language-sheet-list" role="listbox" aria-label={title}>{locales.map((item) => <LanguageOption key={item} locale={item} selected={item === locale} mobile onSelect={() => onSelect(item)} />)}</div>
    </motion.div>
  </motion.div>;
}
