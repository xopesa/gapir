"use client";

import { ArrowCounterClockwise, ArrowRight, Lightning } from "@phosphor-icons/react";
import Link from "next/link";
import { Badge, Card, SectionHeader } from "@/src/components/ui";
import type { LearningDashboardView } from "@/src/features/learning/components/learning-screen";
import type { AppDictionary } from "@/src/types/app";

/**
 * Practice = repeating lessons the learner has finished. Until the first lesson
 * is done the page points to the lesson to take now.
 */
export function PracticeScreen({ dictionary, dashboard }: { dictionary: AppDictionary; dashboard: LearningDashboardView }) {
  const t = dictionary.practice;
  const lessons = dashboard.modules.flatMap((module, moduleIndex) => module.lessons.map((lesson) => ({ ...lesson, unit: moduleIndex + 1 })));
  const completed = lessons.filter((lesson) => lesson.status === "completed");
  const current = lessons.find((lesson) => lesson.status === "in_progress") ?? lessons.find((lesson) => lesson.status === "available");
  // The lesson finished most recently is the freshest one to repeat.
  const featured = completed[completed.length - 1] ?? current;

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">{dictionary.nav.practice}</p>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </header>

      {featured && (
        <Card className="practice-feature" tone="blue">
          <div>
            <Badge className="badge-on-blue">{completed.length ? t.repeatLast : t.startFirst}</Badge>
            <h2>{featured.title}</h2>
            <p>{completed.length ? t.noXp : t.emptyText}</p>
            <Link href={`/learn/${featured.id}`} className="button button-secondary button-md">
              {completed.length ? t.repeat : dictionary.lesson.start} <ArrowRight weight="bold" />
            </Link>
          </div>
          <div className="practice-rings" aria-hidden="true">
            <span />
            <Lightning weight="fill" />
          </div>
        </Card>
      )}

      {completed.length > 0 && (
        <section>
          <SectionHeader eyebrow={`${completed.length}/${lessons.length}`} title={t.completedTitle} />
          <div className="practice-list">
            {completed.map((lesson) => (
              <Link key={lesson.id} href={`/learn/${lesson.id}`} className="practice-row">
                <span className="practice-row-icon"><ArrowCounterClockwise weight="bold" /></span>
                <span className="practice-row-copy">
                  <small>{dictionary.lesson.unit} {lesson.unit}</small>
                  <strong>{lesson.title}</strong>
                </span>
                <span className="practice-row-go">{t.repeat}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
