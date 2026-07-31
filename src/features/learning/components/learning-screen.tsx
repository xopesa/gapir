"use client";

import {
  Bell,
  BookOpen,
  CheckCircle,
  ChatCircleDots,
  Play,
  Sparkle,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  CurrencyBadge,
  IconButton,
  LessonNode,
  ProgressBar,
  SectionHeader,
  StreakBadge,
  XpBadge,
} from "@/src/components/ui";
import { lessons } from "@/src/mocks";
import { useUserStore } from "@/src/stores/user-store";
import type { Lesson } from "@/src/types";

export function LearningScreen() {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { name, xp, streak, gapCoins, completeLesson } = useUserStore();

  const finishLesson = () => {
    if (!activeLesson) return;
    completeLesson(activeLesson.id, activeLesson.xp);
    setActiveLesson(null);
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Juma, 31 июля</p>
          <h1>Салом, {name}!</h1>
          <p>Ещё один маленький шаг — и узбекский станет ближе.</p>
        </div>
        <div className="header-account">
          <div className="desktop-header-stats">
            <StreakBadge value={streak} />
            <XpBadge value={xp} />
            <CurrencyBadge value={gapCoins} />
          </div>
          <div className="notification-wrap">
            <IconButton
              aria-label="Уведомления"
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen((value) => !value)}
            >
              <Bell weight="bold" />
              <span className="notification-dot" />
            </IconButton>
            {notificationsOpen && (
              <div className="notification-popover">
                <strong>Новый личный рекорд близко</strong>
                <p>Завершите урок и получите ещё 20 GapCoin.</p>
              </div>
            )}
          </div>
          <Avatar initials="АЛ" />
        </div>
      </header>

      <Card className="learning-hero" tone="ice">
        <div className="hero-copy">
          <span className="hero-label">
            <Sparkle weight="fill" /> Раздел 1 · Основы
          </span>
          <h2>Продолжим обучение?</h2>
          <p>Следующий урок займёт около 5 минут</p>
          <Button size="lg" onClick={() => setActiveLesson(lessons[2])}>
            <Play weight="fill" /> Продолжить
          </Button>
          <div className="hero-progress">
            <div>
              <span>Прогресс раздела</span>
              <strong>42%</strong>
            </div>
            <ProgressBar value={40} label="Прогресс раздела 42%" />
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="hero-art-card art-main">
            <BookOpen weight="duotone" />
            <span>Oila</span>
          </div>
          <div className="hero-art-card art-chat">
            <ChatCircleDots weight="fill" />
            <span>Bu mening oilam</span>
          </div>
        </div>
      </Card>

      <section>
        <SectionHeader
          eyebrow="Ваш маршрут"
          title="Основы общения"
          action={<span className="section-progress">2 из 6 уроков</span>}
        />
        <div className="lesson-track">
          {lessons.map((lesson) => (
            <LessonNode key={lesson.id} lesson={lesson} onStart={setActiveLesson} />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {activeLesson && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
            onClick={() => setActiveLesson(null)}
          >
            <motion.div
              className="lesson-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="lesson-dialog-title"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
            >
              <span className="modal-icon">
                <CheckCircle weight="duotone" />
              </span>
              <p className="eyebrow">Урок {activeLesson.id}</p>
              <h2 id="lesson-dialog-title">{activeLesson.title}</h2>
              <p>
                Демо-урок готов. На первом этапе прогресс сохраняется только на
                этом устройстве.
              </p>
              <div className="modal-actions">
                <Button variant="ghost" onClick={() => setActiveLesson(null)}>
                  Позже
                </Button>
                <Button onClick={finishLesson}>Завершить демо · +{activeLesson.xp} XP</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
