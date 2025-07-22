import React, { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, setMode } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;

    // 初始化时，检查系统偏好设置
    const initializeTheme = () => {
      // 如果当前主题是从 localStorage 恢复的，直接应用
      if (theme.mode) {
        root.classList.remove("light", "dark");
        root.classList.add(theme.mode);
        return;
      }

      // 如果没有保存的主题，检查系统偏好
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialTheme = systemPrefersDark ? "dark" : "light";

      setMode(initialTheme);
      root.classList.remove("light", "dark");
      root.classList.add(initialTheme);
    };

    initializeTheme();

    // 监听系统主题变化（可选）
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (_e: MediaQueryListEvent) => {
      // 只有在用户没有手动设置主题时才跟随系统
      // 这里我们总是保持用户的选择，不自动跟随系统变化
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [setMode]);

  useEffect(() => {
    const root = window.document.documentElement;

    // 当主题变化时，更新HTML类名
    root.classList.remove("light", "dark");
    root.classList.add(theme.mode);

    // 可选：给body添加一个过渡效果
    document.body.style.transition =
      "background-color 0.3s ease, color 0.3s ease";

    return () => {
      document.body.style.transition = "";
    };
  }, [theme.mode]);

  return <>{children}</>;
}
