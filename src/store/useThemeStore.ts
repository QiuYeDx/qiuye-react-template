import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemeMode = "light" | "dark";

interface ThemeState {
  theme: {
    primaryColor: string;
    mode: ThemeMode;
  };
  setPrimaryColor: (color: string) => void;
  setMode: (mode: ThemeMode) => void;
}

const STORAGE_KEY = "theme-store";
const DEFAULT_PRIMARY_COLOR = "#1890ff";

const isThemeMode = (mode: unknown): mode is ThemeMode =>
  mode === "light" || mode === "dark";

const getSystemMode = (): ThemeMode => {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getInitialTheme = (): ThemeState["theme"] => {
  const fallback = {
    primaryColor: DEFAULT_PRIMARY_COLOR,
    mode: getSystemMode(),
  };

  if (typeof window === "undefined") return fallback;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as {
      state?: { theme?: { primaryColor?: unknown; mode?: unknown } };
    };
    const savedTheme = parsed.state?.theme;

    return {
      primaryColor:
        typeof savedTheme?.primaryColor === "string"
          ? savedTheme.primaryColor
          : fallback.primaryColor,
      mode: isThemeMode(savedTheme?.mode) ? savedTheme.mode : fallback.mode,
    };
  } catch {
    return fallback;
  }
};

const initialTheme = getInitialTheme();

if (typeof document !== "undefined") {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(initialTheme.mode);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: initialTheme,
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
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const savedTheme = (
          persistedState as Partial<ThemeState> | undefined
        )?.theme;

        return {
          ...currentState,
          theme: {
            primaryColor:
              typeof savedTheme?.primaryColor === "string"
                ? savedTheme.primaryColor
                : currentState.theme.primaryColor,
            mode: isThemeMode(savedTheme?.mode)
              ? savedTheme.mode
              : currentState.theme.mode,
          },
        };
      },
    }
  )
);
