import type {
  AsciiRendererOptions,
  CellRendererOptions,
  DotRendererOptions,
  MatrixFrameContext,
  MatrixRenderCell,
  MatrixRenderer,
} from "./types";

const DEFAULT_DOT_COLOR = "#71717a";
const DEFAULT_DOT_RADIUS_RANGE = [0, 4] as const;
const DEFAULT_DOT_OPACITY_RANGE = [1, 1] as const;
const DEFAULT_ASCII_CHARACTERS = " .:-=+*#%@";
const DEFAULT_ASCII_COLOR = "#71717a";
const DEFAULT_ASCII_FONT_FAMILY =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
const DEFAULT_ASCII_FONT_WEIGHT = "400";
const DEFAULT_ASCII_FONT_SCALE = 1;
const DEFAULT_ASCII_FALLBACK_FONT = `400 10px ${DEFAULT_ASCII_FONT_FAMILY}`;
const FULL_CIRCLE = Math.PI * 2;
const NOOP = () => {};
const warnedIssues = new Set<string>();

function warnOnce(issue: string, message: string) {
  if (
    typeof process === "undefined" ||
    process.env.NODE_ENV !== "development" ||
    warnedIssues.has(issue)
  ) {
    return;
  }

  warnedIssues.add(issue);
  console.warn(`[MatrixEffect] ${message}`);
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function clampUnit(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 1;
  }

  return value;
}

function normalizeRange(
  range: readonly [number, number] | undefined,
  fallback: readonly [number, number],
  minimum: number,
  maximum: number,
): readonly [number, number] {
  const requestedMinimum = Number.isFinite(range?.[0])
    ? (range?.[0] as number)
    : fallback[0];
  const requestedMaximum = Number.isFinite(range?.[1])
    ? (range?.[1] as number)
    : fallback[1];
  const normalizedMinimum = clamp(requestedMinimum, minimum, maximum);
  const normalizedMaximum = clamp(requestedMaximum, minimum, maximum);

  return normalizedMinimum <= normalizedMaximum
    ? [normalizedMinimum, normalizedMaximum]
    : [normalizedMaximum, normalizedMinimum];
}

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return (
    (typeof value === "object" || typeof value === "function") &&
    value !== null &&
    typeof (value as PromiseLike<unknown>).then === "function"
  );
}

function appendCirclePath(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
) {
  ctx.moveTo(centerX + radius, centerY);
  ctx.arc(centerX, centerY, radius, 0, FULL_CIRCLE);
}

function fillCircle(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, FULL_CIRCLE);
  ctx.fill();
}

function resolveDotValue(
  value: number,
  valueCurve: NonNullable<DotRendererOptions["valueCurve"]>,
): number {
  const curvedValue: unknown = valueCurve(clampUnit(value));

  if (isThenable(curvedValue)) {
    void Promise.resolve(curvedValue).catch(NOOP);
    throw new TypeError(
      "MatrixEffect createDotRenderer() valueCurve 必须同步返回数值，不能返回 Promise。",
    );
  }

  return clampUnit(typeof curvedValue === "number" ? curvedValue : Number.NaN);
}

function resolveDotRadius(
  value: number,
  minimumRadius: number,
  radiusSpan: number,
  maximumCellRadius: number,
): number {
  return Math.min(maximumCellRadius, minimumRadius + radiusSpan * value);
}

interface NormalizedAsciiCharacters {
  readonly glyphs: readonly string[];
  readonly drawable: readonly boolean[];
}

function normalizeAsciiCharacters(
  characters: AsciiRendererOptions["characters"],
): NormalizedAsciiCharacters {
  let glyphs: string[];

  if (typeof characters === "string") {
    glyphs = Array.from(characters);
  } else if (characters !== undefined) {
    glyphs = Array.from(characters, (glyph) =>
      typeof glyph === "string" ? glyph : "",
    );
  } else {
    glyphs = [];
  }

  if (glyphs.length === 0) {
    if (characters !== undefined) {
      warnOnce(
        "ascii-empty-characters",
        "ASCII 字符集不能为空；已回退到默认字符集。",
      );
    }

    glyphs = Array.from(DEFAULT_ASCII_CHARACTERS);
  }

  return {
    glyphs,
    drawable: glyphs.map((glyph) => glyph.trim().length > 0),
  };
}

function normalizeAsciiFontScale(value: number | undefined): number {
  return Number.isFinite(value) && (value as number) > 0
    ? (value as number)
    : DEFAULT_ASCII_FONT_SCALE;
}

