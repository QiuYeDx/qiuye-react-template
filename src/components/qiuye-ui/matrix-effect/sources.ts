import type {
  MatrixEffectError,
  MatrixFit,
  MatrixProceduralContext,
  MatrixProceduralSource,
  MatrixSource,
  MatrixSourcePosition,
  SoftBlobSourceOptions,
} from "./types";

type MatrixRasterSource =
  | HTMLCanvasElement
  | HTMLImageElement
  | ImageBitmap
  | OffscreenCanvas;

type MatrixImageResource = HTMLImageElement | ImageBitmap;

interface NormalizedRasterOptions {
  readonly fit: MatrixFit;
  readonly positionX: number;
  readonly positionY: number;
  readonly smoothing: boolean;
  readonly background: string | null;
}

/** 内部 Source adapter 的创建选项；不会从组件公共入口导出 */
export interface MatrixSourceAdapterOptions {
  /** 异步图片从 loading 进入 ready 或 error 时触发 */
  onStateChange?: () => void;
}

/** 单次 Source 绘制的结构化结果；不会从组件公共入口导出 */
export type MatrixSourceDrawResult =
  | { readonly status: "drawn" }
  | { readonly status: "loading" }
  | { readonly status: "idle" }
  | { readonly status: "error"; readonly error: MatrixEffectError };

/** 核心管线消费的内部 Source adapter；不会从组件公共入口导出 */
export interface MatrixSourceAdapter {
  /** Source 是否需要持续绘制 */
  readonly animated: boolean;
  /** 把当前 Source 绘制到低分辨率采样上下文 */
  draw(context: MatrixProceduralContext): MatrixSourceDrawResult;
  /** 幂等释放 adapter 自己拥有的资源 */
  dispose(): void;
}

/** Raster Source 的源矩形与目标矩形；主要用于确定性几何验证 */
export interface MatrixSourceDrawRect {
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
  destinationX: number;
  destinationY: number;
  destinationWidth: number;
  destinationHeight: number;
}

const DRAWN_RESULT = { status: "drawn" } as const;
const LOADING_RESULT = { status: "loading" } as const;
const IDLE_RESULT = { status: "idle" } as const;
const DEFAULT_POSITION = 0.5;
const TRANSPARENT_FILL = "rgba(0, 0, 0, 0)";
const NOOP = () => {};
const HTML_IMAGE_BRANDS = ["[object HTMLImageElement]"] as const;
const IMAGE_BITMAP_BRANDS = ["[object ImageBitmap]"] as const;
const BLOB_BRANDS = ["[object Blob]", "[object File]"] as const;
const HTML_CANVAS_BRANDS = ["[object HTMLCanvasElement]"] as const;
const OFFSCREEN_CANVAS_BRANDS = ["[object OffscreenCanvas]"] as const;
const DEFAULT_BLOB_COUNT = 3;
const DEFAULT_BLOB_MIN_RADIUS = 0.2;
const DEFAULT_BLOB_MAX_RADIUS = 0.45;
const DEFAULT_BLOB_SPEED = 0.14;
const DEFAULT_BLOB_BASE_VALUE = 0.04;
const DEFAULT_BLOB_SEED = 1;
const MIN_BLOB_COUNT = 1;
const MAX_BLOB_COUNT = 6;
const MIN_BLOB_RADIUS = 0.01;
const MAX_BLOB_RADIUS = 2;
const MAX_BLOB_SPEED = 4;

