import { motion } from "motion/react"
import { useTranslation } from "react-i18next"
import { NavLink } from "react-router"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

/** 桌面端导航：当前项背景通过 layoutId 在各项之间平滑移动 */
export function MainNav({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {siteConfig.nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "relative isolate rounded-lg px-3 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="main-nav-active"
                  className="absolute inset-0 -z-10 rounded-lg bg-muted"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                />
              )}
              {t(item.labelKey)}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
