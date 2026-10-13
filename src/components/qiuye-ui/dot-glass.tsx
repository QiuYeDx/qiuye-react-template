"use client";

import React from "react";
import { cn } from "@/lib/utils";

/** DotGlass 组件的属性 */
export interface DotGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 圆点直径（像素）
   * @default 3
   */
  dotSize?: number;
  /**
   * 点阵间距（像素）
   * @default 6
   */
  dotGap?: number;
  /**
   * 边缘柔化（像素），值越大圆点边缘越模糊
   * @default 0
   */
  dotFade?: number;
  /**
   * 模糊强度（像素）
   * @default 4
   */
  blur?: number;
  /**
   * 饱和度（百分比，100 为原色）
   * @default 130
   */
  saturation?: number;
  /**
   * 玻璃层透明度（0-1）
   * @default 0.45
   */
  glassAlpha?: number;
  /**
   * 盖板颜色（非孔洞区域的背景色）
   * @default "#ffffff"
   */
  coverColor?: string;
  /**
   * 是否使用固定定位（适用于 header 等场景）
   * @default false
   */
  fixed?: boolean;
  /**
   * 是否使用绝对定位
   * @default false
   */
  absolute?: boolean;
  /**
   * 是否使用粘性定位
   * @default false
   */
  sticky?: boolean;
  /**
   * 子元素（内容）
   */
  children?: React.ReactNode;
}

/**
 * DotGlass — 点阵开孔毛玻璃组件
 *
 * 一种"反直觉"的玻璃效果：只有点阵孔洞里会露出背后内容的模糊（blur），
 * 其余区域是纯色盖板遮挡。
 *
 * 实现原理：
 * - 底层玻璃层：带 `backdrop-filter: blur` 和半透明背景
 * - 上层盖板层：纯色背景 + 反向 CSS mask 挖出点阵孔洞
 *
 * 支持 `fixed`、`absolute`、`sticky` 等定位模式，适用于 Header、侧边栏等场景。
 *
 * @example
 * ```tsx
 * // 基本用法 — 相对定位，包裹子内容
 * <DotGlass className="p-4">
 *   <h1>标题内容</h1>
 * </DotGlass>
 *
 * // 固定定位的毛玻璃导航栏
 * <DotGlass fixed className="top-0 inset-x-0 z-50 px-6 py-3">
 *   <nav>导航内容</nav>
 * </DotGlass>
 *
 * // 自定义点阵参数
 * <DotGlass dotSize={4} dotGap={8} blur={6} saturation={150} coverColor="#000000">
 *   <p>深色主题内容</p>
 * </DotGlass>
 * ```
 */
const DotGlass = React.forwardRef<HTMLDivElement, DotGlassProps>(
  (
    {
      className,
      dotSize = 3,
      dotGap = 6,
      dotFade = 0,
      blur = 4,
      saturation = 130,
      glassAlpha = 0.45,
      coverColor = "#ffffff",
      fixed = false,
      absolute = false,
      sticky = false,
      children,
      style,
      ...props
    },
    ref
  ) => {
    // 计算 mask 的渐变半径
    const dotRadius = dotSize / 2;
    const fadeRadius = dotRadius + dotFade;

    // 构建 CSS 变量
    const cssVars = {
      "--dot-glass-dot-size": `${dotSize}px`,
      "--dot-glass-dot-gap": `${dotGap}px`,
      "--dot-glass-dot-fade": `${dotFade}px`,
      "--dot-glass-blur": `${blur}px`,
      "--dot-glass-sat": `${saturation}%`,
      "--dot-glass-alpha": glassAlpha,
      "--dot-glass-cover-color": coverColor,
      "--dot-glass-dot-radius": `${dotRadius}px`,
      "--dot-glass-fade-radius": `${fadeRadius}px`,
    } as React.CSSProperties;

    // 确定定位类名
    const positionClass = fixed
      ? "fixed"
      : absolute
        ? "absolute"
        : sticky
          ? "sticky"
          : "relative";

    return (
      <div
        ref={ref}
        className={cn("dot-glass", positionClass, className)}
        style={{ ...cssVars, ...style }}
        {...props}
      >
        {/* 1. 玻璃层：blur + 半透明背景 */}
        <div
          className="dot-glass-blur-layer absolute inset-0 pointer-events-none"
          style={{
            background: `rgba(255, 255, 255, var(--dot-glass-alpha))`,
            backdropFilter: `saturate(var(--dot-glass-sat)) blur(var(--dot-glass-blur))`,
            WebkitBackdropFilter: `saturate(var(--dot-glass-sat)) blur(var(--dot-glass-blur))`,
            zIndex: 1,
          }}
        />

        {/* 2. 盖板层：纯色 + 反向 mask 挖孔 */}
        <div
          className="dot-glass-cover-layer absolute inset-0 pointer-events-none"
          style={{
            background: "var(--dot-glass-cover-color)",
            maskImage: `radial-gradient(circle, transparent var(--dot-glass-dot-radius), #fff var(--dot-glass-fade-radius))`,
            maskSize: `var(--dot-glass-dot-gap) var(--dot-glass-dot-gap)`,
            maskRepeat: "repeat",
            maskPosition: "center",
            WebkitMaskImage: `radial-gradient(circle, transparent var(--dot-glass-dot-radius), #fff var(--dot-glass-fade-radius))`,
            WebkitMaskSize: `var(--dot-glass-dot-gap) var(--dot-glass-dot-gap)`,
            WebkitMaskRepeat: "repeat",
            WebkitMaskPosition: "center",
            zIndex: 2,
          }}
        />

        {/* 3. 内容层 */}
        <div className="dot-glass-content relative" style={{ zIndex: 3 }}>
          {children}
        </div>
      </div>
    );
  }
);

DotGlass.displayName = "DotGlass";

export { DotGlass };
