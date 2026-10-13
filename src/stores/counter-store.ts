import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
  reset: () => void
}

/** 示例 store：演示 Zustand + persist 中间件，可按需删除 */
export const useCounterStore = create<CounterState>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: "counter",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ count: state.count }),
    }
  )
)
