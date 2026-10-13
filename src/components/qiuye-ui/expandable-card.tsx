"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import {
  animate,
  motion,
  motionValue,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Transition,
} from "motion/react";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";

const SHEET_SPRING = { type: "spring" as const, duration: 0.5, bounce: 0 };
const PRESS_SPRING = { type: "spring" as const, duration: 0.3, bounce: 0.18 };
const SNAP_SPRING = { type: "spring" as const, duration: 0.35, bounce: 0.12 };
const POINTER_SPRING = { stiffness: 240, damping: 28, mass: 0.7 };
const EASE = [0.22, 1, 0.36, 1] as const;
const FOOTER_HEIGHT = 84;

// 卡片与浮层共用同一静止阴影：浮层落地时轮廓与卡片逐值一致。
const REST_SHADOW =
  "0 4px 20px -12px color-mix(in oklab, var(--foreground) 14%, transparent)";
const HOVER_SHADOW =
  "0 24px 48px -28px color-mix(in oklab, var(--foreground) 32%, transparent)";
// 浮层的深阴影放在独立图层上，只动画该层的 opacity：
// 不逐帧改写阴影颜色，也不改写会被整棵子树继承的自定义属性。
const LIFT_SHADOW = "0 40px 100px -40px rgb(0 0 0 / 0.5)";

// 飞行中覆盖 SmoothCorners：普通圆角走合成器的快速裁切路径。
const roundCorners = (radius: number) =>
  ({ borderRadius: radius, cornerShape: "round" }) as React.CSSProperties;

type Phase = "closed" | "opening" | "open" | "closing";
interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/* ------------------------------------------------------------------ */
/* 上下文与视差图层                                                     */
/* ------------------------------------------------------------------ */

/** 封面内部可读取的运行状态 */
export interface ExpandableCardState {
  /** 指针横向位置，归一化到 -1…1；未悬停、触屏或减少动态效果时为 0 */
  x: MotionValue<number>;
  /** 指针纵向位置，归一化到 -1…1 */
  y: MotionValue<number>;
  /** 封面是否应运行循环动画：可见、未被浮层占用、不在展开/收起过程中且允许动态效果 */
  live: boolean;
  /** 当前渲染位置是否为展开中的浮层 */
  expanded: boolean;
}

const STILL = motionValue(0);
const ExpandableCardContext = React.createContext<ExpandableCardState>({
  x: STILL,
  y: STILL,
  live: false,
  expanded: false,
});

/**
 * 读取 ExpandableCard 封面的运行状态。
 *
 * 封面会在卡片和浮层中各渲染一次；循环动画应在 `live` 为 true 时运行，
 * 并尽量由时钟派生，让两份封面显示同一帧。
 *
 * @example
 * ```tsx
 * function Cover() {
 *   const { live } = useExpandableCard();
 *   return <div className={live ? "animate-pulse" : undefined} />;
 * }
 * ```
 */
export function useExpandableCard() {
  return React.useContext(ExpandableCardContext);
}

/** ExpandableCardLayer 的属性 */
export interface ExpandableCardLayerProps {
  /**
   * 指针位于卡片边缘时的最大横向位移（px），纵向为其 0.7 倍。
   * 负值向相反方向移动，可用于远景层。
   * @default 8
   */
  depth?: number;
  /** 图层类名，用于定位、尺寸与外观 */
  className?: string;
  /** 图层样式；`transform` 由组件接管，请勿传入 */
  style?: React.CSSProperties;
  /** 图层内容 */
  children?: React.ReactNode;
}

/**
 * ExpandableCardLayer — 封面中的视差图层
 *
 * - 跟随卡片内的指针产生分层位移，多层共享同一组弹簧坐标
 * - 默认绝对定位、不拦截指针、对读屏隐藏
 * - 铺满封面的背景层建议设置负 inset（如 `-inset-6`），避免位移时露边
 *
 * @example
 * ```tsx
 * <ExpandableCardLayer depth={-4} className="-inset-6 bg-gradient-to-br from-indigo-900 to-fuchsia-900" />
 * <ExpandableCardLayer depth={14} className="right-8 top-10 size-16 rounded-full bg-amber-100" />
 * ```
 */
