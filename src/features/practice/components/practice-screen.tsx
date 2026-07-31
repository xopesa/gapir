"use client";

import {
  ChatTeardropText,
  Ear,
  Lightning,
  Microphone,
  Repeat,
  WarningCircle,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Badge, Button, Card, SectionHeader } from "@/src/components/ui";
import { practiceModes } from "@/src/mocks";

const icons = {
  words: Repeat,
  listening: Ear,
  speaking: Microphone,
  dialogs: ChatTeardropText,
  mistakes: WarningCircle,
  quick: Lightning,
};

export function PracticeScreen() {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Тренировка</p>
          <h1>Практика</h1>
          <p>Выберите навык и закрепите его в удобном темпе.</p>
        </div>
      </header>

      <Card className="practice-feature" tone="blue">
        <div>
          <Badge className="badge-on-blue">Рекомендуем сегодня</Badge>
          <h2>Быстрый микс на 3 минуты</h2>
          <p>Слова, слух и короткие ответы в одной динамичной сессии.</p>
          <Button variant="secondary" onClick={() => setActiveMode("quick")}>
            Начать практику
          </Button>
        </div>
        <div className="practice-rings" aria-hidden="true">
          <span />
          <Lightning weight="fill" />
        </div>
      </Card>

      <section>
        <SectionHeader eyebrow="Все режимы" title="Что потренируем?" />
        <div className="practice-grid">
          {practiceModes.map((mode) => {
            const Icon = icons[mode.id as keyof typeof icons];
            const selected = activeMode === mode.id;
            return (
              <Card key={mode.id} className="practice-card" interactive tone="surface">
                <span className={`practice-icon tone-${mode.tone}`}>
                  <Icon weight="duotone" />
                </span>
                <div className="practice-card-copy">
                  <h3>{mode.title}</h3>
                  <p>{mode.description}</p>
                  <Badge>{mode.tasks} заданий</Badge>
                </div>
                <Button
                  variant={selected ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setActiveMode(mode.id)}
                >
                  {selected ? "Выбрано" : "Запустить"}
                </Button>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
