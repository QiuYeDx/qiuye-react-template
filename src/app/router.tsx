import { createBrowserRouter } from "react-router"

import { AppFallback } from "@/components/layout/app-fallback"
import { RootLayout } from "@/components/layout/root-layout"
import { RouteError } from "@/pages/error"

/**
 * 路由表：页面统一使用 `lazy` 按需加载，每个页面模块导出 `Component`
 *（可选导出 `loader` / `action` / `ErrorBoundary` 等路由模块字段）。
 */
export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    // 布局本身出错时的兜底
    ErrorBoundary: RouteError,
    // 首次进入、页面代码仍在加载时显示
    HydrateFallback: AppFallback,
    children: [
      {
        // 页面出错时保留页头页脚，只替换内容区域
        ErrorBoundary: RouteError,
        children: [
          { index: true, lazy: () => import("@/pages/home") },
          { path: "components", lazy: () => import("@/pages/components") },
          { path: "about", lazy: () => import("@/pages/about") },
          { path: "*", lazy: () => import("@/pages/not-found") },
        ],
      },
    ],
  },
])
