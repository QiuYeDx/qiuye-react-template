import React, { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useThemeStore();

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
