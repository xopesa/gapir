"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const TEST_USERNAME = "Test";
const TEST_PASSWORD = "2804meili";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      login: (username, password) => {
        const isValid =
          username.trim() === TEST_USERNAME && password === TEST_PASSWORD;
        if (isValid) {
          set({ isAuthenticated: true, username: TEST_USERNAME });
        }
        return isValid;
      },
      logout: () => set({ isAuthenticated: false, username: null }),
    }),
    {
      name: "gapir-test-session",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        username: state.username,
      }),
    },
  ),
);
