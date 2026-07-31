"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/src/lib/utils";

export function IconButton({
  className,
  children,
  ...props
}: HTMLMotionProps<"button">) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cn("icon-button", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
