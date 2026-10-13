import type * as React from "react";

/** 图片或 Canvas 输入适配到采样画布时的缩放方式 */
export type MatrixFit = "cover" | "contain" | "fill";

/** Source 在采样画布中的归一化对齐位置 */
export interface MatrixSourcePosition {
  /** 水平位置，0 为左侧，0.5 为居中，1 为右侧 */
  x: number;
  /** 垂直位置，0 为顶部，0.5 为居中，1 为底部 */
  y: number;
}

/** MatrixEffect 支持的图片输入 */
export type MatrixImageInput = string | Blob | HTMLImageElement | ImageBitmap;

/** 图片 Source 描述符 */
export interface MatrixImageSource {
  /** Source 类型判别字段 */
  type: "image";
  /** 图片 URL、Blob、HTMLImageElement 或 ImageBitmap */
  src: MatrixImageInput;
  /**
   * 图片适配到采样画布的方式
   * @default "cover"
   */
  fit?: MatrixFit;
  /**
   * 图片裁切或留白时的对齐位置
   * @default { x: 0.5, y: 0.5 }
   */
  position?: MatrixSourcePosition;
  /**
   * 降采样时是否启用图像平滑
   * @default true
   */
  smoothing?: boolean;
  /**
   * 绘制图片前填充的采样场背景色，null 表示透明
   * @default null
   */
  background?: string | null;
  /** 远程图片的跨域请求模式 */
  crossOrigin?: "anonymous" | "use-credentials";
}

/** 外部 Canvas Source 描述符 */
export interface MatrixCanvasSource {
  /** Source 类型判别字段 */
  type: "canvas";
  /** 外部 Canvas，或按需返回当前 Canvas 的 supplier */
  canvas:
    | HTMLCanvasElement
    | OffscreenCanvas
    | (() => HTMLCanvasElement | OffscreenCanvas | null);
  /**
   * 外部 Canvas 是否会持续更新
   * @default false
   */
  animated?: boolean;
  /**
   * 外部 Canvas 适配到采样画布的方式
   * @default "cover"
   */
  fit?: MatrixFit;
  /**
   * 外部 Canvas 裁切或留白时的对齐位置
   * @default { x: 0.5, y: 0.5 }
   */
  position?: MatrixSourcePosition;
  /**
   * 降采样时是否启用图像平滑
   * @default true
   */
  smoothing?: boolean;
  /**
   * 绘制外部 Canvas 前填充的采样场背景色，null 表示透明
   * @default null
   */
  background?: string | null;
}

/** 程序化 Source 每次绘制时收到的上下文 */
export interface MatrixProceduralContext {
  /** 内部采样 Canvas 的 2D 上下文 */
  ctx: CanvasRenderingContext2D;
  /** 采样画布宽度，等于 columns */
  width: number;
  /** 采样画布高度，等于 rows */
  height: number;
  /** 当前网格列数 */
  columns: number;
  /** 当前网格行数 */
  rows: number;
  /** 动画有效播放时间，单位秒 */
  time: number;
  /** 与上一个已绘制帧的有效间隔，单位秒 */
  deltaTime: number;
  /** 当前绘制尝试的帧序号；仅在上一整帧成功后推进 */
  frame: number;
}

/** 程序化 Source 描述符 */
export interface MatrixProceduralSource {
  /** Source 类型判别字段 */
  type: "procedural";
  /**
   * 在低分辨率采样画布中同步绘制当前信号场
   *
   * 绘制上下文只在本次调用期间有效，不能返回 Promise 或异步保存后继续使用。
   */
  draw: (context: MatrixProceduralContext) => void;
  /**
   * 是否需要持续帧循环
   * @default true
   */
  animated?: boolean;
  /**
   * 调用 draw 前填充的采样场背景色，null 表示透明
   * @default null
   */
  background?: string | null;
}

/** 程序化柔和光团 Source 的配置 */
export interface SoftBlobSourceOptions {
  /**
   * 参与叠加的光团数量，小数向下取整后限制在 1 到 6
   * @default 3
   */
  count?: number;
  /**
   * 光团最小半径，相对于采样画布短边的比例，限制在 0.01 到 2
   * @default 0.2
   */
  minRadius?: number;
  /**
   * 光团最大半径，相对于采样画布短边的比例，限制在 0.01 到 2
   * @default 0.45
   */
  maxRadius?: number;
  /**
   * 光团轨迹的基础相位速度，单位为弧度/秒；限制在 0 到 4，0 表示静态 Source
   * @default 0.14
   */
  speed?: number;
  /**
   * 光团之外的基础灰度，最终限制在 0 到 1
   * @default 0.04
   */
  baseValue?: number;
  /**
   * 生成光团参数的确定性种子，小数会先截断为 32 位整数
   * @default 1
   */
  seed?: number;
}

