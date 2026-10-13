import type {
  LevelsTransformOptions,
  LuminanceMapperOptions,
  MatrixSignalMapper,
  MatrixSignalTransform,
  TemporalSmoothingTransformOptions,
  ThresholdTransformOptions,
} from "./types";

const REC_709_WEIGHTS = [0.2126, 0.7152, 0.0722] as const;
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

function clampUnit(value: number) {
  if (value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 1;
  }

  return value;
}

function normalizeFiniteOption(
  value: number | undefined,
  fallback: number,
  issue: string,
  message: string,
) {
  if (value === undefined) {
    return fallback;
  }

  if (Number.isFinite(value)) {
    return value;
  }

  warnOnce(issue, message);
  return fallback;
}

function normalizeLuminanceWeights(
  options?: LuminanceMapperOptions,
): readonly [number, number, number] {
  const weights = options?.weights;

  if (weights === undefined) {
    return REC_709_WEIGHTS;
  }

  const [red, green, blue] = weights;
  const sum = red + green + blue;
  const isValid =
    Number.isFinite(red) &&
    Number.isFinite(green) &&
    Number.isFinite(blue) &&
    red >= 0 &&
    green >= 0 &&
    blue >= 0 &&
    Number.isFinite(sum) &&
    sum > 0;

  if (!isValid) {
    warnOnce(
      "luminance-weights",
      "亮度权重必须是三个有限非负数，且总和必须有限并大于 0；已回退到 Rec.709。",
    );
    return REC_709_WEIGHTS;
  }

  return [red / sum, green / sum, blue / sum];
}

/**
 * 创建把 RGBA 采样映射为视觉亮度的 Mapper
 *
 * - 默认使用 Rec.709 RGB 权重
 * - 合法自定义权重会在创建时归一化并快照
 * - Alpha 不参与亮度计算，也不会被修改
 *
 * @example
 * ```ts
 * const redChannelMapper = createLuminanceMapper({ weights: [1, 0, 0] });
 * ```
 */
export function createLuminanceMapper(
  options?: LuminanceMapperOptions,
): MatrixSignalMapper {
  const [redWeight, greenWeight, blueWeight] =
    normalizeLuminanceWeights(options);

  return (frame) => {
    const { rgba, values } = frame;

    for (let index = 0, rgbaIndex = 0; index < values.length; index += 1) {
      values[index] =
        (rgba[rgbaIndex] * redWeight +
          rgba[rgbaIndex + 1] * greenWeight +
          rgba[rgbaIndex + 2] * blueWeight) /
        255;
      rgbaIndex += 4;
    }
  };
}

/**
 * 创建主信号反相 Transform
 *
 * 有限值按 `1 - value` 原地转换；非有限值保留给 MatrixEffect 在整条
 * Transform 管线结束后统一归零和裁切。
 *
 * @example
 * ```ts
 * const invert = createInvertTransform();
 * ```
 */
export function createInvertTransform(): MatrixSignalTransform {
  return (frame) => {
    const { values } = frame;

    for (let index = 0; index < values.length; index += 1) {
      const value = values[index];

      if (Number.isFinite(value)) {
        values[index] = 1 - value;
      }
    }
  };
}

/**
 * 创建输入范围、Gamma、对比度和亮度 Transform
 *
 * 处理顺序固定为输入范围归一化、Gamma、对比度、亮度。工厂会在创建时
 * 快照配置；最终 `[0, 1]` 裁切由 MatrixEffect 在完整转换链后统一执行。
 *
 * @example
 * ```ts
 * const levels = createLevelsTransform({
 *   inputMin: 0.15,
 *   inputMax: 0.85,
 *   gamma: 1.2,
 *   contrast: 1.1,
 * });
 * ```
 */
