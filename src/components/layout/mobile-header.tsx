"use client";

import { Bell } from "@phosphor-icons/react";
import { useState } from "react";
import { CurrencyBadge, IconButton, StreakBadge } from "@/src/components/ui";
import type { AppUser } from "@/src/types/app";
import { Brand } from "./brand";

export function MobileHeader({ user }: { user: AppUser }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="mobile-header">
      <Brand compact />
      <div className="mobile-stats">
        <StreakBadge value={user.streak} />
        <CurrencyBadge value={user.xp} />
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
