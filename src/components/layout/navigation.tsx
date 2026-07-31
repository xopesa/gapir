"use client";

import {
  BookOpen,
  Storefront,
  Target,
  Trophy,
  UserCircle,
} from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { NavigationItem } from "@/src/components/ui";

const navItems = [
  { href: "/", label: "Обучение", icon: BookOpen },
  { href: "/practice", label: "Практика", icon: Target },
  { href: "/leagues", label: "Лиги", icon: Trophy },
  { href: "/shop", label: "Магазин", icon: Storefront },
  { href: "/profile", label: "Профиль", icon: UserCircle },
];

export function DesktopNavigation() {
  const pathname = usePathname();
  return (
    <nav className="desktop-nav" aria-label="Основная навигация">
      {navItems.map((item) => (
        <NavigationItem
          key={item.href}
          {...item}
          active={pathname === item.href}
        />
      ))}
    </nav>
  );
}

export function BottomNavigation() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      {navItems.map((item) => (
        <NavigationItem
          key={item.href}
          {...item}
          compact
          active={pathname === item.href}
        />
      ))}
    </nav>
  );
}
