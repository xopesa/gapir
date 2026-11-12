"use client";

import { Fire, Lightning } from "@phosphor-icons/react";
import { Avatar, Badge, Card } from "@/src/components/ui";
import { formatNumber } from "@/src/lib/utils";
import type { AppDictionary, AppUser } from "@/src/types/app";

export function RightSidebar({ user, dictionary }: { user: AppUser; dictionary: AppDictionary }) {
  const { name, xp, streak } = user;
  return (
    <aside className="right-sidebar">
      <Card className="profile-mini">
        <Avatar initials={name.trim().slice(0, 1).toUpperCase()} />
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
      </Card>

      <p className="xp-total">{dictionary.profile.totalXp}: {formatNumber(xp)}</p>
    </aside>
  );
}