export function ExpandableCardLayer({
  depth = 8,
  className,
  style,
  children,
}: ExpandableCardLayerProps) {
  const { x, y } = useExpandableCard();
  const offsetX = useTransform(x, (value) => value * depth);
  const offsetY = useTransform(y, (value) => value * depth * 0.7);
  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
      style={{ ...style, x: offsetX, y: offsetY }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* 内部工具                                                             */
/* ------------------------------------------------------------------ */

const clampUnit = (value: number) => Math.max(-1, Math.min(1, value));

// 感应区为静止的卡片本身，只在精细指针、允许动态效果时启用。
function usePointerParallax(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const x = useSpring(0, POINTER_SPRING);
  const y = useSpring(0, POINTER_SPRING);

  React.useEffect(() => {
    const host = ref.current;
    if (!host || !enabled) return;
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const reset = () => {
      x.set(0);
      y.set(0);
    };
    const stop = () => {
      x.jump(0);
      y.jump(0);
    };
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== "mouse") {
        stop();
        return;
      }
      const rect = host.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      x.set(clampUnit(((event.clientX - rect.left) / rect.width) * 2 - 1));
      y.set(clampUnit(((event.clientY - rect.top) / rect.height) * 2 - 1));
    };
    const onVisibility = () => {
      if (document.hidden) stop();
    };
    host.addEventListener("pointerenter", move);
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", reset);
    host.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    window.addEventListener("resize", reset);
    // 捕获阶段同时覆盖横向轮播等嵌套滚动容器。
    window.addEventListener("scroll", reset, true);
    document.addEventListener("visibilitychange", onVisibility);
    media.addEventListener("change", stop);
    return () => {
      host.removeEventListener("pointerenter", move);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", reset);
      host.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("resize", reset);
      window.removeEventListener("scroll", reset, true);
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener("change", stop);
      stop();
    };
  }, [ref, enabled, x, y]);

  return { x, y };
}

function readSheetRect(width: number, height: number, maxWidth: number): Rect {
  const mobile = width < 640;
  const inset = mobile ? 8 : 32;
  const sheetWidth = mobile ? width - inset * 2 : Math.min(maxWidth, width - 48);
  return {
    top: inset,
    left: (width - sheetWidth) / 2,
    width: sheetWidth,
    height: height - inset * 2,
  };
}

// 封面标题字号：与 Surface 中的 `text-[clamp(1.25rem,6.5cqw,1.75rem)]` 一致。
const titleSize = (coverWidth: number, rem: number) =>
  Math.min(1.75 * rem, Math.max(1.25 * rem, coverWidth * 0.065));

const readRem = () =>
  parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

/** 计算浮层封面高度时可用的尺寸信息 */
export interface ExpandableCardCoverContext {
  /** 视口宽度（px） */
  viewportWidth: number;
  /** 视口高度（px） */
  viewportHeight: number;
  /** 浮层宽度（px） */
  sheetWidth: number;
  /** 卡片宽度（px） */
  cardWidth: number;
  /** 卡片中的封面高度（px） */
  cardCoverHeight: number;
}

// 窄屏上浮层只比卡片略宽：按卡片封面比例等比放大，构图不重排，
// 只是整体放大；宽屏浮层远宽于卡片，改用随视口高度变化的固定区间。
function defaultCoverHeight({
  viewportWidth,
  viewportHeight,
  sheetWidth,
  cardWidth,
  cardCoverHeight,
}: ExpandableCardCoverContext) {
  if (viewportWidth < 640 && cardWidth > 0 && cardCoverHeight > 0) {
    const proportional = (cardCoverHeight * sheetWidth) / cardWidth;
    return Math.round(Math.min(proportional, viewportHeight * 0.62));
  }
  return Math.round(Math.min(400, Math.max(240, viewportHeight * 0.42)));
}

// 下拉关闭：位移越大阻力越大，浮层最多缩小到 0.8。
const dragScale = (offset: number) => 1 - (0.2 * offset) / (offset + 200);
const DISMISS_OFFSET = 110;
const DISMISS_VELOCITY = 0.5; // px/ms

function readCard(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const cover = element
    .querySelector("[data-expandable-card-cover]")
    ?.getBoundingClientRect();
  return {
    rect: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    },
    cover: cover?.height ?? Math.max(0, rect.height - FOOTER_HEIGHT),
  };
}

function textOf(node: React.ReactNode) {
  return typeof node === "string" || typeof node === "number"
    ? String(node).replace(/\s*\n\s*/g, " ")
    : undefined;
}

/* ------------------------------------------------------------------ */
/* 卡片与浮层共用的视觉                                                 */
/* ------------------------------------------------------------------ */

