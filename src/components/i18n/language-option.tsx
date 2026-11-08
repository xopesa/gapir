"use client";

import { Check, CheckCircle } from "@phosphor-icons/react";
import { localeLabels, type Locale } from "@/src/i18n/config";

export function LanguageOption({ locale, selected, mobile = false, onSelect }: { locale: Locale; selected: boolean; mobile?: boolean; onSelect: () => void }) {
  const SelectedIcon = mobile ? CheckCircle : Check;
  return <button type="button" role="option" aria-selected={selected} className={`language-option${selected ? " selected" : ""}`} onClick={onSelect}>
    <span><strong>{localeLabels[locale]}</strong><small>{locale.toUpperCase()}</small></span>
    {selected && <SelectedIcon weight={mobile ? "fill" : "bold"} aria-hidden="true" />}
  </button>;
}
