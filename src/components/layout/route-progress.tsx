import { AnimatePresence, motion } from "motion/react"
import { useNavigation } from "react-router"

/** 路由切换（懒加载页面 / loader）期间显示在顶部的细进度条 */
export function RouteProgress() {
  const navigation = useNavigation()
  const busy = navigation.state !== "idle"

  return (
    <AnimatePresence>
      {busy && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-[100] h-0.5 origin-left bg-brand"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{
            scaleX: 0.8,
            transition: { duration: 2, ease: [0.1, 0.6, 0.3, 1] },
          }}
          exit={{ scaleX: 1, opacity: 0, transition: { duration: 0.25 } }}
        />
      )}
    </AnimatePresence>
  )
}
