import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

export function Component() {
  const { t } = useTranslation()

  return (
    <div className="container-page flex min-h-[60svh] items-center justify-center py-16">
      <Empty>
        <EmptyHeader>
          <p className="font-mono text-6xl font-semibold tracking-tighter text-muted-foreground/40">
            404
          </p>
          <EmptyTitle>{t("notFound.title")}</EmptyTitle>
          <EmptyDescription>{t("notFound.description")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link to="/">{t("common.backHome")}</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
