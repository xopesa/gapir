"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BottomNavigation } from "./navigation";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileHeader } from "./mobile-header";
import { RightSidebar } from "./right-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <>
      <MobileHeader />
      <div className="app-shell">
        <DesktopSidebar />
        <motion.main
          className="main-content"
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {children}
        </motion.main>
        <RightSidebar />
      </div>
      <BottomNavigation />
    </>
  );
}
