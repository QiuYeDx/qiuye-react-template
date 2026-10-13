import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { CopyButton } from "@/components/copy-button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import type { DemoSource } from "./demos"

interface DemoCardProps {
  id: string
  title: string
  description: string
  source: DemoSource
  install: string
  wide?: boolean
  children: ReactNode
  /** 预览区域额外的 className，例如需要贴边展示的效果 */
  previewClassName?: string
  installId?: string
}

export function DemoCard({
  id,
  title,
  description,
  source,
  install,
  wide,
  children,
  previewClassName,
  installId,
}: DemoCardProps) {
  const { t } = useTranslation()
  const command = `pnpm dlx shadcn@latest add ${install}`

  return (
    <article
      id={id}
      className={cn(
        "flex min-w-0 scroll-mt-20 flex-col overflow-hidden rounded-xl border bg-card",
        wide && "md:col-span-2"
      )}
    >
      <header className="flex items-start justify-between gap-3 px-5 pt-5">
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="font-medium">{title}</h2>
          <p className="text-sm text-pretty text-muted-foreground">
            {description}
          </p>
        </div>
        <Badge
          variant={source === "qiuye" ? "outline" : "secondary"}
          className="shrink-0"
        >
          {source === "qiuye"
            ? t("components.filter.qiuye")
            : t("components.filter.shadcn")}
        </Badge>
      </header>
      <div
        className={cn(
          "flex min-h-52 flex-1 flex-col items-center justify-center gap-4 p-6",
          previewClassName
        )}
      >
        {children}
      </div>
      <footer
        id={installId}
        className="flex h-11 items-center gap-2 border-t bg-muted/40 pr-2 pl-4"
      >
        <span className="sr-only">{t("components.install")}</span>
        <code
          className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground"
          title={command}
        >
          {command}
        </code>
        <CopyButton value={command} />
      </footer>
    </article>
  )
}
