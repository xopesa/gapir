"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpen,
  CalendarDots,
  Fire,
  GearSix,
  Medal,
  SpeakerHigh,
  Star,
} from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Avatar,
  Badge,
  Button,
  Card,
  SectionHeader,
  StatCard,
} from "@/src/components/ui";
import { activity } from "@/src/mocks";
import { cn, formatNumber } from "@/src/lib/utils";
import { useUserStore } from "@/src/stores/user-store";

const settingsSchema = z.object({
  sound: z.boolean(),
  reminders: z.boolean(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

export function ProfileScreen() {
  const { xp, streak, completedLessons } = useUserStore();
  const { register, handleSubmit, formState } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { sound: true, reminders: true },
  });

  return (
    <div className="page-stack">
      <Card className="profile-hero" tone="ice">
        <Avatar initials="АЛ" size="xl" />
        <div className="profile-main-copy">
          <Badge tone="blue">Уровень 7 · A1</Badge>
          <h1>Алексей Морозов</h1>
          <p>Изучает узбекский с 12 июня 2026</p>
        </div>
        <Button variant="secondary">Редактировать</Button>
      </Card>

      <div className="stats-grid">
        <StatCard icon={<Fire weight="fill" />} label="текущий стрик" value={`${streak} дней`} />
        <StatCard icon={<Star weight="fill" />} label="лучший стрик" value="24 дня" />
        <StatCard icon={<BookOpen weight="duotone" />} label="уроков завершено" value={`${completedLessons.length}`} />
        <StatCard icon={<SpeakerHigh weight="duotone" />} label="слов изучено" value="286" />
      </div>

      <section>
        <SectionHeader eyebrow="Ваш ритм" title="Активность" action={<Badge tone="blue">{formatNumber(xp)} XP всего</Badge>} />
        <Card className="activity-card">
          <div className="activity-summary">
            <CalendarDots weight="duotone" />
            <div><strong>Июль</strong><span>22 активных дня</span></div>
          </div>
          <div className="activity-grid" aria-label="Календарь активности за июль">
            {activity.map((level, index) => (
              <span
                key={index}
                className={cn("activity-day", `activity-${level}`)}
                title={`${index + 1} июля`}
              />
            ))}
          </div>
        </Card>
      </section>

      <section>
        <SectionHeader eyebrow="Коллекция" title="Достижения" />
        <div className="achievement-grid">
          <Card className="achievement" interactive>
            <span className="achievement-icon gold"><Medal weight="fill" /></span>
            <div><h3>Первый диалог</h3><p>Пройдите мини-диалог без ошибок</p></div>
          </Card>
          <Card className="achievement" interactive>
            <span className="achievement-icon blue"><Fire weight="fill" /></span>
            <div><h3>Неделя в ритме</h3><p>Серия занятий длиной 7 дней</p></div>
          </Card>
          <Card className="achievement achievement-locked">
            <span className="achievement-icon"><Star weight="fill" /></span>
            <div><h3>500 слов</h3><p>Осталось выучить 214 слов</p></div>
          </Card>
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Предпочтения" title="Настройки интерфейса" />
        <Card className="settings-card">
          <div className="settings-heading"><GearSix weight="duotone" /><div><h3>Обучение без отвлечений</h3><p>Настройки сохраняются локально.</p></div></div>
          <form
            onSubmit={handleSubmit(() => undefined)}
            className="settings-form"
          >
            <label>
              <span><strong>Звуки интерфейса</strong><small>Награды и ответы</small></span>
              <input type="checkbox" {...register("sound")} />
            </label>
            <label>
              <span><strong>Напоминания</strong><small>Мягкое напоминание о серии</small></span>
              <input type="checkbox" {...register("reminders")} />
            </label>
            <Button type="submit" size="sm" variant="outline">
              {formState.isSubmitted ? "Сохранено" : "Сохранить"}
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
}
