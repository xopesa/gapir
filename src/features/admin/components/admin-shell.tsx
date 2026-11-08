"use client";

import { BookOpen, ChartBar, House, SignOut, Users } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LocaleSwitcher } from "@/src/components/i18n/locale-switcher";
import { Brand } from "@/src/components/layout/brand";
import { ThemeSwitcher } from "@/src/components/theme/theme-switcher";
import type { AppDictionary, AppUser } from "@/src/types/app";

export function AdminShell({ children, user, dictionary }: { children: React.ReactNode; user: AppUser; dictionary: AppDictionary }) {
  const pathname = usePathname();
  const router = useRouter();
  const items = [{ href: "/admin", label: dictionary.admin.dashboard, icon: ChartBar }, { href: "/admin/courses", label: dictionary.admin.courses, icon: BookOpen }];
  if (user.role === "ADMIN" || user.role === "OWNER") items.push({ href: "/admin/users", label: dictionary.admin.users, icon: Users });
  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.replace("/login"); router.refresh(); };
  return <div className="admin-shell">
    <aside className="admin-sidebar"><Brand /><div className="admin-role"><strong>{user.name}</strong><span>{user.role}</span></div><nav>{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname === href || (href !== "/admin" && pathname.startsWith(href)) ? "active" : ""}><Icon weight="duotone" /><span>{label}</span></Link>)}</nav><div className="admin-sidebar-footer"><Link href="/"><House /> {dictionary.nav.learn}</Link><button type="button" onClick={() => void logout()}><SignOut /> {dictionary.common.logout}</button></div></aside>
    <div className="admin-main"><header className="admin-topbar"><div><p className="eyebrow">Gapir Studio</p><strong>{dictionary.admin.title}</strong></div><div className="admin-topbar-actions"><ThemeSwitcher initialTheme={user.preference?.theme ?? "system"} authenticated label={dictionary.settings.theme} locale={user.locale} /><LocaleSwitcher locale={user.locale} authenticated /></div></header><main>{children}</main></div>
  </div>;
}
