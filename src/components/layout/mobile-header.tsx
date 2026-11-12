"use client";

import { Bell, Fire, Lightning } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import type { AppDictionary, AppUser } from "@/src/types/app";

/** Phone header: avatar, greeting with streak and XP, notifications. */
export function MobileHeader({ user, dictionary }: { user: AppUser; dictionary: AppDictionary }) {
  const [open, setOpen] = useState(false);
  const firstName = user.name.split(/\s+/)[0];
  return (
    <header className="mobile-header">
      <Link href="/profile" className="gx-avatar" aria-label={dictionary.nav.profile}>{firstName.slice(0, 1).toUpperCase()}</Link>
      <div className="gx-hello">
        <strong>{dictionary.learning.greeting}, {firstName}</strong>
        <span><Fire weight="fill" className="gx-fire" /> {user.streak} <Lightning weight="fill" className="gx-bolt" /> {user.xp} XP</span>
      </div>
      <div className="notification-wrap">
        <button type="button" className="gx-bell" aria-label="Уведомления" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <Bell weight="bold" />
          <span className="notification-dot" />
        </button>
        {open && (
          <div className="notification-popover" role="status">
            <strong>Пора закрепить серию</strong>
            <p>Сегодня достаточно одного короткого урока.</p>
          </div>
        )}
      </div>
    </header>
  );
}