interface SoftBlobParameters {
  readonly innerColor: string;
  readonly middleColor: string;
  readonly outerColor: string;
  readonly phaseX: number;
  readonly phaseY: number;
  readonly phaseRadius: number;
  readonly frequencyX: number;
  readonly frequencyY: number;
  readonly secondaryFrequency: number;
  readonly radiusFrequency: number;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalizeFiniteNumber(
  value: number | undefined,
  fallback: number,
): number {
  return Number.isFinite(value) ? (value as number) : fallback;
}

function createSeededRandom(seed: number): () => number {
  let state = Math.trunc(seed) >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function createSoftBlobParameters(
  count: number,
  seed: number,
): readonly SoftBlobParameters[] {
  const random = createSeededRandom(seed);
  const blobs: SoftBlobParameters[] = [];

  for (let index = 0; index < count; index += 1) {
    const phaseX =
      Math.PI * 2 * ((index + 0.5) / count + ((random() - 0.5) * 0.15) / count);
    const intensity = 0.58 + random() * 0.28;

    blobs.push({
      innerColor: `rgba(255, 255, 255, ${intensity})`,
      middleColor: `rgba(255, 255, 255, ${intensity * 0.62})`,
      outerColor: `rgba(255, 255, 255, ${intensity * 0.18})`,
      phaseX,
      phaseY: phaseX + Math.PI * 2 * (0.2 + random() * 0.6),
      phaseRadius: random() * Math.PI * 2,
      frequencyX: 0.72 + random() * 0.46,
      frequencyY: 0.62 + random() * 0.5,
      secondaryFrequency: 1.18 + random() * 0.54,
      radiusFrequency: 0.48 + random() * 0.32,
    });
  }

  return blobs;
}

/**
 * 创建由多个径向渐变组成的确定性柔和光团 Source
 *
 * - 光团参数在工厂创建时由 seed 一次性生成
 * - 位置和呼吸尺寸只依赖有效播放时间，暂停不会跳变
 * - 直接在低分辨率采样画布绘制，不使用 CSS blur 或额外帧循环
 *
 * @example
 * ```ts
 * const source = createSoftBlobSource({ seed: 42, speed: 0.12 });
 * ```
 */
export function createSoftBlobSource(
  options: SoftBlobSourceOptions = {},
): MatrixProceduralSource {
  const count = clamp(
    Math.floor(normalizeFiniteNumber(options.count, DEFAULT_BLOB_COUNT)),
    MIN_BLOB_COUNT,
    MAX_BLOB_COUNT,
  );
  const requestedMinimumRadius = clamp(
    normalizeFiniteNumber(options.minRadius, DEFAULT_BLOB_MIN_RADIUS),
    MIN_BLOB_RADIUS,
    MAX_BLOB_RADIUS,
  );
  const requestedMaximumRadius = clamp(
    normalizeFiniteNumber(options.maxRadius, DEFAULT_BLOB_MAX_RADIUS),
    MIN_BLOB_RADIUS,
    MAX_BLOB_RADIUS,
  );
  const minimumRadius = Math.min(
    requestedMinimumRadius,
    requestedMaximumRadius,
  );
  const maximumRadius = Math.max(
    requestedMinimumRadius,
    requestedMaximumRadius,
  );
  const speed = clamp(
    normalizeFiniteNumber(options.speed, DEFAULT_BLOB_SPEED),
    0,
    MAX_BLOB_SPEED,
  );
  const baseValue = clamp(
    normalizeFiniteNumber(options.baseValue, DEFAULT_BLOB_BASE_VALUE),
    0,
    1,
  );
  const seed = normalizeFiniteNumber(options.seed, DEFAULT_BLOB_SEED);
  const blobs = createSoftBlobParameters(count, seed);
  const baseChannel = Math.round(baseValue * 255);
  const baseColor = `rgb(${baseChannel}, ${baseChannel}, ${baseChannel})`;

  return {
    type: "procedural",
    animated: speed > 0,
    draw({ ctx, width, height, time }) {
      const shortSide = Math.min(width, height);
      const effectiveTime = Number.isFinite(time)
        ? Math.max(0, time) * speed
        : 0;

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, width, height);

      for (const blob of blobs) {
        const primaryX = Math.sin(
          effectiveTime * blob.frequencyX + blob.phaseX,
        );
        const secondaryX = Math.sin(
          effectiveTime * blob.secondaryFrequency + blob.phaseY,
        );
        const primaryY = Math.sin(
          effectiveTime * blob.frequencyY + blob.phaseY,
        );
        const secondaryY = Math.sin(
          effectiveTime * (blob.secondaryFrequency * 0.83) + blob.phaseX,
        );
        const centerX = width * (0.5 + primaryX * 0.28 + secondaryX * 0.07);
        const centerY = height * (0.5 + primaryY * 0.28 + secondaryY * 0.07);
        const radiusProgress =
          0.5 +
          Math.sin(effectiveTime * blob.radiusFrequency + blob.phaseRadius) *
            0.5;
        const radius =
          shortSide *
          (minimumRadius + (maximumRadius - minimumRadius) * radiusProgress);
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          radius,
        );

        gradient.addColorStop(0, blob.innerColor);
        gradient.addColorStop(0.42, blob.middleColor);
        gradient.addColorStop(0.76, blob.outerColor);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(
          centerX - radius,
          centerY - radius,
          radius * 2,
          radius * 2,
        );
      }

      ctx.globalCompositeOperation = "source-over";
    },
  };
}

