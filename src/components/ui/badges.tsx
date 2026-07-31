import { Coins, Fire, Lightning } from "@phosphor-icons/react";
import { cn } from "@/src/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "blue" | "mint" | "amber";
  className?: string;
}) {
  return <span className={cn("badge", `badge-${tone}`, className)}>{children}</span>;
}

export function StreakBadge({ value }: { value: number }) {
  return (
    <Badge tone="amber">
      <Fire weight="fill" aria-hidden="true" />
      {value}
    </Badge>
  );
}

export function CurrencyBadge({ value }: { value: number }) {
  return (
    <Badge tone="mint">
      <Coins weight="fill" aria-hidden="true" />
      {value}
    </Badge>
  );
}

export function XpBadge({ value }: { value: number }) {
  return (
    <Badge tone="blue">
      <Lightning weight="fill" aria-hidden="true" />
      {value} XP
    </Badge>
  );
}
