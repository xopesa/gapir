"use client";

import { ArrowLeft, ChatCircleText, ClockCounterClockwise } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Card } from "@/src/components/ui";
import type { PublicAiFlags } from "@/src/server/ai/config/public-flags";
import type { AppDictionary } from "@/src/types/app";
import { aiAssistantClient } from "../api/ai-assistant-client";
import type { AiSession } from "../types";
import { localizedAiError } from "../utils";

export function AiHistoryScreen({ dictionary, flags, locale }: { dictionary: AppDictionary; flags: PublicAiFlags; locale: string }) {
  const [sessions, setSessions] = useState<AiSession[]>([]);
  const [loading, setLoading] = useState(flags.assistantEnabled && flags.tutorEnabled);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!flags.assistantEnabled || !flags.tutorEnabled) return;
    const controller = new AbortController();
    aiAssistantClient.history(controller.signal).then(setSessions).catch((nextError) => setError(localizedAiError(nextError, dictionary))).finally(() => setLoading(false));
    return () => controller.abort();
  }, [dictionary, flags.assistantEnabled, flags.tutorEnabled]);

  return <div className="page-stack ai-page">
    <Link href="/ai-assistant" className="ai-back-link"><ArrowLeft weight="bold" />{dictionary.aiAssistant.back}</Link>
    <header className="page-header"><div><h1>{dictionary.aiAssistant.history.title}</h1><p>{dictionary.aiAssistant.history.subtitle}</p></div>{flags.mockMode && <Badge tone="blue">{dictionary.aiAssistant.mockAi}</Badge>}</header>
    {!flags.assistantEnabled || !flags.tutorEnabled ? <Card className="ai-unavailable"><p>{!flags.assistantEnabled ? dictionary.aiAssistant.unavailableText : dictionary.aiAssistant.tutorDisabled}</p></Card> : loading ? <Card className="ai-loading-card" aria-busy="true">{dictionary.common.loading}</Card> : error ? <div className="inline-alert is-error" role="alert">{error}</div> : sessions.length === 0 ? <Card className="ai-empty-state"><ClockCounterClockwise size={36} weight="duotone" /><h2>{dictionary.aiAssistant.history.empty}</h2><p>{dictionary.aiAssistant.history.emptyText}</p></Card> : <div className="ai-history-list">{sessions.map((session) => {
      const lastMessage = session.messages?.[0];
      return <Card key={session.id} className="ai-history-card"><div className="ai-history-icon"><ChatCircleText weight="duotone" /></div><div className="ai-history-copy"><div><strong>{directionLabel(session.direction, dictionary)}</strong><Badge tone={session.status === "FINISHED" ? "neutral" : "mint"}>{session.status === "FINISHED" ? dictionary.aiAssistant.history.finished : dictionary.aiAssistant.history.active}</Badge></div><p>{topicLabel(session.topic, dictionary)} · {levelLabel(session.level, dictionary)}</p><small>{new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(session.createdAt))}</small>{lastMessage && <span>{dictionary.aiAssistant.history.lastMessage}: {lastMessage.teacherReply ?? lastMessage.recognizedText ?? "—"}</span>}</div><Link href={`/ai-assistant/tutor/${session.id}`} className="button button-outline button-sm">{dictionary.aiAssistant.history.open}</Link></Card>;
    })}</div>}
  </div>;
}

export function directionLabel(direction: AiSession["direction"], dictionary: AppDictionary) { return direction === "zh_to_uz" ? dictionary.aiAssistant.setup.zhToUz : dictionary.aiAssistant.setup.uzToZh; }
export function levelLabel(level: AiSession["level"], dictionary: AppDictionary) { return dictionary.aiAssistant.setup[level]; }
export function topicLabel(topic: AiSession["topic"], dictionary: AppDictionary) {
  const keys = { free_conversation: "freeConversation", greeting: "greeting", shopping: "shopping", restaurant: "restaurant", travel: "travel", work: "work" } as const;
  return dictionary.aiAssistant.setup[keys[topic]];
}
