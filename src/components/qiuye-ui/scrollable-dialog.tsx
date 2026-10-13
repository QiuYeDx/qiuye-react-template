"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

/** ScrollableDialog 组件的属性 */
interface ScrollableDialogProps {
  /** 对话框是否打开 */
  open: boolean;
  /** 打开/关闭状态变更回调 */
  onOpenChange: (open: boolean) => void;
  /** 对话框内容（通常为 `ScrollableDialogHeader`、`ScrollableDialogContent`、`ScrollableDialogFooter` 的组合） */
  children?: React.ReactNode;
  /** 内容区域包裹层的自定义 className */
  className?: string;
  /** DialogContent（最外层面板）的自定义 className */
  contentClassName?: string;
  /**
   * 对话框打开时的自动聚焦回调
   *
   * 默认调用 `e.preventDefault()` 阻止自动聚焦行为
   */
  onOpenAutoFocus?: (e: Event) => void;
  /**
   * 对话框面板最大宽度的 Tailwind 类名
   *
   * 如果内容较宽，需手动设置合适的值，例如：
   * - `"sm:max-w-[calc(100%-2rem)]"`
   * - `"sm:max-w-[600px] md:max-w-[728px] lg:max-w-4xl"`
   * @default "sm:max-w-md"
   */
  maxWidth?: string;
}

/** ScrollableDialogHeader 组件的属性 */
interface ScrollableDialogHeaderProps {
  /** 头部内容，通常包含 `DialogTitle` 和 `DialogDescription` */
  children: React.ReactNode;
  /** 头部容器的自定义 className */
  className?: string;
}

/** ScrollableDialogContent 组件的属性 */
interface ScrollableDialogContentProps {
  /** 可滚动区域的内容 */
  children: React.ReactNode;
  /** ScrollArea 容器的自定义 className */
  className?: string;
  /**
   * 是否显示上下渐变遮罩，用于提示用户有更多可滚动内容
   * @default true
   */
  fadeMasks?: boolean;
  /**
   * 渐变遮罩高度（像素）
   * @default 40
   */
  fadeMaskHeight?: number;
  /**
   * 是否启用横向滚动
   *
   * 当内部有大的固定宽度元素时需要开启
   * @default false
   */
  horizontalScroll?: boolean;
}

/** ScrollableDialogFooter 组件的属性 */
interface ScrollableDialogFooterProps {
  /** 底部内容，通常为操作按钮 */
  children: React.ReactNode;
  /** 底部容器的自定义 className */
  className?: string;
}

/**
 * 可滚动对话框容器组件
 *
 * 与 shadcn/ui 原生 Dialog 的区别：
 * - Header 和 Footer 固定在顶部和底部
 * - Content 区域可滚动查看
 * - 支持上下渐变遮罩效果，提示用户有更多内容
 *
 * @note 如果内容很宽, 需要手动设置 maxWidth 为合适的值, 如 "sm:max-w-[calc(100%-2rem)]" "sm:max-w-[600px] md:max-w-[728px] lg:max-w-4xl xl:max-w-5xl"等
 * @example
 * ```tsx
 * <ScrollableDialog open={isOpen} onOpenChange={setIsOpen}>
 *   <ScrollableDialogHeader>
 *     <DialogTitle>标题</DialogTitle>
 *     <DialogDescription>描述</DialogDescription>
 *   </ScrollableDialogHeader>
 *
 *   <ScrollableDialogContent fadeMasks={true} fadeMaskHeight={40}>
 *     // 可滚动的内容
 *   </ScrollableDialogContent>
 *
 *   <ScrollableDialogFooter>
 *     // 固定的底部操作按钮
 *   </ScrollableDialogFooter>
 * </ScrollableDialog>
 * ```
 */
function ScrollableDialog({
  open,
  onOpenChange,
  children,
  className,
  contentClassName,
  onOpenAutoFocus = (e) => e.preventDefault(),
  maxWidth = "sm:max-w-md", 
  // ! 如果内容很宽, 需要手动设置 maxWidth 为合适的值
  // ! 如 "sm:max-w-[calc(100%-2rem)]" "sm:max-w-[600px] md:max-w-[728px] lg:max-w-4xl xl:max-w-5xl"等
}: ScrollableDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 max-h-[85vh] w-[calc(100vw-2rem)] sm:w-full grid grid-rows-[auto_1fr_auto] gap-0 overflow-hidden",
          maxWidth,
          contentClassName
        )}
        onOpenAutoFocus={onOpenAutoFocus}
      >
        <div className={cn("contents", className)}>{children}</div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * ScrollableDialogHeader — 可滚动对话框的固定头部区域
 *
 * 固定在对话框顶部，不随内容滚动。内部使用 shadcn/ui 的 `DialogHeader` 包裹。
 * 通常放置 `DialogTitle` 和 `DialogDescription`。
 */
