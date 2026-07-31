"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  name: string;
  xp: number;
  streak: number;
  gapCoins: number;
  completedLessons: number[];
  purchasedItems: string[];
  completeLesson: (lessonId: number, xp: number) => void;
  purchaseItem: (itemId: string, price: number) => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      name: "Алексей",
      xp: 1320,
      streak: 12,
      gapCoins: 860,
      completedLessons: [1, 2],
      purchasedItems: [],
      completeLesson: (lessonId, xp) =>
        set((state) => ({
          xp: state.xp + xp,
          gapCoins: state.gapCoins + 20,
          completedLessons: Array.from(new Set([...state.completedLessons, lessonId])),
        })),
      purchaseItem: (itemId, price) => {
        const state = get();
        if (state.gapCoins < price || state.purchasedItems.includes(itemId)) {
          return false;
        }
        set({
          gapCoins: state.gapCoins - price,
          purchasedItems: [...state.purchasedItems, itemId],
        });
        return true;
      },
    }),
    { name: "gapir-user" },
  ),
);