function createSourceError(
  code: MatrixEffectError["code"],
  message: string,
  cause?: unknown,
): MatrixEffectError {
  return {
    code,
    message,
    recoverable: true,
    ...(cause === undefined ? {} : { cause }),
  };
}

function createErrorResult(
  code: MatrixEffectError["code"],
  message: string,
  cause?: unknown,
): MatrixSourceDrawResult {
  return {
    status: "error",
    error: createSourceError(code, message, cause),
  };
}

function normalizeFit(fit: MatrixFit | undefined): MatrixFit {
  if (fit === "contain" || fit === "fill") {
    return fit;
  }

  return "cover";
}

function normalizePosition(value: number | undefined): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_POSITION;
  }

  return Math.min(1, Math.max(0, value as number));
}

function normalizeRasterOptions(options: {
  fit?: MatrixFit;
  position?: MatrixSourcePosition;
  smoothing?: boolean;
  background?: string | null;
}): NormalizedRasterOptions {
  return {
    fit: normalizeFit(options.fit),
    positionX: normalizePosition(options.position?.x),
    positionY: normalizePosition(options.position?.y),
    smoothing: options.smoothing ?? true,
    background: options.background ?? null,
  };
}

function hasPositiveDimensions(width: number, height: number): boolean {
  return (
    Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0
  );
}

function writeMatrixSourceDrawRect(
  rect: MatrixSourceDrawRect,
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  fit: MatrixFit,
  positionX: number,
  positionY: number,
): boolean {
  if (
    !hasPositiveDimensions(sourceWidth, sourceHeight) ||
    !hasPositiveDimensions(targetWidth, targetHeight)
  ) {
    return false;
  }

  rect.sourceX = 0;
  rect.sourceY = 0;
  rect.sourceWidth = sourceWidth;
  rect.sourceHeight = sourceHeight;
  rect.destinationX = 0;
  rect.destinationY = 0;
  rect.destinationWidth = targetWidth;
  rect.destinationHeight = targetHeight;

  if (fit === "fill") {
    return true;
  }

  const scale =
    fit === "contain"
      ? Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight)
      : Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);

  if (fit === "contain") {
    rect.destinationWidth = sourceWidth * scale;
    rect.destinationHeight = sourceHeight * scale;
    rect.destinationX = (targetWidth - rect.destinationWidth) * positionX;
    rect.destinationY = (targetHeight - rect.destinationHeight) * positionY;
    return true;
  }

  rect.sourceWidth = Math.min(sourceWidth, targetWidth / scale);
  rect.sourceHeight = Math.min(sourceHeight, targetHeight / scale);
  rect.sourceX = (sourceWidth - rect.sourceWidth) * positionX;
  rect.sourceY = (sourceHeight - rect.sourceHeight) * positionY;
  return true;
}

/**
 * 计算 Raster Source 在采样画布中的精确绘制矩形
 *
 * 返回值保留浮点精度；输入存在非正尺寸时返回 null。
 */
export function resolveMatrixSourceDrawRect(
  sourceWidth: number,
  sourceHeight: number,
  targetWidth: number,
  targetHeight: number,
  fit: MatrixFit = "cover",
  position?: MatrixSourcePosition,
): MatrixSourceDrawRect | null {
  const rect: MatrixSourceDrawRect = {
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 0,
    sourceHeight: 0,
    destinationX: 0,
    destinationY: 0,
    destinationWidth: 0,
    destinationHeight: 0,
  };

  const didResolve = writeMatrixSourceDrawRect(
    rect,
    sourceWidth,
    sourceHeight,
    targetWidth,
    targetHeight,
    normalizeFit(fit),
    normalizePosition(position?.x),
    normalizePosition(position?.y),
  );

  return didResolve ? rect : null;
}

