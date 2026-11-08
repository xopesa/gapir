"use client";

import {
  BookOpen,
  Target,
  ShieldCheck,
  Sparkle,
  UserCircle,
} from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { NavigationItem } from "@/src/components/ui";
import type { AppDictionary, AppUser } from "@/src/types/app";
import type { PublicAiFlags } from "@/src/server/ai/config/public-flags";

function getNavItems(dictionary: AppDictionary, user: AppUser, aiFlags: PublicAiFlags) {
  const items = [
    { href: "/", label: dictionary.nav.learn, icon: BookOpen },
    { href: "/practice", label: dictionary.nav.practice, icon: Target },
  ];
  if (aiFlags.assistantEnabled) items.push({ href: "/ai-assistant", label: dictionary.nav.aiAssistant, icon: Sparkle });
  items.push({ href: "/profile", label: dictionary.nav.profile, icon: UserCircle });
  if (user.role !== "USER") items.push({ href: "/admin", label: dictionary.nav.admin, icon: ShieldCheck });
  return items;
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNavigation({ dictionary, user, aiFlags }: { dictionary: AppDictionary; user: AppUser; aiFlags: PublicAiFlags }) {
  const pathname = usePathname();
  const navItems = getNavItems(dictionary, user, aiFlags);
  return (
    <nav className="desktop-nav" aria-label="Основная навигация">
      {navItems.map((item) => (
        <NavigationItem
          key={item.href}
          {...item}
          active={isActive(pathname, item.href)}
        />
      ))}
    </nav>
  );
}

export function BottomNavigation({ dictionary, user, aiFlags }: { dictionary: AppDictionary; user: AppUser; aiFlags: PublicAiFlags }) {
  const pathname = usePathname();
  const navItems = getNavItems(dictionary, user, aiFlags);
  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      {navItems.map((item) => (
        <NavigationItem
          key={item.href}
          {...item}
          compact
          active={isActive(pathname, item.href)}
        />
      ))}
    </nav>
  );
}
