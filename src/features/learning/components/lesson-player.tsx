"use client";

import { ArrowCounterClockwise, CheckCircle, Heart, Lightning, SpeakerHigh, Target, Timer, X, XCircle } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mascot, type MascotKind, type MascotMood } from "@/src/components/mascots/mascot";
import type { AppDictionary } from "@/src/types/app";
import { playSound } from "@/src/lib/sound/sound-manager";
import { useSoundSettings } from "@/src/lib/sound/use-sound-settings";
import type { SoundSettings } from "@/src/lib/sound/sound-types";
import { applyTheme } from "@/src/lib/theme/theme-manager";
import type { ThemePreference } from "@/src/lib/theme/theme-types";
import { narrationAudio, phraseAudio } from "@/src/content/audio-manifest.generated";
import { narrationKey, phraseKey } from "@/src/lib/audio-keys";
import { useSpeech } from "../hooks/use-speech";
import { checkOffline, isLessonCompleted, offlineStore } from "@/src/features/offline/offline-store";

type ExerciseType = "MULTIPLE_CHOICE" | "ARRANGE_WORDS" | "MATCHING" | "TRANSLATE";

interface ExerciseView {
  id: string; type: ExerciseType;
  instruction: string; question: string; xpReward: number;
  payload: { words?: string[]; left?: string[]; right?: string[]; prompt?: string; speak?: string; mascot?: MascotKind; optionImages?: Array<string | null>; teach?: string; listen?: boolean };
  options: { id: string; text: string }[];
}

interface LessonView { id: string; title: string; description: string; theory: string; xpReward: number; estimatedMinutes: number; targetLanguage?: string; exercises: ExerciseView[] }

type Answer = string | string[] | Record<string, string> | null;
type Feedback = { isCorrect: boolean; explanation: string; solution?: string; praise: string };

const MAX_HEARTS = 5;
const MASCOT_CYCLE: MascotKind[] = ["panda", "dragon", "tiger"];

function vibrate(pattern: number | number[]) {
  try { navigator.vibrate?.(pattern); } catch { /* unsupported */ }
}

function isAnswerReady(exercise: ExerciseView, answer: Answer) {
  if (answer === null) return false;
  if (exercise.type === "MATCHING") return Object.keys(answer as Record<string, string>).length === (exercise.payload.left?.length ?? 0);
  if (Array.isArray(answer)) return answer.length > 0;
  return String(answer).trim().length > 0;
}

function ExitLink({ onExit, className, label, children }: { onExit?: () => void; className: string; label?: string; children: React.ReactNode }) {
  if (onExit) return <button type="button" className={className} aria-label={label} onClick={onExit}>{children}</button>;
  return <Link href="/" className={className} aria-label={label}>{children}</Link>;
}

// ─── Exercise controls ──────────────────────────────────────────────────────

function ChoiceControl({ exercise, answer, locked, onAnswer }: { exercise: ExerciseView; answer: Answer; locked: boolean; onAnswer: (value: string) => void }) {
  const images = exercise.payload.optionImages;
  const withImages = Boolean(images?.some(Boolean));
  return <div className={withImages ? "duo-choice-grid" : "duo-choice-list"} role="radiogroup">
    {exercise.options.map((option, index) => <button
      type="button" role="radio" aria-checked={answer === option.id} key={option.id}
      className={`duo-tile${answer === option.id ? " is-selected" : ""}`} disabled={locked}
      onClick={() => { onAnswer(option.id); playSound("buttonTap"); }}
    >
      {withImages && <span className="duo-tile-image" aria-hidden="true">{images?.[index] ?? "❔"}</span>}
      {!withImages && <span className="duo-tile-key" aria-hidden="true">{index + 1}</span>}
      <span className="duo-tile-text">{option.text}</span>
    </button>)}
  </div>;
}

