import type {
  LeaderboardUser,
  Lesson,
  PracticeMode,
  ShopItem,
} from "@/src/types";

export const lessons: Lesson[] = [
  { id: 1, title: "Приветствия", subtitle: "Salom · Xayr", status: "completed", xp: 40 },
  { id: 2, title: "Знакомство", subtitle: "Как представить себя", status: "completed", xp: 50 },
  { id: 3, title: "Семья", subtitle: "12 новых слов", status: "active", xp: 60 },
  { id: 4, title: "Числа", subtitle: "Считаем до ста", status: "locked", xp: 60 },
  { id: 5, title: "Еда и напитки", subtitle: "В кафе и на базаре", status: "locked", xp: 80 },
  { id: 6, title: "Город и транспорт", subtitle: "Как найти дорогу", status: "locked", xp: 90 },
];

export const practiceModes: PracticeMode[] = [
  { id: "words", title: "Повторение слов", description: "Закрепите слова из последних уроков", tasks: 18, tone: "blue" },
  { id: "listening", title: "Слушание", description: "Распознавайте живую узбекскую речь", tasks: 12, tone: "ice" },
  { id: "speaking", title: "Произношение", description: "Повторяйте фразы в своём темпе", tasks: 8, tone: "mint" },
  { id: "dialogs", title: "Мини-диалоги", description: "Короткие ситуации из реальной жизни", tasks: 6, tone: "violet" },
  { id: "mistakes", title: "Работа над ошибками", description: "Вернитесь к сложным заданиям", tasks: 9, tone: "rose" },
  { id: "quick", title: "Быстрая практика", description: "Смешанная тренировка на 3 минуты", tasks: 20, tone: "amber" },
];

export const leaderboard: LeaderboardUser[] = [
  { id: 1, name: "Mariya", xp: 1840, initials: "MA", zone: "promotion" },
  { id: 2, name: "Aziz", xp: 1710, initials: "AZ", zone: "promotion" },
  { id: 3, name: "Daniil", xp: 1580, initials: "DA", zone: "promotion" },
  { id: 4, name: "Sofia", xp: 1460, initials: "SO", zone: "safe" },
  { id: 5, name: "Алексей", xp: 1320, initials: "АЛ", zone: "safe", current: true },
  { id: 6, name: "Laylo", xp: 1210, initials: "LA", zone: "safe" },
  { id: 7, name: "Timur", xp: 1090, initials: "TI", zone: "safe" },
  { id: 8, name: "Elena", xp: 970, initials: "EL", zone: "safe" },
  { id: 9, name: "Nikita", xp: 860, initials: "NI", zone: "demotion" },
  { id: 10, name: "Malika", xp: 740, initials: "MK", zone: "demotion" },
];

export const shopItems: ShopItem[] = [
  { id: "freeze", title: "Streak Freeze", description: "Сохранит стрик, если пропустите день", price: 120, category: "Бустеры", accent: "blue" },
  { id: "double-xp", title: "XP ×2 на 30 минут", description: "Удвойте награду за каждый урок", price: 180, category: "Бустеры", accent: "amber" },
  { id: "premium-day", title: "Premium на 1 день", description: "Все уроки и практика без ограничений", price: 320, category: "Подписка", accent: "violet" },
  { id: "premium-week", title: "Premium на 7 дней", description: "Неделя полного доступа к Gapir", price: 1200, category: "Подписка", accent: "mint" },
  { id: "ice-theme", title: "Тема Ice Glass", description: "Мягкая ледяная тема интерфейса", price: 450, category: "Темы", accent: "blue" },
  { id: "avatar", title: "Эксклюзивный аватар", description: "Особый образ для профиля и лиги", price: 680, category: "Аватары", accent: "violet" },
];

export const activity = [1, 1, 0, 1, 2, 2, 0, 1, 3, 2, 1, 0, 1, 2, 3, 1, 0, 2, 3, 2, 1, 1, 2, 3, 0, 1, 2, 3, 2, 1, 0, 2, 3, 1, 2];
