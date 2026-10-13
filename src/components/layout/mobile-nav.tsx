import { Menu } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { NavLink } from "react-router"

import { LogoMark } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

export function MobileNav({ className }: { className?: string }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("common.openMenu")}
          className={className}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <LogoMark className="size-5" />
            {siteConfig.name}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {siteConfig.description}
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {siteConfig.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
