"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { MoonIcon, SunIcon } from "lucide-react";

import {
  DualStateToggle,
  type DualStateToggleProps,
} from "@/components/qiuye-ui/dual-state-toggle";
import { cn } from "@/lib/utils";

type ViewTransitionLike = {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition: () => void;
};

type DocumentWithViewTransition = Document & {
  startViewTransition?: (
    callback: () => void | Promise<void>,
  ) => ViewTransitionLike;
};

type ThemeTransitionLayer = "new" | "old";
type PolygonTransitionShape = "star" | "diamond" | "hexagon";
type ViewportEdge = "top" | "right" | "bottom" | "left";
type ViewportCorner = "top-left" | "top-right" | "bottom-right" | "bottom-left";

const ELLIPSE_Y_RATIO = 0.72;
const STAR_INNER_RADIUS_RATIO = 0.46;
const POLYGON_COVER_MULTIPLIERS: Record<PolygonTransitionShape, number> = {
  star: 2.6,
  diamond: 1.5,
  hexagon: 1.25,
};
const DEFAULT_TRANSITION_DURATION = 580;
const DEFAULT_TRANSITION_EASING = "cubic-bezier(0.17,0.84,0.44,1)";
let activeThemeViewTransition: ViewTransitionLike | undefined;
let activeThemeClipPathAnimation: Animation | undefined;

/** 主题切换时的几何揭幕形状 */
export type ThemeTransitionShape =
  | "circle"
  | "ellipse"
  | "star"
  | "diamond"
  | "hexagon";

/** 主题切换动画的方向 */
export type ThemeTransitionDirection = "auto" | "enter" | "exit";

/** 主题切换动画的时间预设 */
export type ThemeTransitionTiming = "spring" | "smooth";

/** 主题切换时的几何过渡效果 */
export type ThemeTransitionEffect = "reveal" | "wipe" | "split" | "diagonal";

/** 边缘扫入与轴线展开的运动轴向 */
export type ThemeTransitionAxis = "auto" | "horizontal" | "vertical";

/** 对角揭幕使用的视口角 */
export type ThemeTransitionCorner = "auto" | ViewportCorner;

/** 计算揭幕动画起点时可使用的来源 */
export type ThemeTransitionOrigin =
  | HTMLElement
  | React.RefObject<HTMLElement | null>
  | PointerEvent
  | MouseEvent
  | React.MouseEvent<HTMLElement>
  | { x: number; y: number }
  | "center";

/** 执行 View Transition 主题动画时使用的配置 */
export interface ThemeTransitionOptions {
  /** 触发主题切换的 DOM 更新函数 */
  updateTheme: () => void;
  /**
   * 用于计算几何揭幕中心点的来源
   * @default "center"
   */
  origin?: ThemeTransitionOrigin | null;
  /**
   * 动画时长，单位毫秒
   * @default 580
   */
  duration?: number;
  /**
   * CSS easing 曲线
   * @default "cubic-bezier(0.17,0.84,0.44,1)"
   */
  easing?: string;
  /**
   * 动画时间预设
   * - `"spring"`：使用连续半径插值，保留兼容命名但不做 overshoot/尾段停靠
   * - `"smooth"`：只使用起止两帧，完全由 duration/easing 控制
   * @default "spring"
   */
  timing?: ThemeTransitionTiming;
  /**
   * 几何过渡效果
   * - `"reveal"`：从触发点按 shape 扩散或收束
   * - `"wipe"`：从离触发点最近的视口边缘扫入或扫出
   * - `"split"`：从穿过触发点的轴线向两侧展开或收拢
   * - `"diagonal"`：从离触发点最近的视口角做对角揭幕
   * @default "reveal"
   */
  transitionEffect?: ThemeTransitionEffect;
  /**
   * 边缘扫入与轴线展开的运动轴向
   * - `"auto"`：根据触发点离视口边缘的距离自动选择
   * - `"horizontal"`：沿水平方向从左右边缘扫入，或从轴线向左右展开
   * - `"vertical"`：沿垂直方向从上下边缘扫入，或从轴线向上下展开
   * @default "auto"
   */
  transitionAxis?: ThemeTransitionAxis;
  /**
   * 对角揭幕使用的视口角
   * - `"auto"`：根据触发点自动选择最近的视口角
   * - 其余值：固定从指定视口角揭幕或向该角收拢
   * @default "auto"
   */
  transitionCorner?: ThemeTransitionCorner;
  /**
   * reveal 过渡使用的揭幕形状
   * - `"circle"`：圆形揭幕
   * - `"ellipse"`：椭圆揭幕
   * - `"star"`：五角星揭幕
   * - `"diamond"`：菱形揭幕
   * - `"hexagon"`：六边形揭幕
   * @default "circle"
   */
  shape?: ThemeTransitionShape;
  /**
   * 主题截图的揭幕方向
   * - `"auto"`：进入深色时扩散新主题，回到浅色时收束旧主题
   * - `"enter"`：始终扩散新主题截图
   * - `"exit"`：始终收束旧主题截图
   * @default "auto"
   */
  direction?: ThemeTransitionDirection;
  /** 切换前是否为深色主题，用于 direction="auto" 的方向判断 */
  isDark?: boolean;
  /**
   * 切换后的目标主题是否为深色；传入后会在 View Transition 的 update 阶段同步更新 html class
   */
  targetDark?: boolean;
  /**
   * 深色主题挂载在 documentElement 上的 className，设为 null 可关闭同步
   * @default "dark"
   */
  themeClassName?: string | null;
  /**
   * reveal 过渡的额外覆盖半径，避免大屏和缩放场景下边角露白
   * @default 48
   */
  extraRadius?: number;
  /**
   * 是否尊重系统减少动态效果偏好
   * @default true
   */
  respectReducedMotion?: boolean;
  /** View Transition 不可用或被降级时触发 */
  onFallback?: () => void;
  /** 动画完成后的回调 */
  onFinish?: () => void;
}