interface SurfaceProps {
  cover: React.ReactNode;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  tone: "light" | "dark";
  icon?: React.ReactNode;
  name?: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  /** 卡片与浮层必须一致，否则飞行中会多出或缺少底栏 */
  footer: boolean;
  state: ExpandableCardState;
  /** 仅浮层：按数值动画封面高度；卡片中封面由 flex 撑满 */
  coverHeight?: { from: number; to: number; transition: Transition };
  /**
   * 仅浮层：标题按落点字号排版，用 transform 从卡片字号比例缩放到 1。
   * 卡片中标题字号随封面宽度（cqw）变化；若浮层也这样做，飞行中每帧都要
   * 重新 shaping 标题文本。
   */
  titleScale?: { from: number; to: number; size: number; transition: Transition };
  /** 仅卡片：悬停时封面放大并显示高光 */
  glare?: MotionValue<string>;
}

function Surface({
  cover,
  eyebrow,
  title,
  tone,
  icon,
  name,
  subtitle,
  trailing,
  footer,
  state,
  coverHeight,
  titleScale,
  glare,
}: SurfaceProps) {
  return (
    <ExpandableCardContext.Provider value={state}>
      <div className="flex h-full flex-col">
        <motion.div
          data-expandable-card-cover=""
          className={cn(
            "relative isolate min-h-0 overflow-hidden [container-type:size]",
            coverHeight ? "flex-none" : "flex-1",
          )}
          initial={coverHeight ? { height: coverHeight.from } : false}
          animate={coverHeight ? { height: coverHeight.to } : undefined}
          transition={coverHeight?.transition}
        >
          <motion.div
            className="absolute inset-0"
            variants={glare ? { rest: { scale: 1 }, hover: { scale: 1.03 } } : undefined}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {cover}
          </motion.div>
          {glare && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[2] mix-blend-soft-light"
              variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{ background: glare }}
            />
          )}
          {(eyebrow || title) && (
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 z-[3] px-6 pt-6 pb-12 max-sm:px-5 max-sm:pt-5",
                tone === "light"
                  ? "bg-gradient-to-b from-black/30 to-transparent text-white"
                  : "bg-gradient-to-b from-white/45 to-transparent text-zinc-900",
              )}
            >
              {eyebrow && (
                <p className="text-xs font-semibold tracking-[0.08em] opacity-75">
                  {eyebrow}
                </p>
              )}
              {title && (
                <motion.p
                  className={cn(
                    // 字号随封面宽度（size 容器）变化，窄卡片也保持预期断行。
                    // max-width 以 em 计，任何字号下断行一致，浮层按比例缩放时与卡片对齐。
                    "mt-1.5 max-w-[13em] origin-top-left text-[clamp(1.25rem,6.5cqw,1.75rem)] leading-[1.28] font-bold tracking-[-0.02em] text-balance whitespace-pre-line",
                    tone === "light" && "[text-shadow:0_1px_12px_rgb(0_0_0/0.25)]",
                  )}
                  style={titleScale ? { fontSize: titleScale.size } : undefined}
                  initial={titleScale ? { scale: titleScale.from } : false}
                  animate={titleScale ? { scale: titleScale.to } : undefined}
                  transition={titleScale?.transition}
                >
                  {title}
                </motion.p>
              )}
            </div>
          )}
        </motion.div>

        {footer && (
          <div
            className="flex shrink-0 items-center gap-3.5 border-t border-foreground/[0.06] bg-card px-5 max-sm:gap-3 max-sm:px-4"
            style={{ height: FOOTER_HEIGHT }}
          >
            {icon && (
              <SmoothCorners
                radius={12}
                smoothing={0.6}
                className="size-[52px] shrink-0 overflow-hidden bg-muted ring-1 ring-foreground/10 [&>img]:size-full [&>img]:object-cover [&>svg]:size-full"
              >
                {icon}
              </SmoothCorners>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              {name && (
                <span className="truncate text-[15px] font-semibold tracking-[-0.01em]">
                  {name}
                </span>
              )}
              {subtitle && (
                <span className="truncate text-xs leading-normal text-muted-foreground">
                  {subtitle}
                </span>
              )}
            </div>
            {trailing}
          </div>
        )}
      </div>
    </ExpandableCardContext.Provider>
  );
}

const pillClassName =
  "inline-flex h-8 shrink-0 items-center justify-center rounded-full bg-secondary px-4 text-[13px] font-semibold whitespace-nowrap text-foreground transition-colors duration-200";

/* ------------------------------------------------------------------ */
/* ExpandableCard                                                       */
/* ------------------------------------------------------------------ */

