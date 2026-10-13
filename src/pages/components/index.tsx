import type { ParseKeys } from "i18next"
import { AnimatePresence, motion } from "motion/react"
import { Suspense, useState } from "react"
import { useTranslation } from "react-i18next"

import { PageHeader } from "@/components/page-header"
import { SegmentedControl } from "@/components/qiuye-ui/segmented-control"
import { Skeleton } from "@/components/ui/skeleton"

import { DemoCard } from "./demo-card"
import { demos, type DemoSource } from "./demos"

type Filter = "all" | DemoSource

export function Component() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<Filter>("all")
  const visible = demos.filter(
    (demo) => filter === "all" || demo.source === filter
  )

  return (
    <div className="container-page pb-20">
      <PageHeader
        title={t("components.title")}
        description={t("components.description")}
      >
        <div id="components-filter" className="mt-3 self-start">
          <SegmentedControl
            aria-label={t("components.filter.label")}
            value={filter}
            onValueChange={(value) => setFilter(value as Filter)}
            items={[
              { value: "all", label: t("components.filter.all") },
              { value: "shadcn", label: t("components.filter.shadcn") },
              { value: "qiuye", label: t("components.filter.qiuye") },
            ]}
          />
        </div>
      </PageHeader>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {visible.map(
            ({ key, source, install, Demo, wide, previewClassName }, index) => (
              <DemoCard
                key={key}
                id={key}
                installId={index === 0 ? "demo-install" : undefined}
                title={t(`components.demos.${key}.title` satisfies ParseKeys)}
                description={t(
                  `components.demos.${key}.description` satisfies ParseKeys
                )}
                source={source}
                install={install}
                wide={wide}
                previewClassName={previewClassName}
              >
                <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                  <Demo />
                </Suspense>
              </DemoCard>
            )
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