/** useThemeTransition Hook 的配置 */
export interface UseThemeTransitionOptions extends Omit<
  ThemeTransitionOptions,
  "updateTheme" | "origin"
> {
  /** 触发主题切换的 DOM 更新函数 */
  updateTheme: () => void;
  /**
   * 默认揭幕中心点；调用 run 时传入的 origin 会覆盖它
   * @default "center"
   */
  origin?: ThemeTransitionOrigin | null;
}

/** ThemeTransitionToggle 组件的属性 */
export interface ThemeTransitionToggleProps
  extends
    Omit<
      DualStateToggleProps,
      | "active"
      | "onToggle"
      | "activeIcon"
      | "inactiveIcon"
      | "activeLabel"
      | "inactiveLabel"
      | "shape"
    >,
    Omit<ThemeTransitionOptions, "updateTheme" | "origin"> {
  /** 当前是否处于深色主题 */
  isDark: boolean;
  /** 主题切换回调，组件会在 View Transition 的 update 阶段调用它 */
  onToggle: (nextDark: boolean) => void;
  /**
   * 浅色主题下显示的图标
   * @default <SunIcon />
   */
  lightIcon?: React.ReactNode;
  /**
   * 深色主题下显示的图标
   * @default <MoonIcon />
   */
  darkIcon?: React.ReactNode;
  /**
   * 浅色主题下的无障碍标签
   * @default "切换到深色主题"
   */
  lightLabel?: string;
  /**
   * 深色主题下的无障碍标签
   * @default "切换到浅色主题"
   */
  darkLabel?: string;
  /**
   * 按钮形状快捷设置，独立于揭幕 shape
   * @default "square"
   */
  buttonShape?: DualStateToggleProps["shape"];
  /** 点击切换前触发 */
  onToggleStart?: (nextDark: boolean) => void;
}

function isViewTransitionSupported() {
  return typeof document !== "undefined" && "startViewTransition" in document;
}

function shouldReduceMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getRefCurrent(origin: ThemeTransitionOrigin): HTMLElement | undefined {
  if (
    typeof origin === "object" &&
    "current" in origin &&
    origin.current instanceof HTMLElement
  ) {
    return origin.current;
  }

  return undefined;
}

