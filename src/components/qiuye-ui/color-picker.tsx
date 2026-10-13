"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────── */
/*  颜色转换工具                                                   */
/* ────────────────────────────────────────────────────────────── */

interface HSV {
  h: number;
  s: number;
  v: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clampPercent(value: number): number {
  return Math.round(clamp(value, 0, 100));
}

function clampHue(value: number): number {
  return clamp(Math.round(value), 0, 360);
}

function clampAlpha(value: number): number {
  return Math.round(clamp(value, 0, 100));
}

function alphaToHex(alpha: number): string {
  const byte = Math.round((clamp(alpha, 0, 100) / 100) * 255);
  return byte.toString(16).padStart(2, "0").toUpperCase();
}

function hueForRgb(value: number): number {
  const hue = clampHue(value);
  return hue === 360 ? 0 : hue;
}

function sanitizeHsv(hsv: HSV): HSV {
  return {
    h: clampHue(hsv.h),
    s: clampPercent(hsv.s),
    v: clampPercent(hsv.v),
  };
}

function preserveHueForAchromatic(next: HSV, fallbackHue: number): HSV {
  const sanitized = sanitizeHsv(next);
  if (sanitized.s === 0 || sanitized.v === 0) {
    return { ...sanitized, h: clampHue(fallbackHue) };
  }
  return sanitized;
}

function getPaintRect(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const styles = window.getComputedStyle(el);
  const borderLeft = parseFloat(styles.borderLeftWidth) || 0;
  const borderRight = parseFloat(styles.borderRightWidth) || 0;
  const borderTop = parseFloat(styles.borderTopWidth) || 0;
  const borderBottom = parseFloat(styles.borderBottomWidth) || 0;
  const width = rect.width - borderLeft - borderRight;
  const height = rect.height - borderTop - borderBottom;

  if (width <= 0 || height <= 0) return null;

  return {
    left: rect.left + borderLeft,
    top: rect.top + borderTop,
    width,
    height,
  };
}

function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    switch (max) {
      case r:
        h = ((g - b) / delta) % 6;
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  const roundedHue = Math.round(h);
  return {
    h: roundedHue === 360 ? 0 : roundedHue,
    s: max === 0 ? 0 : Math.round((delta / max) * 100),
    v: Math.round(max * 100),
  };
}

function hsvToRgb(
  h: number,
  s: number,
  v: number,
): { r: number; g: number; b: number } {
  s = clamp(s, 0, 100) / 100;
  v = clamp(v, 0, 100) / 100;
  h = hueForRgb(h) / 60;
  const c = v * s;
  const x = c * (1 - Math.abs((h % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h >= 0 && h < 1) {
    r = c;
    g = x;
  } else if (h < 2) {
    r = x;
    g = c;
  } else if (h < 3) {
    g = c;
    b = x;
  } else if (h < 4) {
    g = x;
    b = c;
  } else if (h < 5) {
    r = x;
    b = c;
  } else if (h < 6) {
    r = c;
    b = x;
  }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})(?:[a-f\d]{2})?$/i.exec(hex);
  return m
    ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function hexToHsv(hex: string): HSV | null {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsv(rgb.r, rgb.g, rgb.b) : null;
}

function hsvToHex(h: number, s: number, v: number): string {
  const { r, g, b } = hsvToRgb(h, s, v);
  return rgbToHex(r, g, b);
}

function hexToRgbaString(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha / 100})`;
}

/**
 * 校验并规范化十六进制颜色字符串（始终输出 6 位 `#RRGGBB`）
 * - 支持 3 位简写（`#RGB` → `#RRGGBB`）
 * - 支持 4 位简写（`#RGBA` → 取前 3 位展开）
 * - 支持 8 位（`#RRGGBBAA` → 截取前 6 位）
 * - 校验失败时回退到 fallback
 */
function normalizeHex(raw: string, fallback: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return fallback;
  let hex = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
    const [r, g, b] = hex.slice(1);
    hex = `#${r}${r}${g}${g}${b}${b}`;
  }
  if (/^#[0-9A-Fa-f]{4}$/.test(hex)) {
    const [r, g, b] = hex.slice(1);
    hex = `#${r}${r}${g}${g}${b}${b}`;
  }
  if (/^#[0-9A-Fa-f]{8}$/.test(hex)) {
    hex = hex.slice(0, 7);
  }
  return /^#[0-9A-Fa-f]{6}$/.test(hex) ? hex.toUpperCase() : fallback;
}