function ArrangeControl({ exercise, locked, onAnswer, clearLabel }: { exercise: ExerciseView; locked: boolean; onAnswer: (value: string[]) => void; clearLabel: string }) {
  const words = useMemo(() => exercise.payload.words ?? [], [exercise.payload.words]);
  // Track chosen tiles by bank index so repeated words stay distinct.
  // The control remounts for every exercise (keyed section), so state starts empty.
  const [picked, setPicked] = useState<number[]>([]);
  const update = (next: number[]) => { setPicked(next); onAnswer(next.map((index) => words[index])); playSound("buttonTap"); };
  return <div className="duo-arrange">
    <div className="duo-answer-line" aria-live="polite">
      {picked.map((wordIndex, position) => <motion.button layout layoutId={`w-${exercise.id}-${wordIndex}`} type="button" key={wordIndex} className="duo-word" disabled={locked} onClick={() => update(picked.filter((_, i) => i !== position))}>{words[wordIndex]}</motion.button>)}
    </div>
    <div className="duo-word-bank">
      {words.map((word, wordIndex) => picked.includes(wordIndex)
        ? <span key={wordIndex} className="duo-word is-ghost" aria-hidden="true">{word}</span>
        : <motion.button layout layoutId={`w-${exercise.id}-${wordIndex}`} type="button" key={wordIndex} className="duo-word" disabled={locked} onClick={() => update([...picked, wordIndex])}>{word}</motion.button>)}
    </div>
    {picked.length > 0 && !locked && <button type="button" className="duo-link" onClick={() => update([])}>{clearLabel}</button>}
  </div>;
}

function MatchControl({ exercise, answer, locked, onAnswer }: { exercise: ExerciseView; answer: Answer; locked: boolean; onAnswer: (value: Record<string, string>) => void }) {
  const left = exercise.payload.left ?? [];
  const right = exercise.payload.right ?? [];
  const pairs = (answer && typeof answer === "object" && !Array.isArray(answer) ? answer : {}) as Record<string, string>;
  const [activeLeft, setActiveLeft] = useState<string | null>(null);
  const [activeRight, setActiveRight] = useState<string | null>(null);
  const pairIndex = (side: "left" | "right", value: string) => {
    const entries = Object.entries(pairs);
    const at = entries.findIndex(([l, r]) => (side === "left" ? l : r) === value);
    return at;
  };
  const connect = (l: string, r: string) => {
    const next = Object.fromEntries(Object.entries(pairs).filter(([key, value]) => key !== l && value !== r));
    next[l] = r;
    onAnswer(next);
    setActiveLeft(null); setActiveRight(null);
    playSound("buttonTap");
  };
  const tap = (side: "left" | "right", value: string) => {
    const existing = pairIndex(side, value);
    if (existing >= 0) {
      // Tapping a paired tile unpairs it.
      onAnswer(Object.fromEntries(Object.entries(pairs).filter((_, index) => index !== existing)));
      return;
    }
    if (side === "left") { if (activeRight) connect(value, activeRight); else setActiveLeft(activeLeft === value ? null : value); }
    else { if (activeLeft) connect(activeLeft, value); else setActiveRight(activeRight === value ? null : value); }
  };
  const tile = (side: "left" | "right", value: string) => {
    const index = pairIndex(side, value);
    const active = side === "left" ? activeLeft === value : activeRight === value;
    return <button type="button" key={value} disabled={locked}
      className={`duo-tile duo-match-tile${active ? " is-selected" : ""}${index >= 0 ? ` is-paired pair-${index % 5}` : ""}`}
      onClick={() => tap(side, value)}>
      {index >= 0 && <span className="duo-pair-badge">{index + 1}</span>}
      <span className="duo-tile-text">{value}</span>
    </button>;
  };
  return <div className="duo-match">
    <div className="duo-match-col">{left.map((value) => tile("left", value))}</div>
    <div className="duo-match-col">{right.map((value) => tile("right", value))}</div>
  </div>;
}

// Extra keys phone keyboards usually lack, per target language.
const CHAR_KEYS: Record<string, string[]> = { uz: ["ö", "ğ", "ş", "ç", "ʼ"] };