function resetSamplingContext(
  context: MatrixProceduralContext,
  background: string | null,
) {
  const { ctx, width, height } = context;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();

  if (background !== null) {
    // 先设透明基线，使非法 CSS 颜色不会继承上一次 fillStyle。
    ctx.fillStyle = TRANSPARENT_FILL;
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }
}

function restoreSamplingContext(
  ctx: CanvasRenderingContext2D,
  result: MatrixSourceDrawResult,
): MatrixSourceDrawResult {
  try {
    ctx.restore();
    return result;
  } catch (cause) {
    return createErrorResult(
      "SOURCE_RUNTIME_ERROR",
      "MatrixEffect 恢复采样 Canvas 状态失败。",
      cause,
    );
  }
}

function createDrawRect(): MatrixSourceDrawRect {
  return {
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 0,
    sourceHeight: 0,
    destinationX: 0,
    destinationY: 0,
    destinationWidth: 0,
    destinationHeight: 0,
  };
}

function drawRasterSource(
  context: MatrixProceduralContext,
  source: MatrixRasterSource,
  sourceWidth: number,
  sourceHeight: number,
  options: NormalizedRasterOptions,
  drawRect: MatrixSourceDrawRect,
  zeroSizeResult: MatrixSourceDrawResult,
): MatrixSourceDrawResult {
  if (!hasPositiveDimensions(context.width, context.height)) {
    return IDLE_RESULT;
  }

  if (!hasPositiveDimensions(sourceWidth, sourceHeight)) {
    return zeroSizeResult;
  }

  const didResolve = writeMatrixSourceDrawRect(
    drawRect,
    sourceWidth,
    sourceHeight,
    context.width,
    context.height,
    options.fit,
    options.positionX,
    options.positionY,
  );

  if (!didResolve) {
    return zeroSizeResult;
  }

  const { ctx } = context;

  try {
    ctx.save();
  } catch (cause) {
    return createErrorResult(
      "SOURCE_RUNTIME_ERROR",
      "MatrixEffect 保存采样 Canvas 状态失败。",
      cause,
    );
  }

  let result: MatrixSourceDrawResult = DRAWN_RESULT;

  try {
    resetSamplingContext(context, options.background);
    ctx.imageSmoothingEnabled = options.smoothing;
    ctx.drawImage(
      source,
      drawRect.sourceX,
      drawRect.sourceY,
      drawRect.sourceWidth,
      drawRect.sourceHeight,
      drawRect.destinationX,
      drawRect.destinationY,
      drawRect.destinationWidth,
      drawRect.destinationHeight,
    );
  } catch (cause) {
    result = createErrorResult(
      "SOURCE_RUNTIME_ERROR",
      "MatrixEffect 绘制 Raster Source 失败。",
      cause,
    );
  }

  return restoreSamplingContext(ctx, result);
}

function hasObjectBrand(value: unknown, brands: readonly string[]): boolean {
  if (
    (typeof value !== "object" && typeof value !== "function") ||
    value === null
  ) {
    return false;
  }

  try {
    return brands.includes(Object.prototype.toString.call(value));
  } catch {
    return false;
  }
}

function isHtmlImageElement(value: unknown): value is HTMLImageElement {
  return (
    (typeof HTMLImageElement !== "undefined" &&
      value instanceof HTMLImageElement) ||
    hasObjectBrand(value, HTML_IMAGE_BRANDS)
  );
}

function isImageBitmap(value: unknown): value is ImageBitmap {
  return (
    (typeof ImageBitmap !== "undefined" && value instanceof ImageBitmap) ||
    hasObjectBrand(value, IMAGE_BITMAP_BRANDS)
  );
}

