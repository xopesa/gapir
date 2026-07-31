"use client";

import { Bell } from "@phosphor-icons/react";
import { useState } from "react";
import { CurrencyBadge, IconButton, StreakBadge } from "@/src/components/ui";
import { useUserStore } from "@/src/stores/user-store";
import { Brand } from "./brand";

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const { gapCoins, streak } = useUserStore();
  return (
    <header className="mobile-header">
      <Brand compact />
      <div className="mobile-stats">
        <StreakBadge value={streak} />
        <CurrencyBadge value={gapCoins} />
        <div className="notification-wrap">
          <IconButton
            aria-label="Уведомления"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <Bell weight="bold" />
            <span className="notification-dot" />
          </IconButton>
          {open && (
            <div className="notification-popover" role="status">
              <strong>Пора закрепить серию</strong>
              <p>Сегодня достаточно одного короткого урока.</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
