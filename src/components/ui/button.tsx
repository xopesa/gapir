"use client";

import { CircleNotch } from "@phosphor-icons/react";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children?: ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cn("button", `button-${variant}`, `button-${size}`, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <CircleNotch className="spin" weight="bold" />}
      {children}
    </motion.button>
  );
}