function TypeControl({ answer, locked, onAnswer, placeholder, onSubmit, lang }: { answer: Answer; locked: boolean; onAnswer: (value: string) => void; placeholder: string; onSubmit: () => void; lang: string }) {
  const value = typeof answer === "string" ? answer : "";
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  // Insert at the caret and keep focus so the phone keyboard stays open.
  const insert = (char: string) => {
    const field = fieldRef.current;
    const start = field?.selectionStart ?? value.length;
    const end = field?.selectionEnd ?? value.length;
    onAnswer(`${value.slice(0, start)}${char}${value.slice(end)}`);
    requestAnimationFrame(() => { field?.focus(); field?.setSelectionRange(start + char.length, start + char.length); });
  };
  return <div className="duo-type">
    <textarea ref={fieldRef} className="duo-textarea" value={value} disabled={locked} rows={3}
      placeholder={placeholder} autoCapitalize="off" autoCorrect="off" spellCheck={false} lang={lang}
      onChange={(event) => onAnswer(event.target.value)}
      onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); onSubmit(); } }} />
    {/* Phone keyboards rarely have the new Uzbek letters — offer them as keys. */}
    <div className="duo-char-keys">{(CHAR_KEYS[lang] ?? []).map((char) => <button type="button" key={char} className="duo-char-key" disabled={locked} onPointerDown={(event) => event.preventDefault()} onClick={() => insert(char)}>{char}</button>)}</div>
  </div>;
}

function PromptCard({ text, speak, speakLabel, lang }: { text: string; speak?: string; speakLabel: string; lang: string }) {
  const speech = useSpeech(speak || text, lang);
  return <div className="duo-prompt" lang={lang}>
    {speech.available && <button type="button" className={`duo-speaker${speech.playing ? " is-playing" : ""}`} aria-label={speakLabel} onClick={() => speech.play()}><SpeakerHigh weight="fill" /></button>}
    <span className="duo-prompt-text">{text}</span>
  </div>;
}

/** Listening (book: 听录音): only a big speaker; the text shows after the answer. */
function ListenCard({ speak, label, lang, reveal }: { speak: string; label: string; lang: string; reveal: boolean }) {
  const speech = useSpeech(speak, lang);
  return <div className="duo-listen" lang={lang}>
    <button type="button" className={`duo-listen-btn${speech.playing ? " is-playing" : ""}`} aria-label={label} onClick={() => speech.play()}><SpeakerHigh weight="fill" /></button>
    {reveal && <span className="duo-prompt-text">{speak}</span>}
  </div>;
}

/**
 * Like a teacher: when an exercise appears the mascot reads the question, then
 * says the word to work with. Returns a function that replays the question.
 */
function useExerciseVoice(exerciseId: string, question: string, word: string | undefined, lang: string) {
  const questionUrl = narrationAudio[narrationKey(question)];
  const wordUrl = word ? phraseAudio[lang]?.[phraseKey(lang, word)] : undefined;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playList = useCallback((urls: string[]) => {
    audioRef.current?.pause();
    const next = ([first, ...rest]: string[]) => {
      if (!first) return;
      const audio = new Audio(first);
      audioRef.current = audio;
      audio.onended = () => { if (audioRef.current === audio) next(rest); };
      void audio.play().catch(() => undefined);
    };
    next(urls);
  }, []);
  useEffect(() => {
    playList([questionUrl, wordUrl].filter((url): url is string => Boolean(url)));
    return () => { audioRef.current?.pause(); audioRef.current = null; };
  }, [exerciseId, questionUrl, wordUrl, playList]);
  return questionUrl ? () => playList([questionUrl]) : null;
}

/** The mascot reads the lesson's theory aloud (pre-recorded); starts by itself. */
function Narration({ text, label }: { text: string; label: string }) {
  const url = narrationAudio[narrationKey(text)];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!url) return;
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onplay = () => setPlaying(true);
    audio.onpause = () => setPlaying(false);
    audio.onended = () => setPlaying(false);
    // Blocked without a tap on some browsers: then the button starts it.
    void audio.play().catch(() => undefined);
    return () => { audio.pause(); audioRef.current = null; };
  }, [url]);
  if (!url) return null;
  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { if (audio.ended) audio.currentTime = 0; void audio.play().catch(() => undefined); } else audio.pause();
  };
  return <button type="button" className={`duo-narration${playing ? " is-playing" : ""}`} onClick={toggle} aria-pressed={playing}>
    <SpeakerHigh weight="fill" /><span>{label}</span>
  </button>;
}

// ─── Screens ────────────────────────────────────────────────────────────────

