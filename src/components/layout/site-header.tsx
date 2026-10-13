import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import { GitHubIcon } from "@/components/icons"
import { LanguageSwitcher } from "@/components/language-switcher"
import { MainNav } from "@/components/layout/main-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { LogoMark } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { siteConfig } from "@/config/site"

export function SiteHeader() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/65">
      <div className="container-page flex h-14 items-center gap-4">
        <Link
          to="/"
          className="-mx-1.5 flex items-center gap-2 rounded-lg px-1.5 py-1 font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <LogoMark />
          <span className="hidden sm:inline">{siteConfig.name}</span>
        </Link>

        <MainNav className="ml-2 hidden md:flex" />

        <div className="ml-auto flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t("common.github")}
                >
                  <GitHubIcon />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("common.github")}</TooltipContent>
          </Tooltip>
          <LanguageSwitcher />
          <ThemeToggle id="theme-toggle" />
          <MobileNav className="md:hidden" />
        </div>
      </div>
    </header>
  )
}