/** ExpandableCard 组件的属性 */
export interface ExpandableCardProps {
  /** 卡片与浮层共用的封面（插画、图片或任意节点）；会渲染两次，应保持确定性 */
  cover: React.ReactNode;
  /** 封面左上角的小标签，如分类 */
  eyebrow?: React.ReactNode;
  /** 封面上的大标题；字符串中的 `\n` 会作为换行 */
  title?: React.ReactNode;
  /**
   * 封面文字配色：`light` 为浅色文字（适合深色封面），`dark` 为深色文字
   * @default "light"
   */
  tone?: "light" | "dark";
  /** 底栏图标；传入 `<img>` 或 `<svg>` 会自动铺满 52px 圆角容器 */
  icon?: React.ReactNode;
  /** 底栏名称 */
  name?: React.ReactNode;
  /** 底栏副标题，单行截断 */
  subtitle?: React.ReactNode;
  /**
   * 卡片态底栏右侧的胶囊文字；传入 `null` 隐藏
   * @default "查看"
   */
  actionLabel?: React.ReactNode;
  /** 展开后替换胶囊的操作区，如下载、访问官网按钮 */
  actions?: React.ReactNode;
  /** 展开后显示在底栏下方的正文 */
  children?: React.ReactNode;
  /** 卡片按钮与对话框的无障碍名称；默认取 `name` 或 `title` 中的文字 */
  label?: string;
  /** 受控模式下的展开状态 */
  open?: boolean;
  /**
   * 非受控模式下的初始展开状态；为 true 时挂载后从卡片位置展开
   * @default false
   */
  defaultOpen?: boolean;
  /** 展开状态变化回调（点击卡片、Esc、遮罩、关闭按钮、触屏下拉关闭） */
  onOpenChange?: (open: boolean) => void;
  /**
   * 是否启用卡片内的指针视差与高光
   * @default true
   */
  parallax?: boolean;
  /**
   * 浮层最大宽度（px）；视口宽度小于 640px 时四边各留 8px
   * @default 760
   */
  maxWidth?: number;
  /**
   * 浮层中的封面高度
   * - 传入 `number` 时单位为 px
   * - 传入函数时接收视口与卡片尺寸，返回 px
   * @default 视口宽度小于 640px 时按卡片封面比例等比放大（不超过视口高度的 62%），否则为 clamp(240, vh * 0.42, 400)
   */
  expandedCoverHeight?:
    | number
    | ((context: ExpandableCardCoverContext) => number);
  /**
   * 卡片与浮层的圆角半径（px），使用平滑圆角
   * @default 28
   */
  radius?: number;
  /**
   * 关闭按钮的无障碍名称
   * @default "关闭"
   */
  closeLabel?: string;
  /** 卡片类名；卡片高度由调用方决定，默认 `h-[28rem]` */
  className?: string;
  /** 浮层类名 */
  sheetClassName?: string;
  /** 正文容器类名 */
  contentClassName?: string;
}

/**
 * ExpandableCard — App Store 风格的展开卡片
 *
 * - 卡片点击后从原位置连续放大为居中详情浮层，关闭时飞回原卡片
 * - 按数值动画几何而非缩放，文字与圆角在过渡中不变形
 * - 悬停上浮、封面分层视差与高光，按压缩小反馈
 * - 叠加滚动条不占宽度，展开前后内容不重排；阴影在落地时无缝交接
 * - 飞行中只做合成器友好的工作：普通圆角裁切、深阴影按落点尺寸栅格化一次后缩放、
 *   标题用 transform 缩放
 * - 触屏上内容滚动到顶部后继续下拉，浮层随手指缩小，松手超过阈值即收起
 * - 基于 Radix Dialog：焦点陷阱、Esc / 遮罩关闭、焦点还原；支持受控模式与减少动态效果
 *
 * @example
 * ```tsx
 * <ExpandableCard
 *   cover={<div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-fuchsia-800" />}
 *   eyebrow="桌面应用"
 *   title={"后台在播放，\n字幕留在游戏画面上"}
 *   icon={<img src="/icon.png" alt="" />}
 *   name="PotSubOverlay"
 *   subtitle="透明 · 置顶 · 鼠标穿透"
 *   actions={<Button size="sm" className="rounded-full">下载</Button>}
 * >
 *   <p>展开后的详细介绍……</p>
 * </ExpandableCard>
 * ```
 */
