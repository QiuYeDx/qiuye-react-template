import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn("flex flex-col gap-3 pt-12 pb-8 md:pt-16", className)}
    >
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-base text-pretty text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
      {children}
    </header>
  )
}
