import { useId, type SVGProps } from "react"

import { cn } from "@/lib/utils"

/** 秋叶 Logo 图形，渐变 id 通过 useId 生成，同页多次渲染也不会冲突 */
export function LogoMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  const id = useId()
  const front = `${id}-front`
  const back = `${id}-back`

  return (
    <svg
      viewBox="4 7 28 28"
      aria-hidden="true"
      className={cn("size-6 shrink-0", className)}
      {...props}
    >
      <defs>
        <linearGradient id={front} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b35" />
          <stop offset="50%" stopColor="#f7931e" />
          <stop offset="100%" stopColor="#ffcc02" />
        </linearGradient>
        <linearGradient id={back} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M8 30 Q5 22 8 15 Q12 8 20 10 Q25 13 23 22 Q20 30 8 30 Z"
        fill={`url(#${front})`}
        opacity="0.9"
      />
      <path
        d="M16 33 Q13 25 15 18 Q18 11 26 13 Q30 16 28 25 Q26 33 16 33 Z"
        fill={`url(#${back})`}
        opacity="0.8"
      />
      <path
        d="M10 20 Q16 17 20 22 M18 22 Q22 20 26 24"
        stroke="#fff"
        strokeOpacity="0.5"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  )
}
