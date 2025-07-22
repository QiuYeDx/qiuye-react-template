import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LoadingConfig {
  text?: string;
  className?: string;
  delay?: number;
  duration?: number; // 自动隐藏的持续时间，0表示不自动隐藏
}

interface LoadingState {
  isLoading: boolean;
  config: LoadingConfig;
  timeoutId: NodeJS.Timeout | null;
}

interface LoadingActions {
  showLoading: (config?: LoadingConfig) => void;
  hideLoading: () => void;
  setConfig: (config: LoadingConfig) => void;
}

export type LoadingStore = LoadingState & LoadingActions;

export const useLoadingStore = create<LoadingStore>()(
  persist(
    (set, get) => ({
      // 状态
      isLoading: false,
      config: {},
      timeoutId: null,

      // 显示Loading
      showLoading: (config: LoadingConfig = {}) => {
        const { timeoutId } = get();

        // 清除之前的定时器
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // 应用延迟显示
        const delay = config.delay || 0;

        const showHandler = () => {
          set({
            isLoading: true,
            config,
            timeoutId: null,
          });

          // 如果设置了持续时间，自动隐藏
          if (config.duration && config.duration > 0) {
            const hideTimeoutId = setTimeout(() => {
              set({ isLoading: false, timeoutId: null });
            }, config.duration);

            set({ timeoutId: hideTimeoutId });
          }
        };

        if (delay > 0) {
          const delayTimeoutId = setTimeout(showHandler, delay);
          set({ timeoutId: delayTimeoutId });
        } else {
          showHandler();
        }
      },

      // 隐藏Loading
      hideLoading: () => {
        const { timeoutId } = get();

        // 清除定时器
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        set({
          isLoading: false,
          timeoutId: null,
        });
      },

      // 设置配置
      setConfig: (config: LoadingConfig) => {
        set({ config });
      },
    }),
    {
      name: "loading-store",
      // 只持久化配置，不持久化加载状态
      partialize: (state) => ({
        config: state.config,
      }),
    }
  )
);

// 便捷的Loading控制器
export class LoadingController {
  /**
   * 显示全局Loading
   * @param config Loading配置
   */
  static show(config?: LoadingConfig) {
    useLoadingStore.getState().showLoading(config);
  }

  /**
   * 隐藏全局Loading
   */
  static hide() {
    useLoadingStore.getState().hideLoading();
  }

  /**
   * 显示Loading指定时间后自动隐藏
   * @param duration 持续时间（毫秒）
   * @param config 其他配置
   */
  static showFor(duration: number, config?: Omit<LoadingConfig, "duration">) {
    LoadingController.show({ ...config, duration });
  }

  /**
   * 延迟显示Loading
   * @param delay 延迟时间（毫秒）
   * @param config 其他配置
   */
  static showWithDelay(delay: number, config?: Omit<LoadingConfig, "delay">) {
    LoadingController.show({ ...config, delay });
  }

  /**
   * 异步操作包装器
   * @param asyncFn 异步函数
   * @param config Loading配置
   */
  static async withLoading<T>(
    asyncFn: () => Promise<T>,
    config?: LoadingConfig
  ): Promise<T> {
    try {
      LoadingController.show(config);
      const result = await asyncFn();
      return result;
    } finally {
      LoadingController.hide();
    }
  }

  /**
   * 获取当前Loading状态
   */
  static get isLoading() {
    return useLoadingStore.getState().isLoading;
  }
}

// 导出便捷函数
export const showGlobalLoading = LoadingController.show;
export const hideGlobalLoading = LoadingController.hide;
export const withGlobalLoading = LoadingController.withLoading;