function isBlob(value: unknown): value is Blob {
  return (
    (typeof Blob !== "undefined" && value instanceof Blob) ||
    hasObjectBrand(value, BLOB_BRANDS)
  );
}

function isCanvas(
  value: unknown,
): value is HTMLCanvasElement | OffscreenCanvas {
  const isHtmlCanvas =
    (typeof HTMLCanvasElement !== "undefined" &&
      value instanceof HTMLCanvasElement) ||
    hasObjectBrand(value, HTML_CANVAS_BRANDS);
  const isOffscreenCanvas =
    (typeof OffscreenCanvas !== "undefined" &&
      value instanceof OffscreenCanvas) ||
    hasObjectBrand(value, OFFSCREEN_CANVAS_BRANDS);

  return isHtmlCanvas || isOffscreenCanvas;
}

function getImageWidth(image: MatrixImageResource): number {
  if (isHtmlImageElement(image)) {
    return image.naturalWidth;
  }

  return image.width;
}

function getImageHeight(image: MatrixImageResource): number {
  if (isHtmlImageElement(image)) {
    return image.naturalHeight;
  }

  return image.height;
}

function hasAssignedImageSource(image: HTMLImageElement): boolean {
  return image.currentSrc !== "" || image.getAttribute("src") !== null;
}

function createImageSourceAdapter(
  source: Extract<MatrixSource, { type: "image" }>,
  options: MatrixSourceAdapterOptions,
): MatrixSourceAdapter {
  const rasterOptions = normalizeRasterOptions(source);
  const onStateChange = options.onStateChange ?? NOOP;
  const drawRect = createDrawRect();
  const zeroSizeResult = createErrorResult(
    "SOURCE_RUNTIME_ERROR",
    "MatrixEffect 图片 Source 已失去可绘制尺寸。",
  );
  let image: MatrixImageResource | null = null;
  let ownedImage: HTMLImageElement | null = null;
  let objectUrl: string | null = null;
  let revokeObjectUrl: ((url: string) => void) | null = null;
  let removeListeners: (() => void) | null = null;
  let state: "loading" | "ready" | "error" = "loading";
  let errorResult: MatrixSourceDrawResult | null = null;
  let initialized = false;
  let disposed = false;

  const detachListeners = () => {
    removeListeners?.();
    removeListeners = null;
  };

  const settleError = (message: string, cause?: unknown) => {
    if (disposed || state !== "loading") {
      return;
    }

    state = "error";
    errorResult = createErrorResult("SOURCE_LOAD_FAILED", message, cause);
    detachListeners();

    if (initialized) {
      onStateChange();
    }
  };

  const settleReady = () => {
    if (disposed || state !== "loading" || image === null) {
      return;
    }

    const width = getImageWidth(image);
    const height = getImageHeight(image);

    if (!hasPositiveDimensions(width, height)) {
      settleError("MatrixEffect 图片 Source 没有可绘制尺寸。");
      return;
    }

    state = "ready";
    detachListeners();

    if (initialized) {
      onStateChange();
    }
  };

  const watchImage = (
    candidate: HTMLImageElement,
    checkCurrentState: boolean,
  ) => {
    const handleLoad = () => settleReady();
    const handleError = (event: Event) =>
      settleError(
        "MatrixEffect 图片 Source 加载失败；请检查 URL、网络和 CORS 配置。",
        event,
      );

    candidate.addEventListener("load", handleLoad);
    candidate.addEventListener("error", handleError);
    removeListeners = () => {
      candidate.removeEventListener("load", handleLoad);
      candidate.removeEventListener("error", handleError);
    };

    if (
      checkCurrentState &&
      candidate.complete &&
      (hasPositiveDimensions(candidate.naturalWidth, candidate.naturalHeight) ||
        hasAssignedImageSource(candidate))
    ) {
      settleReady();
    }
  };

  try {
    const input = source.src;

    if (typeof input === "string" || isBlob(input)) {
      if (typeof Image === "undefined") {
        settleError(
          "当前环境无法创建图片对象；请仅在客户端初始化 MatrixEffect Source。",
        );
      } else {
        ownedImage = new Image();
        image = ownedImage;

        let imageUrl: string;

        if (typeof input === "string") {
          imageUrl = input;

          if (source.crossOrigin !== undefined) {
            ownedImage.crossOrigin = source.crossOrigin;
          }
        } else if (
          typeof URL === "undefined" ||
          typeof URL.createObjectURL !== "function" ||
          typeof URL.revokeObjectURL !== "function"
        ) {
          settleError("当前环境不支持 Blob object URL，无法加载图片 Source。");
          imageUrl = "";
        } else {
          const objectUrlApi = URL;
          objectUrl = objectUrlApi.createObjectURL(input);
          revokeObjectUrl = (url) => objectUrlApi.revokeObjectURL(url);
          imageUrl = objectUrl;
        }

        if (state === "loading") {
          // new Image() 在尚未设置 src 时也可能是 complete，需在赋值后再检查。
          watchImage(ownedImage, false);
          ownedImage.src = imageUrl;

          if (state === "loading" && ownedImage.complete) {
            settleReady();
          }
        }
      }
    } else if (isHtmlImageElement(input)) {
      image = input;
      watchImage(input, true);
    } else if (isImageBitmap(input)) {
      image = input;
      settleReady();
    } else {
      settleError("MatrixEffect 收到了当前环境无法识别的图片 Source。");
    }
  } catch (cause) {
    settleError("MatrixEffect 初始化图片 Source 失败。", cause);
  }

  initialized = true;

  return {
    animated: false,
    draw(context) {
      if (disposed) {
        return IDLE_RESULT;
      }

      if (state === "loading") {
        return LOADING_RESULT;
      }

      if (state === "error" || image === null) {
        return (
          errorResult ??
          createErrorResult(
            "SOURCE_LOAD_FAILED",
            "MatrixEffect 图片 Source 不可用。",
          )
        );
      }

      const width = getImageWidth(image);
      const height = getImageHeight(image);

      return drawRasterSource(
        context,
        image,
        width,
        height,
        rasterOptions,
        drawRect,
        zeroSizeResult,
      );
    },
    dispose() {
      if (disposed) {
        return;
      }

      disposed = true;
      detachListeners();

      if (ownedImage !== null) {
        try {
          ownedImage.removeAttribute("src");
        } catch {
          // 清理失败不应破坏 Strict Mode 的后续 setup。
        }
      }

      if (objectUrl !== null && revokeObjectUrl !== null) {
        try {
          revokeObjectUrl(objectUrl);
        } catch {
          // object URL 已失效时保持 dispose 幂等。
        }

        objectUrl = null;
      }

      image = null;
      ownedImage = null;
    },
  };
}

