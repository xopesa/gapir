export type LessonStatus = "completed" | "active" | "locked";

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  status: LessonStatus;
  xp: number;
}

export interface PracticeMode {
  id: string;
  title: string;
  description: string;
  tasks: number;
  tone: "blue" | "mint" | "violet" | "amber" | "rose" | "ice";
}

export interface LeaderboardUser {
  id: number;
  name: string;
  xp: number;
  initials: string;
  zone: "promotion" | "safe" | "demotion";
  current?: boolean;
}

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: "Бустеры" | "Подписка" | "Темы" | "Аватары";
  state?: "available" | "unavailable";
  accent: "blue" | "mint" | "violet" | "amber";
}
