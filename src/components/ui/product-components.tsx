"use client";

import {
  Check,
  Coins,
  LockKey,
  Play,
  ShoppingBagOpen,
  Sparkle,
} from "@phosphor-icons/react";
import type { LeaderboardUser, Lesson, ShopItem } from "@/src/types";
import { cn, formatNumber } from "@/src/lib/utils";
import { Avatar } from "./avatar";
import { Badge } from "./badges";
import { Button } from "./button";
import { Card } from "./card";

export function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="stat-card">
      <span className="stat-icon">{icon}</span>
      <strong>{value}</strong>
      <span>{label}</span>
    </Card>
  );
}

export function LessonNode({
  lesson,
  onStart,
}: {
  lesson: Lesson;
  onStart: (lesson: Lesson) => void;
}) {
  const statusIcon = {
    completed: <Check weight="bold" />,
    active: <Play weight="fill" />,
    locked: <LockKey weight="bold" />,
  }[lesson.status];

  return (
    <article className={cn("lesson-node", `lesson-${lesson.status}`)}>
      <button
        type="button"
        className="lesson-orb"
        aria-label={`${lesson.title}: ${lesson.status}`}
        disabled={lesson.status === "locked"}
        onClick={() => onStart(lesson)}
      >
        {statusIcon}
      </button>
      <Card className="lesson-copy" interactive={lesson.status !== "locked"}>
        <div>
          <span className="lesson-kicker">Урок {lesson.id}</span>
          <h3>{lesson.title}</h3>
          <p>{lesson.subtitle}</p>
        </div>
        <Badge tone={lesson.status === "completed" ? "mint" : "blue"}>
          +{lesson.xp} XP
        </Badge>
      </Card>
    </article>
  );
}

export function ShopItemCard({
  item,
  purchased,
  canAfford,
  onPurchase,
}: {
  item: ShopItem;
  purchased: boolean;
  canAfford: boolean;
  onPurchase: () => void;
}) {
  return (
    <Card className="shop-item" interactive={!purchased}>
      <div className={cn("shop-visual", `shop-${item.accent}`)}>
        {item.category === "Подписка" ? (
          <Sparkle weight="fill" />
        ) : (
          <ShoppingBagOpen weight="duotone" />
        )}
      </div>
      <div className="shop-copy">
        <Badge>{item.category}</Badge>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
      <div className="shop-footer">
        <span className="price">
          <Coins weight="fill" /> {item.price}
        </span>
        <Button
          size="sm"
          variant={purchased ? "secondary" : "primary"}
          disabled={purchased || !canAfford || item.state === "unavailable"}
          onClick={onPurchase}
        >
          {purchased ? "Куплено" : canAfford ? "Купить" : "Не хватает"}
        </Button>
      </div>
    </Card>
  );
}

export function LeaderboardRow({
  user,
  position,
}: {
  user: LeaderboardUser;
  position: number;
}) {
  return (
    <div
      className={cn(
        "leader-row",
        user.current && "leader-current",
        `zone-${user.zone}`,
      )}
    >
      <span className="leader-position">{position}</span>
      <Avatar initials={user.initials} size="sm" />
      <strong>{user.name}</strong>
      <span>{formatNumber(user.xp)} XP</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="empty-state" tone="ice">
      <Sparkle weight="duotone" />
      <h3>{title}</h3>
      <p>{description}</p>
    </Card>
  );
}
