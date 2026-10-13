"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

/** Typewriter 组件的属性 */
export interface TypewriterProps {
  /**
   * 要打字的文案
   * - 传入 `string`：单次打字
   * - 传入 `string[]`：多文案轮播
   */
  phrases: string | string[];
  /**
   * 打字速度（毫秒/字符）
   * @default 90
   */
  typingSpeed?: number;
  /**
   * 删除速度（毫秒/字符）
   * @default 45
   */
  deletingSpeed?: number;
  /**
   * 打完一段后的停顿时长（毫秒）
   * @default 1800
   */
  pauseDuration?: number;
  /**
   * 删完一段后、开始打下一段之前的停顿时长（毫秒）
   *
   * 值为 `0` 时删除完立即开始打字，视觉上没有"清空后等一下"的节奏感；
   * 推荐 300–800 之间取值。
   * @default 500
   */
  switchInterval?: number;
  /**
   * 是否循环轮播
   * - `true`（默认）：打完最后一段后回到第一段继续
   * - `false`：打完最后一段后停止，光标保持闪烁
   * @default true
   */
  loop?: boolean;
  /**
   * 光标配置
   * - `true`（默认）：显示默认竖线闪烁光标
   * - `false`：隐藏光标
   * - `ReactNode`：渲染自定义光标元素
   * @default true
   */
  cursor?: boolean | React.ReactNode;
  /**
   * 默认光标的自定义类名，可覆盖颜色、宽度等。
   * 仅在 `cursor={true}` 时生效。
   */
  cursorClassName?: string;
  /**
   * 容器宽度弹簧动画配置，
   * 控制容器宽度跟随文本宽度变化时的弹簧物理参数
   * @default \{ stiffness: 300, damping: 30 \}
   */
  springConfig?: { stiffness?: number; damping?: number };
  /** 最外层容器类名 */
  className?: string;
  /** 文本裁剪容器的额外类名 */
  textClassName?: string;
}

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

/**
 * Typewriter — 平滑打字机效果组件
 *
 * 核心特性：
 * - **弹簧宽度跟随**：通过 `useSpring` 驱动容器宽度，将离散的逐字符宽度跳变
 *   平滑化为连续弹簧曲线，外层容器（如胶囊/徽章）跟随逐帧缩放无顿挫
 * - **全文渲染 + 裁剪**：容器内始终渲染完整文案，通过 `overflow: hidden`
 *   + 弹簧宽度实现平滑的"揭开/收回"效果，删除时字符不会凭空闪现消失
 * - **text-left 锚定**：防止父级 `text-center` 继承导致文字居中偏移
 *
 * @example
 * ```tsx
 * // 多文案轮播（默认）
 * <Typewriter phrases={["Hello", "World", "React"]} />
 *
 * // 单文案打字，不循环
 * <Typewriter phrases="Hello World" loop={false} />
 *
 * // 自定义速度与光标颜色
 * <Typewriter
 *   phrases={["Fast typing", "Slow deletion"]}
 *   typingSpeed={50}
 *   deletingSpeed={30}
 *   cursorClassName="bg-blue-500 w-0.5"
 * />
 *
 * // 自定义切换停顿
 * <Typewriter
 *   phrases={["Hello", "World"]}
 *   switchInterval={800}
 * />
 *
 * // 自定义光标元素
 * <Typewriter
 *   phrases={["Custom cursor"]}
 *   cursor={<span className="animate-bounce text-primary">|</span>}
 * />
 * ```
 */
export function Typewriter({
  phrases,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseDuration = 1800,
  switchInterval = 500,
  loop = true,
  cursor = true,
  cursorClassName,
  springConfig,
  className,
  textClassName,
}: TypewriterProps) {
  const phraseList = Array.isArray(phrases) ? phrases : [phrases];
  const safePhrases = phraseList.length > 0 ? phraseList : ["\u00A0"];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const measureRef = useRef<HTMLSpanElement>(null);

  const smoothWidth = useSpring(0, {
    stiffness: springConfig?.stiffness ?? 300,
    damping: springConfig?.damping ?? 30,
  });

  const currentPhrase = safePhrases[phraseIndex] ?? safePhrases[0];

  useEffect(() => {
    if (!displayText) {
      smoothWidth.set(0);
    } else if (measureRef.current) {
      smoothWidth.set(measureRef.current.scrollWidth);
    }
  }, [displayText, smoothWidth]);

  useEffect(() => {
    if (!currentPhrase || isDone) return;

    const isPhraseComplete = displayText === currentPhrase;
    const isPhraseEmpty = displayText.length === 0;
    const isLastPhrase = phraseIndex === safePhrases.length - 1;

    const timeoutId = window.setTimeout(
      () => {
        if (!isDeleting) {
          if (!isPhraseComplete) {
            setDisplayText(currentPhrase.slice(0, displayText.length + 1));
            return;
          }
          if (!loop && isLastPhrase) {
            setIsDone(true);
            return;
          }
          setIsDeleting(true);
          return;
        }

        if (!isPhraseEmpty) {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
          return;
        }

        setIsDeleting(false);
        setPhraseIndex((i) => (i + 1) % safePhrases.length);
      },
      isDeleting
        ? isPhraseEmpty
          ? switchInterval
          : deletingSpeed
        : isPhraseComplete
          ? pauseDuration
          : typingSpeed,
    );

    return () => window.clearTimeout(timeoutId);
  }, [
    currentPhrase,
    deletingSpeed,
    displayText,
    isDone,
    isDeleting,
    loop,
    pauseDuration,
    phraseIndex,
    safePhrases.length,
    switchInterval,
    typingSpeed,
  ]);

  const cursorNode =
    cursor === false ? null : cursor === true ? (
      <span
        className={cn(
          "ml-0.5 shrink-0 inline-block h-[1.1em] w-px animate-pulse bg-current opacity-50",
          cursorClassName,
        )}
      />
    ) : (
      cursor
    );

  return (
    <span className={className}>
      <span className="sr-only">{currentPhrase}</span>
      <span
        className="relative inline-flex items-center whitespace-nowrap"
        aria-hidden="true"
      >
        <span
          ref={measureRef}
          className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap"
        >
          {displayText || "\u00A0"}
        </span>
        <motion.span
          className={cn(
            "inline-block overflow-hidden whitespace-nowrap text-left",
            textClassName,
          )}
          style={{ width: smoothWidth }}
        >
          {currentPhrase}
        </motion.span>
        {cursorNode}
      </span>
    </span>
  );
}
