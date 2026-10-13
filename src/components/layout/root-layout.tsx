import { useTranslation } from "react-i18next"
import { Outlet, ScrollRestoration } from "react-router"

import { RouteProgress } from "@/components/layout/route-progress"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"

export function RootLayout() {
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only z-60 rounded-lg bg-background px-3 py-2 text-sm font-medium shadow-md focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t("common.skipToContent")}
      </a>
      <RouteProgress />
      <SiteHeader />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <ScrollRestoration />
    </div>
  )
}
