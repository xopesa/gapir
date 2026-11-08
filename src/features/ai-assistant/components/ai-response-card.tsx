"use client";

import {
  BookOpenText,
  ChatCircleDots,
  Coins,
  Lightbulb,
  Lightning,
  SpeakerHigh,
  Star,
  Translate,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Button } from "@/src/components/ui";
import type { AppDictionary } from "@/src/types/app";
import type { AiTutorResponse } from "../types";
import { visibleResponseSections } from "../utils";

export function AiResponseCard({
  response,
  dictionary,
  playing,
  onPlay,
}: {
  response: AiTutorResponse;
  dictionary: AppDictionary;
  playing: boolean;
  onPlay: (url: string) => void;
}) {
  const sections = visibleResponseSections(response);

  return (
    <div className="ai-assistant-turn">
      {sections.teacher && (
        <section className="ai-teacher-message">
          <span className="ai-message-icon" aria-hidden="true"><ChatCircleDots weight="fill" /></span>
          <div>
            <strong>{dictionary.aiAssistant.response.teacher}</strong>
            <p>{sections.teacher}</p>
          </div>
        </section>
      )}

      {(sections.score !== null || response.xp > 0 || response.coins > 0 || response.audioUrl) && (
        <footer className="ai-response-footer">
          <div className="ai-rewards" aria-label={dictionary.aiAssistant.response.score}>
            {sections.score !== null && <span><Star weight="fill" /><b>{sections.score}</b>/100</span>}
            {response.xp > 0 && <span><Lightning weight="fill" />+{response.xp} XP</span>}
            {response.coins > 0 && <span><Coins weight="fill" />+{response.coins}</span>}
          </div>
          {response.audioUrl && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onPlay(response.audioUrl!)}>
              <SpeakerHigh weight="bold" />
              {playing ? dictionary.aiAssistant.chat.pause : dictionary.aiAssistant.chat.play}
            </Button>
          )}
        </footer>
      )}

      <div className="ai-response-support">
        {sections.translation && (
          <ResponseBlock icon={<Translate weight="bold" />} label={dictionary.aiAssistant.response.translation} value={sections.translation} />
        )}
        {sections.explanation && (
          <ResponseBlock icon={<Lightbulb weight="fill" />} label={dictionary.aiAssistant.response.explanation} value={sections.explanation} />
        )}
        {sections.newWords.length > 0 && (
          <section className="ai-response-list">
            <div className="ai-response-label"><BookOpenText weight="bold" /><strong>{dictionary.aiAssistant.response.newWords}</strong></div>
            <div className="ai-word-list">
              {sections.newWords.map((word) => (
                <span key={`${word.language}-${word.word}`}><b>{word.word}</b><span>{word.translation}</span></span>
              ))}
            </div>
          </section>
        )}
        {sections.pronunciation.length > 0 && (
          <section className="ai-response-list">
            <div className="ai-response-label"><SpeakerHigh weight="bold" /><strong>{dictionary.aiAssistant.response.pronunciation}</strong></div>
            <ul>{sections.pronunciation.map((tip) => <li key={tip}>{tip}</li>)}</ul>
          </section>
        )}
      </div>

      {sections.nextQuestion && (
        <section className="ai-next-question">
          <span className="ai-message-icon" aria-hidden="true"><ChatCircleDots weight="fill" /></span>
          <div>
            <strong>{dictionary.aiAssistant.response.nextQuestion}</strong>
            <p>{sections.nextQuestion}</p>
          </div>
        </section>
      )}
    </div>
  );
}

function ResponseBlock({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <section className="ai-response-block">
      <div className="ai-response-label">{icon}<strong>{label}</strong></div>
      <p>{value}</p>
    </section>
  );
}