/**
 * 从任意格式的 hex 字符串解析出 6 位颜色和 alpha（0-100）
 * - 支持 `#RGB` / `#RGBA` / `#RRGGBB` / `#RRGGBBAA`
 */
function parseHexColor(
  raw: string,
  fallback: string,
): { hex6: string; alpha: number } {
  const trimmed = raw.trim();
  if (!trimmed) return { hex6: fallback, alpha: 100 };
  const prefixed = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

  if (/^#[0-9A-Fa-f]{4}$/.test(prefixed)) {
    const [r, g, b, a] = prefixed.slice(1);
    return {
      hex6: `#${r}${r}${g}${g}${b}${b}`.toUpperCase(),
      alpha: clampAlpha(Math.round((parseInt(`${a}${a}`, 16) / 255) * 100)),
    };
  }

  const m8 = /^#([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})$/.exec(prefixed);
  if (m8) {
    return {
      hex6: `#${m8[1]}`.toUpperCase(),
      alpha: clampAlpha(Math.round((parseInt(m8[2], 16) / 255) * 100)),
    };
  }

  return { hex6: normalizeHex(prefixed, fallback), alpha: 100 };
}

function buildHexWithAlpha(hex6: string, alpha: number): string {
  return `${hex6}${alphaToHex(alpha)}`;
}

/* ────────────────────────────────────────────────────────────── */
/*  默认预设色卡                                                   */
/* ────────────────────────────────────────────────────────────── */

const DEFAULT_PRESET_COLORS = [
  // 灰度
  "#000000", "#434343", "#666666", "#999999",
  "#B7B7B7", "#CCCCCC", "#D9D9D9", "#FFFFFF",
  // 饱和色
  "#FF0000", "#FF9900", "#FFFF00", "#00FF00",
  "#00FFFF", "#0000FF", "#9900FF", "#FF00FF",
  // 浅色
  "#F4CCCC", "#FCE5CD", "#FFF2CC", "#D9EAD3",
  "#D0E0E3", "#CFE2F3", "#D9D2E9", "#EAD1DC",
  // 中等色
  "#E06666", "#F6B26B", "#FFD966", "#93C47D",
  "#76A5AF", "#6FA8DC", "#8E7CC3", "#C27BA0",
  // 深色
  "#CC0000", "#E69138", "#F1C232", "#6AA84F",
  "#45818E", "#3D85C6", "#674EA7", "#A64D79",
];

const CHECKERBOARD_STYLE: React.CSSProperties = {
  backgroundColor: "#fff",
  backgroundImage:
    "linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%), linear-gradient(45deg, #e0e0e0 25%, transparent 25%, transparent 75%, #e0e0e0 75%)",
  backgroundSize: "8px 8px",
  backgroundPosition: "0 0, 4px 4px",
};

/* ────────────────────────────────────────────────────────────── */
/*  内部子组件：SV 面板                                             */
/* ────────────────────────────────────────────────────────────── */

interface SvPanelProps {
  hsv: HSV;
  width: number;
  height: number;
  onChange: (s: number, v: number) => void;
  smoothCorners: boolean;
  smoothCornerSmoothing: number;
}