function normalizeAsciiFontWeight(value: number | string | undefined): string {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : DEFAULT_ASCII_FONT_WEIGHT;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return DEFAULT_ASCII_FONT_WEIGHT;
}

function normalizeAsciiFontFamily(value: string | undefined): string {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : DEFAULT_ASCII_FONT_FAMILY;
}

/**
 * 创建把整帧缓冲区适配为逐单元格回调的 Renderer
 *
 * - 每个 Renderer 实例只创建一个 scratch cell，并在所有格子与帧之间复用
 * - 坐标和尺寸使用 CSS px，`u/v` 表示单元格中心的归一化坐标
 * - 回调是同步的瞬时借用，不得保存 ctx/cell，且必须配平自己的 save/restore
 * - current path 只在整帧边界清理；逐格使用路径 API 时，回调必须自行 beginPath
 *
 * @example
 * ```ts
 * const renderer = createCellRenderer((ctx, cell) => {
 *   const size = Math.min(cell.width, cell.height) * cell.value;
 *   ctx.fillRect(cell.centerX - size / 2, cell.centerY - size / 2, size, size);
 * });
 * ```
 */
export function createCellRenderer(
  drawCell: (
    ctx: CanvasRenderingContext2D,
    cell: Readonly<MatrixRenderCell>,
    context: MatrixFrameContext,
  ) => void,
  options: CellRendererOptions = {},
): MatrixRenderer {
  const cellAspectRatio =
    Number.isFinite(options.cellAspectRatio) &&
    (options.cellAspectRatio as number) > 0
      ? options.cellAspectRatio
      : undefined;
  const preferredFrameRate =
    options.preferredFrameRate === 30 || options.preferredFrameRate === 60
      ? options.preferredFrameRate
      : undefined;
  const scratchCell: MatrixRenderCell = {
    index: 0,
    column: 0,
    row: 0,
    x: 0,
    y: 0,
    centerX: 0,
    centerY: 0,
    width: 0,
    height: 0,
    u: 0,
    v: 0,
    value: 0,
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  };

  return {
    ...(cellAspectRatio === undefined ? {} : { cellAspectRatio }),
    ...(preferredFrameRate === undefined ? {} : { preferredFrameRate }),
    render(ctx, frame, context) {
      const { columns, rows, rgba, values } = frame;
      const { cellWidth, cellHeight } = context;

      ctx.save();

      try {
        ctx.beginPath();

        for (let index = 0; index < values.length; index += 1) {
          const column = index % columns;
          const row = Math.floor(index / columns);
          const rgbaIndex = index * 4;
          const x = column * cellWidth;
          const y = row * cellHeight;

          scratchCell.index = index;
          scratchCell.column = column;
          scratchCell.row = row;
          scratchCell.x = x;
          scratchCell.y = y;
          scratchCell.centerX = x + cellWidth / 2;
          scratchCell.centerY = y + cellHeight / 2;
          scratchCell.width = cellWidth;
          scratchCell.height = cellHeight;
          scratchCell.u = (column + 0.5) / columns;
          scratchCell.v = (row + 0.5) / rows;
          scratchCell.value = values[index];
          scratchCell.r = rgba[rgbaIndex];
          scratchCell.g = rgba[rgbaIndex + 1];
          scratchCell.b = rgba[rgbaIndex + 2];
          scratchCell.a = rgba[rgbaIndex + 3];

          const returnedValue: unknown = drawCell(ctx, scratchCell, context);

          if (isThenable(returnedValue)) {
            void Promise.resolve(returnedValue).catch(NOOP);
            throw new TypeError(
              "MatrixEffect createCellRenderer() 回调必须同步完成，不能返回 Promise。",
            );
          }
        }
      } finally {
        try {
          ctx.beginPath();
        } finally {
          ctx.restore();
        }
      }
    },
  };
}

/**
 * 创建以主信号控制圆点半径和不透明度的 Renderer
 *
 * - 默认使用中性固定色，也可保留 Source 的原始 RGB
 * - 始终把半径限制在单元格短边的一半内
 * - Source Alpha 只与最终不透明度相乘，透明像素不会因信号反相而变实
 * - 固定色且透明度恒定时，将不透明像素批量合并到同一 Path
 *
 * @example
 * ```ts
 * const renderer = createDotRenderer({
 *   color: "#52525b",
 *   radiusRange: [0, 4],
 * });
 * ```
 */