function getPointFromOrigin(origin: ThemeTransitionOrigin | null | undefined) {
  if (typeof window === "undefined") {
    return { x: 0, y: 0 };
  }

  if (!origin || origin === "center") {
    const { width, height } = getViewportSize();

    return {
      x: width / 2,
      y: height / 2,
    };
  }

  const refElement = getRefCurrent(origin);
  if (refElement) {
    const rect = refElement.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  if (typeof HTMLElement !== "undefined" && origin instanceof HTMLElement) {
    const rect = origin.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  if ("clientX" in origin && "clientY" in origin) {
    return {
      x: origin.clientX,
      y: origin.clientY,
    };
  }

  if ("x" in origin && "y" in origin) {
    return {
      x: origin.x,
      y: origin.y,
    };
  }

  return {
    x: getViewportSize().width / 2,
    y: getViewportSize().height / 2,
  };
}

function getViewportSize() {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }

  const viewport = window.visualViewport;

  return {
    width: Math.max(
      window.innerWidth,
      document.documentElement.clientWidth,
      viewport?.width ?? 0,
    ),
    height: Math.max(
      window.innerHeight,
      document.documentElement.clientHeight,
      viewport?.height ?? 0,
    ),
  };
}

/**
 * 把布局视口中的 CSS 像素换算为裁剪参考框百分比。
 *
 * View Transition 快照的合成层与页面布局视口可能使用不同的设备像素比例；
 * 使用相对坐标可让圆心与半径始终跟随伪元素的实际参考框缩放。
 */
function toClipPercentage(value: number, reference: number) {
  if (
    !Number.isFinite(value) ||
    !Number.isFinite(reference) ||
    reference <= 0
  ) {
    return 0;
  }

  return (value / reference) * 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getNearestViewportEdge(
  x: number,
  y: number,
  width: number,
  height: number,
  transitionAxis: ThemeTransitionAxis,
): ViewportEdge {
  const pointX = clamp(x, 0, width);
  const pointY = clamp(y, 0, height);
  const horizontalDistances: Array<{
    edge: ViewportEdge;
    distance: number;
  }> = [
    { edge: "left", distance: pointX },
    { edge: "right", distance: width - pointX },
  ];
  const verticalDistances: Array<{ edge: ViewportEdge; distance: number }> = [
    { edge: "top", distance: pointY },
    { edge: "bottom", distance: height - pointY },
  ];
  const distances =
    transitionAxis === "horizontal"
      ? horizontalDistances
      : transitionAxis === "vertical"
        ? verticalDistances
        : [...horizontalDistances, ...verticalDistances];

  return distances.reduce((nearest, current) =>
    current.distance < nearest.distance ? current : nearest,
  ).edge;
}

function getNearestViewportCorner(
  x: number,
  y: number,
  width: number,
  height: number,
): ViewportCorner {
  const horizontal = x <= width / 2 ? "left" : "right";
  const vertical = y <= height / 2 ? "top" : "bottom";

  return `${vertical}-${horizontal}` as ViewportCorner;
}

function getCircleCoverRadius(
  x: number,
  y: number,
  width: number,
  height: number,
  extraRadius: number,
) {
  return (
    Math.max(
      Math.hypot(x, y),
      Math.hypot(width - x, y),
      Math.hypot(x, height - y),
      Math.hypot(width - x, height - y),
    ) + extraRadius
  );
}

function getEllipseCoverRadii(
  x: number,
  y: number,
  width: number,
  height: number,
  extraRadius: number,
) {
  const requiredRadiusX = Math.max(
    Math.hypot(x, y / ELLIPSE_Y_RATIO),
    Math.hypot(width - x, y / ELLIPSE_Y_RATIO),
    Math.hypot(x, (height - y) / ELLIPSE_Y_RATIO),
    Math.hypot(width - x, (height - y) / ELLIPSE_Y_RATIO),
  );
  const radiusX = requiredRadiusX + extraRadius / ELLIPSE_Y_RATIO;

  return {
    radiusX,
    radiusY: radiusX * ELLIPSE_Y_RATIO,
  };
}

function isPolygonShape(
  shape: ThemeTransitionShape,
): shape is PolygonTransitionShape {
  return shape === "star" || shape === "diamond" || shape === "hexagon";
}

function getPolygonPoints(shape: PolygonTransitionShape) {
  if (shape === "diamond") {
    return [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ];
  }

  if (shape === "hexagon") {
    return Array.from({ length: 6 }, (_, index) => {
      const angle = -Math.PI / 2 + index * (Math.PI / 3);
      return [Math.cos(angle), Math.sin(angle)];
    });
  }

  return Array.from({ length: 10 }, (_, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI / 5);
    const radius = index % 2 === 0 ? 1 : STAR_INNER_RADIUS_RATIO;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  });
}

function getPolygonCoverRadii(shape: PolygonTransitionShape, radius: number) {
  const coverRadius = radius * POLYGON_COVER_MULTIPLIERS[shape];

  return {
    radiusX: coverRadius,
    radiusY: coverRadius,
  };
}

function getClipPathValue({
  x,
  y,
  radiusX,
  radiusY,
  width,
  height,
  shape,
}: {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  width: number;
  height: number;
  shape: ThemeTransitionShape;
}) {
  const centerX = toClipPercentage(x, width);
  const centerY = toClipPercentage(y, height);

  if (shape === "ellipse") {
    return `ellipse(${toClipPercentage(radiusX, width)}% ${toClipPercentage(radiusY, height)}% at ${centerX}% ${centerY}%)`;
  }

  if (isPolygonShape(shape)) {
    const points = getPolygonPoints(shape)
      .map(([pointX, pointY]) => {
        return `${toClipPercentage(x + pointX * radiusX, width)}% ${toClipPercentage(y + pointY * radiusY, height)}%`;
      })
      .join(", ");

    return `polygon(${points})`;
  }

  const circleReferenceRadius = Math.hypot(width, height) / Math.SQRT2;

  return `circle(${toClipPercentage(radiusX, circleReferenceRadius)}% at ${centerX}% ${centerY}%)`;
}

function waitForNextPaint() {
  if (typeof window === "undefined" || document.visibilityState === "hidden") {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

function getClipPathKeyframes({
  x,
  y,
  width,
  height,
  radiusX,
  radiusY,
  shape,
  transitionEffect,
  transitionAxis,
  transitionCorner,
  layer,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  radiusX: number;
  radiusY: number;
  shape: ThemeTransitionShape;
  transitionEffect: ThemeTransitionEffect;
  transitionAxis: ThemeTransitionAxis;
  transitionCorner: ThemeTransitionCorner;
  layer: ThemeTransitionLayer;
}) {
  const edge = getNearestViewportEdge(x, y, width, height, transitionAxis);
  const pointX = clamp(x, 0, width);
  const pointY = clamp(y, 0, height);
  let hidden: string;
  let visible: string;

  if (transitionEffect === "wipe") {
    const hiddenInsets: Record<ViewportEdge, string> = {
      top: "inset(0% 0% 100% 0%)",
      right: "inset(0% 0% 0% 100%)",
      bottom: "inset(100% 0% 0% 0%)",
      left: "inset(0% 100% 0% 0%)",
    };

    hidden = hiddenInsets[edge];
    visible = "inset(0% 0% 0% 0%)";
  } else if (transitionEffect === "split") {
    const leftInset = toClipPercentage(pointX, width);
    const rightInset = toClipPercentage(width - pointX, width);
    const topInset = toClipPercentage(pointY, height);
    const bottomInset = toClipPercentage(height - pointY, height);

    hidden =
      edge === "left" || edge === "right"
        ? `inset(0% ${rightInset}% 0% ${leftInset}%)`
        : `inset(${topInset}% 0% ${bottomInset}% 0%)`;
    visible = "inset(0% 0% 0% 0%)";
  } else if (transitionEffect === "diagonal") {
    const corner =
      transitionCorner === "auto"
        ? getNearestViewportCorner(x, y, width, height)
        : transitionCorner;
    const diagonalPaths: Record<
      ViewportCorner,
      { hidden: string; visible: string }
    > = {
      "top-left": {
        hidden: "polygon(0% 0%, 0% 0%, 0% 0%)",
        visible: "polygon(0% 0%, 202% 0%, 0% 202%)",
      },
      "top-right": {
        hidden: "polygon(100% 0%, 100% 0%, 100% 0%)",
        visible: "polygon(100% 0%, -102% 0%, 100% 202%)",
      },
      "bottom-right": {
        hidden: "polygon(100% 100%, 100% 100%, 100% 100%)",
        visible: "polygon(100% 100%, -102% 100%, 100% -102%)",
      },
      "bottom-left": {
        hidden: "polygon(0% 100%, 0% 100%, 0% 100%)",
        visible: "polygon(0% 100%, 0% -102%, 202% 100%)",
      },
    };

    ({ hidden, visible } = diagonalPaths[corner]);
  } else {
    hidden = getClipPathValue({
      x,
      y,
      radiusX: 0,
      radiusY: 0,
      width,
      height,
      shape,
    });
    visible = getClipPathValue({
      x,
      y,
      radiusX,
      radiusY,
      width,
      height,
      shape,
    });
  }

  return layer === "old"
    ? [{ clipPath: visible }, { clipPath: hidden }]
    : [{ clipPath: hidden }, { clipPath: visible }];
}

function getTransitionLayer(
  direction: ThemeTransitionDirection,
  isDark: boolean,
): ThemeTransitionLayer {
  if (direction === "enter") return "new";
  if (direction === "exit") return "old";

  return isDark ? "old" : "new";
}

function syncDocumentThemeClass(
  targetDark: boolean | undefined,
  themeClassName: string | null,
) {
  if (typeof document === "undefined" || typeof targetDark !== "boolean") {
    return;
  }

  if (!themeClassName) return;

  document.documentElement.classList.toggle(themeClassName, targetDark);
}

function commitThemeUpdate({
  updateTheme,
  targetDark,
  themeClassName = "dark",
}: Pick<
  ThemeTransitionOptions,
  "targetDark" | "themeClassName" | "updateTheme"
>) {
  syncDocumentThemeClass(targetDark, themeClassName);
  updateTheme();
}

function createViewTransitionStyle(layer: ThemeTransitionLayer) {
  const style = document.createElement("style");
  style.dataset.qiuyeThemeTransition = "true";
  style.textContent = `
::view-transition-old(root),
::view-transition-group(root),
::view-transition-image-pair(root),
::view-transition-new(root) {
  animation: none !important;
  mix-blend-mode: normal !important;
  backface-visibility: hidden;
}

::view-transition-old(root) {
  z-index: ${layer === "old" ? 2 : 1};
}

::view-transition-new(root) {
  z-index: ${layer === "new" ? 2 : 1};
}

::view-transition-${layer}(root) {
  will-change: clip-path;
}
`;
  document.head.appendChild(style);
  return style;
}

/**
 * runThemeViewTransition — 执行一次主题 View Transition
 *
 * 封装浏览器 View Transition API 的主题切换流程：
 * - 在 update 阶段同步提交主题 DOM 变化
 * - 可提前同步 `html.dark`，避免 next-themes 等异步 effect 在尾帧补切主题
 * - 根据按钮、鼠标事件或坐标计算揭幕中心点
 * - 浅色→深色时扩散 `::view-transition-new(root)`
 * - 深色→浅色时收束 `::view-transition-old(root)`，露出下方新主题
 * - 自动尊重 `prefers-reduced-motion` 并在不支持 API 时降级
 *
 * @example
 * ```tsx
 * await runThemeViewTransition({
 *   isDark,
 *   targetDark: !isDark,
 *   origin: buttonRef,
 *   updateTheme: () => setTheme(isDark ? "light" : "dark"),
 * });
 * ```
 */
export async function runThemeViewTransition({
  updateTheme,
  origin = "center",
  duration = DEFAULT_TRANSITION_DURATION,
  easing = DEFAULT_TRANSITION_EASING,
  timing = "spring",
  transitionEffect = "reveal",
  transitionAxis = "auto",
  transitionCorner = "auto",
  shape = "circle",
  direction = "auto",
  isDark = false,
  targetDark,
  themeClassName = "dark",
  extraRadius = 48,
  respectReducedMotion = true,
  onFallback,
  onFinish,
}: ThemeTransitionOptions) {
  void timing;

  const shouldFallback =
    !isViewTransitionSupported() ||
    (respectReducedMotion && shouldReduceMotion());

  if (shouldFallback) {
    commitThemeUpdate({ updateTheme, targetDark, themeClassName });
    onFallback?.();
    onFinish?.();
    return;
  }

  const { x, y } = getPointFromOrigin(origin);
  const { width, height } = getViewportSize();
  const circleRadius = getCircleCoverRadius(x, y, width, height, extraRadius);
  const { radiusX, radiusY } =
    shape === "ellipse"
      ? getEllipseCoverRadii(x, y, width, height, extraRadius)
      : isPolygonShape(shape)
        ? getPolygonCoverRadii(shape, circleRadius)
        : { radiusX: circleRadius, radiusY: circleRadius };
  const layer = getTransitionLayer(direction, isDark);
  const keyframes = getClipPathKeyframes({
    x,
    y,
    width,
    height,
    radiusX,
    radiusY,
    shape,
    transitionEffect,
    transitionAxis,
    transitionCorner,
    layer,
  });
  const pseudoElement =
    layer === "old"
      ? "::view-transition-old(root)"
      : "::view-transition-new(root)";
  const documentWithTransition = document as DocumentWithViewTransition;

  activeThemeClipPathAnimation?.cancel();
  activeThemeViewTransition?.skipTransition();
  const style = createViewTransitionStyle(layer);
  let clipPathAnimation: Animation | undefined;

  const transition = documentWithTransition.startViewTransition?.(() => {
    flushSync(() => {
      commitThemeUpdate({ updateTheme, targetDark, themeClassName });
    });
  });

  if (!transition) {
    style.remove();
    commitThemeUpdate({ updateTheme, targetDark, themeClassName });
    onFallback?.();
    onFinish?.();
    return;
  }

  activeThemeViewTransition = transition;
  let didRequestFinish = false;
  const finishOnResize = () => {
    if (didRequestFinish) return;
    didRequestFinish = true;
    clipPathAnimation?.cancel();
    transition.skipTransition();
  };
  window.addEventListener("resize", finishOnResize, { once: true });
  window.visualViewport?.addEventListener("resize", finishOnResize, {
    once: true,
  });

  try {
    await transition.ready;

    clipPathAnimation = document.documentElement.animate(keyframes, {
      duration,
      easing,
      fill: "both",
      pseudoElement,
    });
    activeThemeClipPathAnimation = clipPathAnimation;

    await Promise.allSettled([transition.finished, clipPathAnimation.finished]);
  } catch {
    await transition.updateCallbackDone.catch(() => undefined);
  } finally {
    window.removeEventListener("resize", finishOnResize);
    window.visualViewport?.removeEventListener("resize", finishOnResize);
    await waitForNextPaint();
    clipPathAnimation?.cancel();
    style.remove();
    if (activeThemeViewTransition === transition) {
      activeThemeViewTransition = undefined;
    }
    if (activeThemeClipPathAnimation === clipPathAnimation) {
      activeThemeClipPathAnimation = undefined;
    }
    onFinish?.();
  }
}

/**
 * useThemeTransition — 在任意交互控件里复用主题揭幕动画
 *
 * 返回一个稳定的 `run` 函数，可传入鼠标事件、按钮 ref 或坐标作为动画原点。
 *
 * @example
 * ```tsx
 * const { run, isTransitioning } = useThemeTransition({
 *   isDark,
 *   updateTheme: () => setTheme(isDark ? "light" : "dark"),
 * });
 *
 * <button onClick={(event) => run(event)}>切换主题</button>
 * ```
 */
export function useThemeTransition({
  updateTheme,
  origin,
  onFinish,
  duration = DEFAULT_TRANSITION_DURATION,
  easing = DEFAULT_TRANSITION_EASING,
  timing = "spring",
  transitionEffect = "reveal",
  transitionAxis = "auto",
  transitionCorner = "auto",
  shape = "circle",
  direction = "auto",
  isDark = false,
  targetDark,
  themeClassName = "dark",
  extraRadius = 48,
  respectReducedMotion = true,
  onFallback,
}: UseThemeTransitionOptions) {
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const run = React.useCallback(
    async (nextOrigin?: ThemeTransitionOrigin | null) => {
      setIsTransitioning(true);

      await runThemeViewTransition({
        updateTheme,
        origin: nextOrigin ?? origin,
        duration,
        easing,
        timing,
        transitionEffect,
        transitionAxis,
        transitionCorner,
        shape,
        direction,
        isDark,
        targetDark: targetDark ?? !isDark,
        themeClassName,
        extraRadius,
        respectReducedMotion,
        onFallback,
        onFinish: () => {
          setIsTransitioning(false);
          onFinish?.();
        },
      });
    },
    [
      direction,
      duration,
      easing,
      extraRadius,
      isDark,
      onFallback,
      onFinish,
      origin,
      respectReducedMotion,
      shape,
      timing,
      targetDark,
      themeClassName,
      transitionEffect,
      transitionAxis,
      transitionCorner,
      updateTheme,
    ],
  );

  return { run, isTransitioning } as const;
}

/**
 * ThemeTransitionToggle — View Transition 深浅模式切换按钮
 *
 * 提供可直接安装使用的主题按钮：
 * - 用浏览器 View Transition API 做孔径揭幕、边缘扫入、轴线展开或对角揭幕
 * - 复用 DualStateToggle，默认带图标旋转与点击缩放反馈
 * - 默认从按钮中心扩散，支持鼠标点击位置、坐标或居中降级
 * - 暴露 `runThemeViewTransition` 与 `useThemeTransition` 复用能力
 * - 不支持 API 或用户开启减少动态效果时自动切换为无动画更新
 *
 * @example
 * ```tsx
 * const { resolvedTheme, setTheme } = useTheme();
 * const isDark = resolvedTheme === "dark";
 *
 * <ThemeTransitionToggle
 *   isDark={isDark}
 *   onToggle={(nextDark) => setTheme(nextDark ? "dark" : "light")}
 * />
 * ```
 */
export const ThemeTransitionToggle = React.forwardRef<
  HTMLButtonElement,
  ThemeTransitionToggleProps
>(function ThemeTransitionToggle(
  {
    isDark,
    onToggle,
    lightIcon = <SunIcon />,
    darkIcon = <MoonIcon />,
    lightLabel = "切换到深色主题",
    darkLabel = "切换到浅色主题",
    duration = DEFAULT_TRANSITION_DURATION,
    easing = DEFAULT_TRANSITION_EASING,
    timing = "spring",
    transitionEffect = "reveal",
    transitionAxis = "auto",
    transitionCorner = "auto",
    shape = "circle",
    direction = "auto",
    targetDark,
    themeClassName = "dark",
    extraRadius = 48,
    respectReducedMotion = true,
    onFallback,
    onFinish,
    onToggleStart,
    variant = "outline",
    size = "icon",
    buttonShape = "square",
    effect = "rotate",
    transitionDuration = 0.35,
    disabled,
    className,
    onClick,
    type = "button",
    ...buttonProps
  },
  forwardedRef,
) {
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const setRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );

  const handleClick = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;

      const nextDark = !isDark;
      onToggleStart?.(nextDark);
      setIsTransitioning(true);

      await runThemeViewTransition({
        isDark,
        duration,
        easing,
        timing,
        transitionEffect,
        transitionAxis,
        transitionCorner,
        shape,
        direction,
        targetDark: targetDark ?? nextDark,
        themeClassName,
        extraRadius,
        respectReducedMotion,
        onFallback,
        updateTheme: () => onToggle(nextDark),
        origin: buttonRef,
        onFinish: () => {
          setIsTransitioning(false);
          onFinish?.();
        },
      });
    },
    [
      direction,
      duration,
      easing,
      extraRadius,
      isDark,
      onClick,
      onFallback,
      onFinish,
      onToggle,
      onToggleStart,
      respectReducedMotion,
      shape,
      timing,
      targetDark,
      themeClassName,
      transitionEffect,
      transitionAxis,
      transitionCorner,
    ],
  );

  return (
    <DualStateToggle
      ref={setRefs}
      active={isDark}
      onToggle={() => undefined}
      activeIcon={darkIcon}
      inactiveIcon={lightIcon}
      activeLabel={darkLabel}
      inactiveLabel={lightLabel}
      variant={variant}
      size={size}
      shape={buttonShape}
      effect={effect}
      transitionDuration={transitionDuration}
      type={type}
      disabled={disabled || isTransitioning}
      aria-label={isDark ? darkLabel : lightLabel}
      aria-pressed={isDark}
      className={cn("overflow-hidden", className)}
      {...buttonProps}
      onClick={handleClick}
    />
  );
});
