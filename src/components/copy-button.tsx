import { Check, Copy } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import type { ComponentProps } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"

interface CopyButtonProps extends Omit<
  ComponentProps<typeof Button>,
  "onClick"
> {
  value: string
}

export function CopyButton({
  value,
  className,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: CopyButtonProps) {
  const { t } = useTranslation()
  const { copied, copy } = useCopyToClipboard()

  return (
    <Button
      variant={variant}
      size={size}
      aria-label={copied ? t("common.copied") : t("common.copy")}
      className={cn("relative", className)}
      onClick={async () => {
        if (!(await copy(value))) toast.error(t("common.copyFailed"))
      }}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "check" : "copy"}
          initial={{ opacity: 0, scale: 0.6, filter: "blur(2px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.6, filter: "blur(2px)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          className="flex items-center justify-center"
        >
          {copied ? <Check /> : <Copy />}
        </motion.span>
      </AnimatePresence>
    </Button>
  )
}
