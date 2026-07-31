"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface ProgressBarProps {
  value: number;
  tone?: "blue" | "mint" | "amber";
  label?: string;
  compact?: boolean;
}

const widths: Record<number, string> = {
  20: "progress-width-20",
  30: "progress-width-30",
  40: "progress-width-40",
  50: "progress-width-50",
  60: "progress-width-60",
  70: "progress-width-70",
  80: "progress-width-80",
  90: "progress-width-90",
  100: "progress-width-100",
};

export function ProgressBar({
  value,
  tone = "blue",
  label,
  compact = false,
}: ProgressBarProps) {
  const rounded = Math.max(20, Math.min(100, Math.round(value / 10) * 10));
  return (
    <div className="progress-wrap">
      <div
        className={cn("progress-track", compact && "progress-compact")}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={label}
      >
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
          className={cn("progress-fill", `progress-${tone}`, widths[rounded])}
        />
      </div>
    </div>
  );
}