function createCanvasSourceAdapter(
  source: Extract<MatrixSource, { type: "canvas" }>,
): MatrixSourceAdapter {
  const rasterOptions = normalizeRasterOptions(source);
  const canvasInput = source.canvas;
  const animated = source.animated ?? false;
  const drawRect = createDrawRect();
  let disposed = false;

  return {
    animated,
    draw(context) {
      if (disposed) {
        return IDLE_RESULT;
      }

      let canvas: HTMLCanvasElement | OffscreenCanvas | null;

      try {
        canvas =
          typeof canvasInput === "function" ? canvasInput() : canvasInput;
      } catch (cause) {
        return createErrorResult(
          "SOURCE_RUNTIME_ERROR",
          "MatrixEffect Canvas supplier 执行失败。",
          cause,
        );
      }

      if (canvas === null) {
        return IDLE_RESULT;
      }

      if (!isCanvas(canvas)) {
        return createErrorResult(
          "SOURCE_RUNTIME_ERROR",
          "MatrixEffect Canvas supplier 返回了不受支持的值。",
        );
      }

      return drawRasterSource(
        context,
        canvas,
        canvas.width,
        canvas.height,
        rasterOptions,
        drawRect,
        IDLE_RESULT,
      );
    },
    dispose() {
      disposed = true;
    },
  };
}

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return (
    (typeof value === "object" || typeof value === "function") &&
    value !== null &&
    typeof (value as PromiseLike<unknown>).then === "function"
  );
}

