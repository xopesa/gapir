"use client";

import { SignIn, SignOut } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LocaleSwitcher } from "@/src/components/i18n/locale-switcher";
import { ThemeSwitcher } from "@/src/components/theme/theme-switcher";
import type { AppDictionary, AppUser } from "@/src/types/app";

/** Frame of the teacher's site: a top bar and the page. A `guest` works without an account and is offered to sign in instead of signing out. */
export function TeacherShell({ children, user, dictionary, guest }: { children: React.ReactNode; user: AppUser; dictionary: AppDictionary; guest: boolean }) {
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
          {guest
            ? <Link href="/login?returnTo=%2Fteacher" className="teacher-logout" aria-label={dictionary.auth.login} title={dictionary.auth.login}><SignIn weight="bold" /></Link>
            : <button type="button" className="teacher-logout" onClick={() => void logout()} aria-label={dictionary.common.logout} title={`${user.name} · ${dictionary.common.logout}`}><SignOut weight="bold" /></button>}
        </div>
      </header>
      <main className="teacher-main">
        {children}
      </main>
    </div>
  );
}