export function createLevelsTransform(
  options: LevelsTransformOptions = {},
): MatrixSignalTransform {
  let inputMin = normalizeFiniteOption(
    options.inputMin,
    0,
    "levels-input-min",
    "Levels inputMin 必须是有限数；已回退到 0。",
  );
  let inputMax = normalizeFiniteOption(
    options.inputMax,
    1,
    "levels-input-max",
    "Levels inputMax 必须是有限数；已回退到 1。",
  );
  let inputSpan = inputMax - inputMin;

  if (!Number.isFinite(inputSpan) || inputSpan <= 0) {
    warnOnce(
      "levels-input-range",
      "Levels 输入范围必须具有有限且大于 0 的跨度；已回退到 0 到 1。",
    );
    inputMin = 0;
    inputMax = 1;
    inputSpan = inputMax - inputMin;
  }

  const brightness = normalizeFiniteOption(
    options.brightness,
    0,
    "levels-brightness",
    "Levels brightness 必须是有限数；已回退到 0。",
  );
  const rawContrast = normalizeFiniteOption(
    options.contrast,
    1,
    "levels-contrast-finite",
    "Levels contrast 必须是有限非负数；已回退到 1。",
  );
  const contrast = rawContrast >= 0 ? rawContrast : 1;

  if (rawContrast < 0) {
    warnOnce(
      "levels-contrast-range",
      "Levels contrast 不能为负数；已回退到 1。",
    );
  }

  const rawGamma = normalizeFiniteOption(
    options.gamma,
    1,
    "levels-gamma-finite",
    "Levels gamma 必须是有限正数；已回退到 1。",
  );
  const rawGammaExponent = 1 / rawGamma;
  const isGammaValid =
    rawGamma > 0 && Number.isFinite(rawGammaExponent) && rawGammaExponent > 0;
  const gammaExponent = isGammaValid ? rawGammaExponent : 1;

  if (!isGammaValid) {
    warnOnce(
      "levels-gamma-range",
      "Levels gamma 必须是可安全求倒数的正数；已回退到 1。",
    );
  }

  return (frame) => {
    const { values } = frame;

    for (let index = 0; index < values.length; index += 1) {
      const value = values[index];

      if (!Number.isFinite(value)) {
        continue;
      }

      let output = clampUnit((value - inputMin) / inputSpan);
      output = Math.pow(output, gammaExponent);
      output = (output - 0.5) * contrast + 0.5;
      values[index] = output + brightness;
    }
  };
}

/**
 * 创建硬阈值或带 smoothstep 过渡的 Threshold Transform
 *
 * `softness` 表示阈值两侧的过渡半宽。值等于硬阈值时归入高侧；
 * 非有限 signal 值保留给 MatrixEffect 在完整转换链后统一处理。
 *
 * @example
 * ```ts
 * const threshold = createThresholdTransform({
 *   threshold: 0.55,
 *   softness: 0.08,
 * });
 * ```
 */
export function createThresholdTransform(
  options: ThresholdTransformOptions = {},
): MatrixSignalTransform {
  const threshold = normalizeFiniteOption(
    options.threshold,
    0.5,
    "threshold-value",
    "Threshold threshold 必须是有限数；已回退到 0.5。",
  );
  const rawSoftness = normalizeFiniteOption(
    options.softness,
    0,
    "threshold-softness-finite",
    "Threshold softness 必须是有限非负数；已回退到 0。",
  );
  const softness = rawSoftness >= 0 ? rawSoftness : 0;

  if (rawSoftness < 0) {
    warnOnce(
      "threshold-softness-range",
      "Threshold softness 不能为负数；已回退到 0。",
    );
  }

  if (softness === 0) {
    return (frame) => {
      const { values } = frame;

      for (let index = 0; index < values.length; index += 1) {
        const value = values[index];

        if (Number.isFinite(value)) {
          values[index] = value >= threshold ? 1 : 0;
        }
      }
    };
  }

  return (frame) => {
    const { values } = frame;

    for (let index = 0; index < values.length; index += 1) {
      const value = values[index];

      if (!Number.isFinite(value)) {
        continue;
      }

      const normalized = clampUnit(
        0.5 + 0.5 * ((value - threshold) / softness),
      );
      values[index] = normalized * normalized * (3 - 2 * normalized);
    }
  };
}

/**
 * 创建基于上一成功帧的时间无关指数平滑 Transform
 *
 * - `responseMs` 是到达目标约 63.2% 的指数时间常数
 * - 首帧、缓冲长度变化或 responseMs=0 时保留当前帧
 * - 应放在转换链最后，并用于具有持续帧循环的动态 Source
 *
 * @example
 * ```ts
 * const smoothing = createTemporalSmoothingTransform({ responseMs: 120 });
 * ```
 */
export function createTemporalSmoothingTransform(
  options: TemporalSmoothingTransformOptions,
): MatrixSignalTransform {
  const rawResponseMs = options?.responseMs;
  const isResponseValid = Number.isFinite(rawResponseMs) && rawResponseMs >= 0;
  const responseMs = isResponseValid ? rawResponseMs : 0;

  if (!isResponseValid) {
    warnOnce(
      "temporal-response",
      "Temporal smoothing responseMs 必须是有限非负数；已按 0 处理并立即跟随当前帧。",
    );
  }

  return (frame, context) => {
    const { previousValues, values } = frame;

    if (
      responseMs === 0 ||
      previousValues === null ||
      previousValues.length !== values.length
    ) {
      return;
    }

    const deltaTime = Number.isFinite(context.deltaTime)
      ? Math.max(0, context.deltaTime)
      : 0;
    const alpha = -Math.expm1((-deltaTime * 1000) / responseMs);

    for (let index = 0; index < values.length; index += 1) {
      const current = values[index];
      const previous = previousValues[index];

      if (!Number.isFinite(current) || !Number.isFinite(previous)) {
        continue;
      }

      values[index] = previous + (current - previous) * alpha;
    }
  };
}
