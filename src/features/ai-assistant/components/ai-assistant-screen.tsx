"use client";

import { BookOpenText, Brain, ChatCircleText, ClockCounterClockwise, Microphone, Sparkle, Translate } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge, Button, Card } from "@/src/components/ui";
import type { PublicAiFlags } from "@/src/server/ai/config/public-flags";
import type { AppDictionary } from "@/src/types/app";
import { aiAssistantClient } from "../api/ai-assistant-client";
import type { AiMemory, CreateSessionInput, TutorDirection, TutorLevel, TutorTopic } from "../types";
import { localizedAiError } from "../utils";

export function AiAssistantScreen({ dictionary, flags }: { dictionary: AppDictionary; flags: PublicAiFlags }) {
  if (!flags.assistantEnabled) return <Unavailable dictionary={dictionary} />;
  return <EnabledAssistant dictionary={dictionary} flags={flags} />;
}

function EnabledAssistant({ dictionary, flags }: { dictionary: AppDictionary; flags: PublicAiFlags }) {
  const router = useRouter();
  const gate = useRef(false);
  const [direction, setDirection] = useState<TutorDirection>("uz_to_zh");
  const [level, setLevel] = useState<TutorLevel>("beginner");
  const [topic, setTopic] = useState<TutorTopic>("free_conversation");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [memory, setMemory] = useState<AiMemory[]>([]);

  useEffect(() => {
    if (!flags.tutorEnabled) return;
    const controller = new AbortController();
    aiAssistantClient.memory(controller.signal).then(setMemory).catch(() => undefined);
    return () => controller.abort();
  }, [flags.tutorEnabled]);

  const start = async () => {
    if (gate.current || !flags.tutorEnabled) return;
    gate.current = true; setCreating(true); setError("");
    try {
      const input: CreateSessionInput = { direction, level, topic };
      const session = await aiAssistantClient.createSession(input);
      router.push(`/ai-assistant/tutor/${session.id}`);
    } catch (nextError) {
      setError(localizedAiError(nextError, dictionary));
      gate.current = false; setCreating(false);
    }
  };

  const features = useMemo(() => [
    { name: dictionary.aiAssistant.features.conversation, icon: ChatCircleText },
    { name: dictionary.aiAssistant.features.grammar, icon: BookOpenText },
    { name: dictionary.aiAssistant.features.translation, icon: Translate },
    { name: dictionary.aiAssistant.features.vocabulary, icon: Brain },
    { name: dictionary.aiAssistant.features.pronunciation, icon: Microphone },
  ], [dictionary]);

  return (
    <div className="page-stack ai-page">
      <header className="page-header ai-page-header"><div><span className="eyebrow">Gapir AI</span><h1>{dictionary.aiAssistant.title}</h1><p>{dictionary.aiAssistant.subtitle}</p></div>{flags.mockMode && <Badge tone="blue">{dictionary.aiAssistant.mockAi}</Badge>}</header>
      <div className="ai-feature-grid">
        <Card className="ai-feature-card ai-feature-primary" tone="blue"><Sparkle size={28} weight="fill" /><div><div className="ai-feature-title"><h2>{dictionary.aiAssistant.features.tutor}</h2><Badge tone={flags.tutorEnabled ? "mint" : "neutral"}>{flags.tutorEnabled ? dictionary.aiAssistant.available : dictionary.aiAssistant.tutorDisabled}</Badge></div><p>{dictionary.aiAssistant.features.tutorText}</p></div></Card>
        <Link href="/ai-assistant/history" className="ai-feature-link"><Card className="ai-feature-card" interactive><ClockCounterClockwise size={26} weight="bold" /><div><div className="ai-feature-title"><h2>{dictionary.aiAssistant.features.history}</h2><Badge tone="mint">{dictionary.aiAssistant.available}</Badge></div><p>{dictionary.aiAssistant.features.historyText}</p></div></Card></Link>
        {features.map(({ name, icon: Icon }) => <Card className="ai-feature-card is-soon" key={name}><Icon size={24} weight="bold" /><div><div className="ai-feature-title"><h3>{name}</h3><Badge tone="neutral">{dictionary.aiAssistant.soon}</Badge></div></div></Card>)}
      </div>
      <Card className="ai-setup-card">
        <div className="section-copy"><h2>{dictionary.aiAssistant.setup.title}</h2><p>{dictionary.aiAssistant.setup.subtitle}</p></div>
        {!flags.tutorEnabled ? <div className="inline-alert" role="status">{dictionary.aiAssistant.tutorDisabled}</div> : (
          <form onSubmit={(event) => { event.preventDefault(); void start(); }} className="ai-setup-form">
            <ChoiceGroup legend={dictionary.aiAssistant.setup.direction} value={direction} onChange={(value) => setDirection(value as TutorDirection)} options={[{ value: "uz_to_zh", label: dictionary.aiAssistant.setup.uzToZh, text: dictionary.aiAssistant.setup.uzToZhText }, { value: "zh_to_uz", label: dictionary.aiAssistant.setup.zhToUz, text: dictionary.aiAssistant.setup.zhToUzText }]} />
            <ChoiceGroup legend={dictionary.aiAssistant.setup.level} value={level} onChange={(value) => setLevel(value as TutorLevel)} compact options={[{ value: "beginner", label: dictionary.aiAssistant.setup.beginner }, { value: "intermediate", label: dictionary.aiAssistant.setup.intermediate }, { value: "advanced", label: dictionary.aiAssistant.setup.advanced }]} />
            <ChoiceGroup legend={dictionary.aiAssistant.setup.topic} value={topic} onChange={(value) => setTopic(value as TutorTopic)} compact options={[{ value: "free_conversation", label: dictionary.aiAssistant.setup.freeConversation }, { value: "greeting", label: dictionary.aiAssistant.setup.greeting }, { value: "shopping", label: dictionary.aiAssistant.setup.shopping }, { value: "restaurant", label: dictionary.aiAssistant.setup.restaurant }, { value: "travel", label: dictionary.aiAssistant.setup.travel }, { value: "work", label: dictionary.aiAssistant.setup.work }]} />
            {error && <div className="inline-alert is-error" role="alert">{error}</div>}
            <Button type="submit" size="lg" loading={creating} disabled={creating}>{creating ? dictionary.aiAssistant.setup.starting : dictionary.aiAssistant.setup.start}</Button>
          </form>
        )}
      </Card>
      <MemorySummary dictionary={dictionary} memories={memory} />
    </div>
  );
}

