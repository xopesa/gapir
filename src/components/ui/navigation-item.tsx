"use client";

import type { Icon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/src/lib/utils";

export function NavigationItem({
  href,
  label,
  icon: IconComponent,
  active,
  compact = false,
}: {
  href: string;
  label: string;
  icon: Icon;
  active: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("nav-item", active && "nav-item-active", compact && "nav-item-compact")}
      aria-current={active ? "page" : undefined}
    >
      {active && (
        <motion.span
          layoutId={compact ? "mobile-nav-active" : "desktop-nav-active"}
          className="nav-active-bg"
          transition={{ type: "spring", stiffness: 340, damping: 30 }}
        />
      )}
      <IconComponent weight={active ? "fill" : "regular"} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