export function ExpandableCard({
  cover,
  eyebrow,
  title,
  tone = "light",
  icon,
  name,
  subtitle,
  actionLabel = "查看",
  actions,
  children,
  label,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  parallax = true,
  maxWidth = 760,
  expandedCoverHeight = defaultCoverHeight,
  radius = 28,
  closeLabel = "关闭",
  className,
  sheetClassName,
  contentClassName,
}: ExpandableCardProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const cardRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const controlled = openProp !== undefined;
  const requestedOpen = controlled ? openProp : uncontrolledOpen;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!controlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  const [phase, setPhase] = React.useState<Phase>("closed");
  const [origin, setOrigin] = React.useState<{ rect: Rect; cover: number }>({
    rect: { top: 0, left: 0, width: 0, height: 0 },
    cover: 0,
  });
  const [viewport, setViewport] = React.useState({
    width: 1280,
    height: 800,
    rem: 16,
  });

  // 深阴影层按落点尺寸绘制一次，飞行中只随面板当前尺寸缩放（见渲染处注释）。
  const liftScaleX = useMotionValue(1);
  const liftScaleY = useMotionValue(1);

  // 打开 / 关闭都以卡片当前位置为起点或落点；收起时重新测量。
  React.useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (requestedOpen && (phase === "closed" || phase === "closing")) {
      const measured = readCard(card);
      if (!reduceMotion) {
        const landing = readSheetRect(window.innerWidth, window.innerHeight, maxWidth);
        liftScaleX.jump(measured.rect.width / landing.width);
        liftScaleY.jump(measured.rect.height / landing.height);
      }
      setViewport({ width: window.innerWidth, height: window.innerHeight, rem: readRem() });
      setOrigin(measured);
      setPhase("opening");
    } else if (!requestedOpen && (phase === "opening" || phase === "open")) {
      setOrigin(readCard(card));
      setPhase("closing");
      const scroller = scrollRef.current;
      if (scroller && scroller.scrollTop > 0) {
        animate(scroller.scrollTop, 0, {
          duration: reduceMotion ? 0 : 0.32,
          ease: EASE,
          onUpdate: (value) => {
            scroller.scrollTop = value;
          },
        });
      }
    }
    // 只响应展开请求的变化；phase 由动画完成回调推进。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedOpen]);

  // 正文按落点宽度排版，需扣除面板左右边框（可能被 sheetClassName 改写）。
  const [frameX, setFrameX] = React.useState(2);
  const mounted = phase !== "closed";
  React.useLayoutEffect(() => {
    const panel = panelRef.current;
    if (panel) setFrameX(panel.offsetWidth - panel.clientWidth);
  }, [mounted]);

  React.useEffect(() => {
    if (phase === "closed") return;
    const onResize = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight, rem: readRem() });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [phase]);

  // 下拉关闭：内容滚动到顶部时继续下拉，浮层随手指缩小；
  // 松手时超过阈值（或快速下滑）则收起，否则弹回。
  const drag = useMotionValue(0);
  const sheetScale = useTransform(drag, dragScale);
  const sheetY = useTransform(drag, (offset) => offset * 0.12);
  const setOpenRef = React.useRef(setOpen);
  setOpenRef.current = setOpen;

  React.useEffect(() => {
    const scroller = scrollRef.current;
    if (phase !== "open" || !scroller) return;
    let startX = 0;
    let startY = 0;
    let tracking = false;
    let dragging = false;
    let lastY = 0;
    let lastTime = 0;
    let velocity = 0;

    const onStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        tracking = false;
        return;
      }
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      tracking = scroller.scrollTop <= 0;
      dragging = false;
    };
    const onMove = (event: TouchEvent) => {
      if (!tracking) return;
      const touch = event.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (!dragging) {
        // 只接管从顶部开始、以纵向下拉为主的手势；其余交给原生滚动。
        if (Math.abs(dx) > Math.abs(dy) || dy < 0 || scroller.scrollTop > 0) {
          if (Math.abs(dx) + Math.abs(dy) > 6) tracking = false;
          return;
        }
        if (dy < 6) return;
        dragging = true;
        startY = touch.clientY;
        lastY = touch.clientY;
        lastTime = event.timeStamp;
        velocity = 0;
      }
      event.preventDefault();
      const elapsed = event.timeStamp - lastTime;
      if (elapsed > 0) velocity = (touch.clientY - lastY) / elapsed;
      lastY = touch.clientY;
      lastTime = event.timeStamp;
      drag.set(Math.max(0, touch.clientY - startY));
    };
    const onEnd = () => {
      if (!dragging) {
        tracking = false;
        return;
      }
      tracking = false;
      dragging = false;
      const offset = drag.get();
      if (
        offset > DISMISS_OFFSET ||
        (velocity > DISMISS_VELOCITY && offset > 24)
      ) {
        // 缩放随收起飞行同步回到 1，视觉尺寸连续落回卡片。
        animate(drag, 0, SHEET_SPRING);
        setOpenRef.current(false);
      } else {
        animate(drag, 0, SNAP_SPRING);
      }
    };

    scroller.addEventListener("touchstart", onStart, { passive: true });
    scroller.addEventListener("touchmove", onMove, { passive: false });
    scroller.addEventListener("touchend", onEnd);
    scroller.addEventListener("touchcancel", onEnd);
    return () => {
      scroller.removeEventListener("touchstart", onStart);
      scroller.removeEventListener("touchmove", onMove);
      scroller.removeEventListener("touchend", onEnd);
      scroller.removeEventListener("touchcancel", onEnd);
    };
  }, [phase, drag]);

  React.useEffect(() => {
    if (phase === "closed") drag.jump(0);
  }, [phase, drag]);

  const settle = () => {
    setPhase((current) =>
      current === "opening" ? "open" : current === "closing" ? "closed" : current,
    );
  };

  const active = phase !== "closed";
  const expanded = phase === "opening" || phase === "open";
  const flying = !reduceMotion && (phase === "opening" || phase === "closing");
  const target = readSheetRect(viewport.width, viewport.height, maxWidth);
  const targetCover =
    typeof expandedCoverHeight === "function"
      ? expandedCoverHeight({
          viewportWidth: viewport.width,
          viewportHeight: viewport.height,
          sheetWidth: target.width,
          cardWidth: origin.rect.width,
          cardCoverHeight: origin.cover,
        })
      : expandedCoverHeight;
  // 浮层标题按落点字号排版，起飞 / 落回时按卡片字号的比例缩放。
  const targetTitle = titleSize(target.width, viewport.rem);
  const titleRatio =
    origin.rect.width > 0 ? titleSize(origin.rect.width, viewport.rem) / targetTitle : 1;
  const sheetTransition: Transition = reduceMotion
    ? { duration: 0.2 }
    : SHEET_SPRING;
  const accessibleName =
    label ?? textOf(name) ?? textOf(title) ?? textOf(eyebrow) ?? "卡片详情";

  // 卡片：视差、高光与可见性
  const { x, y } = usePointerParallax(cardRef, parallax && !reduceMotion);
  const inView = useInView(cardRef, { margin: "120px 0px" });
  const glareX = useTransform(x, (value) => 50 + value * 40);
  const glareY = useTransform(y, (value) => 50 + value * 40);
  const glare = useMotionTemplate`radial-gradient(60% 60% at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.14), transparent 70%)`;
  // 上下文对象保持引用稳定：否则每次相位变化都会重渲染封面里的全部图层。
  const cardLive = inView && !reduceMotion && !active;
  const cardState = React.useMemo<ExpandableCardState>(
    () => ({ x, y, live: cardLive, expanded: false }),
    [x, y, cardLive],
  );
  // 飞行中封面逐帧变化尺寸，循环动画等落地后再运行。
  const sheetLive = !reduceMotion && phase === "open";
  const sheetState = React.useMemo<ExpandableCardState>(
    () => ({ x: STILL, y: STILL, live: sheetLive, expanded: true }),
    [sheetLive],
  );

  const surface = {
    cover,
    eyebrow,
    title,
    tone,
    icon,
    name,
    subtitle,
    footer: Boolean(icon || name || subtitle || actionLabel != null || actions),
  };

  return (
    <>
      <SmoothCorners asChild radius={radius} smoothing={0.6}>
        <motion.button
          ref={cardRef}
          type="button"
          data-expandable-card=""
          data-state={active ? "open" : "closed"}
          aria-haspopup="dialog"
          aria-expanded={active}
          aria-label={accessibleName}
          onClick={() => setOpen(true)}
          initial={false}
          animate="rest"
          whileHover={reduceMotion ? undefined : "hover"}
          whileTap={reduceMotion ? undefined : "press"}
          variants={{
            rest: { y: 0, scale: 1 },
            hover: { y: -4 },
            press: { scale: 0.97 },
          }}
          transition={PRESS_SPRING}
          className={cn(
            "group relative isolate block h-[28rem] w-full cursor-pointer overflow-hidden border bg-card p-0 text-start text-card-foreground outline-none [-webkit-tap-highlight-color:transparent]",
            "[--ec-card-shadow:var(--ec-rest-shadow)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "[transition:border-color_250ms_ease-out,box-shadow_250ms_ease-out] hover:border-foreground/15 hover:[--ec-card-shadow:var(--ec-hover-shadow)]",
            className,
          )}
          style={
            {
              "--ec-rest-shadow": REST_SHADOW,
              "--ec-hover-shadow": HOVER_SHADOW,
              boxShadow: "var(--ec-card-shadow)",
              // 浮层接管视觉时卡片保留占位、焦点还原锚点与布局。
              opacity: active ? 0 : 1,
            } as React.CSSProperties
          }
        >
          <Surface
            {...surface}
            state={cardState}
            glare={parallax && !reduceMotion ? glare : undefined}
            trailing={
              actionLabel != null ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    pillClassName,
                    "group-hover:bg-foreground group-hover:text-background",
                  )}
                >
                  {actionLabel}
                </span>
              ) : undefined
            }
          />
        </motion.button>
      </SmoothCorners>

      <DialogPrimitive.Root
        open={active}
        onOpenChange={(next) => {
          if (!next) setOpen(false);
        }}
      >
        {active && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay forceMount asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[10px] backdrop-saturate-[1.1] dark:bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: expanded ? 1 : 0 }}
                transition={{
                  duration: expanded ? 0.32 : 0.22,
                  delay: expanded ? 0.06 : 0,
                  ease: EASE,
                }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              forceMount
              asChild
              aria-describedby={undefined}
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                (event.currentTarget as HTMLElement | null)?.focus({
                  preventScroll: true,
                });
              }}
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                cardRef.current?.focus({ preventScroll: true });
              }}
            >
              <motion.div
                data-expandable-card-sheet=""
                data-phase={phase}
                tabIndex={-1}
                className="fixed z-50 outline-none"
                style={{ scale: sheetScale, y: sheetY }}
                initial={
                  reduceMotion
                    ? { ...target, opacity: 0 }
                    : { ...origin.rect, opacity: 1 }
                }
                animate={
                  reduceMotion
                    ? { ...target, opacity: expanded ? 1 : 0 }
                    : { ...(expanded ? target : origin.rect), opacity: 1 }
                }
                transition={sheetTransition}
                onUpdate={(latest) => {
                  const width = parseFloat(String(latest.width));
                  const height = parseFloat(String(latest.height));
                  if (width > 0) liftScaleX.set(width / target.width);
                  if (height > 0) liftScaleY.set(height / target.height);
                }}
                onAnimationComplete={settle}
              >
                <SmoothCorners asChild radius={radius} smoothing={0.6}>
                  <motion.div
                    aria-hidden="true"
                    // 深阴影按落点尺寸绘制一次，飞行中只按面板当前尺寸做 transform 缩放：
                    // 大半径模糊不再逐帧重新栅格化，柔和阴影被非等比拉伸也看不出来。
                    className="pointer-events-none absolute top-0 left-0 origin-top-left will-change-transform"
                    style={{
                      width: target.width,
                      height: target.height,
                      boxShadow: LIFT_SHADOW,
                      scaleX: liftScaleX,
                      scaleY: liftScaleY,
                    }}
                    initial={{ opacity: reduceMotion ? 1 : 0 }}
                    animate={{ opacity: expanded || reduceMotion ? 1 : 0 }}
                    // 比几何动画更早归零，落地时只剩与卡片相同的静止阴影。
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: expanded ? 0.45 : 0.32, ease: EASE }
                    }
                  />
                </SmoothCorners>
                <SmoothCorners asChild radius={radius} smoothing={0.6}>
                  <div
                    ref={panelRef}
                    className={cn(
                      "absolute inset-0 overflow-hidden border bg-card text-card-foreground",
                      sheetClassName,
                    )}
                    // 飞行中用普通圆角：合成器可直接裁切圆角矩形；超椭圆圆角会让面板内
                    // 正在动画的图层每帧重新生成遮罩。落地后换回平滑圆角。
                    style={{
                      boxShadow: REST_SHADOW,
                      ...(flying ? roundCorners(radius) : undefined),
                    }}
                  >
                    <DialogPrimitive.Title className="sr-only">
                      {accessibleName}
                    </DialogPrimitive.Title>
                    {/* Radix 给 Root 写了内联 position: relative，绝对定位需通过 style 覆盖。 */}
                    <ScrollAreaPrimitive.Root
                      type="scroll"
                      data-lenis-prevent=""
                      style={{ position: "absolute", inset: 0 }}
                    >
                      <ScrollAreaPrimitive.Viewport
                        ref={scrollRef}
                        // 内容包裹层默认 display: table，会被横向滚动的子元素撑宽。
                        className="size-full overscroll-contain [&>div]:!block"
                        // 飞行期间禁止滚动；原生滚动条已隐藏，开关滚动不改变宽度。
                        style={
                          phase === "open"
                            ? undefined
                            : { overflowX: "hidden", overflowY: "hidden" }
                        }
                      >
                        <Surface
                          {...surface}
                          state={sheetState}
                          coverHeight={{
                            from: reduceMotion ? targetCover : origin.cover,
                            to: expanded || reduceMotion ? targetCover : origin.cover,
                            transition: sheetTransition,
                          }}
                          titleScale={{
                            from: reduceMotion ? 1 : titleRatio,
                            to: expanded || reduceMotion ? 1 : titleRatio,
                            size: targetTitle,
                            transition: sheetTransition,
                          }}
                          trailing={
                            // 胶囊与操作区叠在同一格中交叉淡入淡出。透明度 < 1 会建立层叠上下文，
                            // 隐藏的胶囊会盖在操作区上方吞掉点击：胶囊不接收指针，操作区置于上层。
                            <span className="grid shrink-0 justify-items-end [&>*]:[grid-area:1/1]">
                              {actionLabel != null && (
                                <motion.span
                                  aria-hidden="true"
                                  className={cn(pillClassName, "pointer-events-none")}
                                  initial={false}
                                  animate={{ opacity: expanded ? 0 : 1 }}
                                  transition={{
                                    duration: expanded ? 0.12 : 0.2,
                                    ease: EASE,
                                  }}
                                >
                                  {actionLabel}
                                </motion.span>
                              )}
                              {actions && (
                                <motion.span
                                  inert={!expanded}
                                  className="relative z-[1] flex items-center gap-2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: expanded ? 1 : 0 }}
                                  transition={{
                                    duration: expanded ? 0.24 : 0.12,
                                    delay: expanded ? 0.12 : 0,
                                    ease: EASE,
                                  }}
                                >
                                  {actions}
                                </motion.span>
                              )}
                            </span>
                          }
                        />
                        <motion.div
                          inert={phase !== "open"}
                          className={cn("px-7 pt-2 pb-10 max-sm:px-5 max-sm:pb-8", contentClassName)}
                          // 始终按落点宽度排版：飞行中长文本不随面板宽度逐帧重排，
                          // 超出部分由面板裁切，随展开逐渐露出。
                          style={{ width: target.width - frameX }}
                          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                          animate={
                            expanded
                              ? { opacity: 1, y: 0, visibility: "visible" }
                              : {
                                  opacity: 0,
                                  y: reduceMotion ? 0 : 8,
                                  // 淡出后不再参与绘制。
                                  transitionEnd: { visibility: "hidden" },
                                }
                          }
                          transition={{
                            duration: expanded ? 0.4 : 0.14,
                            delay: expanded && !reduceMotion ? 0.14 : 0,
                            ease: EASE,
                          }}
                        >
                          {children}
                        </motion.div>
                      </ScrollAreaPrimitive.Viewport>
                      <ScrollAreaPrimitive.Scrollbar
                        orientation="vertical"
                        className="z-10 flex w-2.5 touch-none px-px py-[18px] select-none"
                      >
                        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-foreground/40 ring-1 ring-background/45" />
                      </ScrollAreaPrimitive.Scrollbar>
                    </ScrollAreaPrimitive.Root>

                    <DialogPrimitive.Close asChild>
                      <motion.button
                        type="button"
                        aria-label={closeLabel}
                        className="absolute top-4 right-4 z-20 grid size-8 cursor-pointer place-items-center rounded-full border border-white/20 bg-zinc-900/55 text-zinc-100 backdrop-blur-md transition-colors hover:bg-zinc-900/75 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={
                          expanded
                            ? { opacity: 1, scale: 1 }
                            : { opacity: 0, scale: 0.8 }
                        }
                        transition={{
                          duration: expanded ? 0.24 : 0.12,
                          delay: expanded ? 0.18 : 0,
                          ease: EASE,
                        }}
                      >
                        <XIcon className="size-4" aria-hidden="true" />
                      </motion.button>
                    </DialogPrimitive.Close>
                  </div>
                </SmoothCorners>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </DialogPrimitive.Root>
    </>
  );
}