function createProceduralSourceAdapter(
  source: Extract<MatrixSource, { type: "procedural" }>,
): MatrixSourceAdapter {
  const draw = source.draw;
  const animated = source.animated ?? true;
  const background = source.background ?? null;
  let disposed = false;

  return {
    animated,
    draw(context) {
      if (disposed || !hasPositiveDimensions(context.width, context.height)) {
        return IDLE_RESULT;
      }

      const { ctx } = context;

      try {
        ctx.save();
      } catch (cause) {
        return createErrorResult(
          "SOURCE_RUNTIME_ERROR",
          "MatrixEffect 保存程序化 Source 的 Canvas 状态失败。",
          cause,
        );
      }

      let result: MatrixSourceDrawResult = DRAWN_RESULT;

      try {
        resetSamplingContext(context, background);
        const returnedValue: unknown = draw(context);

        if (isThenable(returnedValue)) {
          // 适配器会同步上报契约错误，同时吸收后续 rejection，避免形成未处理 Promise。
          void Promise.resolve(returnedValue).catch(NOOP);
          result = createErrorResult(
            "SOURCE_RUNTIME_ERROR",
            "MatrixEffect 程序化 Source 必须同步完成绘制，不能返回 Promise。",
          );
        }
      } catch (cause) {
        result = createErrorResult(
          "SOURCE_RUNTIME_ERROR",
          "MatrixEffect 程序化 Source 绘制失败。",
          cause,
        );
      }

      try {
        // current path 不属于 Canvas drawing state，必须显式清理以防跨帧残留。
        ctx.beginPath();
      } catch (cause) {
        result = createErrorResult(
          "SOURCE_RUNTIME_ERROR",
          "MatrixEffect 清理程序化 Source 的 Canvas 路径失败。",
          cause,
        );
      }

      return restoreSamplingContext(ctx, result);
    },
    dispose() {
      disposed = true;
    },
  };
}

function createInvalidSourceAdapter(): MatrixSourceAdapter {
  const errorResult = createErrorResult(
    "SOURCE_RUNTIME_ERROR",
    "MatrixEffect 收到了无法识别的 Source 类型。",
  );
  let disposed = false;

  return {
    animated: false,
    draw: () => (disposed ? IDLE_RESULT : errorResult),
    dispose: () => {
      disposed = true;
    },
  };
}

/**
 * 把公共 Source 描述符规范化为核心管线可消费的内部 adapter
 *
 * adapter 创建时会快照描述符配置，但外部 Canvas 和图片的尺寸及像素仍按
 * 每次绘制时的实时值读取。调用方必须在 Source 变化或卸载时调用 dispose。
 */
export function createMatrixSourceAdapter(
  source: MatrixSource,
  options: MatrixSourceAdapterOptions = {},
): MatrixSourceAdapter {
  switch (source.type) {
    case "image":
      return createImageSourceAdapter(source, options);
    case "canvas":
      return createCanvasSourceAdapter(source);
    case "procedural":
      return createProceduralSourceAdapter(source);
    default:
      return createInvalidSourceAdapter();
  }
}

/**
 * 判断采样读取异常是否由跨域或其他 origin-clean 限制导致
 *
 * 使用错误名称而非仅依赖 instanceof DOMException，以兼容跨 realm 异常。
 */
export function isMatrixSourceSecurityError(cause: unknown): boolean {
  if (typeof cause !== "object" || cause === null) {
    return false;
  }

  try {
    return "name" in cause && cause.name === "SecurityError";
  } catch {
    return false;
  }
}

/** 把 getImageData() 异常映射为核心管线使用的结构化 Source 错误 */
export function createMatrixSourceSampleError(
  cause: unknown,
): MatrixEffectError {
  if (isMatrixSourceSecurityError(cause)) {
    return createSourceError(
      "SOURCE_SECURITY_ERROR",
      "MatrixEffect 无法读取采样 Canvas；请使用同源资源，或为远程资源配置正确的 CORS 响应。",
      cause,
    );
  }

  return createSourceError(
    "SOURCE_RUNTIME_ERROR",
    "MatrixEffect 读取采样 Canvas 失败。",
    cause,
  );
}
