"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mascot } from "@/src/components/mascots/mascot";
import { Button, Card } from "@/src/components/ui";
import { normalizePin } from "@/src/lib/quiz/logic";
import type { AppDictionary } from "@/src/types/app";

/** Learner's entry to a class game: the code from the teacher's screen and a name for the scoreboard. */
export function QuizJoinScreen({ dictionary, initialPin, initialName }: { dictionary: AppDictionary; initialPin: string; initialName: string }) {
  const t = dictionary.quiz;
  const router = useRouter();
  const [pin, setPin] = useState(normalizePin(initialPin));
  const [name, setName] = useState(initialName);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const ready = pin.length === 6 && name.trim().length > 0;

  const join = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ready || busy) return;
    setBusy(true); setError("");
    const response = await fetch("/api/quiz/join", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin, nickname: name.trim() }) }).catch(() => null);
    if (response?.ok) { router.push(`/quiz/${pin}`); return; }
    const code = response ? (await response.json().catch(() => ({})) as { error?: string }).error : undefined;
    setError(code === "GAME_NOT_FOUND" ? t.errNotFound : code === "GAME_FINISHED" ? t.errFinished : t.errGeneric);
    setBusy(false);
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">{dictionary.nav.quiz}</p>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </header>
      <Card className="quiz-join">
        <Mascot kind="tiger" mood="happy" size={104} />
        <form onSubmit={(event) => void join(event)}>
          <label htmlFor="quiz-pin">{t.pinLabel}</label>
          <input
            id="quiz-pin" className="quiz-pin-input" inputMode="numeric" autoComplete="off" maxLength={11}
            placeholder={t.pinPlaceholder} value={pin} onChange={(event) => setPin(normalizePin(event.target.value))}
          />
          <label htmlFor="quiz-name">{t.nameLabel}</label>
          <input id="quiz-name" className="quiz-text-input" maxLength={20} placeholder={t.namePlaceholder} value={name} onChange={(event) => setName(event.target.value)} />
          {error && <p className="quiz-error" role="alert">{error}</p>}
          <Button type="submit" size="lg" disabled={!ready} loading={busy}>{t.join} <ArrowRight weight="bold" /></Button>
        </form>
      </Card>
    </div>
  );
}
