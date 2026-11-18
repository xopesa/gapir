"use client";

import { Check, CheckCircle, SignOut, Trophy, X, XCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Mascot } from "@/src/components/mascots/mascot";
import { OPTION_LETTERS, secondsLeft, useQuizPoll } from "@/src/features/quiz/use-quiz-poll";
import { haptic } from "@/src/lib/haptics";
import { playSound } from "@/src/lib/sound/sound-manager";
import { cn } from "@/src/lib/utils";
import type { PlayerGameState } from "@/src/server/services/quiz-game-service";
import type { AppDictionary } from "@/src/types/app";

function pollDelay(state: PlayerGameState | null, failed: boolean) {
  if (failed || !state) return 3000;
  if (state.phase === "FINISHED") return 0;
  if (state.phase === "LOBBY") return 2000;
  if (state.phase === "COUNTDOWN") return 1000;
  return state.phase === "QUESTION" ? 1500 : 1200;
}

function Leaders({ state, dictionary }: { state: Extract<PlayerGameState, { joined: true }>; dictionary: AppDictionary }) {
  const t = dictionary.quiz;
  if (!state.top.length) return null;
  const outside = !state.top.some((item) => item.me) && state.me.place !== null;
  return (
    <section className="quiz-leaders" aria-label={t.leaderboard}>
      <h2><Trophy weight="fill" /> {t.leaderboard}</h2>
      <ol>
        {state.top.map((item, index) => (
          <li key={index} className={cn(item.me && "is-me")}>
            <span className="quiz-leader-place">{item.place}</span>
            <span className="quiz-leader-name">{item.nickname}{item.me && <small> · {t.you}</small>}</span>
            <strong>{item.score}</strong>
          </li>
        ))}
        {outside && (
          <li className="is-me">
            <span className="quiz-leader-place">{state.me.place}</span>
            <span className="quiz-leader-name">{state.me.nickname}<small> · {t.you}</small></span>
            <strong>{state.me.score}</strong>
          </li>
        )}
      </ol>
    </section>
  );
}

