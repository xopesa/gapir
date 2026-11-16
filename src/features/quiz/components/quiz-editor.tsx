"use client";

import { ArrowLeft, Check, FloppyDisk, Play, Plus, Trash, X } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card } from "@/src/components/ui";
import { OPTION_LETTERS } from "@/src/features/quiz/use-quiz-poll";
import { MAX_OPTIONS, MAX_QUESTIONS, TIME_LIMITS, type QuizQuestionData } from "@/src/lib/quiz/logic";
import { cn } from "@/src/lib/utils";
import type { QuizView } from "@/src/server/services/quiz-service";
import type { AppDictionary } from "@/src/types/app";

const blankQuestion = (): QuizQuestionData => ({ text: "", options: ["", ""], correctIndex: 0, timeLimitSec: 20 });

/** A question the server would accept: a text, 2–4 different filled options, a marked right one. */
function isComplete(question: QuizQuestionData) {
  const options = question.options.map((option) => option.trim());
  return Boolean(question.text.trim()) && options.length >= 2 && options.every(Boolean) && new Set(options).size === options.length && question.correctIndex < options.length;
}

/** The whole quiz is edited on one page and saved with one button. */
export function QuizEditor({ quiz, dictionary }: { quiz: QuizView; dictionary: AppDictionary }) {
  const t = dictionary.quiz;
  const router = useRouter();
  const [title, setTitle] = useState(quiz.title);
  const [questions, setQuestions] = useState<QuizQuestionData[]>(quiz.questions.length ? quiz.questions : [blankQuestion()]);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<"" | "save" | "play">("");
  const [message, setMessage] = useState("");
  const valid = Boolean(title.trim()) && questions.length > 0 && questions.every(isComplete);

  const change = (update: (current: QuizQuestionData[]) => QuizQuestionData[]) => { setQuestions(update); setDirty(true); setMessage(""); };
  const patch = (index: number, value: Partial<QuizQuestionData>) => change((current) => current.map((question, position) => (position === index ? { ...question, ...value } : question)));
  const setOption = (index: number, optionIndex: number, text: string) => patch(index, { options: questions[index].options.map((option, position) => (position === optionIndex ? text : option)) });
  const removeOption = (index: number, optionIndex: number) => {
    const question = questions[index];
    const correctIndex = question.correctIndex === optionIndex ? 0 : question.correctIndex > optionIndex ? question.correctIndex - 1 : question.correctIndex;
    patch(index, { options: question.options.filter((_, position) => position !== optionIndex), correctIndex });
  };

  const save = async () => {
    if (!valid) { setMessage(t.fixErrors); return false; }
    const response = await fetch(`/api/teacher/quizzes/${quiz.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), description: "", questions: questions.map((question) => ({ ...question, text: question.text.trim(), options: question.options.map((option) => option.trim()) })) }),
    }).catch(() => null);
    if (!response?.ok) { setMessage(t.errGeneric); return false; }
    setDirty(false); setMessage(t.saved);
    return true;
  };
  const onSave = async () => { setBusy("save"); await save(); setBusy(""); };
  const onPlay = async () => {
    setBusy("play");
    if (dirty && !(await save())) { setBusy(""); return; }
    if (!valid) { setMessage(t.fixErrors); setBusy(""); return; }
    const response = await fetch("/api/teacher/games", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ quizId: quiz.id }) }).catch(() => null);
    const payload = response?.ok ? await response.json() as { game: { id: string } } : null;
    if (payload) router.push(`/teacher/games/${payload.game.id}`); else { setMessage(t.errGeneric); setBusy(""); }
  };

  return (
    <div className="teacher-page quiz-editor">
      <header className="teacher-page-header">
        <div>
          <Link href="/teacher" className="teacher-back"><ArrowLeft weight="bold" /> {t.myQuizzes}</Link>
          <label htmlFor="quiz-title" className="eyebrow">{t.quizTitle}</label>
          <input id="quiz-title" className="quiz-title-input" maxLength={120} placeholder={t.quizTitlePlaceholder} value={title} onChange={(event) => { setTitle(event.target.value); setDirty(true); setMessage(""); }} />
        </div>
        <div className="teacher-actions">
          <Button type="button" variant="outline" disabled={!dirty} loading={busy === "save"} onClick={() => void onSave()}><FloppyDisk weight="bold" /> {dictionary.common.save}</Button>
          <Button type="button" loading={busy === "play"} onClick={() => void onPlay()}><Play weight="fill" /> {t.play}</Button>
        </div>
      </header>
      <p className={cn("quiz-editor-status", message === t.saved && "is-ok", message && message !== t.saved && "is-error")} role="status">{message || (dirty ? t.unsaved : "")}</p>

      {questions.map((question, index) => (
        <Card key={index} className="quiz-editor-question">
          <div className="quiz-editor-question-head">
            <strong>{t.question} {index + 1}</strong>
            <label>{t.timeLimit}
              <select value={question.timeLimitSec} onChange={(event) => patch(index, { timeLimitSec: Number(event.target.value) })}>
                {TIME_LIMITS.map((seconds) => <option key={seconds} value={seconds}>{seconds} {t.seconds}</option>)}
              </select>
            </label>
            <button type="button" className="teacher-icon-button" aria-label={`${t.removeQuestion} ${index + 1}`} disabled={questions.length === 1} onClick={() => change((current) => current.filter((_, position) => position !== index))}><Trash weight="bold" /></button>
          </div>
          <textarea rows={2} maxLength={300} placeholder={t.questionText} aria-label={`${t.questionText} ${index + 1}`} value={question.text} onChange={(event) => patch(index, { text: event.target.value })} />
          <div className="quiz-editor-options">
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className={cn("quiz-editor-option", `tone-${optionIndex}`, question.correctIndex === optionIndex && "is-correct")}>
                <span className="quiz-option-letter">{OPTION_LETTERS[optionIndex]}</span>
                <input maxLength={120} placeholder={`${t.option} ${OPTION_LETTERS[optionIndex]}`} aria-label={`${t.option} ${OPTION_LETTERS[optionIndex]}`} value={option} onChange={(event) => setOption(index, optionIndex, event.target.value)} />
                <button type="button" className="quiz-editor-correct" aria-pressed={question.correctIndex === optionIndex} aria-label={`${t.markCorrect}: ${OPTION_LETTERS[optionIndex]}`} title={t.markCorrect} onClick={() => patch(index, { correctIndex: optionIndex })}><Check weight="bold" /></button>
                {question.options.length > 2 && <button type="button" className="quiz-editor-remove" aria-label={`${t.removeOption}: ${OPTION_LETTERS[optionIndex]}`} title={t.removeOption} onClick={() => removeOption(index, optionIndex)}><X weight="bold" /></button>}
              </div>
            ))}
          </div>
          {question.options.length < MAX_OPTIONS && <button type="button" className="quiz-editor-add-option" onClick={() => patch(index, { options: [...question.options, ""] })}><Plus weight="bold" /> {t.addOption}</button>}
        </Card>
      ))}
      {questions.length < MAX_QUESTIONS && <Button type="button" variant="outline" size="lg" className="quiz-editor-add" onClick={() => change((current) => [...current, blankQuestion()])}><Plus weight="bold" /> {t.addQuestion}</Button>}
    </div>
  );
}