/** MatrixEffect 支持的全部 Source 描述符 */
export type MatrixSource =
  | MatrixImageSource
  | MatrixCanvasSource
  | MatrixProceduralSource;

/** MatrixEffect 的响应式或固定网格配置 */
export type MatrixGridConfig =
  | {
      /**
       * 根据容器比例和目标单元格尺寸自动计算网格
       * @default "auto"
       */
      mode?: "auto";
      /**
       * 目标单元格宽度，单位为 CSS px
       * @default 10
       */
      cellSize?: number;
      /** 单元格宽高比（宽 / 高），默认优先采用 Renderer 提示 */
      cellAspectRatio?: number;
      /**
       * 允许的最大单元格数
       * @default 10000
       */
      maxCells?: number;
      /** 自动模式不接受固定列数 */
      columns?: never;
      /** 自动模式不接受固定行数 */
      rows?: never;
    }
  | {
      /** 使用固定列数，以及可选的固定行数 */
      mode: "fixed";
      /** 固定列数 */
      columns: number;
      /** 未传时根据容器比例和 cellAspectRatio 推导 */
      rows?: number;
      /** 单元格宽高比（宽 / 高），默认优先采用 Renderer 提示 */
      cellAspectRatio?: number;
      /**
       * 允许的最大单元格数
       * @default 10000
       */
      maxCells?: number;
      /** 固定模式不接受自动模式的目标单元格宽度 */
      cellSize?: never;
    };

/** 单帧的采样数据和主信号缓冲区 */
export interface MatrixFrame {
  /** 当前网格列数 */
  readonly columns: number;
  /** 当前网格行数 */
  readonly rows: number;
  /** 与单元格一一对应的原始 RGBA 采样数据 */
  readonly rgba: Uint8ClampedArray;
  /** 当前主信号；Mapper 和 Transform 可以原地写入 */
  readonly values: Float32Array;
  /** 上一个成功绘制帧的最终信号；首帧或缓冲重置后为 null */
  readonly previousValues: Float32Array | null;
}

/** Mapper、Transform 与 Renderer 共享的单帧运行上下文 */
export interface MatrixFrameContext {
  /** 动画有效播放时间，单位秒；暂停期间不累计 */
  readonly time: number;
  /** 与上一个已绘制帧的间隔，单位秒，并由核心限制异常大值 */
  readonly deltaTime: number;
  /** 当前绘制尝试的帧序号；仅在上一整帧成功后推进 */
  readonly frame: number;
  /** 输出 Canvas 的 CSS 宽度 */
  readonly cssWidth: number;
  /** 输出 Canvas 的 CSS 高度 */
  readonly cssHeight: number;
  /** 单元格的 CSS 宽度 */
  readonly cellWidth: number;
  /** 单元格的 CSS 高度 */
  readonly cellHeight: number;
  /** 当前输出 Canvas 使用的有效设备像素比 */
  readonly dpr: number;
}

/**
 * 把原始 RGBA 采样数据映射到主信号的同步函数
 *
 * 回调必须在本次调用中完成写入，不能返回 Promise 或异步持有 frame/context。
 */
export type MatrixSignalMapper = (
  frame: MatrixFrame,
  context: MatrixFrameContext,
) => void;

/**
 * 原地转换整帧主信号的同步函数
 *
 * 回调必须在本次调用中完成转换，不能返回 Promise 或异步持有 frame/context。
 */
export type MatrixSignalTransform = (
  frame: MatrixFrame,
  context: MatrixFrameContext,
) => void;

/** 亮度 Mapper 的配置 */
export interface LuminanceMapperOptions {
  /**
   * RGB 权重；总和有限且大于 0 的合法权重会被归一化
   * @default [0.2126, 0.7152, 0.0722]
   */
  weights?: readonly [red: number, green: number, blue: number];
}

/** Levels Transform 的配置 */
export interface LevelsTransformOptions {
  /**
   * 输入黑场位置
   * @default 0
   */
  inputMin?: number;
  /**
   * 输入白场位置
   * @default 1
   */
  inputMax?: number;
  /**
   * 最后叠加到信号的亮度偏移
   * @default 0
   */
  brightness?: number;
  /**
   * 围绕 0.5 应用的对比度倍数
   * @default 1
   */
  contrast?: number;
  /**
   * Gamma 值；大于 1 时提亮中间调
   * @default 1
   */
  gamma?: number;
}

