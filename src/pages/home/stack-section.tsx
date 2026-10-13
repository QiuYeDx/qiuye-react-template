import type { ParseKeys } from "i18next"
import { motion } from "motion/react"
import { useTranslation } from "react-i18next"

import { Reveal, revealProps } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"

import { dependencies, devDependencies } from "../../../package.json"

const versions: Record<string, string> = { ...dependencies, ...devDependencies }

/** "^19.3.0" -> "19.3"，"^4" -> "4" */
const formatVersion = (pkg: string) => {
  const raw = versions[pkg]?.replace(/^[^\d]*/, "") ?? ""
  return raw.split(".").slice(0, 2).join(".")
}

const stack: { name: string; pkg?: string; key: ParseKeys }[] = [
  { name: "Vite", pkg: "vite", key: "home.stack.items.vite" },
  { name: "React", pkg: "react", key: "home.stack.items.react" },
  { name: "TypeScript", pkg: "typescript", key: "home.stack.items.typescript" },
  {
    name: "Tailwind CSS",
    pkg: "tailwindcss",
    key: "home.stack.items.tailwind",
  },
  { name: "shadcn/ui", pkg: "shadcn", key: "home.stack.items.shadcn" },
  { name: "QiuYe UI", key: "home.stack.items.qiuye" },
  { name: "React Router", pkg: "react-router", key: "home.stack.items.router" },
  {
    name: "TanStack Query",
    pkg: "@tanstack/react-query",
    key: "home.stack.items.query",
  },
  { name: "Zustand", pkg: "zustand", key: "home.stack.items.zustand" },
  { name: "Motion", pkg: "motion", key: "home.stack.items.motion" },
  { name: "i18next", pkg: "i18next", key: "home.stack.items.i18next" },
  { name: "Vitest", pkg: "vitest", key: "home.stack.items.vitest" },
]

export function StackSection() {
  const { t } = useTranslation()

  return (
    <section className="container-page py-16 md:py-20">
      <Reveal>
        <SectionHeading
          title={t("home.stack.title")}
          description={t("home.stack.description")}
        />
      </Reveal>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stack.map((item, index) => (
          <motion.li
            key={item.name}
            {...revealProps((index % 4) * 0.04)}
            className="group flex flex-col gap-1.5 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/20"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-medium">{item.name}</span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {item.pkg ? `v${formatVersion(item.pkg)}` : "registry"}
              </span>
            </div>
            <p className="text-sm text-pretty text-muted-foreground">
              {t(item.key)}
            </p>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
