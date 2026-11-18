"use client";

import { ArrowRight, Check, Play, Trophy, Users } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import { Mascot } from "@/src/components/mascots/mascot";
import { Button } from "@/src/components/ui";
import { OPTION_LETTERS, secondsLeft, useQuizPoll } from "@/src/features/quiz/use-quiz-poll";
import { cn } from "@/src/lib/utils";
import type { HostGameState } from "@/src/server/services/quiz-game-service";
import type { AppDictionary } from "@/src/types/app";

function pollDelay(state: HostGameState | null, failed: boolean) {
  if (failed || !state) return 3000;
  if (state.phase === "FINISHED") return 0;
  if (state.phase === "LOBBY") return 1500;
  // After the answer is shown nothing changes until the teacher presses a button.
  return state.phase === "REVEAL" ? 4000 : 1000;
}

type HostAction = "start" | "reveal" | "next" | "end";

/** The screen the teacher shows to the class: the code, then each question, the answers and the scoreboard. */
export function QuizHostScreen({ gameId, dictionary, learnerSite }: { gameId: string; dictionary: AppDictionary; learnerSite: string }) {
  const t = dictionary.quiz;
  const { state, error, serverNow, apply } = useQuizPoll<HostGameState>(`/api/teacher/games/${gameId}`, pollDelay);
  const [busy, setBusy] = useState<HostAction | "">("");
  const [ending, setEnding] = useState(false);
  const [message, setMessage] = useState("");

  const act = async (action: HostAction) => {
    setBusy(action); setMessage("");
    const response = await fetch(`/api/teacher/games/${gameId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) }).catch(() => null);
    const payload = response ? await response.json().catch(() => ({})) as { game?: HostGameState } : {};
    if (response?.ok && payload.game) apply(payload.game); else setMessage(t.errGeneric);
    setBusy(""); setEnding(false);
  };

  if (!state) {
    return <div className="host-stage host-center"><Mascot kind="tiger" mood={error ? "sad" : "idle"} size={112} /><p>{error ? t.errGeneric : dictionary.common.loading}</p>{error && <Link href="/teacher" className="button button-outline button-md">{t.hostBack}</Link>}</div>;
  }

  const { phase, players, question } = state;
  const left = secondsLeft(state.closesAt, serverNow);
  const last = state.questionIndex >= state.total - 1;
  const progress = state.questionIndex >= 0 && phase !== "FINISHED" ? `${t.question} ${state.questionIndex + 1} ${t.of} ${state.total}` : "";
  const topCount = Math.max(1, ...(state.distribution ?? [1]));

  const bar = (
    <header className="host-bar">
      <div className="host-bar-title"><strong>{state.title}</strong>{progress && <span>{progress}</span>}</div>
      <div className="host-bar-pin" aria-label={t.pinLabel}><small>{t.pinLabel}</small><b>{state.pin}</b></div>
      <div className="host-bar-players"><Users weight="fill" /> {players.length}</div>
      {phase !== "FINISHED" && (ending ? (
        <div className="host-bar-end">
          <span>{t.hostConfirmEnd}</span>
          <Button type="button" size="sm" loading={busy === "end"} onClick={() => void act("end")}>{t.hostEnd}</Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setEnding(false)}>{dictionary.common.cancel}</Button>
        </div>
      ) : <Button type="button" size="sm" variant="ghost" onClick={() => setEnding(true)}>{t.hostEnd}</Button>)}
    </header>
  );

  if (phase === "LOBBY") {
    return (
      <div className="host-stage">{bar}
        <div className="host-lobby">
          <div className="host-join">
            <p>{t.hostJoinAt}</p>
            <p className="host-site">{learnerSite}</p>
            <div className="host-pin" aria-label={`${t.pinLabel}: ${state.pin}`}>{state.pin.slice(0, 3)} {state.pin.slice(3)}</div>
          </div>
          <div className="host-players">
            <h2><Users weight="fill" /> {t.hostPlayers}: {players.length}</h2>
            {players.length ? <ul>{players.map((player) => <li key={player.id}>{player.nickname}</li>)}</ul> : <p className="quiz-muted">{t.hostWaiting}</p>}
          </div>
          {message && <p className="quiz-error" role="alert">{message}</p>}
          <Button type="button" size="lg" disabled={!players.length} loading={busy === "start"} onClick={() => void act("start")}><Play weight="fill" /> {t.hostStart}</Button>
        </div>
      </div>
    );
  }

  if (phase === "COUNTDOWN") {
    return (
      <div className="host-stage">{bar}
        <div className="host-center">
          <p className="quiz-muted">{progress}</p>
          <div className="quiz-countdown">{Math.max(1, secondsLeft(state.opensAt, serverNow))}</div>
          <h1>{t.getReady}</h1>
        </div>
      </div>
    );
  }

  if (phase === "FINISHED") {
    const podium = players.filter((player) => player.place <= 3).slice(0, 3);
    return (
      <div className="host-stage">{bar}
        <div className="host-final">
          <Mascot kind="dragon" mood="cheer" size={110} />
          <h1><Trophy weight="fill" /> {t.hostPodium}</h1>
          {podium.length > 0 && <ol className="host-podium">{podium.map((player) => <li key={player.id} className={`place-${player.place}`}><span>{player.place}</span><strong>{player.nickname}</strong><b>{player.score}</b></li>)}</ol>}
          {players.length > podium.length && (
            <section className="host-all"><h2>{t.hostAllPlayers}</h2>
              <ol>{players.slice(podium.length).map((player) => <li key={player.id}><span>{player.place}</span><strong>{player.nickname}</strong><b>{player.score}</b></li>)}</ol>
            </section>
          )}
          <Link href="/teacher" className="button button-primary button-lg">{t.hostBack}</Link>
        </div>
      </div>
    );
  }

  const reveal = phase === "REVEAL";
  return (
    <div className="host-stage">{bar}
      <div className="host-question">
        <div className="host-question-meta">
          {reveal ? <span className="host-answered"><Check weight="bold" /> {t.rightAnswer}</span> : <span className="host-clock" role="timer">{left}</span>}
          <span className="host-answered"><Users weight="fill" /> {t.hostAnswers}: {state.answeredCount} / {players.length}</span>
        </div>
        {question && <h1>{question.text}</h1>}
        {question && (
          <div className={cn("host-options", question.options.length <= 2 && "is-two")}>
            {question.options.map((option, index) => {
              const isRight = reveal && question.correctIndex === index;
              const count = state.distribution?.[index] ?? 0;
              return (
                <div key={index} className={cn("quiz-option", `tone-${index}`, reveal && !isRight && "is-dim", isRight && "is-right")}>
                  <span className="quiz-option-letter">{OPTION_LETTERS[index]}</span>
                  <span className="quiz-option-text">{option}</span>
                  {isRight && <Check weight="bold" className="quiz-option-mark" aria-label={t.rightAnswer} />}
                  {reveal && <span className="host-option-count" aria-label={`${count}`}><i style={{ width: `${(count / topCount) * 100}%` }} /><b>{count}</b></span>}
                </div>
              );
            })}
          </div>
        )}
        {reveal && players.length > 0 && (
          <section className="quiz-leaders host-leaders"><h2><Trophy weight="fill" /> {t.leaderboard}</h2>
            <ol>{players.slice(0, 5).map((player) => <li key={player.id}><span className="quiz-leader-place">{player.place}</span><span className="quiz-leader-name">{player.nickname}</span><strong>{player.score}</strong></li>)}</ol>
          </section>
        )}
        {message && <p className="quiz-error" role="alert">{message}</p>}
        <div className="host-controls">
          {reveal
            ? <Button type="button" size="lg" loading={busy === "next"} onClick={() => void act("next")}>{last ? t.hostFinish : t.hostNext} <ArrowRight weight="bold" /></Button>
            : <Button type="button" size="lg" variant="outline" loading={busy === "reveal"} onClick={() => void act("reveal")}>{t.hostReveal}</Button>}
        </div>
      </div>
    </div>
  );
}
