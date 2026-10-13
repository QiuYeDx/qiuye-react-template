"use client";

import React, { useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

/** 单个 Tab 选项的配置 */
export interface TabItem {
  /** Tab 的唯一标识值，对应 `ResponsiveTabs` 的 `value` / `onValueChange` */
  value: string;
  /** Tab 显示的文本标签 */
  label: string;
  /** Tab 标签前方的图标（可选） */
  icon?: React.ReactNode;
  /** Tab 标签后方的徽标，传入 `number` 或 `string`（可选） */
  badge?: number | string;
  /** 是否禁用此 Tab */
  disabled?: boolean;
}

/**
 * 布局模式
 * - `"responsive"` — 所有选项始终等宽；空间不足时以最长选项为统一最小宽度并横向滚动
 * - `"scroll"` — 每个选项按自身内容宽度排列并始终支持横向滚动
 * - `"grid"` — 按 `gridColsClass` 配置的列数等分并允许换行
 */
type LayoutMode = "responsive" | "scroll" | "grid";

/**
 * Tab 尺寸
 * - `"default"` — 默认尺寸
 * - `"sm"` — 紧凑小尺寸，适用于工具栏、表单内嵌等场景
 */
type TabSize = "default" | "sm";

/** ResponsiveTabs 组件的属性 */
export interface ResponsiveTabsProps {
  /** 当前激活的 Tab 值 */
  value: string;
  /** Tab 切换时的回调，参数为新激活的 Tab `value` */
  onValueChange: (value: string) => void;
  /** Tab 选项列表 */
  items: TabItem[];
  /** Tab 面板内容（`TabsContent` 区域），不传则不渲染内容区域 */
  children?: React.ReactNode;
  /**
   * 是否在支持 hover 的设备上，在 responsive / scroll 模式发生横向溢出且悬停 Tab 区域时显示左右滚动箭头按钮
   * @default true
   */
  scrollButtons?: boolean;
  /**
   * 点击滚动按钮时每次滚动的步长（像素）
   * @default 220
   */
  scrollStep?: number;
  /**
   * `layout="grid"` 时的网格列数 Tailwind 类名
   * 请提供无断点或自定义断点的类；其他布局模式下忽略
   * @default "sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
   */
  gridColsClass?: string;
  /** TabsList 容器的自定义 className */
  listClassName?: string;
  /** 每个 TabsTrigger 的自定义 className */
  triggerClassName?: string;
  /**
   * 布局模式
   * - `"responsive"` — 所有选项始终等宽；空间不足时以最长选项为统一最小宽度并横向滚动（默认）
   * - `"scroll"` — 每个选项按自身内容宽度排列并始终支持横向滚动
   * - `"grid"` — 按 `gridColsClass` 配置的列数等分并允许换行
   * @default "responsive"
   */
  layout?: LayoutMode;
  /** 根容器的自定义 className */
  className?: string;
  /**
   * 是否在 responsive / scroll 模式发生横向溢出时显示左右渐变遮罩
   * @default true
   */
  fadeMasks?: boolean;
  /**
   * 渐变遮罩宽度（像素）
   * @default 64
   */
  fadeMaskWidth?: number;
  /**
   * 是否启用选中态 layoutId 底色平移过渡动画
   *
   * 开启后，切换 Tab 时选中高亮背景会以弹簧动画从上一个 Tab 滑动到新 Tab，
   * 而非默认的即时切换。
   * @default true
   */
  animatedHighlight?: boolean;
  /**
   * Tab 整体尺寸
   * - `"default"` — 默认尺寸
   * - `"sm"` — 紧凑小尺寸，触发器更小、文字更紧凑，适用于工具栏、表单内嵌等场景
   * @default "default"
   */
  size?: TabSize;
}

/**
 * ResponsiveTabs — 响应式标签页组件
 *
 * 基于 shadcn/ui Tabs 扩展，根据可用空间自动调整布局：
 * - **空间充足**：所有 Tab 在单行内等宽分配，充分利用容器宽度
 * - **空间不足**：以最长 Tab 的文案、图标和徽标所需宽度作为所有选项的统一最小宽度，并横向滚动
 * - **滚动提示**：支持渐变遮罩；仅在支持 hover 的设备上显示左右箭头按钮
 *
 * 支持三种布局模式：`responsive`（统一等宽并在必要时滚动）、`scroll`（按内容宽度滚动）、`grid`（按配置列数等分换行）。
 * 每个 Tab 选项支持图标、徽标、禁用等配置。
 *
 * @example
 * ```tsx
 * const [tab, setTab] = useState("all");
 *
 * <ResponsiveTabs
 *   value={tab}
 *   onValueChange={setTab}
 *   items={[
 *     { value: "all", label: "全部" },
 *     { value: "ui", label: "UI 组件", icon: <LayoutIcon />, badge: 12 },
 *     { value: "hooks", label: "Hooks", disabled: true },
 *   ]}
 * >
 *   <TabsContent value="all">全部内容</TabsContent>
 *   <TabsContent value="ui">UI 组件内容</TabsContent>
 * </ResponsiveTabs>
 * ```
 */
const ResponsiveTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  ResponsiveTabsProps
>(
  (
    {
      value,
      onValueChange,
      items,
      children,
      scrollButtons = true,
      scrollStep = 220,
      gridColsClass = "sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8",
      listClassName,
      triggerClassName,
      layout = "responsive",
      className,
      fadeMasks = true,
      fadeMaskWidth = 64,
      animatedHighlight = true,
      size = "default",
      ...props
    },
    ref,
  ) => {
    // layoutId 动画高亮的唯一前缀（避免多实例冲突）
    const instanceId = React.useId();
    const isSm = size === "sm";

    // 背景容器（不滚）
    const tabsListRef = useRef<HTMLDivElement>(null);
    // 可滚动轨道（只滚内容）
    const scrollerRef = useRef<HTMLDivElement>(null);
    // Tab 行（监听内容尺寸变化）
    const rowRef = useRef<HTMLDivElement>(null);

    const [showLeftButton, setShowLeftButton] = React.useState(false);
    const [showRightButton, setShowRightButton] = React.useState(false);
    const [showLeftFade, setShowLeftFade] = React.useState(false);
    const [showRightFade, setShowRightFade] = React.useState(false);
    const [hasHoverDevice, setHasHoverDevice] = React.useState(false);
    const [isTabAreaHovered, setIsTabAreaHovered] = React.useState(false);

    const isScrollAll = layout === "scroll";
    const isGridAll = layout === "grid";
    const isResponsive = layout === "responsive";
    const scrollBehavior: ScrollBehavior = hasHoverDevice ? "smooth" : "auto";

    // 仅在支持 hover 的设备上显示箭头；触摸设备直接通过手势横向滚动。
    useEffect(() => {
      const mediaQuery = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      );
      const updateHoverCapability = () => setHasHoverDevice(mediaQuery.matches);
      updateHoverCapability();
      if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", updateHoverCapability);
        return () =>
          mediaQuery.removeEventListener("change", updateHoverCapability);
      }

      const legacyMediaQuery = mediaQuery as unknown as {
        addListener: (listener: () => void) => void;
        removeListener: (listener: () => void) => void;
      };
      legacyMediaQuery.addListener(updateHoverCapability);
      return () => legacyMediaQuery.removeListener(updateHoverCapability);
    }, []);

    // 更新滚动按钮和遮罩状态 —— 基于 scrollerRef
    const checkScrollAffordance = React.useCallback(() => {
      const el = scrollerRef.current;
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;

      if (scrollButtons) {
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft + clientWidth < scrollWidth - 1);
      }

      if (fadeMasks && (isScrollAll || isResponsive)) {
        const maxScroll = scrollWidth - clientWidth;
        setShowLeftFade(scrollLeft > 1);
        setShowRightFade(maxScroll > 0 && scrollLeft < maxScroll - 1);
      }
    }, [scrollButtons, fadeMasks, isScrollAll, isResponsive]);

    // 左右滚动
    const scrollByDir = (dir: "left" | "right") => {
      const el = scrollerRef.current;
      if (!el) return;
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      const delta = dir === "left" ? -scrollStep : scrollStep;
      const targetLeft = Math.min(
        maxScroll,
        Math.max(0, el.scrollLeft + delta),
      );
      el.scrollTo({
        left: targetLeft,
        behavior: scrollBehavior,
      });
    };

    // 滚到激活项（只移动 scroller，不动背景）
    const scrollToActiveTab = React.useCallback(
      (behavior: ScrollBehavior = scrollBehavior) => {
        const scroller = scrollerRef.current;
        const list = tabsListRef.current;
        if (!scroller || !list) return;

        const active = list.querySelector<HTMLElement>('[data-state="active"]');
        if (!active) return;

        const cRect = scroller.getBoundingClientRect();
        const aRect = active.getBoundingClientRect();
        const fullyVisible =
          aRect.left >= cRect.left && aRect.right <= cRect.right;

        if (!fullyVisible) {
          const targetLeft =
            active.offsetLeft - (scroller.clientWidth - active.clientWidth) / 2;
          const maxScroll = Math.max(
            0,
            scroller.scrollWidth - scroller.clientWidth,
          );
          scroller.scrollTo({
            left: Math.min(maxScroll, Math.max(0, targetLeft)),
            behavior,
          });
        }
      },
      [scrollBehavior],
    );

    // 监听滚动与尺寸变化
    useEffect(() => {
      const el = scrollerRef.current;
      if (!el) return;

      const onScroll = () => checkScrollAffordance();
      el.addEventListener("scroll", onScroll, { passive: true });
      checkScrollAffordance();

      const ro = new ResizeObserver(() => {
        checkScrollAffordance();
        scrollToActiveTab("auto");
      });
      ro.observe(el);
      if (rowRef.current) ro.observe(rowRef.current);

      const onWinResize = () => {
        checkScrollAffordance();
        scrollToActiveTab("auto");
      };
      window.addEventListener("resize", onWinResize);

      return () => {
        el.removeEventListener("scroll", onScroll);
        ro.disconnect();
        window.removeEventListener("resize", onWinResize);
      };
    }, [checkScrollAffordance, scrollToActiveTab]);

    // 将纵向滚轮转为横向滚（仅 scroll 模式）
    useEffect(() => {
      if (!isScrollAll) return;
      const el = scrollerRef.current;
      if (!el) return;

      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        if (e.ctrlKey) return;

        const hasOverflowX = el.scrollWidth > el.clientWidth;
        if (!hasOverflowX) return;

        const max = el.scrollWidth - el.clientWidth;
        const atStart = el.scrollLeft <= 0;
        const atEnd = el.scrollLeft >= max - 1;

        const goingLeft = e.deltaY < 0;
        const goingRight = e.deltaY > 0;

        if ((goingLeft && !atStart) || (goingRight && !atEnd)) {
          e.preventDefault();
          el.scrollBy({ left: e.deltaY, behavior: "auto" });
          checkScrollAffordance();
        }
      };

      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }, [isScrollAll, checkScrollAffordance]);

    // value 改变时，确保激活项可见
    useEffect(() => {
      if (isGridAll) return;
      scrollToActiveTab(scrollBehavior);
    }, [value, isGridAll, scrollBehavior, scrollToActiveTab]);

    // 类名计算
    // 外层相对定位容器，仅用于放置按钮/遮罩层（不承担滚动）
    const outerRelativeClass = "relative w-full min-w-0";
    const sizeClasses = isSm
      ? {
          listRadiusClass: "rounded-lg",
          listRadius: 10,
          triggerRadius: 8,
          gutter: "p-[3px]",
          gap: "gap-0.5",
        }
      : {
          listRadiusClass: "rounded-xl",
          listRadius: 14,
          triggerRadius: 10,
          gutter: "p-1",
          gap: "gap-1",
        };

    // 背景层保留外部阴影；只有 scroller 裁切滚动内容。
    const listClass = cn(
      // radix-nova 的 TabsList 通过 group-data-horizontal/tabs:h-8 设置高度，需要同一变体才能覆盖
      "relative block h-auto w-full min-w-0 overflow-visible p-0 group-data-horizontal/tabs:h-auto",
      listClassName,
    );

    // scroller：真正滚动的层
    const scrollerClass = cn(
      "w-full [border-radius:inherit] [corner-shape:inherit]",
      sizeClasses.gutter,
      isGridAll ? "overflow-visible" : "overflow-x-auto overflow-y-hidden",
      // 隐藏滚动条
      !isGridAll &&
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
      // 阻断横向滚动链，避免 iOS Safari 将触摸惯性传递给页面
      "overscroll-x-contain",
    );

    // responsive 使用 max-content 计算所有等宽列所需的最小宽度：
    // 放得下时由 min-w-full 撑满并等分，放不下时由 scroller 横向滚动。
    const rowClass = cn(
      isGridAll
        ? cn("grid w-full", sizeClasses.gap)
        : isScrollAll
          ? cn("flex w-max whitespace-nowrap", sizeClasses.gap)
          : cn(
              "grid w-max min-w-full grid-flow-col auto-cols-[minmax(max-content,1fr)] whitespace-nowrap",
              sizeClasses.gap,
            ),
      isGridAll && gridColsClass,
    );

    const triggerClass = cn(
      "h-auto",
      isSm ? "px-2 py-1 text-xs" : "px-3 py-2",
      !animatedHighlight &&
        "data-[state=active]:border-foreground/15 dark:data-[state=active]:border-input",
      isSm &&
        !animatedHighlight &&
        "data-[state=active]:shadow-xs data-[state=active]:shadow-black/10 dark:data-[state=active]:shadow-black/5",
      isScrollAll && "shrink-0 min-w-fit",
      isGridAll && "shrink min-w-0 flex items-center justify-center",
      isResponsive && "min-w-max flex items-center justify-center",
      "data-[state=active]:font-medium",
      // 当启用 layoutId 动画高亮时，取消 trigger 自带的选中态背景/阴影/边框，改由 motion.span 承载
      animatedHighlight &&
        "relative data-[state=active]:bg-transparent data-[state=active]:shadow-none dark:data-[state=active]:bg-transparent dark:data-[state=active]:border-transparent",
      // 覆盖 radix-nova TabsTrigger 通过 group 变体设置的选中态阴影与背景
      animatedHighlight &&
        "group-data-[variant=default]/tabs-list:data-active:shadow-none data-active:bg-transparent dark:data-active:bg-transparent dark:data-active:border-transparent",
      triggerClassName,
    );

    const scrollButtonClass =
      "h-full w-full cursor-pointer border border-foreground/15 bg-background/95 p-0 shadow-xs shadow-black/10 backdrop-blur-sm hover:bg-background dark:border-input dark:bg-muted dark:shadow-black/5 dark:hover:border-foreground/20 dark:hover:bg-accent";

    return (
      <Tabs
        ref={ref}
        value={value}
        onValueChange={onValueChange}
        className={cn("w-full", className)}
        {...props}
      >
        <div
          className={outerRelativeClass}
          onPointerEnter={() => setIsTabAreaHovered(true)}
          onPointerLeave={() => setIsTabAreaHovered(false)}
        >
          {/* 按钮相对背景层定位，四周内缩一致且不随内容滚动。 */}
          <SmoothCorners
            asChild
            radius={sizeClasses.listRadius}
            smoothing={0.7}
          >
            <TabsList ref={tabsListRef} className={listClass}>
              {/* 左侧按钮 */}
              <AnimatePresence>
                {scrollButtons &&
                  !isGridAll &&
                  showLeftButton &&
                  hasHoverDevice &&
                  isTabAreaHovered && (
                    <motion.div
                      className={cn(
                        "absolute inset-y-1 left-1 z-10 flex origin-left",
                        isSm ? "w-6" : "w-8",
                      )}
                      initial={{ opacity: 0, scale: 0, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      <SmoothCorners
                        asChild
                        radius={isSm ? 6 : 8}
                        smoothing={0.7}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className={scrollButtonClass}
                          onClick={() => scrollByDir("left")}
                          aria-label="向左滚动"
                          title="向左滚动"
                        >
                          <ChevronLeft className={isSm ? "size-3" : "size-4"} />
                        </Button>
                      </SmoothCorners>
                    </motion.div>
                  )}
              </AnimatePresence>

              {/* 右侧按钮 */}
              <AnimatePresence>
                {scrollButtons &&
                  !isGridAll &&
                  showRightButton &&
                  hasHoverDevice &&
                  isTabAreaHovered && (
                    <motion.div
                      className={cn(
                        "absolute inset-y-1 right-1 z-10 flex origin-right",
                        isSm ? "w-6" : "w-8",
                      )}
                      initial={{ opacity: 0, scale: 0, x: 10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0, x: 10 }}
                      transition={{ duration: 0.15 }}
                    >
                      <SmoothCorners
                        asChild
                        radius={isSm ? 6 : 8}
                        smoothing={0.7}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className={scrollButtonClass}
                          onClick={() => scrollByDir("right")}
                          aria-label="向右滚动"
                          title="向右滚动"
                        >
                          <ChevronRight
                            className={isSm ? "size-3" : "size-4"}
                          />
                        </Button>
                      </SmoothCorners>
                    </motion.div>
                  )}
              </AnimatePresence>

              {/* 仅 scroller 层滚动 */}
              <div
                ref={scrollerRef}
                className={scrollerClass}
                style={!isGridAll ? { touchAction: "pan-x" } : undefined}
              >
                {/* 真正承载触发器的行 */}
                <div ref={rowRef} className={rowClass}>
                  {items.map((item) => (
                    <SmoothCorners
                      key={item.value}
                      asChild
                      radius={sizeClasses.triggerRadius}
                      smoothing={0.7}
                    >
                      <TabsTrigger
                        value={item.value}
                        disabled={item.disabled}
                        className={triggerClass}
                      >
                        {/* layoutId 动画高亮底色 */}
                        {animatedHighlight && value === item.value && (
                          <SmoothCorners
                            asChild
                            radius={sizeClasses.triggerRadius}
                            smoothing={0.7}
                          >
                            <motion.span
                              layoutId={`${instanceId}-tab-highlight`}
                              className={cn(
                                "absolute inset-0 border border-foreground/15 bg-background dark:border-input dark:bg-input/30",
                                isSm
                                  ? "shadow-xs shadow-black/10 dark:shadow-black/5"
                                  : "shadow-sm",
                              )}
                              transition={{
                                type: "spring",
                                bounce: 0.15,
                                duration: 0.4,
                              }}
                            />
                          </SmoothCorners>
                        )}
                        <span
                          className={cn(
                            "flex items-center max-w-full",
                            isSm ? "gap-1.5" : "gap-2",
                            animatedHighlight && "relative z-[1]",
                          )}
                        >
                          {item.icon && (
                            <span className="shrink-0">{item.icon}</span>
                          )}
                          <span className="truncate">{item.label}</span>
                          {item.badge !== undefined && (
                            <Badge
                              variant="secondary"
                              className={
                                isSm
                                  ? "ml-0.5 h-3.5 min-w-[16px] px-0.5 text-[10px]"
                                  : "ml-1 h-4 min-w-[20px] px-1 text-xs"
                              }
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </span>
                      </TabsTrigger>
                    </SmoothCorners>
                  ))}
                </div>
              </div>

              {/* 渐变遮罩 */}
              <AnimatePresence>
                {fadeMasks && (isScrollAll || isResponsive) && showLeftFade && (
                  <motion.div
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute left-0 top-0 bottom-0 z-[5] bg-gradient-to-r from-muted to-transparent",
                      sizeClasses.listRadiusClass,
                    )}
                    style={{ width: `${fadeMaskWidth}px` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {fadeMasks &&
                  (isScrollAll || isResponsive) &&
                  showRightFade && (
                    <motion.div
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute right-0 top-0 bottom-0 z-[5] bg-gradient-to-l from-muted to-transparent",
                        sizeClasses.listRadiusClass,
                      )}
                      style={{ width: `${fadeMaskWidth}px` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
              </AnimatePresence>
            </TabsList>
          </SmoothCorners>
        </div>

        {children != null && <div className="mt-3">{children}</div>}
      </Tabs>
    );
  },
);

ResponsiveTabs.displayName = "ResponsiveTabs";
export { ResponsiveTabs, TabsContent };