function ScrollableDialogHeader({
  children,
  className,
}: ScrollableDialogHeaderProps) {
  return (
    <div className={cn("border-b px-4 py-4", className)}>
      <DialogHeader>{children}</DialogHeader>
    </div>
  );
}

/**
 * ScrollableDialogContent — 可滚动对话框的可滚动内容区域
 *
 * 内部使用 shadcn/ui 的 `ScrollArea` 实现滚动，支持上下渐变遮罩效果。
 *
 * @note 如果内容很宽，需要设置 `horizontalScroll={true}` 以启用横向滚动
 */
function ScrollableDialogContent({
  children,
  className,
  fadeMasks = true,
  fadeMaskHeight = 40,
  horizontalScroll = false, // ! 是否启用横向滚动，默认 false, 内部有大的固定宽度元素时需要开启
}: ScrollableDialogContentProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [showTopFade, setShowTopFade] = React.useState(false);
  const [showBottomFade, setShowBottomFade] = React.useState(false);

  // 检查滚动状态，更新遮罩显示
  const checkScrollAffordance = React.useCallback(() => {
    if (!fadeMasks) return;

    const container = containerRef.current;
    if (!container) return;

    // 查找 ScrollArea 内部的 viewport 元素
    const viewport = container.querySelector(
      "[data-slot='scroll-area-viewport']"
    ) as HTMLElement;
    if (!viewport) return;

    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const maxScroll = scrollHeight - clientHeight;

    setShowTopFade(scrollTop > 1);
    setShowBottomFade(maxScroll > 0 && scrollTop < maxScroll - 1);
  }, [fadeMasks]);

  // 监听滚动和尺寸变化
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const viewport = container.querySelector(
      "[data-slot='scroll-area-viewport']"
    ) as HTMLElement;
    if (!viewport) return;

    const onScroll = () => checkScrollAffordance();
    viewport.addEventListener("scroll", onScroll, { passive: true });

    // 初始检查
    checkScrollAffordance();

    // 监听尺寸变化
    const ro = new ResizeObserver(() => {
      checkScrollAffordance();
    });
    ro.observe(viewport);

    return () => {
      viewport.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [checkScrollAffordance]);

  return (
    <ScrollArea
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        "[&_[data-radix-scroll-area-viewport]]:border-t [&_[data-radix-scroll-area-viewport]]:border-b [&_[data-radix-scroll-area-viewport]]:border-background",
        "[&_[data-radix-scroll-area-viewport]>div]:!block [&_[data-radix-scroll-area-viewport]>div]:!min-w-0 [&_[data-radix-scroll-area-viewport]>div]:!w-full",
        className
      )}
    >
      <div
        className={cn(
          "px-4 py-4 w-full min-w-0",
          horizontalScroll ? "min-w-max" : "max-w-full overflow-x-hidden"
        )}
      >
      {/* <div className={cn("px-4 py-4 w-full")}> */}
        {children}
      </div>

      {/* 横向滚动条 */}
      {horizontalScroll && <ScrollBar orientation="horizontal" />}

      {/* 顶部渐变遮罩 */}
      <AnimatePresence>
        {fadeMasks && showTopFade && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-0 z-[5] bg-gradient-to-b from-background to-transparent"
            style={{ height: `${fadeMaskHeight}px` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* 底部渐变遮罩 */}
      <AnimatePresence>
        {fadeMasks && showBottomFade && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 bottom-0 z-[5] bg-gradient-to-t from-background to-transparent"
            style={{ height: `${fadeMaskHeight}px` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </ScrollArea>
  );
}

/**
 * ScrollableDialogFooter — 可滚动对话框的固定底部区域
 *
 * 固定在对话框底部，不随内容滚动。通常放置确认/取消等操作按钮。
 */
function ScrollableDialogFooter({
  children,
  className,
}: ScrollableDialogFooterProps) {
  return <div className={cn("border-t px-4 py-4", className)}>{children}</div>;
}

export {
  ScrollableDialog,
  ScrollableDialogHeader,
  ScrollableDialogContent,
  ScrollableDialogFooter,
  // 重新导出原始 Dialog 的子组件，方便使用
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