/** Threshold Transform 的配置 */
export interface ThresholdTransformOptions {
  /**
   * 二值化阈值
   * @default 0.5
   */
  threshold?: number;
  /**
   * 阈值两侧的平滑过渡半宽，0 表示硬阈值
   * @default 0
   */
  softness?: number;
}

/** Temporal smoothing Transform 的配置 */
export interface TemporalSmoothingTransformOptions {
  /**
   * 指数响应时间常数，单位毫秒；0 表示立即跟随当前帧
   */
  responseMs: number;
}

/** MatrixEffect 的整帧 Renderer 契约 */
export interface MatrixRenderer {
  /** Renderer 建议的单元格宽高比（宽 / 高） */
  readonly cellAspectRatio?: number;
  /** Renderer 建议的自动模式目标帧率 */
  readonly preferredFrameRate?: 30 | 60;
  /**
   * 在 Canvas、网格、DPR 或 Renderer 身份变化后同步准备缓存
   *
   * ctx 指向内部 staging Canvas，并非 MatrixEffectHandle.canvas。回调不能返回
   * Promise；额外调用的 save()/restore() 必须自行配平。
   */
  prepare?(
    ctx: CanvasRenderingContext2D,
    frame: MatrixFrame,
    context: MatrixFrameContext,
  ): void;
  /**
   * 把当前整帧信号同步绘制到内部 staging Canvas
   *
   * 完整成功后核心才会提交到可见 Canvas。回调不能返回 Promise 或异步持有
   * ctx/frame/context；额外调用的 save()/restore() 必须自行配平。
   */
  render(
    ctx: CanvasRenderingContext2D,
    frame: MatrixFrame,
    context: MatrixFrameContext,
  ): void;
  /**
   * Renderer 被替换或组件真正卸载时同步释放内部资源
   *
   * 同一实例同一时刻只能由一个 MatrixEffect 独占使用；开发环境 Strict Mode
   * 的立即 cleanup/setup 会由核心合并。实现必须幂等，且不能返回 Promise。
   */
  dispose?(): void;
}

/** `createCellRenderer` 回调收到的单个单元格瞬时视图 */
export interface MatrixRenderCell {
  /** 单元格在线性缓冲区中的索引 */
  index: number;
  /** 单元格列索引 */
  column: number;
  /** 单元格行索引 */
  row: number;
  /** 单元格左上角的 CSS x 坐标 */
  x: number;
  /** 单元格左上角的 CSS y 坐标 */
  y: number;
  /** 单元格中心的 CSS x 坐标 */
  centerX: number;
  /** 单元格中心的 CSS y 坐标 */
  centerY: number;
  /** 单元格 CSS 宽度 */
  width: number;
  /** 单元格 CSS 高度 */
  height: number;
  /** 单元格中心的横向归一化坐标 */
  u: number;
  /** 单元格中心的纵向归一化坐标 */
  v: number;
  /** 当前主信号值 */
  value: number;
  /** 原始采样红色通道，范围为 0 到 255 */
  r: number;
  /** 原始采样绿色通道，范围为 0 到 255 */
  g: number;
  /** 原始采样蓝色通道，范围为 0 到 255 */
  b: number;
  /** 原始采样 Alpha 通道，范围为 0 到 255 */
  a: number;
}

/** `createCellRenderer` 的 Renderer 提示配置 */
export interface CellRendererOptions {
  /** Renderer 建议的单元格宽高比（宽 / 高） */
  cellAspectRatio?: number;
  /** Renderer 建议的自动模式目标帧率 */
  preferredFrameRate?: 30 | 60;
}

/**
 * 把 0 到 1 的主信号同步转换为 Dot 视觉强度的纯函数
 *
 * 返回值会被重新限制到 0 到 1；不能返回 Promise 或异步持有渲染帧状态。
 */
export type DotValueCurve = (value: number) => number;

/** Dot Renderer 的配置 */
export interface DotRendererOptions {
  /**
   * 固定 CSS 颜色，或使用 `"source"` 保留每个采样格的 RGB
   * @default "#71717a"
   */
  color?: string | "source";
  /**
   * 主信号从 0 到 1 时对应的半径范围，单位为 CSS px
   *
   * 实际半径还会被限制到当前单元格可容纳的范围。
   * @default [0, 4]
   */
  radiusRange?: readonly [minimum: number, maximum: number];
  /**
   * 主信号从 0 到 1 时对应的不透明度范围
   * @default [1, 1]
   */
  opacityRange?: readonly [minimum: number, maximum: number];
  /**
   * 在计算半径和不透明度前同步应用的纯值曲线，不能返回 Promise
   * @default value => value
   */
  valueCurve?: DotValueCurve;
}

