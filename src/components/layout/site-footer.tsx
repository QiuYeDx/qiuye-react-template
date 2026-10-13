import { useTranslation } from "react-i18next"

import { LogoMark } from "@/components/logo"
import { siteConfig } from "@/config/site"

export function SiteFooter() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border/60">
      <div className="container-page flex flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <LogoMark className="mt-0.5 size-4" />
          <span>
            © {new Date().getFullYear()} {siteConfig.author} ·{" "}
            {t("footer.license")}
          </span>
        </div>
        <p>
          {t("footer.builtWith")} ·{" "}
          <a
            href={siteConfig.links.qiuyeUi}
            target="_blank"
            rel="noreferrer"
            className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            ui.qiuyedx.com
          </a>
        </p>
      </div>
    </footer>
  )
}