function ChoiceGroup({ legend, value, options, onChange, compact = false }: { legend: string; value: string; options: Array<{ value: string; label: string; text?: string }>; onChange: (value: string) => void; compact?: boolean }) {
  return <fieldset className="ai-choice-group"><legend>{legend}</legend><div className={`ai-choice-grid${compact ? " is-compact" : ""}`}>{options.map((option) => <label className={`ai-choice${value === option.value ? " is-selected" : ""}`} key={option.value}><input type="radio" name={legend} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} /><span><strong>{option.label}</strong>{option.text && <small>{option.text}</small>}</span></label>)}</div></fieldset>;
}

function MemorySummary({ dictionary, memories }: { dictionary: AppDictionary; memories: AiMemory[] }) {
  const memory = memories[0];
  return <Card className="ai-memory-card" tone="soft"><div className="ai-memory-title"><Brain size={24} weight="bold" /><h2>{dictionary.aiAssistant.memory.title}</h2></div>{!memory ? <p>{dictionary.aiAssistant.memory.empty}</p> : <div className="ai-memory-grid"><span><b>{memory.totalXp}</b>{dictionary.aiAssistant.memory.totalXp}</span><span><b>{memory.streak}</b>{dictionary.aiAssistant.memory.streak}</span><span><b>{memory.coins}</b>{dictionary.aiAssistant.memory.coins}</span><span><b>{memory.learnedWords.length}</b>{dictionary.aiAssistant.memory.learnedWords}</span></div>}</Card>;
}

function Unavailable({ dictionary }: { dictionary: AppDictionary }) {
  return <div className="page-stack ai-page"><Card className="ai-unavailable" tone="ice"><Sparkle size={36} weight="duotone" /><h1>{dictionary.aiAssistant.unavailableTitle}</h1><p>{dictionary.aiAssistant.unavailableText}</p><Link href="/">{dictionary.aiAssistant.back}</Link></Card></div>;
}
