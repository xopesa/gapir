export type TutorDirection = "uz_to_zh" | "zh_to_uz";
export type TutorLevel = "beginner" | "intermediate" | "advanced";
export type TutorTopic = "free_conversation" | "greeting" | "shopping" | "restaurant" | "travel" | "work";
export type AiUiState = "ready" | "listening" | "recording" | "uploading" | "recognizing" | "thinking" | "speaking" | "error" | "finished";

export type AiTutorResponse = {
  recognizedText: string;
  correctedText: string;
  translation: string;
  grammarExplanation: string;
  teacherReply: string;
  nextQuestion: string;
  newWords: Array<{ word: string; translation: string; language: "uz" | "zh-CN" }>;
  pronunciationTips: string[];
  grammarTopic: string;
  score: number;
  xp: number;
  coins: number;
  achievements: string[];
  audioUrl: string | null;
  version: "1";
};

export type AiMessage = {
  id: string;
  role: "USER" | "ASSISTANT" | string;
  recognizedText: string | null;
  correctedText: string | null;
  translation: string | null;
  grammarExplanation: string | null;
  teacherReply: string | null;
  nextQuestion: string | null;
  score: number | null;
  xp: number;
  coins: number;
  audioUrl: string | null;
  responseJson: string | null;
  createdAt: string;
};

export type AiSession = {
  id: string;
  feature: string;
  direction: TutorDirection;
  nativeLanguage: string;
  targetLanguage: string;
  level: TutorLevel;
  topic: TutorTopic;
  status: "ACTIVE" | "FINISHED" | string;
  startedAt: string;
  finishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: AiMessage[];
};

export type AiMemory = {
  id: string;
  direction: TutorDirection;
  level: TutorLevel;
  summary: string;
  coins: number;
  totalXp: number;
  streak: number;
  lastLessonAt: string | null;
  weakGrammarTopics: string[];
  frequentMistakes: string[];
  recentTopics: string[];
  learnedWords: Array<{ id: string; word: string; translation: string; language: string; mastery: number }>;
};

export type CreateSessionInput = { direction: TutorDirection; level: TutorLevel; topic: TutorTopic };
export type AudioMessageInput = { blob: Blob; mimeType: string; durationMs: number; fileName: string; clientMessageId?: string };
