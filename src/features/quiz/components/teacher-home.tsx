"use client";

import { BookOpen, PencilSimple, Play, Plus, Sparkle, Trash, Trophy } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card } from "@/src/components/ui";
import type { HostGameListItem } from "@/src/server/services/quiz-game-service";
import type { LessonTree, QuizListItem } from "@/src/server/services/quiz-service";
import type { AppDictionary } from "@/src/types/app";

async function postJson<T>(url: string, body: unknown): Promise<{ data?: T; error?: string }> {
  const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
  if (!response) return { error: "NETWORK" };
  const payload = await response.json().catch(() => ({})) as T & { error?: string };
  return response.ok ? { data: payload } : { error: payload.error ?? "REQUEST_FAILED" };
}

const LIMITS = [5, 10, 15, 20];

/** Teacher's start page: own quizzes, "new", "build from lessons" and the latest games. */
export function TeacherHome({ dictionary, quizzes, games, lessonTree, guest }: { dictionary: AppDictionary; guest: boolean; quizzes: QuizListItem[]; games: Array<HostGameListItem & { createdLabel: string }>; lessonTree: LessonTree }) {
  const t = dictionary.quiz;
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [lessonIds, setLessonIds] = useState<string[]>([]);
  const [limit, setLimit] = useState(10);

  const createQuiz = async () => {
    setBusy("new"); setMessage("");
    const { data } = await postJson<{ quiz: { id: string } }>("/api/teacher/quizzes", { title: t.newQuiz, questions: [] });
    if (data) router.push(`/teacher/quizzes/${data.quiz.id}`); else { setMessage(t.errGeneric); setBusy(""); }
  };
  const buildFromLessons = async () => {
    setBusy("lessons"); setMessage("");
    const { data, error } = await postJson<{ quiz: { id: string } }>("/api/teacher/quizzes/from-lessons", { lessonIds, limit });
    if (data) router.push(`/teacher/quizzes/${data.quiz.id}`);
    else { setMessage(error === "NO_QUESTIONS_IN_LESSONS" ? t.noQuestionsInLessons : t.errGeneric); setBusy(""); }
  };
  const playReady = async (moduleId: string) => {
    setBusy(`play:${moduleId}`); setMessage("");
    const { data } = await postJson<{ game: { id: string } }>("/api/teacher/games", { moduleId });
    if (data) router.push(`/teacher/games/${data.game.id}`); else { setMessage(t.errGeneric); setBusy(""); }
  };
  /** A copy of a unit's ready quiz in "My quizzes", to edit. */
  const copyReady = async (moduleId: string, ids: string[], questions: number) => {
    setBusy(`copy:${moduleId}`); setMessage("");
    const { data } = await postJson<{ quiz: { id: string } }>("/api/teacher/quizzes/from-lessons", { lessonIds: ids, limit: questions });
    if (data) router.push(`/teacher/quizzes/${data.quiz.id}`); else { setMessage(t.errGeneric); setBusy(""); }
  };
  const readyCourses = lessonTree.map((course) => ({ ...course, modules: course.modules.filter((courseModule) => courseModule.readyQuestions > 0) })).filter((course) => course.modules.length);
  const play = async (quizId: string) => {
    setBusy(quizId); setMessage("");
    const { data, error } = await postJson<{ game: { id: string } }>("/api/teacher/games", { quizId });
    if (data) router.push(`/teacher/games/${data.game.id}`);
    else { setMessage(error === "QUIZ_HAS_NO_QUESTIONS" ? t.needQuestions : t.errGeneric); setBusy(""); }
  };
  const remove = async (quizId: string) => {
    setBusy(quizId);
    const response = await fetch(`/api/teacher/quizzes/${quizId}`, { method: "DELETE" }).catch(() => null);
    if (!response?.ok) setMessage(t.errGeneric);
    setDeleting(null); setBusy(""); router.refresh();
  };
  const toggleLesson = (id: string) => setLessonIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  return (
    <div className="teacher-page">
      <header className="teacher-page-header">
        <div><p className="eyebrow">Gapir</p><h1>{t.teacherTitle}</h1><p>{t.teacherSubtitle}</p></div>
        <div className="teacher-actions">
          <Button type="button" onClick={() => void createQuiz()} loading={busy === "new"}><Plus weight="bold" /> {t.newQuiz}</Button>
          <Button type="button" variant="outline" onClick={() => setPicking((value) => !value)} aria-expanded={picking}><BookOpen weight="bold" /> {t.fromLessons}</Button>
        </div>
      </header>
      {message && <p className="quiz-error" role="alert">{message}</p>}

      {picking && (
        <Card className="teacher-lessons">
          <h2>{t.fromLessonsTitle}</h2>
          <p>{t.fromLessonsText}</p>
          {lessonTree.map((course) => (
            <div key={course.id} className="teacher-course">
              <h3>{course.title}</h3>
              {course.modules.map((courseModule) => (
                <fieldset key={courseModule.id}>
                  <legend>{courseModule.title}</legend>
                  <div className="teacher-lesson-chips">
                    {courseModule.lessons.map((lesson) => (
                      <label key={lesson.id} className={lessonIds.includes(lesson.id) ? "is-on" : undefined}>
                        <input type="checkbox" checked={lessonIds.includes(lesson.id)} onChange={() => toggleLesson(lesson.id)} disabled={!lessonIds.includes(lesson.id) && lessonIds.length >= 30} />
                        {lesson.title}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          ))}
          <div className="teacher-lessons-footer">
            <label>{t.questionsLimit}
              <select value={limit} onChange={(event) => setLimit(Number(event.target.value))}>{LIMITS.map((value) => <option key={value} value={value}>{value}</option>)}</select>
            </label>
            <Button type="button" disabled={!lessonIds.length} loading={busy === "lessons"} onClick={() => void buildFromLessons()}>{t.build}</Button>
          </div>
        </Card>
      )}

      {readyCourses.length > 0 && (
        <section>
          <h2 className="teacher-section-title"><Sparkle weight="fill" /> {t.readyQuizzes}</h2>
          <p className="teacher-section-text">{t.readyQuizzesText}</p>
          {readyCourses.map((course) => (
            <div key={course.id} className="teacher-ready-course">
              <h3>{course.title}</h3>
              <div className="teacher-quiz-list">
                {course.modules.map((courseModule) => (
                  <Card key={courseModule.id} className="teacher-quiz">
                    <div className="teacher-quiz-copy"><strong>{courseModule.title}</strong><span>{courseModule.readyQuestions} {t.questionsCount}</span></div>
                    <div className="teacher-quiz-actions">
                      <Button type="button" size="sm" loading={busy === `play:${courseModule.id}`} onClick={() => void playReady(courseModule.id)}><Play weight="fill" /> {t.play}</Button>
                      <Button type="button" size="sm" variant="outline" loading={busy === `copy:${courseModule.id}`} onClick={() => void copyReady(courseModule.id, courseModule.lessons.map((lesson) => lesson.id), courseModule.readyQuestions)}><PencilSimple weight="bold" /> {t.customize}</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      <section>
        <h2 className="teacher-section-title">{t.myQuizzes}</h2>
        {guest && <p className="teacher-section-text">{t.guestNote} <Link href="/login?returnTo=%2Fteacher">{dictionary.auth.login}</Link></p>}
        {quizzes.length === 0 ? (
          <Card className="teacher-empty"><Trophy weight="duotone" /><strong>{t.noQuizzes}</strong><p>{t.noQuizzesText}</p></Card>
        ) : (
          <div className="teacher-quiz-list">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="teacher-quiz">
                <div className="teacher-quiz-copy"><strong>{quiz.title}</strong><span>{quiz.questionCount} {t.questionsCount}</span></div>
                {deleting === quiz.id ? (
                  <div className="teacher-quiz-actions">
                    <span className="teacher-confirm">{t.confirmDelete}</span>
                    <Button type="button" size="sm" loading={busy === quiz.id} onClick={() => void remove(quiz.id)}>{t.deleteQuiz}</Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => setDeleting(null)}>{dictionary.common.cancel}</Button>
                  </div>
                ) : (
                  <div className="teacher-quiz-actions">
                    <Button type="button" size="sm" disabled={!quiz.questionCount} loading={busy === quiz.id} onClick={() => void play(quiz.id)}><Play weight="fill" /> {t.play}</Button>
                    <Link href={`/teacher/quizzes/${quiz.id}`} className="button button-outline button-sm"><PencilSimple weight="bold" /> {t.editQuiz}</Link>
                    <button type="button" className="teacher-icon-button" aria-label={`${t.deleteQuiz}: ${quiz.title}`} onClick={() => setDeleting(quiz.id)}><Trash weight="bold" /></button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {games.length > 0 && (
        <section>
          <h2 className="teacher-section-title">{t.recentGames}</h2>
          <div className="teacher-game-list">
            {games.map((game) => (
              <Link key={game.id} href={`/teacher/games/${game.id}`} className="teacher-game">
                <span className="teacher-game-copy"><strong>{game.title}</strong><small>{game.createdLabel} · {game.playerCount} {t.playersWord}</small></span>
                <span className={game.status === "FINISHED" ? "teacher-game-status" : "teacher-game-status is-live"}>{game.status === "FINISHED" ? t.statusFinished : t.statusLive}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
