"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  interactive?: boolean;
  tone?: "surface" | "ice" | "blue" | "soft";
}

export function Card({
  className,
  interactive = false,
  tone = "surface",
  children,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={cn("card", `card-${tone}`, className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
