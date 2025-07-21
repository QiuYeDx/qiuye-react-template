import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: {
    primaryColor: string;
    mode: "light" | "dark";
  };
  setPrimaryColor: (color: string) => void;
  setMode: (mode: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: {
        primaryColor: "#1890ff",
        mode: "light",
      },
      setPrimaryColor: (color) =>
        set((state) => ({
          theme: { ...state.theme, primaryColor: color },
        })),
      setMode: (mode) =>
        set((state) => ({
          theme: { ...state.theme, mode },
        })),
    }),
    {
      name: "theme-store",
    }
  )
);
