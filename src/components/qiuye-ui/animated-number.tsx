"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  usePresence,
  usePresenceData,
} from "motion/react";
import { cn } from "@/lib/utils";
import { getNumberTokens, type NumberToken } from "@/lib/animated-number";

/** AnimatedNumber 的属性；同时支持原生 span 的属性及 ref。 */
export interface AnimatedNumberProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "children"
> {
  /** 要显示的数字；不在新旧值之间生成中间数值。 */
  value: number;
  /** Intl 格式化语言，显式默认值保证服务端与浏览器一致。 @default "en-US" */
  locales?: string;
  /** Intl 格式化选项；可配置小数、分组、货币或最少整数位。 @default { useGrouping: false } */
  format?: Intl.NumberFormatOptions;
  /** 是否在变化字形上叠加轻微模糊；不影响静止数字。 @default true */
  blur?: boolean;
  /** 单次过渡的秒数；0 表示立即更新。 @default 0.28 */
  duration?: number;
  /** auto 随数值增减决定方向；up/down 可由日期等外部语义统一控制。 @default "auto" */
  direction?: "auto" | "up" | "down";
  /** 是否启用动画；系统减少动态效果偏好始终优先。 @default true */
  animated?: boolean;
  /** 容器类名，字号、颜色与行高均继承调用方。 */
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

// 字形随真实布局横移时保持同一个合成层，避免过渡尾段恢复为 none 后重新栅格化。
const stableGlyphTransform = (_values: unknown, generated: string) =>
  generated === "none" ? "translateZ(0)" : `${generated} translateZ(0)`;

// 用服务端快照保持 hydration 一致，并实时响应系统偏好变化。
function subscribeReducedMotion(notify: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
const getReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerReducedMotion = () => false;

// 同一个字符再次出现也是新的一次入场；每个退出副本独立回收，不等整组动画空闲。
function NumberGlyphs({
  text,
  sign,
  blur,
  duration,
}: {
  text: string;
  sign: number;
  blur: boolean;
  duration: number;
}) {
  const [frames, setFrames] = React.useState({
    revision: 0,
    text,
    items: [{ id: 0, text, enterSign: sign, exitSign: sign }],
  });
  if (frames.text !== text) {
    const revision = frames.revision + 1;
    setFrames({
      revision,
      text,
      items: [
        ...frames.items.map((frame) =>
          frame.id === frames.revision ? { ...frame, exitSign: sign } : frame,
        ),
        { id: revision, text, enterSign: sign, exitSign: sign },
      ],
    });
  }
  const hiddenBlur = blur ? "3px" : "0px";
  return frames.items.map((frame) => {
    const active = frame.id === frames.revision;
    return (
      <motion.span
        key={frame.id}
        data-number-glyph={frame.text}
        data-number-generation={frame.id}
        data-number-active={active ? "true" : "false"}
        transformTemplate={stableGlyphTransform}
        initial={
          frame.id === 0
            ? false
            : {
                y: frame.enterSign * 35 + "%",
                opacity: 0,
                "--number-blur": hiddenBlur,
              }
        }
        animate={{
          y: active ? "0%" : frame.exitSign * -35 + "%",
          opacity: active ? 1 : 0,
          "--number-blur": active ? "0px" : hiddenBlur,
        }}
        transition={{ duration: Math.max(0, duration), ease: EASE }}
        onAnimationComplete={() => {
          if (active) return;
          setFrames((current) => ({
            ...current,
            items: current.items.filter(
              (item) => item.id !== frame.id || item.id === current.revision,
            ),
          }));
        }}
        style={{
          position: "absolute",
          insetInlineStart: 0,
          top: 0,
          whiteSpace: "nowrap",
          width: "max-content",
          filter: blur ? "blur(var(--number-blur, 0px))" : "none",
          willChange: "transform",
        }}
      >
        {frame.text}
      </motion.span>
    );
  });
}

// 数位的真实占位独立管理退出，避免中途反向使嵌套 exit Promise 悬空。
function NumberSlot({
  token,
  width,
  sign,
  blur,
  duration,
}: {
  token: NumberToken;
  width: number | undefined;
  sign: number;
  blur: boolean;
  duration: number;
}) {
  const [present, safeToRemove] = usePresence();
  const presenceSign: number = usePresenceData() ?? sign;
  const transition = { duration: Math.max(0, duration), ease: EASE };
  const hiddenBlur = blur ? "3px" : "0px";
  const filter = blur ? "blur(var(--number-blur, 0px))" : "none";
  return (
    <motion.span
      data-number-slot={token.key}
      initial={{ width: 0 }}
      animate={{ width: present ? (width ?? "auto") : 0 }}
      onAnimationComplete={() => {
        if (!present) safeToRemove?.();
      }}
      transition={transition}
      style={{ position: "relative", display: "inline-block", flexShrink: 0 }}
    >
      {/* 占位层只改宽度；字形在固有宽度层上绘制，避免缩窄的合成层反复栅格化。 */}
      <motion.span
        data-number-face=""
        transformTemplate={stableGlyphTransform}
        initial={{
          opacity: 0,
          y: sign * 35 + "%",
          "--number-blur": hiddenBlur,
        }}
        animate={{
          opacity: present ? 1 : 0,
          y: present ? "0%" : presenceSign * -35 + "%",
          "--number-blur": present ? "0px" : hiddenBlur,
        }}
        transition={transition}
        style={{
          position: "relative",
          display: "block",
          width: "max-content",
          filter,
          willChange: "transform",
        }}
      >
        <span style={{ visibility: "hidden" }}>{token.text}</span>
        {/* 独立 initial 边界：槽位首屏不入场，但之后新增的字形仍要执行 initial。 */}
        <AnimatePresence initial={true}>
          <NumberGlyphs
            text={token.text}
            sign={sign}
            blur={blur}
            duration={duration}
          />
        </AnimatePresence>
      </motion.span>
    </motion.span>
  );
}

/**
 * AnimatedNumber — 逐位数字过渡。
 *
 * - 整数按数位、小数按精度匹配，未变化的字形不参与切换
 * - 变化字形独立位移、淡入淡出，可选轻微模糊
 * - 实测槽宽驱动真实占位，新增/删除数位时相邻文字连续让位
 * - 首屏直接显示最终值，支持快速反向、Intl 格式与减少动态效果
 * - 读屏只读取当前完整数值，不重复读取退出副本，不主动播报高频更新
 *
 * @example
 * ```tsx
 * <AnimatedNumber value={count} />
 * <AnimatedNumber value={price} format={{ style: "currency", currency: "CNY" }} />
 * <AnimatedNumber value={month} blur={false} direction="down" />
 * ```
 */
export const AnimatedNumber = React.forwardRef<
  HTMLSpanElement,
  AnimatedNumberProps
>(function AnimatedNumber(
  {
    value,
    locales = "en-US",
    format,
    blur = true,
    duration = 0.28,
    direction = "auto",
    animated = true,
    className,
    style,
    ...props
  },
  ref,
) {
  const reduce = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );
  const { text, tokens } = getNumberTokens(value, locales, format);
  const [history, setHistory] = React.useState({ value, sign: 1 });
  // 渲染期同步派生方向，避免 effect 晚一帧导致进入/退出方向不一致。
  let sign = history.sign;
  if (!Object.is(history.value, value)) {
    sign = value >= history.value ? 1 : -1;
    setHistory({ value, sign });
  }
  if (direction !== "auto") sign = direction === "up" ? 1 : -1;
  const instant = !animated || reduce || duration <= 0;
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [widths, setWidths] = React.useState<Record<string, number>>({});
  const signature = JSON.stringify(tokens);
  React.useLayoutEffect(() => {
    const row = measureRef.current;
    if (!row) return;
    const measure = () => {
      const next: Record<string, number> = {};
      for (const child of Array.from(row.children)) {
        const key = child.getAttribute("data-number-measure");
        // flex 子项的计算宽度不包含祖先入场/hover 的 transform 缩放。
        if (key) next[key] = parseFloat(getComputedStyle(child).width);
      }
      setWidths((previous) => {
        const keys = Object.keys(next);
        return keys.length === Object.keys(previous).length &&
          keys.every((key) => previous[key] === next[key])
          ? previous
          : next;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, [signature, instant]);

  return (
    <span
      {...props}
      ref={ref}
      data-animated-number=""
      className={cn(
        "relative inline-flex whitespace-nowrap tabular-nums",
        className,
      )}
      style={{
        ...style,
        position: "relative",
        display: "inline-flex",
        whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span className="sr-only">{text}</span>
      <span
        aria-hidden="true"
        ref={measureRef}
        style={{
          position: "absolute",
          display: "inline-flex",
          visibility: "hidden",
          pointerEvents: "none",
          insetInlineStart: 0,
          top: 0,
        }}
      >
        {tokens.map((token) => (
          <span key={token.key} data-number-measure={token.key}>
            {token.text}
          </span>
        ))}
      </span>
      {instant ? (
        <span aria-hidden="true">{text}</span>
      ) : (
        <span
          aria-hidden="true"
          style={{ display: "inline-flex", position: "relative" }}
        >
          <AnimatePresence initial={false} custom={sign}>
            {tokens.map((token) => (
              <NumberSlot
                key={token.key}
                token={token}
                width={widths[token.key]}
                sign={sign}
                blur={blur}
                duration={duration}
              />
            ))}
          </AnimatePresence>
        </span>
      )}
    </span>
  );
});