/** ASCII Renderer 的配置 */
export interface AsciiRendererOptions {
  /**
   * 从低视觉密度到高视觉密度排列的字符集
   *
   * 字符串按 Unicode code point 拆分；数组中的每个成员视为一个完整 glyph。
   * 空字符串或空数组回退默认字符集。
   * @default " .:-=+*#%@"
   */
  characters?: string | readonly string[];
  /**
   * 使用统一固定色，或保留每个采样格的 Source RGB
   * @default "fixed"
   */
  colorMode?: "fixed" | "source";
  /**
   * 固定色模式下的 CSS 颜色
   * @default "#71717a"
   */
  color?: string;
  /**
   * Renderer 绘制字符前填充的背景色，null 表示不额外填充
   *
   * 该背景在 MatrixEffect 的 clearColor 之后使用 source-over 绘制：
   * 不透明色会覆盖 clearColor，半透明色会与其叠加。
   * @default null
   */
  backgroundColor?: string | null;
  /**
   * Canvas 文本使用的字体族
   * @default "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
   */
  fontFamily?: string;
  /**
   * Canvas 文本使用的字重
   * @default 400
   */
  fontWeight?: number | string;
  /**
   * 字号相对于单元格高度的比例；非有限或小于等于 0 时回退默认值
   * @default 1
   */
  fontScale?: number;
}

/** MatrixEffect 支持的目标帧率模式 */
export type MatrixFrameRate = "auto" | 30 | 60;

/** MatrixEffect 对系统减少动态效果偏好的处理方式 */
export type MatrixReducedMotion = "freeze" | "ignore";

/** MatrixEffect 的低频生命周期状态 */
export type MatrixEffectStatus = "idle" | "loading" | "ready" | "error";

/** MatrixEffect 上报给调用方的结构化错误 */
export interface MatrixEffectError {
  /** 错误所属的管线阶段 */
  code:
    | "SOURCE_LOAD_FAILED"
    | "SOURCE_SECURITY_ERROR"
    | "CANVAS_CONTEXT_UNAVAILABLE"
    | "SOURCE_RUNTIME_ERROR"
    | "MAPPER_RUNTIME_ERROR"
    | "TRANSFORM_RUNTIME_ERROR"
    | "RENDERER_RUNTIME_ERROR";
  /** 面向开发者的错误说明 */
  message: string;
  /** Source 或配置变化后是否允许自动重试 */
  recoverable: boolean;
  /** 原始异常或错误值 */
  cause?: unknown;
}

/** MatrixEffect 通过 ref 暴露的命令式句柄 */
export interface MatrixEffectHandle {
  /** 当前输出 Canvas；挂载完成前为 null */
  readonly canvas: HTMLCanvasElement | null;
  /** 标记 dirty 并请求合并重绘一帧 */
  invalidate(): void;
}

/** MatrixEffect 核心组件的属性 */
export interface MatrixEffectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "dangerouslySetInnerHTML" | "onError"
> {
  /**
   * 输入图片、外部 Canvas 或程序化信号场
   *
   * Source descriptor 按对象身份作为切换边界，并视为不可变配置。请使用模块常量
   * 或 `useMemo` 保持稳定身份；需要更新时创建新的 descriptor。
   */
  source: MatrixSource;
  /** 把最终主信号绘制到输出 Canvas 的 Renderer */
  renderer: MatrixRenderer;
  /**
   * 把原始 RGBA 数据写入主信号的 Mapper
   * @default createLuminanceMapper()
   */
  mapper?: MatrixSignalMapper;
  /**
   * 按数组顺序执行的整帧信号转换链
   * @default []
   */
  transforms?: readonly MatrixSignalTransform[];
  /**
   * 响应式或固定网格配置
   * @default { mode: "auto", cellSize: 10, maxCells: 10000 }
   */
  grid?: MatrixGridConfig;
  /**
   * 是否允许动态 Source 连续播放
   * @default true
   */
  playing?: boolean;
  /**
   * 固定或自动目标帧率
   * @default "auto"
   */
  frameRate?: MatrixFrameRate;
  /**
   * 输出 Canvas 使用的最大设备像素比
   * @default 2
   */
  maxDpr?: number;
  /**
   * 组件离开视口后是否暂停连续绘制
   * @default true
   */
  pauseWhenOffscreen?: boolean;
  /**
   * 系统偏好减少动态效果时的处理方式
   * @default "freeze"
   */
  reducedMotion?: MatrixReducedMotion;
  /**
   * Renderer 执行前的输出 Canvas 清屏颜色，null 表示透明
   * @default null
   */
  clearColor?: string | null;
  /** 输出 Canvas 的 className */
  canvasClassName?: string;
  /**
   * 是否把输出 Canvas 标记为纯装饰内容
   * @default true
   */
  decorative?: boolean;
  /** decorative=false 时用于描述 Canvas 内容的无障碍标签 */
  ariaLabel?: string;
  /** 尚无成功帧且组件发生错误时显示的替代内容 */
  fallback?: React.ReactNode;
  /** 生命周期状态变化时触发 */
  onStatusChange?: (status: MatrixEffectStatus) => void;
  /** 每个 Source 首次成功绘制后触发 */
  onReady?: () => void;
  /** 发生结构化 Source 或管线错误时触发 */
  onError?: (error: MatrixEffectError) => void;
}