/** The learner's phone during a class game: wait, read, tap one of the answers, see the result. */
export function QuizPlayScreen({ pin, dictionary }: { pin: string; dictionary: AppDictionary }) {
  const t = dictionary.quiz;
  const router = useRouter();
  const { state, error, serverNow } = useQuizPoll<PlayerGameState>(`/api/quiz/games/${pin}`, pollDelay);
  // The answer tapped for a question, shown at once; the server's copy replaces it on the next poll.
  const [picked, setPicked] = useState<{ questionIndex: number; optionIndex: number } | null>(null);

  // Not in this game (a shared link, another phone): the join form asks for a name first.
  useEffect(() => {
    if (state && !state.joined) router.replace(state.phase === "FINISHED" ? "/quiz" : `/quiz?pin=${pin}`);
    if (error === "GAME_NOT_FOUND" || error === "UNAUTHORIZED") router.replace("/quiz");
  }, [state, error, pin, router]);

  const phase = state?.phase;
  const resultKey = state?.joined && phase === "REVEAL" ? `${state.questionIndex}:${state.answer?.correct ?? "none"}` : phase === "FINISHED" ? "finished" : null;
  const played = useRef<string | null>(null);
  useEffect(() => {
    if (!resultKey || played.current === resultKey) return;
    played.current = resultKey;
    if (resultKey === "finished") { playSound("lessonComplete"); haptic("complete"); }
    else if (resultKey.endsWith(":true")) { playSound("correctAnswer"); haptic("correct"); }
    else { playSound("wrongAnswer"); haptic("wrong"); }
  }, [resultKey]);

  if (!state || !state.joined) return <main className="quiz-stage quiz-stage-center"><Mascot kind="tiger" mood="idle" size={112} /><p>{dictionary.common.loading}</p></main>;

  const question = state.question;
  const myOption = state.answer?.optionIndex ?? (picked && picked.questionIndex === state.questionIndex ? picked.optionIndex : null);
  const left = secondsLeft(state.closesAt, serverNow);
  const timeShare = question && state.closesAt ? Math.min(1, Math.max(0, (state.closesAt - serverNow) / (question.timeLimitSec * 1000))) : 0;
  const open = phase === "QUESTION" && myOption === null && left > 0;

  const answer = async (optionIndex: number) => {
    if (!open) return;
    const questionIndex = state.questionIndex;
    setPicked({ questionIndex, optionIndex });
    playSound("buttonTap"); haptic("tap");
    const response = await fetch(`/api/quiz/games/${pin}/answer`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questionIndex, optionIndex }) }).catch(() => null);
    // Not accepted (too late, no connection): free the buttons, unless an earlier answer is already stored.
    if (!response?.ok) {
      const code = response ? (await response.json().catch(() => ({})) as { error?: string }).error : undefined;
      if (code !== "ALREADY_ANSWERED") setPicked((current) => (current?.questionIndex === questionIndex ? null : current));
    }
  };

  const header = (
    <header className="quiz-play-header">
      <Link href="/quiz" className="quiz-leave" aria-label={t.leave}><SignOut weight="bold" /></Link>
      <div className="quiz-play-title"><strong>{state.title}</strong>{state.questionIndex >= 0 && phase !== "FINISHED" && <span>{t.question} {state.questionIndex + 1} {t.of} {state.total}</span>}</div>
      <div className="quiz-score" aria-label={t.score}><Trophy weight="fill" /> {state.me.score}</div>
    </header>
  );

  if (phase === "LOBBY") {
    return (
      <main className="quiz-stage">{header}
        <div className="quiz-stage-center">
          <Mascot kind="panda" mood="happy" size={132} />
          <h1>{t.lobbyTitle}</h1>
          <p className="quiz-nickname">{state.me.nickname}</p>
          <p>{t.lobbyText}</p>
          {state.playerCount !== null && <p className="quiz-muted">{t.playersIn}: {state.playerCount}</p>}
        </div>
      </main>
    );
  }

  if (phase === "COUNTDOWN") {
    return (
      <main className="quiz-stage">{header}
        <div className="quiz-stage-center">
          <p className="quiz-muted">{t.question} {state.questionIndex + 1} {t.of} {state.total}</p>
          <div className="quiz-countdown" aria-live="polite">{Math.max(1, secondsLeft(state.opensAt, serverNow))}</div>
          <h1>{t.getReady}</h1>
        </div>
      </main>
    );
  }

  if (phase === "FINISHED") {
    return (
      <main className="quiz-stage">{header}
        <div className="quiz-stage-center">
          <Mascot kind="dragon" mood="cheer" size={120} />
          <h1>{t.finalTitle}</h1>
          <div className="quiz-final">
            <div><small>{t.place}</small><strong>{state.me.place}</strong></div>
            <div><small>{t.score}</small><strong>{state.me.score}</strong></div>
          </div>
          <Leaders state={state} dictionary={dictionary} />
          <div className="quiz-final-actions">
            <Link href="/" className="button button-primary button-lg">{t.backHome}</Link>
            <Link href="/quiz" className="button button-outline button-lg">{t.playAgain}</Link>
          </div>
        </div>
      </main>
    );
  }

  const reveal = phase === "REVEAL";
  const correct = state.answer?.correct;
  return (
    <main className="quiz-stage">{header}
      {!reveal && <div className="quiz-timer" role="timer" aria-label={`${left}`}><span style={{ width: `${timeShare * 100}%` }} /><b>{left}</b></div>}
      {reveal && (
        <div className={cn("quiz-verdict", correct ? "is-correct" : "is-wrong")} role="status">
          {correct ? <CheckCircle weight="fill" /> : <XCircle weight="fill" />}
          <div>
            <strong>{state.answer ? (correct ? t.correct : t.wrong) : t.noAnswer}</strong>
            <span>{correct ? `+${state.answer?.points ?? 0} ${t.points}` : `${t.place}: ${state.me.place}`}</span>
          </div>
        </div>
      )}
      {question && (
        <>
          <h1 className="quiz-question">{question.text}</h1>
          <div className={cn("quiz-options", question.options.length <= 2 && "is-two")}>
            {question.options.map((option, index) => {
              const isRight = reveal && state.correctIndex === index;
              return (
                <button
                  key={index} type="button" disabled={!open} onClick={() => void answer(index)}
                  className={cn("quiz-option", `tone-${index}`, myOption === index && "is-picked", myOption !== null && myOption !== index && !isRight && "is-dim", reveal && !isRight && "is-dim", isRight && "is-right")}
                >
                  <span className="quiz-option-letter">{OPTION_LETTERS[index]}</span>
                  <span className="quiz-option-text">{option}</span>
                  {isRight && <Check weight="bold" className="quiz-option-mark" aria-label={t.rightAnswer} />}
                  {reveal && myOption === index && !isRight && <X weight="bold" className="quiz-option-mark" />}
                </button>
              );
            })}
          </div>
        </>
      )}
      {!reveal && myOption !== null && <p className="quiz-status" role="status"><CheckCircle weight="fill" /> {t.answered}. {t.waitOthers}</p>}
      {!reveal && myOption === null && left === 0 && <p className="quiz-status" role="status">{t.noAnswer}</p>}
      {reveal && <><Leaders state={state} dictionary={dictionary} /><p className="quiz-status">{t.waitNext}</p></>}
    </main>
  );
}
