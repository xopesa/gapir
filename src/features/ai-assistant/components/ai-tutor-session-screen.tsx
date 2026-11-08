"use client";

import { ArrowLeft, ChatCircleDots, CheckCircle, Microphone, PaperPlaneRight, Stop, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Button, Card, IconButton } from "@/src/components/ui";
import type { PublicAiFlags } from "@/src/server/ai/config/public-flags";
import type { AppDictionary } from "@/src/types/app";
import { aiAssistantClient } from "../api/ai-assistant-client";
import { useAudioRecorder, type RecordedAudio } from "../hooks/use-audio-recorder";
import type { AiMessage, AiSession, AiTutorResponse, AiUiState } from "../types";
import {
  groupChatTurns,
  localizedAiError,
  MAX_AUDIO_BYTES,
  microphoneErrorKind,
  parseTutorResponse,
  summarizeSession,
  visibleResponseSections,
} from "../utils";
import { levelLabel, topicLabel } from "./ai-history-screen";
import { AiResponseCard } from "./ai-response-card";

type DisplayMessage = AiMessage & { optimistic?: boolean; parsedResponse?: AiTutorResponse };

export function AiTutorSessionScreen({ sessionId, dictionary, flags }: { sessionId: string; dictionary: AppDictionary; flags: PublicAiFlags }) {
  const [session, setSession] = useState<AiSession | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [text, setText] = useState("");
  const [state, setState] = useState<AiUiState>("ready");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(flags.assistantEnabled && flags.tutorEnabled);
  const [finishOpen, setFinishOpen] = useState(false);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const historyEndRef = useRef<HTMLDivElement | null>(null);
  const sendingRef = useRef(false);

  const loadSession = useCallback(async (signal?: AbortSignal) => {
    const loaded = await aiAssistantClient.getSession(sessionId, signal);
    setSession(loaded);
    setMessages((loaded.messages ?? []).map((message) => ({
      ...message,
      parsedResponse: message.role === "ASSISTANT" ? parseTutorResponse(message) ?? undefined : undefined,
    })));
    setState(loaded.status === "FINISHED" ? "finished" : "ready");
    return loaded;
  }, [sessionId]);

  useEffect(() => {
    if (!flags.assistantEnabled || !flags.tutorEnabled) return;
    const controller = new AbortController();
    const task = globalThis.setTimeout(() => {
      void loadSession(controller.signal)
        .catch((nextError) => {
          if (!controller.signal.aborted) {
            setError(localizedAiError(nextError, dictionary));
            setState("error");
          }
        })
        .finally(() => setLoading(false));
    }, 0);
    return () => {
      globalThis.clearTimeout(task);
      controller.abort();
    };
  }, [dictionary, flags.assistantEnabled, flags.tutorEnabled, loadSession]);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, state]);

  useEffect(() => () => {
    requestRef.current?.abort();
    audioRef.current?.pause();
  }, []);

  const completeTurn = useCallback(async (promise: Promise<AiTutorResponse>) => {
    const response = await promise;
    setMessages((current) => [...current, responseMessage(response)]);
    setState("ready");
    void loadSession().catch(() => undefined);
  }, [loadSession]);

  const runTurn = useCallback(async (kind: "text" | "audio", value: string | RecordedAudio) => {
    if (!session || sendingRef.current || session.status !== "ACTIVE") return;
    sendingRef.current = true;
    setError("");
    const controller = new AbortController();
    requestRef.current = controller;

    try {
      if (kind === "text") {
        const trimmed = String(value).trim();
        if (!trimmed) return;
        setMessages((current) => [...current, optimisticMessage(trimmed)]);
        setText("");
        setState("thinking");
        await completeTurn(aiAssistantClient.sendText(session.id, trimmed, controller.signal));
      } else {
        const audio = value as RecordedAudio;
        if (audio.blob.size > MAX_AUDIO_BYTES) {
          setError(dictionary.aiAssistant.chat.tooLarge);
          setState("error");
          return;
        }
        setState("uploading");
        globalThis.setTimeout(() => setState((current) => current === "uploading" ? "recognizing" : current), 250);
        globalThis.setTimeout(() => setState((current) => ["uploading", "recognizing"].includes(current) ? "thinking" : current), 750);
        await completeTurn(aiAssistantClient.sendAudio(session.id, audio, controller.signal));
      }
    } catch (nextError) {
      setError(localizedAiError(nextError, dictionary));
      setState("error");
    } finally {
      sendingRef.current = false;
      requestRef.current = null;
    }
  }, [completeTurn, dictionary, session]);

  const onRecorded = useCallback((audio: RecordedAudio) => {
    void runTurn("audio", audio);
  }, [runTurn]);
  const onRecorderError = useCallback((nextError: unknown) => {
    setError(microphoneErrorKind(nextError) === "denied" ? dictionary.aiAssistant.errors.microphoneDenied : dictionary.aiAssistant.errors.microphoneFailed);
    setState("error");
  }, [dictionary]);
  const recorder = useAudioRecorder(onRecorded, onRecorderError);

  const finish = async () => {
    if (!session || sendingRef.current) return;
    sendingRef.current = true;
    setFinishOpen(false);
    setState("thinking");
    try {
      const finished = await aiAssistantClient.finishSession(session.id);
      setSession((current) => current ? { ...current, ...finished, messages: current.messages } : finished);
      setState("finished");
    } catch (nextError) {
      setError(localizedAiError(nextError, dictionary));
      setState("error");
    } finally {
      sendingRef.current = false;
    }
  };

  const play = (url: string) => {
    if (playingUrl === url) {
      audioRef.current?.pause();
      setPlayingUrl(null);
      setState("ready");
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingUrl(url);
    setState("speaking");
    audio.onended = () => {
      setPlayingUrl(null);
      setState("ready");
    };
    audio.onerror = () => {
      setPlayingUrl(null);
      setState("error");
      setError(dictionary.aiAssistant.errors.provider);
    };
    void audio.play().catch(() => {
      setPlayingUrl(null);
      setState("error");
      setError(dictionary.aiAssistant.errors.provider);
    });
  };

  if (!flags.assistantEnabled || !flags.tutorEnabled) {
    return <div className="page-stack ai-page"><Card className="ai-unavailable"><h1>{dictionary.aiAssistant.unavailableTitle}</h1><p>{!flags.assistantEnabled ? dictionary.aiAssistant.unavailableText : dictionary.aiAssistant.tutorDisabled}</p><Link href="/">{dictionary.aiAssistant.back}</Link></Card></div>;
  }
  if (loading) return <div className="page-stack ai-page"><Card className="ai-loading-card" aria-busy="true">{dictionary.common.loading}</Card></div>;
  if (!session) return <div className="page-stack ai-page"><div className="inline-alert is-error" role="alert">{error || dictionary.aiAssistant.errors.sessionNotFound}</div><Link href="/ai-assistant">{dictionary.aiAssistant.chat.returnHome}</Link></div>;

  const displayedState: AiUiState = recorder.recording ? "recording" : state;
  const busy = ["uploading", "recognizing", "thinking"].includes(displayedState) || recorder.recording;
  const summary = summarizeSession({ ...session, messages });
  const turns = groupChatTurns(messages);
  const compactDirection = session.direction === "uz_to_zh" ? "O‘zbekcha → 中文" : "中文 → O‘zbekcha";

  return (
    <div className="page-stack ai-page ai-chat-page">
      <header className="ai-chat-header-compact">
        <Link href="/ai-assistant" className="ai-chat-back" aria-label={dictionary.aiAssistant.back}>
          <ArrowLeft weight="bold" />
          <span>{dictionary.aiAssistant.back}</span>
        </Link>
        <div className="ai-chat-heading">
          <div className="ai-chat-title-line">
            <h1>{topicLabel(session.topic, dictionary)}</h1>
            {flags.mockMode && <Badge tone="blue">{dictionary.aiAssistant.mockAi}</Badge>}
          </div>
          <p>{compactDirection}<span aria-hidden="true">·</span>{levelLabel(session.level, dictionary)}</p>
        </div>
        <div className="ai-chat-header-actions">
          <div className={`ai-state is-${displayedState}`} role="status" aria-live="polite"><span />{dictionary.aiAssistant.states[displayedState]}</div>
          <Button className="ai-finish-action" type="button" variant="ghost" size="sm" onClick={() => setFinishOpen(true)} disabled={busy || state === "finished"}>
            <X weight="bold" /><span>{dictionary.aiAssistant.chat.finish}</span>
          </Button>
        </div>
      </header>

      <section className="ai-chat-history" aria-label={dictionary.aiAssistant.chat.title}>
        {turns.length === 0 && (
          <div className="ai-chat-empty">
            <span className="ai-message-icon" aria-hidden="true"><ChatCircleDots weight="fill" /></span>
            <p>{dictionary.aiAssistant.chat.empty}</p>
          </div>
        )}
        {turns.map((turn) => {
          const assistantResponse = turn.assistant?.parsedResponse ?? (turn.assistant ? parseTutorResponse(turn.assistant) : null);
          const correction = assistantResponse ? visibleResponseSections(assistantResponse).corrected : null;
          return (
            <article className="ai-chat-turn" key={turn.id}>
              {turn.user && (
                <div className="ai-user-stack">
                  <div className="ai-user-message">{turn.user.recognizedText}</div>
                  {correction && (
                    <div className="ai-correction-note">
                      <CheckCircle weight="fill" aria-hidden="true" />
                      <div><strong>{dictionary.aiAssistant.response.corrected}</strong><p>{correction}</p></div>
                    </div>
                  )}
                </div>
              )}
              {assistantResponse ? (
                <AiResponseCard response={assistantResponse} dictionary={dictionary} playing={playingUrl === assistantResponse.audioUrl} onPlay={play} />
              ) : turn.assistant?.teacherReply ? (
                <div className="ai-teacher-message ai-plain-assistant-message">
                  <span className="ai-message-icon" aria-hidden="true"><ChatCircleDots weight="fill" /></span>
                  <p>{turn.assistant.teacherReply}</p>
                </div>
              ) : null}
            </article>
          );
        })}
        <div ref={historyEndRef} />
      </section>

      {error && <div className="inline-alert is-error ai-chat-alert" role="alert">{error}</div>}

      {state === "finished" ? (
        <Card className="ai-finished-card" tone="soft">
          <h2>{dictionary.aiAssistant.chat.finished}</h2>
          <p>{dictionary.aiAssistant.chat.finishedText}</p>
          <div><span><b>{summary.messageCount}</b> {dictionary.aiAssistant.chat.messages}</span><span><b>{summary.xp}</b> {dictionary.aiAssistant.chat.xp}</span><span><b>{summary.coins}</b> {dictionary.aiAssistant.chat.coins}</span></div>
          <Link href="/ai-assistant">{dictionary.aiAssistant.chat.returnHome}</Link>
        </Card>
      ) : (
        <form className="ai-chat-composer" onSubmit={(event) => { event.preventDefault(); void runTurn("text", text); }}>
          <label className="sr-only" htmlFor="ai-message">{dictionary.aiAssistant.chat.placeholder}</label>
          <textarea
            id="ai-message"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={dictionary.aiAssistant.chat.placeholder}
            disabled={busy}
            maxLength={4000}
            rows={1}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void runTurn("text", text);
              }
            }}
          />
          <div className="ai-composer-actions">
            <div>
              {flags.voiceInputEnabled && recorder.supported ? (
                <IconButton
                  type="button"
                  aria-label={recorder.recording ? dictionary.aiAssistant.chat.stopRecording : dictionary.aiAssistant.chat.microphone}
                  className={recorder.recording ? "is-recording" : ""}
                  disabled={busy && !recorder.recording}
                  onClick={() => {
                    if (recorder.recording) recorder.stop();
                    else {
                      setState("listening");
                      void recorder.start();
                    }
                  }}
                >
                  {recorder.recording ? <Stop weight="fill" /> : <Microphone weight="bold" />}
                </IconButton>
              ) : (
                <span className="ai-voice-note">{flags.voiceInputEnabled ? dictionary.aiAssistant.chat.voiceUnavailable : dictionary.aiAssistant.chat.voiceDisabled}</span>
              )}
              {recorder.recording && <span className="ai-recording-time">{dictionary.aiAssistant.chat.recordingTime}: {formatDuration(recorder.durationMs)}</span>}
            </div>
            <Button type="submit" disabled={busy || !text.trim()} aria-label={dictionary.aiAssistant.chat.send}>
              <PaperPlaneRight weight="bold" /><span>{dictionary.aiAssistant.chat.send}</span>
            </Button>
          </div>
        </form>
      )}

      {finishOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setFinishOpen(false); }}>
          <div className="lesson-modal ai-finish-modal" role="dialog" aria-modal="true" aria-labelledby="finish-title">
            <h2 id="finish-title">{dictionary.aiAssistant.chat.finishTitle}</h2>
            <p>{dictionary.aiAssistant.chat.finishText}</p>
            <div><Button type="button" variant="outline" onClick={() => setFinishOpen(false)}>{dictionary.aiAssistant.chat.cancel}</Button><Button type="button" onClick={() => void finish()}>{dictionary.aiAssistant.chat.confirmFinish}</Button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function optimisticMessage(text: string): DisplayMessage {
  return { id: `optimistic-${Date.now()}`, role: "USER", recognizedText: text, correctedText: null, translation: null, grammarExplanation: null, teacherReply: null, nextQuestion: null, score: null, xp: 0, coins: 0, audioUrl: null, responseJson: null, createdAt: new Date().toISOString(), optimistic: true };
}

function responseMessage(response: AiTutorResponse): DisplayMessage {
  return { id: `response-${Date.now()}`, role: "ASSISTANT", recognizedText: null, correctedText: response.correctedText, translation: response.translation, grammarExplanation: response.grammarExplanation, teacherReply: response.teacherReply, nextQuestion: response.nextQuestion, score: response.score, xp: response.xp, coins: response.coins, audioUrl: response.audioUrl, responseJson: JSON.stringify(response), createdAt: new Date().toISOString(), parsedResponse: response };
}

function formatDuration(ms: number) {
  const seconds = Math.floor(ms / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
