import type { ComponentType } from "react"
import { lazy } from "react"

import * as Q from "./qiuye-demos"
import * as S from "./shadcn-demos"

export type DemoSource = "shadcn" | "qiuye"

/** 与 i18n 中 components.demos.* 的 key 对应 */
export type DemoKey =
  | "button"
  | "form"
  | "overlay"
  | "feedback"
  | "segmentedControl"
  | "responsiveTabs"
  | "clipPathTabs"
  | "dualStateToggle"
  | "themeToggle"
  | "animatedNumber"
  | "typewriter"
  | "colorPicker"
  | "smoothCorners"
  | "dotGlass"
  | "imageViewer"
  | "expandableCard"
  | "scrollableDialog"
  | "tour"
  | "codeBlock"
  | "markdownRenderer"
  | "matrixEffect"

export interface DemoMeta {
  key: DemoKey
  source: DemoSource
  /** shadcn CLI 安装参数 */
  install: string
  Demo: ComponentType
  /** 在两列布局中占满整行 */
  wide?: boolean
  previewClassName?: string
}

const MarkdownDemo = lazy(() => import("./markdown-demo"))

export const demos: DemoMeta[] = [
  { key: "button", source: "shadcn", install: "button", Demo: S.ButtonDemo },
  {
    key: "form",
    source: "shadcn",
    install: "input textarea switch label",
    Demo: S.FormDemo,
  },
  {
    key: "overlay",
    source: "shadcn",
    install: "dialog popover tooltip dropdown-menu",
    Demo: S.OverlayDemo,
  },
  {
    key: "feedback",
    source: "shadcn",
    install: "badge skeleton spinner sonner",
    Demo: S.FeedbackDemo,
  },
  {
    key: "segmentedControl",
    source: "qiuye",
    install: "@qiuye-ui/segmented-control",
    Demo: Q.SegmentedControlDemo,
  },
  {
    key: "responsiveTabs",
    source: "qiuye",
    install: "@qiuye-ui/responsive-tabs",
    Demo: Q.ResponsiveTabsDemo,
  },
  {
    key: "clipPathTabs",
    source: "qiuye",
    install: "@qiuye-ui/clip-path-tabs",
    Demo: Q.ClipPathTabsDemo,
  },
  {
    key: "dualStateToggle",
    source: "qiuye",
    install: "@qiuye-ui/dual-state-toggle",
    Demo: Q.DualStateToggleDemo,
  },
  {
    key: "themeToggle",
    source: "qiuye",
    install: "@qiuye-ui/theme-transition-toggle",
    Demo: Q.ThemeToggleDemo,
  },
  {
    key: "animatedNumber",
    source: "qiuye",
    install: "@qiuye-ui/animated-number",
    Demo: Q.AnimatedNumberDemo,
  },
  {
    key: "typewriter",
    source: "qiuye",
    install: "@qiuye-ui/typewriter",
    Demo: Q.TypewriterDemo,
  },
  {
    key: "colorPicker",
    source: "qiuye",
    install: "@qiuye-ui/color-picker",
    Demo: Q.ColorPickerDemo,
  },
  {
    key: "smoothCorners",
    source: "qiuye",
    install: "@qiuye-ui/smooth-corners",
    Demo: Q.SmoothCornersDemo,
  },
  {
    key: "dotGlass",
    source: "qiuye",
    install: "@qiuye-ui/dot-glass",
    Demo: Q.DotGlassDemo,
  },
  {
    key: "imageViewer",
    source: "qiuye",
    install: "@qiuye-ui/image-viewer",
    Demo: Q.ImageViewerDemo,
  },
  {
    key: "expandableCard",
    source: "qiuye",
    install: "@qiuye-ui/expandable-card",
    Demo: Q.ExpandableCardDemo,
  },
  {
    key: "scrollableDialog",
    source: "qiuye",
    install: "@qiuye-ui/scrollable-dialog",
    Demo: Q.ScrollableDialogDemo,
  },
  { key: "tour", source: "qiuye", install: "@qiuye-ui/tour", Demo: Q.TourDemo },
  {
    key: "codeBlock",
    source: "qiuye",
    install: "@qiuye-ui/code-block",
    Demo: Q.CodeBlockDemo,
    wide: true,
  },
  {
    key: "markdownRenderer",
    source: "qiuye",
    install: "@qiuye-ui/markdown-renderer",
    Demo: MarkdownDemo,
    wide: true,
    previewClassName: "items-stretch justify-start",
  },
  {
    key: "matrixEffect",
    source: "qiuye",
    install: "@qiuye-ui/matrix-effect",
    Demo: Q.MatrixEffectDemo,
    wide: true,
  },
]
