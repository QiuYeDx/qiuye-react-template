import { Check, Languages } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { languages } from "@/i18n"

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const current = i18n.resolvedLanguage

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("language.label")}
            >
              <Languages />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{t("language.label")}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="min-w-36">
        {languages.map((lng) => (
          <DropdownMenuItem
            key={lng}
            onSelect={() => void i18n.changeLanguage(lng)}
            aria-current={current === lng ? "true" : undefined}
          >
            <span className="flex-1">{t(`language.${lng}`)}</span>
            {current === lng && <Check className="text-muted-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