function SvPanel({
  hsv,
  width,
  height,
  onChange,
  smoothCorners,
  smoothCornerSmoothing,
}: SvPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = getPaintRect(el);
      if (!rect) return;
      const x = clamp(clientX - rect.left, 0, rect.width);
      const y = clamp(clientY - rect.top, 0, rect.height);
      onChange(
        clampPercent((x / rect.width) * 100),
        clampPercent(100 - (y / rect.height) * 100),
      );
    },
    [onChange],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      update(e.clientX, e.clientY);
    },
    [update],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      update(e.clientX, e.clientY);
    },
    [update],
  );

  const handlePointerEnd = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const hueColor = hsvToHex(hsv.h, 100, 100);

  return (
    <SmoothCorners
      asChild
      radius={8}
      smoothing={smoothCornerSmoothing}
      disabled={!smoothCorners}
    >
      <div
        ref={ref}
        className="relative cursor-crosshair rounded-md border border-border overflow-hidden touch-none"
        style={{
          width,
          height,
          backgroundImage: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`,
          backgroundClip: "padding-box",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onLostPointerCapture={handlePointerEnd}
      >
        <div
          className="absolute size-3.5 rounded-full border-2 border-white pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${clamp(hsv.s, 0, 100)}%`,
            top: `${100 - clamp(hsv.v, 0, 100)}%`,
            boxShadow:
              "0 0 0 1px rgba(0,0,0,.3), inset 0 0 0 1px rgba(0,0,0,.15)",
          }}
        />
      </div>
    </SmoothCorners>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  内部子组件：色相条                                               */
/* ────────────────────────────────────────────────────────────── */

interface HueSliderProps {
  hue: number;
  width: number;
  onChange: (h: number) => void;
}

function HueSlider({ hue, width, onChange }: HueSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback(
    (clientX: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = getPaintRect(el);
      if (!rect) return;
      const x = clamp(clientX - rect.left, 0, rect.width);
      onChange(clampHue((x / rect.width) * 360));
    },
    [onChange],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      update(e.clientX);
    },
    [update],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      update(e.clientX);
    },
    [update],
  );

  const handlePointerEnd = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleHue = clampHue(hue);

  return (
    <div
      ref={ref}
      className="relative cursor-pointer rounded-md border border-border overflow-hidden touch-none"
      style={{
        width,
        height: 14,
        backgroundImage:
          "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
        backgroundClip: "padding-box",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onLostPointerCapture={handlePointerEnd}
    >
      <div
        className="absolute top-0 h-full w-1 rounded-sm border border-white/80 pointer-events-none -translate-x-1/2"
        style={{
          left: `${(handleHue / 360) * 100}%`,
          boxShadow: "0 0 2px rgba(0,0,0,.4)",
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  内部子组件：透明度条                                              */
/* ────────────────────────────────────────────────────────────── */

interface AlphaSliderProps {
  alpha: number;
  solidColor: string;
  width: number;
  onChange: (alpha: number) => void;
}

function AlphaSlider({
  alpha,
  solidColor,
  width,
  onChange,
}: AlphaSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback(
    (clientX: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = getPaintRect(el);
      if (!rect) return;
      const x = clamp(clientX - rect.left, 0, rect.width);
      onChange(clampAlpha((x / rect.width) * 100));
    },
    [onChange],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      update(e.clientX);
    },
    [update],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      update(e.clientX);
    },
    [update],
  );

  const handlePointerEnd = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleAlpha = clamp(alpha, 0, 100);

  return (
    <div
      className="relative cursor-pointer rounded-md overflow-hidden touch-none"
      style={{ width, height: 14 }}
    >
      <div className="absolute inset-0 rounded-md" style={CHECKERBOARD_STYLE} />
      <div
        ref={ref}
        className="absolute inset-0 rounded-md border border-border"
        style={{
          backgroundImage: `linear-gradient(to right, transparent, ${solidColor})`,
          backgroundClip: "padding-box",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onLostPointerCapture={handlePointerEnd}
      >
        <div
          className="absolute top-0 h-full w-1 rounded-sm border border-white/80 pointer-events-none -translate-x-1/2"
          style={{
            left: `${handleAlpha}%`,
            boxShadow: "0 0 2px rgba(0,0,0,.4)",
          }}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  色块按钮                                                       */
/* ────────────────────────────────────────────────────────────── */

interface SwatchProps {
  color: string;
  active?: boolean;
  size?: "sm" | "md";
  onClick?: () => void;
  smoothCorners: boolean;
  smoothCornerSmoothing: number;
}

const SWATCH_STYLES = {
  sm: { size: "size-5", radius: 4, rounded: "rounded-[4px]" },
  md: { size: "size-7", radius: 6, rounded: "rounded-[6px]" },
} as const;

function Swatch({
  color,
  active,
  size = "md",
  onClick,
  smoothCorners,
  smoothCornerSmoothing,
}: SwatchProps) {
  const swatchStyle = SWATCH_STYLES[size];
  const swatchSmoothing = clamp(smoothCornerSmoothing * 0.65, 0, 0.5);
  const isLight = useMemo(() => {
    const rgb = hexToRgb(color);
    if (!rgb) return false;
    return rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 186;
  }, [color]);

  return (
    <SmoothCorners
      asChild
      radius={swatchStyle.radius}
      smoothing={swatchSmoothing}
      disabled={!smoothCorners}
    >
      <button
        type="button"
        className={cn(
          swatchStyle.size,
          swatchStyle.rounded,
          "cursor-pointer border transition-[transform,box-shadow,border-color] duration-150 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
          active
            ? "border-ring ring-1 ring-ring/35 ring-offset-1 ring-offset-background"
            : isLight
              ? "border-border"
              : "border-transparent",
        )}
        style={{ backgroundColor: color }}
        onClick={onClick}
        title={color}
        aria-pressed={active}
      />
    </SmoothCorners>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  取色器面板（拆出来以便 popover / inline 复用）                      */
/* ────────────────────────────────────────────────────────────── */

interface ColorPickerPanelProps {
  color: string;
  hsv: HSV;
  onHsvChange: (hsv: HSV) => void;
  onColorSelect: (color: string) => void;
  presetColors: string[] | false;
  showRecent: boolean;
  recentColors: string[];
  showHexInput: boolean;
  showAlpha: boolean;
  alpha: number;
  onAlphaChange: (alpha: number) => void;
  panelWidth: number;
  panelHeight: number;
  smoothCorners: boolean;
  smoothCornerSmoothing: number;
}

function ColorPickerPanel({
  color,
  hsv,
  onHsvChange,
  onColorSelect,
  presetColors,
  showRecent,
  recentColors,
  showHexInput,
  showAlpha,
  alpha,
  onAlphaChange,
  panelWidth,
  panelHeight,
  smoothCorners,
  smoothCornerSmoothing,
}: ColorPickerPanelProps) {
  const [hexInput, setHexInput] = useState(color);
  const [alphaInput, setAlphaInput] = useState(String(alpha));

  useEffect(() => {
    setHexInput(color);
  }, [color]);

  useEffect(() => {
    setAlphaInput(String(alpha));
  }, [alpha]);

  const applyHex = useCallback(
    (raw: string) => {
      const validated = normalizeHex(raw, color);
      setHexInput(validated);
      if (validated !== color) {
        onColorSelect(validated);
      }
    },
    [color, onColorSelect],
  );

  const applyAlpha = useCallback(
    (raw: string) => {
      const num = parseInt(raw, 10);
      const validated = isNaN(num) ? alpha : clampAlpha(num);
      setAlphaInput(String(validated));
      if (validated !== alpha) {
        onAlphaChange(validated);
      }
    },
    [alpha, onAlphaChange],
  );

  const handleSvChange = useCallback(
    (s: number, v: number) => {
      const next: HSV = { ...hsv, s, v };
      onHsvChange(next);
    },
    [hsv, onHsvChange],
  );

  const handleHueChange = useCallback(
    (h: number) => {
      const next: HSV = { ...hsv, h };
      onHsvChange(next);
    },
    [hsv, onHsvChange],
  );

  return (
    <div className="space-y-3" style={{ width: panelWidth }}>
      {/* SV 面板 + 色相条 + 透明度条 */}
      <div className="space-y-2">
        <SvPanel
          hsv={hsv}
          width={panelWidth}
          height={panelHeight}
          onChange={handleSvChange}
          smoothCorners={smoothCorners}
          smoothCornerSmoothing={smoothCornerSmoothing}
        />
        <HueSlider hue={hsv.h} width={panelWidth} onChange={handleHueChange} />
        {showAlpha && (
          <AlphaSlider
            alpha={alpha}
            solidColor={hsvToHex(hsv.h, hsv.s, hsv.v)}
            width={panelWidth}
            onChange={onAlphaChange}
          />
        )}
      </div>

      {/* Hex 输入 + 预览 + 透明度输入 */}
      {showHexInput && (
        <div className="flex items-center gap-2">
          <SmoothCorners
            asChild
            radius={8}
            smoothing={smoothCornerSmoothing}
            disabled={!smoothCorners}
          >
            <div
              className={cn(
                "size-8 shrink-0 rounded-md border border-border",
                showAlpha && "relative overflow-hidden",
              )}
              style={showAlpha ? undefined : { backgroundColor: color }}
            >
              {showAlpha && (
                <>
                  <div
                    className="absolute inset-0"
                    style={CHECKERBOARD_STYLE}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: hexToRgbaString(color, alpha),
                    }}
                  />
                </>
              )}
            </div>
          </SmoothCorners>
          <Input
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyHex(hexInput)}
            onBlur={() => applyHex(hexInput)}
            placeholder="#000000"
            maxLength={7}
            className="h-8 font-mono text-xs"
          />
          {showAlpha && (
            <div className="flex items-center gap-0.5 shrink-0">
              <Input
                value={alphaInput}
                onChange={(e) => setAlphaInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyAlpha(alphaInput)}
                onBlur={() => applyAlpha(alphaInput)}
                className="h-8 w-12 font-mono text-xs text-center px-1"
              />
              <span className="text-xs text-muted-foreground select-none">
                %
              </span>
            </div>
          )}
        </div>
      )}

      {/* 预设色卡 */}
      {presetColors !== false && presetColors.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-muted-foreground">预设</p>
          <div className="grid grid-cols-8 gap-1">
            {presetColors.map((c) => (
              <Swatch
                key={c}
                color={c}
                active={color.toUpperCase() === c.toUpperCase()}
                size="sm"
                onClick={() => onColorSelect(c)}
                smoothCorners={smoothCorners}
                smoothCornerSmoothing={smoothCornerSmoothing}
              />
            ))}
          </div>
        </div>
      )}

      {/* 最近使用 */}
      {showRecent && recentColors.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-medium text-muted-foreground">
            最近使用
          </p>
          <div className="grid grid-cols-8 gap-1">
            {recentColors.map((c) => (
              <Swatch
                key={c}
                color={c}
                active={color.toUpperCase() === c.toUpperCase()}
                size="sm"
                onClick={() => onColorSelect(c)}
                smoothCorners={smoothCorners}
                smoothCornerSmoothing={smoothCornerSmoothing}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  主组件                                                         */
/* ────────────────────────────────────────────────────────────── */

const TRIGGER_SIZES = {
  sm: "size-7",
  md: "size-9",
  lg: "size-11",
} as const;

/** ColorPicker 组件的属性 */
export interface ColorPickerProps {
  /**
   * 当前颜色值（受控模式）
   * - `showAlpha = false` 时使用 6 位十六进制格式（如 `#FF0000`）
   * - `showAlpha = true` 时支持 8 位十六进制格式（如 `#FF000080`），也兼容 6 位输入
   */
  value?: string;
  /**
   * 默认颜色值（非受控模式）
   * @default "#000000"
   */
  defaultValue?: string;
  /**
   * 颜色变化时的回调
   * - `showAlpha = false` 时返回 `#RRGGBB` 格式
   * - `showAlpha = true` 时返回 `#RRGGBBAA` 格式
   */
  onChange?: (color: string) => void;
  /**
   * 是否显示透明度（Alpha）选择
   * - 开启后面板底部增加透明度滑条及百分比输入
   * - `onChange` 返回值变为 8 位十六进制格式（`#RRGGBBAA`）
   * @default false
   */
  showAlpha?: boolean;
  /**
   * 自定义预设色卡数组，传入 `false` 可隐藏预设区域
   * @default DEFAULT_PRESET_COLORS
   */
  presetColors?: string[] | false;
  /**
   * 是否显示最近使用的颜色
   * @default true
   */
  showRecent?: boolean;
  /**
   * 最近使用颜色的最大数量
   * @default 16
   */
  maxRecentColors?: number;
  /**
   * 是否显示十六进制输入框
   * @default true
   */
  showHexInput?: boolean;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 展示模式
   * - `"popover"` 点击触发器弹出面板
   * - `"inline"` 直接内嵌展示面板
   * @default "popover"
   */
  mode?: "popover" | "inline";
  /**
   * 饱和度/亮度面板宽度（像素）
   * @default 224
   */
  panelWidth?: number;
  /**
   * 饱和度/亮度面板高度（像素）
   * @default 150
   */
  panelHeight?: number;
  /**
   * Popover 模式下触发器色块的尺寸
   * @default "md"
   */
  triggerSize?: "sm" | "md" | "lg";
  /**
   * 是否启用 Figma/iOS 风格平滑圆角。
   * 启用后会对触发器、弹层/内嵌容器、SV 面板、颜色预览与小色块做渐进增强。
   * @default true
   */
  smoothCorners?: boolean;
  /**
   * 平滑圆角强度，范围 0..1。仅在 `smoothCorners` 为 true 时生效
   * @default 0.7
   */
  smoothCornerSmoothing?: number;
  /**
   * 触发器额外类名（仅 popover 模式）
   */
  triggerClassName?: string;
  /**
   * 面板容器额外类名
   */
  contentClassName?: string;
  /**
   * 根容器额外类名
   */
  className?: string;
}

/**
 * ColorPicker — 通用取色器组件
 *
 * 基于 HSV 色彩模型的完整取色器：
 * - 饱和度/亮度（SV）面板 + 色相条拖拽选色，支持鼠标与触屏
 * - 可选透明度（Alpha）滑条，支持百分比输入与棋盘格预览
 * - 十六进制颜色输入框（支持 3 位简写自动补全）
 * - 内置 40 色预设色卡，支持自定义或隐藏
 * - 自动记录最近使用颜色，方便快速回选
 * - 支持 popover 弹出与 inline 内嵌两种布局模式
 * - 默认启用 Figma/iOS 风格平滑圆角，并在不支持的浏览器中自动回退
 * - 受控 / 非受控双模式
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   defaultValue="#6366F1"
 *   onChange={(color) => console.log(color)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // 开启透明度选择，onChange 返回 8 位十六进制格式
 * <ColorPicker showAlpha defaultValue="#6366F180" />
 * ```
 */
export function ColorPicker({
  value: controlledValue,
  defaultValue = "#000000",
  onChange,
  showAlpha = false,
  presetColors = DEFAULT_PRESET_COLORS,
  showRecent = true,
  maxRecentColors = 16,
  showHexInput = true,
  disabled = false,
  mode = "popover",
  panelWidth = 224,
  panelHeight = 150,
  triggerSize = "md",
  smoothCorners = true,
  smoothCornerSmoothing = 0.7,
  triggerClassName,
  contentClassName,
  className,
}: ColorPickerProps) {
  const isControlled = controlledValue !== undefined;

  const initialParsed = useMemo(
    () => parseHexColor(controlledValue ?? defaultValue, "#000000"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [internal, setInternal] = useState(initialParsed.hex6);
  const [alpha, setAlpha] = useState<number>(
    showAlpha ? initialParsed.alpha : 100,
  );

  const color = isControlled
    ? parseHexColor(controlledValue!, "#000000").hex6
    : internal;

  const [hsv, setHsv] = useState<HSV>(
    () => hexToHsv(color) ?? { h: 0, s: 0, v: 0 },
  );
  const [recentColors, setRecentColors] = useState<string[]>([]);

  // 同步外部受控值 → 内部 HSV
  useEffect(() => {
    const parsed = hexToHsv(color);
    if (!parsed) return;
    setHsv((prev) => {
      const current = sanitizeHsv(prev);
      if (hsvToHex(current.h, current.s, current.v) === color) {
        return current;
      }
      return preserveHueForAchromatic(parsed, current.h);
    });
  }, [color]);

  // 同步外部受控值 → 内部 alpha
  useEffect(() => {
    if (!showAlpha || !isControlled || controlledValue === undefined) return;
    const { alpha: newAlpha } = parseHexColor(controlledValue, "#000000");
    setAlpha(newAlpha);
  }, [showAlpha, isControlled, controlledValue]);

  const commitColor = useCallback(
    (hex: string, currentAlpha: number = alpha) => {
      const upper = hex.toUpperCase();
      if (!isControlled) setInternal(upper);
      const output = showAlpha ? buildHexWithAlpha(upper, currentAlpha) : upper;
      onChange?.(output);
      setRecentColors((prev) => {
        const next = [upper, ...prev.filter((c) => c !== upper)];
        return next.slice(0, maxRecentColors);
      });
    },
    [isControlled, onChange, maxRecentColors, showAlpha, alpha],
  );

  const handleHsvChange = useCallback(
    (next: HSV) => {
      const sanitized = sanitizeHsv(next);
      setHsv(sanitized);
      const hex = hsvToHex(sanitized.h, sanitized.s, sanitized.v);
      commitColor(hex);
    },
    [commitColor],
  );

  const handleAlphaChange = useCallback(
    (newAlpha: number) => {
      const clamped = clampAlpha(newAlpha);
      setAlpha(clamped);
      commitColor(color, clamped);
    },
    [color, commitColor],
  );

  const handleColorSelect = useCallback(
    (hex: string) => {
      const normalized = normalizeHex(hex, color);
      const parsed = hexToHsv(normalized);
      if (parsed) {
        setHsv((prev) => preserveHueForAchromatic(parsed, prev.h));
      }
      commitColor(normalized);
    },
    [color, commitColor],
  );

  const panel = (
    <ColorPickerPanel
      color={color}
      hsv={hsv}
      onHsvChange={handleHsvChange}
      onColorSelect={handleColorSelect}
      presetColors={presetColors}
      showRecent={showRecent}
      recentColors={recentColors}
      showHexInput={showHexInput}
      showAlpha={showAlpha}
      alpha={alpha}
      onAlphaChange={handleAlphaChange}
      panelWidth={panelWidth}
      panelHeight={panelHeight}
      smoothCorners={smoothCorners}
      smoothCornerSmoothing={smoothCornerSmoothing}
    />
  );

  const outputColor = showAlpha ? buildHexWithAlpha(color, alpha) : color;

  if (mode === "inline") {
    return (
      <div className={cn("inline-block", className)}>
        <SmoothCorners
          asChild
          radius={8}
          smoothing={smoothCornerSmoothing}
          disabled={!smoothCorners}
        >
          <div className={cn("rounded-md p-1", contentClassName)}>{panel}</div>
        </SmoothCorners>
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <SmoothCorners
          asChild
          radius={8}
          smoothing={smoothCornerSmoothing}
          disabled={!smoothCorners}
        >
          <button
            type="button"
            className={cn(
              TRIGGER_SIZES[triggerSize],
              showAlpha && "relative overflow-hidden",
              "rounded-md border-2 border-border shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              triggerClassName,
              className,
            )}
            style={showAlpha ? undefined : { backgroundColor: color }}
            disabled={disabled}
            aria-label={`当前颜色 ${outputColor}`}
          >
            {showAlpha && (
              <>
                <div
                  className="absolute inset-0"
                  style={CHECKERBOARD_STYLE}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: hexToRgbaString(color, alpha),
                  }}
                />
              </>
            )}
          </button>
        </SmoothCorners>
      </PopoverTrigger>
      <SmoothCorners
        asChild
        radius={8}
        smoothing={smoothCornerSmoothing}
        disabled={!smoothCorners}
      >
        <PopoverContent
          className={cn("w-auto p-3", contentClassName)}
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {panel}
        </PopoverContent>
      </SmoothCorners>
    </Popover>
  );
}
