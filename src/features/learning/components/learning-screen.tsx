"use client";

import { BookOpen, ChatsCircle, Check, LockKey, Star, TextAa } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Mascot, type MascotKind } from "@/src/components/mascots/mascot";
import type { AppDictionary, AppUser } from "@/src/types/app";

type LessonStatus = "available" | "in_progress" | "completed" | "locked";
type LessonType = "VOCABULARY" | "GRAMMAR" | "CONVERSATION";

export interface LearningDashboardView {
  course: { title: string; description: string; level: string } | null;
  modules: Array<{ id: string; title: string; description?: string; lessons: Array<{ id: string; title: string; description: string; status: LessonStatus; type?: LessonType; xpReward: number; estimatedMinutes: number }> }>;
  progressPercent: number;
}

// Horizontal offsets (px) that make the path zig-zag like a trail.
const PATH_OFFSETS = [0, 52, 78, 52, 0, -52, -78, -52];
const UNIT_MASCOTS: MascotKind[] = ["panda", "dragon", "tiger"];
const UNIT_TONES = ["tone-blue", "tone-mint", "tone-amber"];

function NodeIcon({ status, type }: { status: LessonStatus; type?: LessonType }) {
  if (status === "completed") return <Check weight="bold" />;
  if (status === "locked") return <LockKey weight="fill" />;
  if (type === "CONVERSATION") return <ChatsCircle weight="fill" />;
  if (type === "GRAMMAR") return <TextAa weight="bold" />;
  if (type === "VOCABULARY") return <BookOpen weight="fill" />;
  return <Star weight="fill" />;
}

/** A lesson link online; inside the offline app lessons open in place. */
function LessonLink({ id, onOpen, className, label, children }: { id: string; onOpen?: (id: string) => void; className: string; label?: string; children: React.ReactNode }) {
  if (onOpen) return <button type="button" className={className} aria-label={label} onClick={() => onOpen(id)}>{children}</button>;
  return <Link href={`/learn/${id}`} className={className} aria-label={label}>{children}</Link>;
}

export function LearningScreen({ user, dictionary, dashboard, onOpenLesson, banner }: { user: Pick<AppUser, "name">; dictionary: AppDictionary; dashboard: LearningDashboardView; onOpenLesson?: (id: string) => void; banner?: React.ReactNode }) {
  const reduced = useReducedMotion();
  const lessons = dashboard.modules.flatMap((module) => module.lessons);
  const current = lessons.find((lesson) => lesson.status === "in_progress") ?? lessons.find((lesson) => lesson.status === "available");

  if (!dashboard.modules.length) {
    return <div className="duo-path-page"><div className="duo-empty"><Mascot kind="panda" mood="idle" size={120} /><h2>{dictionary.learning.empty}</h2><p>{dictionary.learning.subtitle}</p></div></div>;
  }

  return <div className="duo-path-page">
    <header className="duo-course-head">
      <div>
        <p className="eyebrow">{dashboard.course?.level ?? "A1"} · {dictionary.learning.progress} {dashboard.progressPercent}%</p>
        <h1>{dashboard.course?.title ?? "Gapir"}</h1>
      </div>
      <span className="duo-course-greet">{dictionary.learning.greeting}, {user.name.split(/\s+/)[0]}!</span>
    </header>
    {banner}

    {dashboard.modules.map((module, moduleIndex) => {
      const done = module.lessons.filter((lesson) => lesson.status === "completed").length;
      const unitMascot = UNIT_MASCOTS[moduleIndex % UNIT_MASCOTS.length];
      return <section key={module.id} className="duo-unit">
        <div className={`duo-unit-banner ${UNIT_TONES[moduleIndex % UNIT_TONES.length]}`}>
          <div>
            <span className="duo-unit-kicker">{dictionary.lesson.unit} {moduleIndex + 1} · {done}/{module.lessons.length}</span>
            <h2>{module.title.replace(/^[^·]*·\s*/, "")}</h2>
            {module.description && <p>{module.description}</p>}
          </div>
          {current && module.lessons.some((lesson) => lesson.id === current.id) && <LessonLink id={current.id} onOpen={onOpenLesson} className="duo-unit-cta" label={dictionary.learning.continue}><BookOpen weight="fill" /></LessonLink>}
        </div>

        <ol className="duo-path">
          {module.lessons.map((lesson, index) => {
            const offset = PATH_OFFSETS[index % PATH_OFFSETS.length];
            const isCurrent = current?.id === lesson.id;
            const node = <>
              {isCurrent && <motion.span className="duo-start-tag" animate={reduced ? undefined : { y: [0, -5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>{lesson.status === "in_progress" ? dictionary.common.continue : dictionary.lesson.start}</motion.span>}
              <span className={`duo-node-btn status-${lesson.status}${isCurrent ? " is-current" : ""}`}><NodeIcon status={lesson.status} type={lesson.type} /></span>
              <span className="duo-node-label">{lesson.title}</span>
            </>;
            // A mascot sits beside the path, on the side opposite to the bend.
            const showMascot = index === 2 || (index > 2 && index % 5 === 2);
            return <li key={lesson.id} className="duo-path-item" style={{ "--offset": `${offset}px` } as React.CSSProperties}>
              {lesson.status === "locked"
                ? <div className="duo-node" aria-disabled="true" title={dictionary.learning.locked}>{node}</div>
                : <LessonLink id={lesson.id} onOpen={onOpenLesson} className="duo-node">{node}</LessonLink>}
              {showMascot && <Mascot kind={UNIT_MASCOTS[(moduleIndex + Math.floor(index / 5) + 1) % 3]} mood="idle" size={92} className={`duo-path-mascot ${offset >= 0 ? "on-left" : "on-right"}`} />}
            </li>;
          })}
        </ol>
        {moduleIndex === dashboard.modules.length - 1 && <div className="duo-path-end"><Mascot kind={unitMascot} mood={done === module.lessons.length ? "cheer" : "idle"} size={84} /></div>}
      </section>;
    })}
  </div>;
}
