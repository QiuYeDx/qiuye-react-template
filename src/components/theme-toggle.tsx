import { useTheme } from "next-themes"
import { useTranslation } from "react-i18next"

import {
  ThemeTransitionToggle,
  type ThemeTransitionToggleProps,
} from "@/components/qiuye-ui/theme-transition-toggle"

type ThemeToggleProps = Omit<ThemeTransitionToggleProps, "isDark" | "onToggle">

/** 接入 next-themes 的主题切换按钮，切换时带有 View Transitions 揭幕动画 */
export function ThemeToggle({
  variant = "ghost",
  size = "icon",
  ...props
}: ThemeToggleProps) {
  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <ThemeTransitionToggle
      isDark={resolvedTheme === "dark"}
      onToggle={(nextDark) => setTheme(nextDark ? "dark" : "light")}
      lightLabel={t("theme.toDark")}
      darkLabel={t("theme.toLight")}
      variant={variant}
      size={size}
      {...props}
    />
  )
}
