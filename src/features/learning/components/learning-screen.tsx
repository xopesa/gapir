"use client";

import { ArrowRight, BookOpen, ChatsCircle, Check, GraduationCap, LockKey, Star, TextAa, Timer } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Mascot, type MascotKind } from "@/src/components/mascots/mascot";
import type { AppDictionary, AppUser } from "@/src/types/app";

type LessonStatus = "available" | "in_progress" | "completed" | "locked";
type LessonType = "VOCABULARY" | "GRAMMAR" | "CONVERSATION";
type LessonItem = { id: string; title: string; description: string; status: LessonStatus; type?: LessonType; xpReward: number; estimatedMinutes: number };

export interface LearningDashboardView {
  course: { title: string; description: string; level: string } | null;
  modules: Array<{ id: string; title: string; description?: string; lessons: LessonItem[] }>;
  progressPercent: number;
}

// Horizontal offsets (px) that make the roadmap zig-zag like a trail.
const PATH_OFFSETS = [0, 52, 78, 52, 0, -52, -78, -52];
const UNIT_MASCOTS: MascotKind[] = ["panda", "dragon", "tiger"];
const UNIT_TONES = ["tone-ink", "tone-lilac", "tone-peach"];

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

/**
 * The dashed trail that joins a unit's lesson nodes. Node positions depend on
 * label heights, so they are measured; the part already walked is coloured.
 */
function Trail({ walked }: { walked: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<{ done: string; rest: string }>({ done: "", rest: "" });
  useEffect(() => {
    const list = ref.current?.parentElement;
    if (!list) return;
    const measure = () => {
      const box = list.getBoundingClientRect();
      const points = [...list.querySelectorAll<HTMLElement>(".duo-node-btn")].map((node) => {
        const rect = node.getBoundingClientRect();
        return { x: rect.left + rect.width / 2 - box.left, y: rect.top + rect.height / 2 - box.top };
      });
      const curve = (from: number, to: number) => points.slice(from, to + 1).map((point, index, all) => {
        if (index === 0) return `M${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
        const previous = all[index - 1];
        const middle = ((previous.y + point.y) / 2).toFixed(1);
        return `C${previous.x.toFixed(1)} ${middle} ${point.x.toFixed(1)} ${middle} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
      }).join(" ");
      const last = points.length - 1;
      const split = Math.min(Math.max(walked, 0), last);
      setPaths({ done: split > 0 ? curve(0, split) : "", rest: split < last ? curve(split, last) : "" });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [walked]);
  return <svg ref={ref} className="duo-trail" aria-hidden="true">
    {paths.rest && <path d={paths.rest} className="duo-trail-rest" />}
    {paths.done && <path d={paths.done} className="duo-trail-done" />}
  </svg>;
}

export function LearningScreen({ user, dictionary, dashboard, onOpenLesson, banner }: { user: Pick<AppUser, "name">; dictionary: AppDictionary; dashboard: LearningDashboardView; onOpenLesson?: (id: string) => void; banner?: React.ReactNode }) {
  const reduced = useReducedMotion();
  const lessons = dashboard.modules.flatMap((module) => module.lessons);
  const current = lessons.find((lesson) => lesson.status === "in_progress") ?? lessons.find((lesson) => lesson.status === "available");
  const completed = lessons.filter((lesson) => lesson.status === "completed");
  const minutes = completed.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0);

  if (!dashboard.modules.length) {
    return <div className="duo-path-page"><div className="duo-empty"><Mascot kind="panda" mood="idle" size={120} /><h2>{dictionary.learning.empty}</h2><p>{dictionary.learning.subtitle}</p></div></div>;
  }

  return <div className="duo-path-page">
    {/* Hero: where the learner is now, one tap to go on. */}
    <section className="gx-hero">
      <span className="gx-hero-kicker">{dashboard.course?.level ?? "A1"} · {dashboard.course?.title ?? "Gapir"}</span>
      <h1>{current?.title ?? `${dictionary.learning.greeting}, ${user.name.split(/\s+/)[0]}!`}</h1>
      <p>{current?.description ?? dictionary.learning.subtitle}</p>
      {current && <LessonLink id={current.id} onOpen={onOpenLesson} className="gx-hero-go" label={dictionary.learning.continue}><ArrowRight weight="bold" /></LessonLink>}
      <Mascot kind="panda" mood="happy" size={128} className="gx-hero-mascot" />
    </section>
    {banner}

    <div className="gx-tiles">
      <div className="gx-tile tone-peach">
        <span className="gx-tile-head"><i><GraduationCap weight="fill" /></i>{dictionary.learning.lessonsLabel}</span>
        <strong>{completed.length}<small>/{lessons.length}</small></strong>
      </div>
      <div className="gx-tile tone-lilac">
        <span className="gx-tile-head"><i><Timer weight="fill" /></i>{dictionary.learning.minutesLabel}</span>
        <strong>{minutes}</strong>
      </div>
    </div>

    <section className="gx-progress">
      <header><h2>{dictionary.learning.progress}</h2><strong>{dashboard.progressPercent}%</strong></header>
      <div className="gx-progress-bars">
        {dashboard.modules.map((module, moduleIndex) => {
          const done = module.lessons.filter((lesson) => lesson.status === "completed").length;
          const share = module.lessons.length ? done / module.lessons.length : 0;
          return <div key={module.id} className={`gx-progress-col ${UNIT_TONES[moduleIndex % UNIT_TONES.length]}`}>
            <div className="gx-progress-bar"><motion.span initial={reduced ? false : { height: 0 }} animate={{ height: `${Math.max(share * 100, 6)}%` }} transition={{ duration: 0.6, delay: 0.08 * moduleIndex }} /></div>
            <b>{dictionary.lesson.unit} {moduleIndex + 1}</b>
            <span>{done}/{module.lessons.length}</span>
          </div>;
        })}
      </div>
    </section>

    <h2 className="gx-section-title">{dictionary.learning.section}</h2>

    {dashboard.modules.map((module, moduleIndex) => {
      const done = module.lessons.filter((lesson) => lesson.status === "completed").length;
      const unitMascot = UNIT_MASCOTS[moduleIndex % UNIT_MASCOTS.length];
      const currentIndex = module.lessons.findIndex((lesson) => lesson.id === current?.id);
      // How far the trail is walked: up to the current lesson, or the whole unit when it is done.
      const walked = currentIndex >= 0 ? currentIndex : done === module.lessons.length ? module.lessons.length - 1 : done - 1;
      return <section key={module.id} className="duo-unit">
        <div className={`duo-unit-banner ${UNIT_TONES[moduleIndex % UNIT_TONES.length]}`}>
          <div>
            <span className="duo-unit-kicker">{dictionary.lesson.unit} {moduleIndex + 1} · {done}/{module.lessons.length}</span>
            <h2>{module.title.replace(/^[^·]*·\s*/, "")}</h2>
            {module.description && <p>{module.description}</p>}
          </div>
          {currentIndex >= 0 && current && <LessonLink id={current.id} onOpen={onOpenLesson} className="duo-unit-cta" label={dictionary.learning.continue}><ArrowRight weight="bold" /></LessonLink>}
        </div>

        <ol className="duo-path">
          <Trail walked={walked} />
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
