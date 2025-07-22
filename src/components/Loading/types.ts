export type LoadingSize = "sm" | "md" | "lg";

export interface LoadingComponentProps {
  className?: string;
}

export interface InlineLoadingProps {
  size?: LoadingSize;
  className?: string;
}

export interface LoadingWithTextProps {
  text?: string;
  size?: LoadingSize;
  className?: string;
}

// 加载状态枚举
export enum LoadingState {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

// 加载配置类型
export interface LoadingConfig {
  showText?: boolean;
  text?: string;
  size?: LoadingSize;
  delay?: number;
  duration?: number;
}