export function createDotRenderer(
  options: DotRendererOptions = {},
): MatrixRenderer {
  const color = options.color ?? DEFAULT_DOT_COLOR;
  const [minimumRadius, maximumRadius] = normalizeRange(
    options.radiusRange,
    DEFAULT_DOT_RADIUS_RANGE,
    0,
    Number.MAX_SAFE_INTEGER,
  );
  const [minimumOpacity, maximumOpacity] = normalizeRange(
    options.opacityRange,
    DEFAULT_DOT_OPACITY_RANGE,
    0,
    1,
  );
  const radiusSpan = maximumRadius - minimumRadius;
  const opacitySpan = maximumOpacity - minimumOpacity;
  const valueCurve = options.valueCurve ?? ((value: number) => value);
  const usesSourceColor = color === "source";
  const hasConstantOpacity = opacitySpan === 0;

  return {
    cellAspectRatio: 1,
    preferredFrameRate: 60,
    render(ctx, frame, context) {
      const { rgba, values } = frame;
      const maximumCellRadius = Math.max(
        0,
        Math.min(context.cellWidth, context.cellHeight) / 2,
      );

      ctx.save();

      try {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
        ctx.fillStyle = DEFAULT_DOT_COLOR;

        if (!usesSourceColor) {
          ctx.fillStyle = color;
        }

        if (!usesSourceColor && hasConstantOpacity) {
          ctx.globalAlpha = minimumOpacity;
          ctx.beginPath();
          let hasOpaquePath = false;
          let hasPartialAlpha = false;

          for (let index = 0; index < values.length; index += 1) {
            const alpha = rgba[index * 4 + 3];

            if (alpha !== 255) {
              hasPartialAlpha ||= alpha > 0;
              continue;
            }

            const value = resolveDotValue(values[index], valueCurve);
            const column = index % frame.columns;
            const row = Math.floor(index / frame.columns);
            const centerX = (column + 0.5) * context.cellWidth;
            const centerY = (row + 0.5) * context.cellHeight;
            const radius = resolveDotRadius(
              value,
              minimumRadius,
              radiusSpan,
              maximumCellRadius,
            );

            if (radius <= 0 || minimumOpacity <= 0) {
              continue;
            }

            appendCirclePath(ctx, centerX, centerY, radius);
            hasOpaquePath = true;
          }

          if (hasOpaquePath) {
            ctx.fill();
          }

          if (hasPartialAlpha) {
            for (let index = 0; index < values.length; index += 1) {
              const alpha = rgba[index * 4 + 3];

              if (alpha <= 0 || alpha >= 255 || minimumOpacity <= 0) {
                continue;
              }

              const value = resolveDotValue(values[index], valueCurve);
              const column = index % frame.columns;
              const row = Math.floor(index / frame.columns);
              const centerX = (column + 0.5) * context.cellWidth;
              const centerY = (row + 0.5) * context.cellHeight;
              const radius = resolveDotRadius(
                value,
                minimumRadius,
                radiusSpan,
                maximumCellRadius,
              );

              if (radius <= 0) {
                continue;
              }

              ctx.globalAlpha = minimumOpacity * (alpha / 255);
              fillCircle(ctx, centerX, centerY, radius);
            }
          }

          return;
        }

        for (let index = 0; index < values.length; index += 1) {
          const rgbaIndex = index * 4;
          const alpha = rgba[rgbaIndex + 3];

          if (alpha <= 0) {
            continue;
          }

          const value = resolveDotValue(values[index], valueCurve);
          const column = index % frame.columns;
          const row = Math.floor(index / frame.columns);
          const centerX = (column + 0.5) * context.cellWidth;
          const centerY = (row + 0.5) * context.cellHeight;
          const radius = resolveDotRadius(
            value,
            minimumRadius,
            radiusSpan,
            maximumCellRadius,
          );
          const opacity = minimumOpacity + opacitySpan * value;

          if (radius <= 0 || opacity <= 0) {
            continue;
          }

          if (usesSourceColor) {
            ctx.fillStyle = `rgb(${rgba[rgbaIndex]} ${rgba[rgbaIndex + 1]} ${rgba[rgbaIndex + 2]})`;
          }

          ctx.globalAlpha = opacity * (alpha / 255);
          fillCircle(ctx, centerX, centerY, radius);
        }
      } finally {
        try {
          ctx.beginPath();
        } finally {
          ctx.restore();
        }
      }
    },
  };
}

/**
 * 创建把主信号映射为字符密度的 ASCII Renderer
 *
 * - 字符按从低到高密度排列，并使用 round(value * (count - 1)) 选取
 * - 支持固定色或 Source RGB，Source Alpha 作为最终覆盖率
 * - 字体指标只在 prepare() 中测量一次，逐格热路径不创建对象或测量文本
 * - 字号和坐标使用 CSS px，默认提示 1:1 方形采样格与 30 FPS
 *
 * @example
 * ```ts
 * const renderer = createAsciiRenderer({
 *   characters: " .:-=+*#%@",
 *   colorMode: "source",
 *   fontScale: 0.9,
 * });
 * ```
 */
