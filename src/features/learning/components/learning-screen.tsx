"use client";

import { Bell, BookOpen, Check, ChatCircleDots, LockKey, Play, Sparkle } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, Badge, Card, IconButton, ProgressBar, SectionHeader, StreakBadge, XpBadge } from "@/src/components/ui";
import type { AppDictionary, AppUser } from "@/src/types/app";

export interface LearningDashboardView {
  course: { title: string; description: string; level: string } | null;
  modules: Array<{ id: string; title: string; lessons: Array<{ id: string; title: string; description: string; status: "available" | "in_progress" | "completed" | "locked"; xpReward: number; estimatedMinutes: number }> }>;
  progressPercent: number;
}

export function LearningScreen({ user, dictionary, dashboard }: { user: AppUser; dictionary: AppDictionary; dashboard: LearningDashboardView }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const lessons = dashboard.modules.flatMap((module) => module.lessons);
  const nextLesson = lessons.find((lesson) => lesson.status === "in_progress") ?? lessons.find((lesson) => lesson.status === "available");
  const initials = user.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <div className="page-stack">
    <header className="page-header"><div><p className="eyebrow">{dashboard.course?.title ?? "Gapir"}</p><h1>{dictionary.learning.greeting}, {user.name}!</h1><p>{dictionary.learning.subtitle}</p></div><div className="header-account"><div className="desktop-header-stats"><StreakBadge value={user.streak} /><XpBadge value={user.xp} /></div><div className="notification-wrap"><IconButton aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((value) => !value)}><Bell weight="bold" /></IconButton>{notificationsOpen && <div className="notification-popover"><strong>{dictionary.learning.continue}</strong><p>{nextLesson?.title ?? dictionary.learning.empty}</p></div>}</div><Avatar initials={initials} /></div></header>

    <Card className="learning-hero" tone="ice"><div className="hero-copy"><span className="hero-label"><Sparkle weight="fill" /> {dashboard.course?.level ?? "A1"}</span><h2>{nextLesson ? dictionary.learning.continue : lessons.length ? dictionary.learning.completed : dictionary.learning.empty}</h2><p>{nextLesson ? `${nextLesson.title} · ${nextLesson.estimatedMinutes} ${dictionary.learning.minutes}` : dashboard.course?.description}</p>{nextLesson && <Link className="button button-primary button-lg" href={`/learn/${nextLesson.id}`}><Play weight="fill" /> {dictionary.common.continue}</Link>}<div className="hero-progress"><div><span>{dictionary.learning.progress}</span><strong>{dashboard.progressPercent}%</strong></div><ProgressBar value={dashboard.progressPercent} label={`${dictionary.learning.progress} ${dashboard.progressPercent}%`} /></div></div><div className="hero-art" aria-hidden="true"><div className="orb orb-one" /><div className="orb orb-two" /><div className="hero-art-card art-main"><BookOpen weight="duotone" /><span>Salom</span></div><div className="hero-art-card art-chat"><ChatCircleDots weight="fill" /><span>Assalomu alaykum</span></div></div></Card>

    {dashboard.modules.length ? dashboard.modules.map((module) => <section key={module.id}><SectionHeader eyebrow={dictionary.learning.section} title={module.title} action={<span className="section-progress">{module.lessons.filter((lesson) => lesson.status === "completed").length} / {module.lessons.length}</span>} /><div className="lesson-track">{module.lessons.map((lesson, index) => { const enabled = lesson.status !== "locked"; const icon = lesson.status === "completed" ? <Check weight="bold" /> : enabled ? <Play weight="fill" /> : <LockKey weight="bold" />; const content = <><span className="lesson-orb">{icon}</span><Card className="lesson-copy" interactive={enabled}><div><span className="lesson-kicker">{dictionary.learning.lesson} {index + 1}</span><h3>{lesson.title}</h3><p>{lesson.description}</p></div><Badge tone={lesson.status === "completed" ? "mint" : "blue"}>+{lesson.xpReward} XP</Badge></Card></>; return enabled ? <Link href={`/learn/${lesson.id}`} className={`lesson-node lesson-${lesson.status === "in_progress" ? "active" : lesson.status}`} key={lesson.id}>{content}</Link> : <article className="lesson-node lesson-locked" key={lesson.id}>{content}</article>; })}</div></section>) : <Card className="empty-state" tone="ice"><BookOpen weight="duotone" /><h3>{dictionary.learning.empty}</h3><p>{dictionary.learning.subtitle}</p></Card>}
  </div>;
}
