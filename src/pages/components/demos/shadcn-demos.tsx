import {
  ArrowRight,
  ChevronDown,
  LogOut,
  Plus,
  Settings,
  User,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ButtonDemo() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        <Button>{t("components.demos.button.default")}</Button>
        <Button variant="secondary">
          {t("components.demos.button.secondary")}
        </Button>
        <Button variant="outline">
          {t("components.demos.button.outline")}
        </Button>
        <Button variant="ghost">{t("components.demos.button.ghost")}</Button>
        <Button variant="destructive">
          {t("components.demos.button.destructive")}
        </Button>
        <Button variant="link">{t("components.demos.button.link")}</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="sm" variant="outline">
          <Plus data-icon="inline-start" />
          Small
        </Button>
        <Button>
          Default
          <ArrowRight data-icon="inline-end" />
        </Button>
        <Button size="lg">Large</Button>
        <Button size="icon" variant="outline" aria-label="Add">
          <Plus />
        </Button>
      </div>
    </div>
  )
}

export function FormDemo() {
  const { t } = useTranslation()

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-name">{t("components.demos.form.name")}</Label>
        <Input
          id="demo-name"
          placeholder={t("components.demos.form.namePlaceholder")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-intro">{t("components.demos.form.intro")}</Label>
        <Textarea
          id="demo-intro"
          rows={2}
          placeholder={t("components.demos.form.introPlaceholder")}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="demo-notify" className="font-normal">
          {t("components.demos.form.notify")}
        </Label>
        <Switch id="demo-notify" defaultChecked />
      </div>
    </form>
  )
}

export function OverlayDemo() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            {t("components.demos.overlay.dialog")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("components.demos.overlay.dialogTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("components.demos.overlay.dialogDescription")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">
                {t("components.demos.overlay.cancel")}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>{t("components.demos.overlay.confirm")}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {t("components.demos.overlay.popover")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 text-sm">
          {t("components.demos.overlay.popoverText")}
        </PopoverContent>
      </Popover>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">
            {t("components.demos.overlay.tooltip")}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {t("components.demos.overlay.tooltipText")}
        </TooltipContent>
      </Tooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {t("components.demos.overlay.menu")}
            <ChevronDown data-icon="inline-end" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem>
            <User />
            {t("components.demos.overlay.menuProfile")}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            {t("components.demos.overlay.menuSettings")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOut />
            {t("components.demos.overlay.menuSignOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function FeedbackDemo() {
  const { t } = useTranslation()

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5">
      <div className="flex flex-wrap justify-center gap-2">
        <Badge>New</Badge>
        <Badge variant="secondary">Beta</Badge>
        <Badge variant="outline">v3.0</Badge>
        <Badge variant="destructive">Deprecated</Badge>
      </div>
      <div className="flex w-full items-center gap-3">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" disabled>
          <Spinner data-icon="inline-start" />
          {t("components.demos.feedback.loading")}
        </Button>
        <Button
          onClick={() =>
            toast.success(t("components.demos.feedback.toastTitle"), {
              description: t("components.demos.feedback.toastDescription"),
            })
          }
        >
          {t("components.demos.feedback.toast")}
        </Button>
      </div>
    </div>
  )
}