/** DotMatrixEffect 圆点矩阵预设的属性 */
export interface DotMatrixEffectProps extends Omit<
  MatrixEffectProps,
  "source" | "renderer" | "mapper" | "transforms" | "clearColor"
> {
  /**
   * 自定义输入 Source；未传时使用内置柔和光团 Source
   * @default createSoftBlobSource(blobOptions)
   */
  source?: MatrixSource;
  /** 内置柔和光团 Source 的配置；传入 source 时忽略 */
  blobOptions?: SoftBlobSourceOptions;
  /**
   * 固定 CSS 颜色，或使用 `"source"` 保留每个采样格的 RGB
   * @default "#71717a"
   */
  color?: string | "source";
  /**
   * 输出 Canvas 的清屏颜色，null 表示透明
   * @default null
   */
  backgroundColor?: string | null;
  /**
   * 主信号从 0 到 1 时对应的半径范围，单位为 CSS px
   * @default [0, 4]
   */
  radiusRange?: readonly [minimum: number, maximum: number];
  /**
   * 主信号从 0 到 1 时对应的不透明度范围
   * @default [1, 1]
   */
  opacityRange?: readonly [minimum: number, maximum: number];
  /**
   * 是否在 Levels 之前反转主信号
   * @default false
   */
  invert?: boolean;
  /** 可选的输入范围、Gamma、对比度和亮度调整 */
  levels?: LevelsTransformOptions;
  /**
   * 在预设 Invert 和 Levels 之后按顺序执行的额外 Transform
   * @default []
   */
  additionalTransforms?: readonly MatrixSignalTransform[];
}

/** AsciiEffect 字符艺术预设的属性 */
export interface AsciiEffectProps extends Omit<
  MatrixEffectProps,
  "source" | "renderer" | "mapper" | "transforms" | "clearColor" | "grid"
> {
  /** 必填的图片、外部 Canvas 或程序化输入 Source */
  source: MatrixSource;
  /**
   * 响应式或固定网格配置
   * @default { mode: "auto", cellSize: 10, cellAspectRatio: 1, maxCells: 6000 }
   */
  grid?: MatrixGridConfig;
  /**
   * 从低视觉密度到高视觉密度排列的字符集
   *
   * 字符串按 Unicode code point 拆分；数组中的每个成员视为一个完整 glyph。
   * 空字符串或空数组回退默认字符集。
   * @default " .:-=+*#%@"
   */
  characters?: string | readonly string[];
  /**
   * 使用统一固定色，或保留每个采样格的 Source RGB
   * @default "fixed"
   */
  colorMode?: "fixed" | "source";
  /**
   * 固定色模式下的 CSS 颜色
   * @default "#71717a"
   */
  color?: string;
  /**
   * 输出 Canvas 的清屏颜色，null 表示透明
   * @default null
   */
  backgroundColor?: string | null;
  /**
   * Canvas 文本使用的字体族
   * @default "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
   */
  fontFamily?: string;
  /**
   * Canvas 文本使用的字重
   * @default 400
   */
  fontWeight?: number | string;
  /**
   * 字号相对于单元格高度的比例；非有限或小于等于 0 时回退默认值
   * @default 1
   */
  fontScale?: number;
  /**
   * 是否在 Levels 之前反转主信号
   * @default false
   */
  invert?: boolean;
  /** 可选的输入范围、Gamma、对比度和亮度调整 */
  levels?: LevelsTransformOptions;
  /**
   * 在预设 Invert 和 Levels 之后按顺序执行的额外 Transform
   * @default []
   */
  additionalTransforms?: readonly MatrixSignalTransform[];
}
