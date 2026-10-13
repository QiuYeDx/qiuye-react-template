import { motion, type HTMLMotionProps } from "motion/react"

/** 进入视口时轻微上移并淡入、只播放一次的动画参数，可直接展开到任意 motion 元素上 */
export const revealProps = (delay = 0) =>
  ({
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -64px 0px" },
    transition: { type: "spring", duration: 0.6, bounce: 0, delay },
  }) as const

interface RevealProps extends HTMLMotionProps<"div"> {
  /** 入场延迟（秒） */
  delay?: number
}

export function Reveal({ delay = 0, ...props }: RevealProps) {
  return <motion.div {...revealProps(delay)} {...props} />
}
