import type { ParseKeys } from "i18next"
import {
  Languages,
  Network,
  Route,
  ShieldCheck,
  Sparkles,
  SunMoon,
  type LucideIcon,
} from "lucide-react"
import { motion } from "motion/react"
import { useTranslation } from "react-i18next"

import { Reveal, revealProps } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

type FeatureKey = "routing" | "data" | "theme" | "i18n" | "motion" | "quality"

const features: { key: FeatureKey; icon: LucideIcon }[] = [
  { key: "routing", icon: Route },
  { key: "data", icon: Network },
  { key: "theme", icon: SunMoon },
  { key: "i18n", icon: Languages },
  { key: "motion", icon: Sparkles },
  { key: "quality", icon: ShieldCheck },
]

export function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <section className="container-page py-16 md:py-20">
      <Reveal>
        <SectionHeading
          title={t("home.features.title")}
          description={t("home.features.description")}
        />
      </Reveal>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ key, icon: Icon }, index) => (
          <motion.li
            key={key}
            {...revealProps((index % 3) * 0.05)}
            className="flex flex-col gap-3 rounded-xl border bg-card p-5"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
              <Icon className="size-4.5" />
            </span>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-medium">
                {t(`home.features.items.${key}.title` satisfies ParseKeys)}
              </h3>
              <p className="text-sm text-pretty text-muted-foreground">
                {t(
                  `home.features.items.${key}.description` satisfies ParseKeys
                )}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
