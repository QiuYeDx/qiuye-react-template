import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: ReactNode
  description?: ReactNode
  className?: string
}

export function SectionHeading({
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-8 flex flex-col gap-2", className)}>
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-pretty text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}
