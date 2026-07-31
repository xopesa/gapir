"use client";

import { Clock, ShieldChevron, TrendUp, Trophy } from "@phosphor-icons/react";
import {
  Badge,
  Card,
  LeaderboardRow,
  ProgressBar,
  SectionHeader,
} from "@/src/components/ui";
import { leaderboard } from "@/src/mocks";

export function LeaguesScreen() {
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Еженедельный рейтинг</p>
          <h1>Сапфировая лига</h1>
          <p>Учитесь в своём ритме и поднимайтесь вместе с сообществом.</p>
        </div>
        <Badge tone="blue">
          <Clock weight="bold" /> 2 д 14 ч
        </Badge>
      </header>

      <Card className="league-hero" tone="ice">
        <div className="league-emblem" aria-hidden="true">
          <ShieldChevron weight="duotone" />
          <Trophy weight="fill" />
        </div>
        <div className="league-hero-copy">
          <p className="eyebrow">Ваша позиция</p>
          <h2>5 место</h2>
          <p>Ещё 180 XP до зоны повышения</p>
          <ProgressBar value={70} label="Прогресс до зоны повышения" />
        </div>
        <div className="league-stat">
          <TrendUp weight="bold" />
          <span>На 3 позиции выше, чем на прошлой неделе</span>
        </div>
      </Card>

      <section>
        <SectionHeader
          eyebrow="Таблица лиги"
          title="Топ участников"
          action={<span className="zone-legend">Топ 3 повышаются</span>}
        />
        <Card className="leaderboard-card">
          {leaderboard.map((user, index) => (
            <LeaderboardRow key={user.id} user={user} position={index + 1} />
          ))}
        </Card>
      </section>
    </div>
  );
}
