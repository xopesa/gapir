"use client";

import { SignOut } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LocaleSwitcher } from "@/src/components/i18n/locale-switcher";
import { Mascot } from "@/src/components/mascots/mascot";
import { ThemeSwitcher } from "@/src/components/theme/theme-switcher";
import type { AppDictionary, AppUser } from "@/src/types/app";

/** Frame of the teacher's site: a top bar and the page. `access` is false for accounts without the teacher role. */
export function TeacherShell({ children, user, dictionary, access }: { children: React.ReactNode; user: AppUser; dictionary: AppDictionary; access: boolean }) {
  const t = dictionary.quiz;
  const router = useRouter();
  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.replace("/login"); router.refresh(); };
  return (
    <div className="teacher-shell">
      <header className="teacher-topbar">
        <Link href="/teacher" className="teacher-brand">
          <Image src="/gapir-logo.png" alt="" width={40} height={40} unoptimized className="brand-logo-image" />
          <span><strong>Gapir</strong><small>{t.teacherTitle}</small></span>
        </Link>
        <div className="teacher-topbar-actions">
          <ThemeSwitcher initialTheme={user.preference?.theme ?? "system"} authenticated label={dictionary.settings.theme} locale={user.locale} />
          <LocaleSwitcher locale={user.locale} authenticated />
          <button type="button" className="teacher-logout" onClick={() => void logout()} aria-label={dictionary.common.logout} title={`${user.name} · ${dictionary.common.logout}`}><SignOut weight="bold" /></button>
        </div>
      </header>
      <main className="teacher-main">
        {access ? children : (
          <div className="teacher-no-access">
            <Mascot kind="panda" mood="sad" size={120} />
            <h1>{t.noAccessTitle}</h1>
            <p>{t.noAccessText}</p>
            <p className="teacher-account">{user.email}</p>
            <button type="button" className="button button-outline button-md" onClick={() => void logout()}>{dictionary.common.logout}</button>
          </div>
        )}
      </main>
    </div>
  );
}
