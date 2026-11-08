"use client";

import { Fire, Lightning, Trophy } from "@phosphor-icons/react";
import { Avatar, Badge, Card, ProgressBar } from "@/src/components/ui";
import { formatNumber } from "@/src/lib/utils";
import type { AppDictionary, AppUser } from "@/src/types/app";

export function RightSidebar({ user, dictionary }: { user: AppUser; dictionary: AppDictionary }) {
  const { name, xp, streak } = user;
  return (
    <aside className="right-sidebar">
      <Card className="profile-mini">
        <Avatar initials="АЛ" />
        <div>
          <strong>{name}</strong>
          <span>{dictionary.profile.level} · A1</span>
        </div>
        <Badge tone="blue">A1</Badge>
      </Card>

      <Card className="right-card" tone="ice">
        <div className="right-card-title">
          <span className="soft-icon amber">
            <Fire weight="fill" />
          </span>
          <div>
            <span>{dictionary.profile.currentStreak}</span>
            <strong>{streak}</strong>
          </div>
        </div>
        <div className="week-row" aria-label="Активность за неделю">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day, index) => (
            <span key={day} className={index < 5 ? "day-active" : ""}>
              {day}
            </span>
          ))}
        </div>
      </Card>

      <Card className="right-card">
        <div className="right-card-title">
          <span className="soft-icon blue">
            <Lightning weight="fill" />
          </span>
          <div>
            <span>{dictionary.onboarding.dailyGoal}</span>
            <strong>{user.preference?.dailyGoalMinutes ?? 10} {dictionary.onboarding.minutes}</strong>
          </div>
        </div>
        <ProgressBar value={70} label="Дневная цель выполнена на 70%" />
      </Card>

      <Card className="right-card league-mini">
        <div className="right-card-title">
          <span className="soft-icon mint">
            <Trophy weight="fill" />
          </span>
          <div>
            <span>Сапфировая лига</span>
            <strong>5 место</strong>
          </div>
        </div>
        <p>Ещё 180 XP до зоны повышения</p>
      </Card>

      <p className="xp-total">{dictionary.profile.totalXp}: {formatNumber(xp)}</p>
    </aside>
  );
}
