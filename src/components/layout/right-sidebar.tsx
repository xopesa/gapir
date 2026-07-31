"use client";

import { Fire, Lightning, Trophy } from "@phosphor-icons/react";
import { Avatar, Badge, Card, ProgressBar } from "@/src/components/ui";
import { formatNumber } from "@/src/lib/utils";
import { useUserStore } from "@/src/stores/user-store";

export function RightSidebar() {
  const { name, xp, streak } = useUserStore();
  return (
    <aside className="right-sidebar">
      <Card className="profile-mini">
        <Avatar initials="АЛ" />
        <div>
          <strong>{name}</strong>
          <span>Уровень 7 · A1</span>
        </div>
        <Badge tone="blue">A1</Badge>
      </Card>

      <Card className="right-card" tone="ice">
        <div className="right-card-title">
          <span className="soft-icon amber">
            <Fire weight="fill" />
          </span>
          <div>
            <span>Текущая серия</span>
            <strong>{streak} дней</strong>
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
            <span>Дневная цель</span>
            <strong>35 / 50 XP</strong>
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

      <p className="xp-total">Всего {formatNumber(xp)} XP</p>
    </aside>
  );
}
