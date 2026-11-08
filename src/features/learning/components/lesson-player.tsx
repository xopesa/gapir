"use client";

import { ArrowLeft, ArrowRight, CheckCircle, Clock, Sparkle, XCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Card, ProgressBar } from "@/src/components/ui";
import type { AppDictionary } from "@/src/types/app";
import { playSound } from "@/src/lib/sound/sound-manager";
import { useSoundSettings } from "@/src/lib/sound/use-sound-settings";
import type { SoundSettings } from "@/src/lib/sound/sound-types";
import { applyTheme } from "@/src/lib/theme/theme-manager";
import type { ThemePreference } from "@/src/lib/theme/theme-types";

interface ExerciseView {
  id: string; type: "MULTIPLE_CHOICE" | "ARRANGE_WORDS" | "MATCHING" | "TRANSLATE";
  instruction: string; question: string; xpReward: number;
  payload: { words?: string[]; left?: string[]; right?: string[] };
  options: { id: string; text: string }[];
}

interface LessonView { id: string; title: string; description: string; theory: string; xpReward: number; estimatedMinutes: number; exercises: ExerciseView[] }

export function LessonPlayer({ lesson, dictionary, soundSettings, theme }: { lesson: LessonView; dictionary: AppDictionary; soundSettings: SoundSettings; theme: ThemePreference }) {
  useSoundSettings(soundSettings, true);
  useEffect(() => { applyTheme(theme, true); }, [theme]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<unknown>("");
  const [result, setResult] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState<{ earnedXp: number; elapsedMinutes: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const exercise = lesson.exercises[index];
  const progress = lesson.exercises.length ? Math.round((index / lesson.exercises.length) * 100) : 0;

  const begin = async () => {
    setBusy(true); const response = await fetch(`/api/progress/lessons/${lesson.id}/start`, { method: "POST" }); setBusy(false);
    if (response.ok) { setStartedAt(Date.now()); setStarted(true); }
  };
  const submit = async () => {
    if (!exercise) return; setBusy(true);
    const response = await fetch(`/api/progress/exercises/${exercise.id}/answer`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answer }) });
    const payload = await response.json() as { isCorrect: boolean; explanation: string }; setBusy(false);
    if (response.ok) { setResult(payload); playSound(payload.isCorrect ? "correctAnswer" : "wrongAnswer"); if (payload.isCorrect) setCorrect((value) => value + 1); }
  };
  const next = async () => {
    if (index < lesson.exercises.length - 1) { setIndex((value) => value + 1); setAnswer(""); setResult(null); return; }
    setBusy(true); const response = await fetch(`/api/progress/lessons/${lesson.id}/complete`, { method: "POST" }); const payload = await response.json() as { earnedXp: number }; setBusy(false);
    if (response.ok) { setFinished({ ...payload, elapsedMinutes: Math.max(1, Math.round((Date.now() - startedAt) / 60000)) }); playSound("lessonComplete"); if (payload.earnedXp > 0) window.setTimeout(() => playSound("xpReward"), 320); }
  };

  if (finished) return <main className="lesson-page"><Card className="lesson-result-card" tone="ice"><span className="result-medal"><Sparkle weight="fill" /></span><p className="eyebrow">Gapir</p><h1>{dictionary.lesson.result}</h1><div className="result-stats"><div><strong>{correct} / {lesson.exercises.length}</strong><span>{dictionary.lesson.correctAnswers}</span></div><div><strong>+{finished.earnedXp}</strong><span>{dictionary.lesson.earnedXp}</span></div><div><strong>{finished.elapsedMinutes} min</strong><span>{dictionary.lesson.time}</span></div></div><Link href="/" className="button button-primary button-lg">{dictionary.lesson.returnHome} <ArrowRight /></Link></Card></main>;

  if (!started) return <main className="lesson-page"><Card className="lesson-intro-card"><Link href="/" className="lesson-back"><ArrowLeft /> {dictionary.common.back}</Link><span className="lesson-intro-icon"><Sparkle weight="duotone" /></span><p className="eyebrow">{dictionary.learning.lesson}</p><h1>{lesson.title}</h1><p>{lesson.description}</p><div className="lesson-theory"><h2>{dictionary.lesson.theory}</h2>{lesson.theory.split("\n").map((line) => <p key={line}>{line}</p>)}</div><div className="lesson-meta"><span><Clock /> {lesson.estimatedMinutes} {dictionary.learning.minutes}</span><span>+{lesson.xpReward} XP</span></div><Button size="lg" loading={busy} onClick={() => void begin()}>{dictionary.lesson.start} <ArrowRight /></Button></Card></main>;

  return <main className="lesson-page"><div className="lesson-player-wrap"><header className="lesson-player-header"><Link href="/" aria-label={dictionary.common.back}><ArrowLeft /></Link><ProgressBar value={progress} label={`${progress}%`} /><strong>{index + 1} / {lesson.exercises.length}</strong></header><Card className="exercise-card"><p className="eyebrow">{exercise.instruction}</p><h1>{exercise.question}</h1>
    <div className="exercise-control">
      {exercise.type === "MULTIPLE_CHOICE" && <div className="option-grid">{exercise.options.map((option) => <button type="button" key={option.id} className={answer === option.id ? "selected" : ""} disabled={Boolean(result)} onClick={() => setAnswer(option.id)}>{option.text}</button>)}</div>}
      {exercise.type === "TRANSLATE" && <input className="exercise-text-input" value={String(answer)} disabled={Boolean(result)} onChange={(event) => setAnswer(event.target.value)} autoFocus />}
      {exercise.type === "ARRANGE_WORDS" && <><div className="arranged-answer">{Array.isArray(answer) && answer.length ? answer.join(" ") : "…"}</div><div className="word-chips">{(exercise.payload.words ?? []).map((word, wordIndex) => <button type="button" key={`${word}-${wordIndex}`} disabled={Boolean(result)} onClick={() => setAnswer([...(Array.isArray(answer) ? answer : []), word])}>{word}</button>)}</div>{Array.isArray(answer) && answer.length > 0 && !result && <button type="button" className="text-action" onClick={() => setAnswer([])}>{dictionary.common.cancel}</button>}</>}
      {exercise.type === "MATCHING" && <div className="matching-grid">{(exercise.payload.left ?? []).map((left) => <label key={left}><strong>{left}</strong><select disabled={Boolean(result)} value={(answer as Record<string,string>)?.[left] ?? ""} onChange={(event) => setAnswer({ ...(typeof answer === "object" && answer ? answer as object : {}), [left]: event.target.value })}><option value="">—</option>{(exercise.payload.right ?? []).map((right) => <option key={right} value={right}>{right}</option>)}</select></label>)}</div>}
    </div>
    {result && <div className={`answer-result ${result.isCorrect ? "correct" : "incorrect"}`}>{result.isCorrect ? <CheckCircle weight="fill" /> : <XCircle weight="fill" />}<div><strong>{result.isCorrect ? dictionary.lesson.correct : dictionary.lesson.incorrect}</strong><p>{result.explanation}</p></div></div>}
    <div className="exercise-actions">{!result ? <Button size="lg" loading={busy} disabled={answer === "" || (Array.isArray(answer) && !answer.length)} onClick={() => void submit()}>{dictionary.lesson.check}</Button> : <Button size="lg" loading={busy} onClick={() => void next()}>{index === lesson.exercises.length - 1 ? dictionary.lesson.finish : dictionary.lesson.next} <ArrowRight /></Button>}</div>
  </Card></div></main>;
}
