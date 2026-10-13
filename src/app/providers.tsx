import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { MotionConfig } from "motion/react"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { queryClient } from "@/lib/query-client"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      // 首屏主题已由 index.html 中的内联脚本同步设置；SPA 中 next-themes 注入的
      // <script> 不会执行，标记为数据块以避免 React 19 的告警
      scriptProps={{ type: "application/json" }}
    >
      <QueryClientProvider client={queryClient}>
        {/* reducedMotion="user"：跟随系统的「减少动态效果」设置 */}
        <MotionConfig reducedMotion="user">
          <TooltipProvider delayDuration={300}>
            {children}
            <Toaster position="top-center" />
          </TooltipProvider>
        </MotionConfig>
        {import.meta.env.DEV && (
          <ReactQueryDevtools buttonPosition="bottom-left" />
        )}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
