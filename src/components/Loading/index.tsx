import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useTranslation } from "react-i18next";
import {
  LoadingComponentProps,
  InlineLoadingProps,
  LoadingWithTextProps,
} from "./types";

// 主加载组件 - 全屏遮罩式
export const LoadingComponent: React.FC<
  LoadingComponentProps & { text?: string }
> = ({ className, text }) => {
  const { t } = useTranslation();

  // 淡入动画
  const fadeIn = useSpring({
    from: { opacity: 0, transform: "scale(0.8)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { tension: 300, friction: 30 },
    delay: 150,
  });

  // 脉冲动画
  const pulse = useSpring({
    from: { transform: "scale(1)", opacity: 0.6 },
    to: { transform: "scale(1.1)", opacity: 1 },
    config: { duration: 1000 },
    loop: { reverse: true },
  });

  return (
    <animated.div
      style={fadeIn}
      className={`opacity-0 fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-center items-center ${className || ""}`}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* 主加载动画 */}
        <animated.div style={pulse}>
          <div className="relative">
            {/* 外层旋转环 */}
            <div className="w-12 h-12 border-2 border-primary/20 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-3 h-3 bg-primary rounded-full"></div>
            </div>
            {/* 内层脉冲点 */}
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
            </div>
          </div>
        </animated.div>

        {/* 加载文字 */}
        <animated.div
          style={{
            ...pulse,
            opacity: pulse.opacity.to((o) => o * 0.7),
          }}
          className="text-sm text-muted-foreground font-medium"
        >
          {text || t("common.loading")}
        </animated.div>

        {/* 进度指示器 */}
        <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary/50 to-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </animated.div>
  );
};

// 简化版加载组件 - 轻量级
export const SimpleLoadingComponent: React.FC<LoadingComponentProps> = ({
  className,
}) => {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 200 },
  });

  return (
    <animated.div
      style={fadeIn}
      className={`flex justify-center items-center h-32 ${className || ""}`}
    >
      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    </animated.div>
  );
};

// 内联小型加载组件 - 用于按钮等小空间
export const InlineLoadingComponent: React.FC<InlineLoadingProps> = ({
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "w-3 h-3 border",
    md: "w-4 h-4 border-2",
    lg: "w-5 h-5 border-2",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-primary/30 border-t-primary rounded-full animate-spin ${className || ""}`}
    />
  );
};

// 带文字的加载组件
export const LoadingWithText: React.FC<LoadingWithTextProps> = ({
  text,
  size = "md",
  className,
}) => {
  const { t } = useTranslation();

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 200 },
  });

  const sizeClasses = {
    sm: "w-4 h-4 border text-sm",
    md: "w-5 h-5 border-2 text-base",
    lg: "w-6 h-6 border-2 text-lg",
  };

  return (
    <animated.div
      style={fadeIn}
      className={`flex flex-col items-center space-y-2 ${className || ""}`}
    >
      <div
        className={`${sizeClasses[size]} border-primary/30 border-t-primary rounded-full animate-spin`}
      />
      <div className="text-muted-foreground font-medium">
        {text || t("common.loading")}
      </div>
    </animated.div>
  );
};

// 默认导出主加载组件
export default LoadingComponent;