function Bubble({ mascot, mood = "idle", children, size = 92 }: { mascot: MascotKind; mood?: MascotMood; children: React.ReactNode; size?: number }) {
  return <div className="duo-bubble-row">
    <Mascot kind={mascot} mood={mood} size={size} className="duo-bubble-mascot" />
    <div className="duo-bubble">{children}</div>
  </div>;
}

/**
 * Online the server checks every answer. When the network is gone (or `offline`
 * is set by the offline app) answers are checked against the downloaded course
 * package and the finished lesson is queued, to be replayed on the server later.
 */
export function LessonPlayer({ lesson, dictionary, soundSettings, theme, offline = false, onExit }: { lesson: LessonView; dictionary: AppDictionary; soundSettings: SoundSettings; theme: ThemePreference; offline?: boolean; onExit?: () => void }) {
  useSoundSettings(soundSettings, true);
  useEffect(() => { applyTheme(theme, true); }, [theme]);
  const reduced = useReducedMotion();
  const t = dictionary.lesson;
  const lang = lesson.targetLanguage ?? "uz";
  const total = lesson.exercises.length;

  const [phase, setPhase] = useState<"intro" | "play" | "hearts" | "done">("intro");
  const [queue, setQueue] = useState<number[]>(() => lesson.exercises.map((_, index) => index));
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [attempted, setAttempted] = useState<Set<string>>(new Set());
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [answer, setAnswer] = useState<Answer>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [result, setResult] = useState<{ earnedXp: number; seconds: number } | null>(null);
  const [reviewing, setReviewing] = useState(false);
  // Exercises whose short explanation (payload.teach) was already shown.
  const [taught, setTaught] = useState<Set<string>>(new Set());
  const [localMode, setLocalMode] = useState(offline);
  // Answers given without a network, replayed on the server when it is back.
  const offlineAttempts = useRef<Array<{ exerciseId: string; answer: unknown }>>([]);
  /** The downloaded package if it covers this lesson. */
  const offlinePack = useCallback(() => {
    const pack = offlineStore.pack();
    return pack?.lessons[lesson.id] ? pack : null;
  }, [lesson.id]);

  const exercise = queue.length ? lesson.exercises[queue[0]] : undefined;
  const progress = total ? Math.round((solved.size / total) * 100) : 0;
  const mascot: MascotKind = exercise?.payload.mascot ?? MASCOT_CYCLE[(queue[0] ?? 0) % MASCOT_CYCLE.length];
  // Step by step: before an exercise with `teach` the panda explains one thing first.
  const teaching = phase === "play" && exercise?.payload.teach && !taught.has(exercise.id) ? exercise.payload.teach : null;
  const learned = useCallback(() => { if (exercise) setTaught((values) => new Set(values).add(exercise.id)); }, [exercise]);

  const begin = async () => {
    setBusy(true); setError(false);
    const response = localMode ? null : await fetch(`/api/progress/lessons/${lesson.id}/start`, { method: "POST" }).catch(() => null);
    setBusy(false);
    if (!response && offlinePack()) setLocalMode(true);
    else if (!response?.ok) { setError(true); return; }
    setStartedAt(Date.now()); setPhase("play");
  };

  const restart = () => {
    setQueue(lesson.exercises.map((_, index) => index)); setSolved(new Set()); setAttempted(new Set());
    setFirstTryCorrect(0); setHearts(MAX_HEARTS); setAnswer(null); setFeedback(null); setReviewing(false);
    setPhase("play");
  };

  const check = useCallback(async () => {
    if (!exercise || feedback || busy || !isAnswerReady(exercise, answer)) return;
    setBusy(true); setError(false);
    const submitted = typeof answer === "string" ? answer.trim() : answer;
    const response = localMode ? null : await fetch(`/api/progress/exercises/${exercise.id}/answer`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer: submitted }),
    }).catch(() => null);
    setBusy(false);
    let payload: { isCorrect: boolean; explanation: string; solution?: string } | null = null;
    if (response?.ok) payload = await response.json() as { isCorrect: boolean; explanation: string; solution?: string };
    else if (!response) {
      // No network: check locally and remember the answer for the server.
      const pack = offlinePack();
      payload = pack ? checkOffline(pack, exercise.id, submitted) : null;
      if (payload) { setLocalMode(true); offlineAttempts.current.push({ exerciseId: exercise.id, answer: submitted }); }
    }
    if (!payload) { setError(true); return; }
    const praises = [t.praise1, t.praise2, t.praise3];
    setFeedback({ ...payload, praise: payload.isCorrect ? praises[(solved.size + firstTryCorrect) % praises.length] : t.incorrect });
    const firstTry = !attempted.has(exercise.id);
    setAttempted((values) => new Set(values).add(exercise.id));
    if (payload.isCorrect) {
      playSound("correctAnswer"); vibrate(15);
      if (firstTry) setFirstTryCorrect((value) => value + 1);
    } else {
      playSound("wrongAnswer"); vibrate([30, 40, 30]);
      setHearts((value) => Math.max(0, value - 1));
    }
  }, [answer, attempted, busy, exercise, feedback, firstTryCorrect, localMode, offlinePack, solved.size, t]);

  const finish = useCallback(async () => {
    setBusy(true); setError(false);
    const response = localMode ? null : await fetch(`/api/progress/lessons/${lesson.id}/complete`, { method: "POST" }).catch(() => null);
    setBusy(false);
    let payload: { earnedXp: number; alreadyCompleted?: boolean } | null = null;
    if (response?.ok) {
      payload = await response.json() as { earnedXp: number; alreadyCompleted?: boolean };
      offlineStore.markDone(lesson.id); // the offline path shows it as done right away
    }
    else if (!response && offlinePack()) {
      // Finished offline: queue it; XP is granted by the server when it syncs.
      const pack = offlinePack()!;
      const alreadyCompleted = isLessonCompleted(pack, lesson.id);
      offlineStore.enqueue({ lessonId: lesson.id, attempts: offlineAttempts.current, finishedAt: new Date().toISOString(), xp: alreadyCompleted ? 0 : lesson.xpReward });
      payload = { earnedXp: lesson.xpReward, alreadyCompleted };
    }
    if (!payload) { setError(true); return; }
    // A replay doesn't grant XP again; the server echoes the original reward.
    const earnedXp = payload.alreadyCompleted ? 0 : payload.earnedXp;
    setResult({ earnedXp, seconds: Math.max(1, Math.round((Date.now() - startedAt) / 1000)) });
    setPhase("done");
    playSound("lessonComplete");
    if (earnedXp > 0) window.setTimeout(() => playSound("xpReward"), 320);
  }, [lesson.id, lesson.xpReward, localMode, offlinePack, startedAt]);

  const proceed = useCallback(() => {
    if (!exercise || !feedback) return;
    const [current, ...rest] = queue;
    let nextQueue = rest;
    if (feedback.isCorrect) setSolved((values) => new Set(values).add(exercise.id));
    else nextQueue = [...rest, current]; // wrong answers come back at the end
    if (!feedback.isCorrect && hearts <= 0) { setFeedback(null); setPhase("hearts"); return; }
    const onlyReviewLeft = nextQueue.length > 0 && nextQueue.every((index) => attempted.has(lesson.exercises[index].id));
    setReviewing(onlyReviewLeft);
    setQueue(nextQueue); setAnswer(null); setFeedback(null);
    if (nextQueue.length === 0) void finish();
  }, [attempted, exercise, feedback, finish, hearts, lesson.exercises, queue]);

  // Each new exercise starts at the top of the screen (phones keep scroll otherwise).
  const currentKey = `${queue[0] ?? "end"}-${queue.length}`;
  useEffect(() => { window.scrollTo({ top: 0 }); }, [currentKey, phase, teaching]);

  // Desktop keyboard: digits pick options, Enter checks / continues.
  useEffect(() => {
    if (phase !== "play") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement) return;
      if (event.key === "Enter") { event.preventDefault(); if (teaching) learned(); else if (feedback) proceed(); else void check(); return; }
      if (teaching) return;
      if (!feedback && exercise?.type === "MULTIPLE_CHOICE") {
        const option = exercise.options[Number(event.key) - 1];
        if (option) setAnswer(option.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [check, exercise, feedback, learned, phase, proceed, teaching]);

  const enter = reduced ? {} : { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 }, transition: { duration: 0.22 } };

  // Intro: the panda explains the lesson's theory line by line.
  const playing = phase === "play" && exercise && !teaching;
  const replayQuestion = useExerciseVoice(playing ? `${exercise.id}-${queue.length}` : "", playing ? exercise.question : "", exercise?.payload.speak || exercise?.payload.prompt, lang);

  if (phase === "intro") {
    const lines = lesson.theory.split("\n").map((line) => line.trim()).filter(Boolean);
    return <main className="duo-lesson">
      <header className="duo-topbar"><ExitLink onExit={onExit} className="duo-icon-btn" label={t.quit}><X weight="bold" /></ExitLink><div className="duo-topbar-title">{lesson.title}</div><span className="duo-topbar-spacer" /></header>
      <div className="duo-body duo-intro">
        <Bubble mascot="panda" size={104}><strong className="duo-intro-title">{lesson.title}</strong><span>{lesson.description}</span><Narration text={lesson.theory} label={t.listenTheory} /></Bubble>
        <ol className="duo-theory">{lines.map((line, index) => <motion.li key={index} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 0.06 * index }}>{line}</motion.li>)}</ol>
        <div className="duo-intro-meta"><span><Timer weight="bold" /> {lesson.estimatedMinutes} min</span><span><Lightning weight="fill" /> +{lesson.xpReward} XP</span><span><Target weight="bold" /> {total}</span></div>
      </div>
      <footer className="duo-footer">{error && <p className="duo-error">⚠︎</p>}<button type="button" className="duo-btn duo-btn-primary" disabled={busy} onClick={() => void begin()}>{t.start}</button></footer>
    </main>;
  }

  if (phase === "hearts") {
    return <main className="duo-lesson">
      <div className="duo-body duo-center">
        <Mascot kind="tiger" mood="sad" size={150} />
        <h1 className="duo-title">{t.outOfHearts}</h1>
        <p className="duo-subtitle">{t.outOfHeartsText}</p>
      </div>
      <footer className="duo-footer duo-footer-stack"><button type="button" className="duo-btn duo-btn-primary" onClick={restart}><ArrowCounterClockwise weight="bold" /> {t.retry}</button><ExitLink onExit={onExit} className="duo-btn duo-btn-ghost">{t.quit}</ExitLink></footer>
    </main>;
  }

  if (phase === "done" && result) {
    const accuracy = total ? Math.round((firstTryCorrect / total) * 100) : 100;
    const minutes = Math.floor(result.seconds / 60);
    const time = `${minutes}:${String(result.seconds % 60).padStart(2, "0")}`;
    return <main className="duo-lesson">
      <div className="duo-body duo-center">
        <div className="duo-celebrate"><Mascot kind="dragon" mood="cheer" size={110} /><Mascot kind="panda" mood="cheer" size={140} /><Mascot kind="tiger" mood="cheer" size={110} /></div>
        <h1 className="duo-title">{accuracy === 100 ? t.perfect : t.result}</h1>
        <div className="duo-stats">
          <div className="duo-stat stat-xp"><span>{t.earnedXp}</span><strong><Lightning weight="fill" /> {result.earnedXp}</strong></div>
          <div className="duo-stat stat-acc"><span>{t.accuracy}</span><strong><Target weight="bold" /> {accuracy}%</strong></div>
          <div className="duo-stat stat-time"><span>{t.time}</span><strong><Timer weight="bold" /> {time}</strong></div>
        </div>
      </div>
      <footer className="duo-footer"><ExitLink onExit={onExit} className="duo-btn duo-btn-primary">{t.continue}</ExitLink></footer>
    </main>;
  }

  if (!exercise) return <main className="duo-lesson"><div className="duo-body duo-center"><Mascot kind="panda" mood="happy" size={120} /></div></main>;

  const topbar = <header className="duo-topbar">
    <ExitLink onExit={onExit} className="duo-icon-btn" label={t.quit}><X weight="bold" /></ExitLink>
    <div className="duo-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><motion.div className="duo-progress-fill" animate={{ width: `${Math.max(progress, 3)}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} /></div>
    <div className={`duo-hearts${hearts <= 1 ? " is-low" : ""}`} aria-label={`${hearts} / ${MAX_HEARTS}`}><Heart weight="fill" /><motion.span key={hearts} initial={reduced ? false : { scale: 1.6 }} animate={{ scale: 1 }}>{hearts}</motion.span></div>
  </header>;

  if (teaching) {
    const lines = teaching.split("\n").map((line) => line.trim()).filter(Boolean);
    return <main className="duo-lesson">
      {topbar}
      <div className="duo-body">
        <AnimatePresence mode="wait">
          <motion.section key={`teach-${exercise.id}`} className="duo-exercise duo-teach" {...enter}>
            <Bubble mascot="panda" size={104}>
              {/* Numbers are what the learner should remember: they stand out. */}
              {lines.map((line, index) => <span key={index} className="duo-teach-line">{line.split(/(\d+)/).map((part, at) => (at % 2 ? <strong key={at} className="duo-teach-num">{part}</strong> : part))}</span>)}
              <Narration text={teaching} label={t.listenTheory} />
            </Bubble>
          </motion.section>
        </AnimatePresence>
      </div>
      <footer className="duo-footer"><button type="button" className="duo-btn duo-btn-primary" onClick={learned} autoFocus>{t.continue}</button></footer>
    </main>;
  }

  const locked = Boolean(feedback);
  const ready = isAnswerReady(exercise, answer);
  const prompt = exercise.payload.prompt;

  return <main className="duo-lesson">
    {topbar}

    <div className="duo-body">
      <AnimatePresence mode="wait">
        <motion.section key={`${exercise.id}-${queue.length}`} className="duo-exercise" {...enter}>
          {reviewing && <p className="duo-review-tag"><ArrowCounterClockwise weight="bold" /> {t.reviewMistakes}</p>}
          <h1 className="duo-instruction">{exercise.instruction}</h1>
          <Bubble mascot={mascot} mood={feedback ? (feedback.isCorrect ? "happy" : "sad") : "idle"}>
            {exercise.payload.listen && exercise.payload.speak
              ? <ListenCard key={exercise.id} speak={exercise.payload.speak} label={t.listen} lang={lang} reveal={Boolean(feedback)} />
              : prompt && <PromptCard key={exercise.id} text={prompt} speak={exercise.payload.speak} speakLabel={t.listen} lang={lang} />}
            {replayQuestion
              ? <button type="button" className="duo-question duo-question-voice" onClick={replayQuestion} aria-label={t.listen}>{exercise.question} <SpeakerHigh weight="fill" /></button>
              : <span className="duo-question">{exercise.question}</span>}
          </Bubble>
          <div className="duo-control">
            {exercise.type === "MULTIPLE_CHOICE" && <ChoiceControl exercise={exercise} answer={answer} locked={locked} onAnswer={setAnswer} />}
            {exercise.type === "ARRANGE_WORDS" && <ArrangeControl exercise={exercise} locked={locked} onAnswer={setAnswer} clearLabel={t.clear} />}
            {exercise.type === "MATCHING" && <MatchControl exercise={exercise} answer={answer} locked={locked} onAnswer={setAnswer} />}
            {exercise.type === "TRANSLATE" && <TypeControl answer={answer} locked={locked} onAnswer={setAnswer} placeholder={t.typeHere} onSubmit={() => void check()} lang={lang} />}
          </div>
        </motion.section>
      </AnimatePresence>
    </div>

    <footer className={`duo-footer${feedback ? ` is-${feedback.isCorrect ? "correct" : "wrong"}` : ""}`}>
      <AnimatePresence>
        {feedback && <motion.div className="duo-feedback" role="status" initial={reduced ? false : { y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <span className="duo-feedback-icon">{feedback.isCorrect ? <CheckCircle weight="fill" /> : <XCircle weight="fill" />}</span>
          <div>
            <strong>{feedback.praise}</strong>
            {!feedback.isCorrect && feedback.solution && <p className="duo-solution"><span>{t.solution}</span> {feedback.solution}</p>}
            {feedback.explanation && <p>{feedback.explanation}</p>}
          </div>
        </motion.div>}
      </AnimatePresence>
      {error && <p className="duo-error">⚠︎</p>}
      {feedback
        ? <button type="button" className={`duo-btn ${feedback.isCorrect ? "duo-btn-success" : "duo-btn-danger"}`} disabled={busy} onClick={proceed} autoFocus>{t.continue}</button>
        : <button type="button" className="duo-btn duo-btn-primary" disabled={!ready || busy} onClick={() => void check()}>{t.check}</button>}
    </footer>
  </main>;
}
