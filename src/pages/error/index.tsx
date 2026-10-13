import { RotateCw, TriangleAlert } from "lucide-react"
import { useTranslation } from "react-i18next"
import { isRouteErrorResponse, Link, useRouteError } from "react-router"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

/** 路由级错误边界：渲染异常、loader 抛错与 404 响应都会落到这里 */
export function RouteError() {
  const { t } = useTranslation()
  const error = useRouteError()

  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : undefined

  return (
    <div className="container-page flex min-h-[60svh] items-center justify-center py-16">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TriangleAlert />
          </EmptyMedia>
          <EmptyTitle>{t("error.title")}</EmptyTitle>
          <EmptyDescription>{t("error.description")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          {import.meta.env.DEV && detail && (
            <pre className="max-w-full overflow-x-auto rounded-lg bg-muted px-3 py-2 text-left text-xs whitespace-pre-wrap text-muted-foreground">
              {detail}
            </pre>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RotateCw data-icon="inline-start" />
              {t("common.retry")}
            </Button>
            <Button asChild>
              <Link to="/">{t("common.backHome")}</Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