export function createAsciiRenderer(
  options: AsciiRendererOptions = {},
): MatrixRenderer {
  const { glyphs, drawable } = normalizeAsciiCharacters(options.characters);
  const colorMode = options.colorMode === "source" ? "source" : "fixed";
  const color = options.color ?? DEFAULT_ASCII_COLOR;
  const backgroundColor = options.backgroundColor ?? null;
  const fontFamily = normalizeAsciiFontFamily(options.fontFamily);
  const fontWeight = normalizeAsciiFontWeight(options.fontWeight);
  const fontScale = normalizeAsciiFontScale(options.fontScale);
  let preparedFont = DEFAULT_ASCII_FALLBACK_FONT;
  let preparedBaseline: CanvasTextBaseline = "middle";
  let preparedBaselineOffset = 0;

  return {
    cellAspectRatio: 1,
    preferredFrameRate: 30,
    prepare(ctx, _frame, context) {
      const requestedFontSize = context.cellHeight * fontScale;
      const fontSize =
        Number.isFinite(requestedFontSize) && requestedFontSize > 0
          ? requestedFontSize
          : 10;

      ctx.save();

      try {
        ctx.font = DEFAULT_ASCII_FALLBACK_FONT;
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        preparedFont = ctx.font;

        const metrics = ctx.measureText("M");
        const ascent = metrics.actualBoundingBoxAscent;
        const descent = metrics.actualBoundingBoxDescent;
        const hasBoundingBox =
          Number.isFinite(ascent) &&
          Number.isFinite(descent) &&
          ascent >= 0 &&
          descent >= 0 &&
          ascent + descent > 0;

        preparedBaseline = hasBoundingBox ? "alphabetic" : "middle";
        preparedBaselineOffset = hasBoundingBox ? (ascent - descent) / 2 : 0;
      } finally {
        ctx.restore();
      }
    },
    render(ctx, frame, context) {
      const { columns, rows, rgba, values } = frame;
      const { cellWidth, cellHeight, cssWidth, cssHeight } = context;
      const totalCells = Math.min(values.length, columns * rows);

      if (
        totalCells <= 0 ||
        glyphs.length === 0 ||
        cellWidth <= 0 ||
        cellHeight <= 0
      ) {
        return;
      }

      ctx.save();

      try {
        ctx.beginPath();
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;

        if (backgroundColor !== null) {
          ctx.fillStyle = "rgba(0, 0, 0, 0)";
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, cssWidth, cssHeight);
        }

        ctx.font = preparedFont;
        ctx.textAlign = "center";
        ctx.textBaseline = preparedBaseline;

        if (colorMode === "fixed") {
          ctx.fillStyle = DEFAULT_ASCII_COLOR;
          ctx.fillStyle = color;
        }

        let previousAlpha = -1;
        let previousSourceColor = -1;

        for (let row = 0; row < rows; row += 1) {
          const rowOffset = row * columns;

          if (rowOffset >= totalCells) {
            break;
          }

          const columnsInRow = Math.min(columns, totalCells - rowOffset);
          const centerY = (row + 0.5) * cellHeight + preparedBaselineOffset;

          for (let column = 0; column < columnsInRow; column += 1) {
            const index = rowOffset + column;
            const rgbaIndex = index * 4;
            const alpha = rgba[rgbaIndex + 3];

            if (alpha <= 0) {
              continue;
            }

            const value = clampUnit(values[index]);
            const glyphIndex = Math.round(value * (glyphs.length - 1));

            if (!drawable[glyphIndex]) {
              continue;
            }

            if (alpha !== previousAlpha) {
              ctx.globalAlpha = alpha / 255;
              previousAlpha = alpha;
            }

            if (colorMode === "source") {
              const red = rgba[rgbaIndex];
              const green = rgba[rgbaIndex + 1];
              const blue = rgba[rgbaIndex + 2];
              const sourceColor = (red << 16) | (green << 8) | blue;

              if (sourceColor !== previousSourceColor) {
                ctx.fillStyle = `rgb(${red} ${green} ${blue})`;
                previousSourceColor = sourceColor;
              }
            }

            const centerX = (column + 0.5) * cellWidth;
            ctx.fillText(glyphs[glyphIndex], centerX, centerY, cellWidth);
          }
        }
      } finally {
        try {
          ctx.beginPath();
        } finally {
          ctx.restore();
        }
      }
    },
  };
}
