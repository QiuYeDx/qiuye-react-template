import { ArrowRight } from "lucide-react"
import { motion, type Variants } from "motion/react"
import { useTheme } from "next-themes"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router"

import { CopyButton } from "@/components/copy-button"
import { GitHubIcon } from "@/components/icons"
import { DotMatrixEffect } from "@/components/qiuye-ui/matrix-effect"
import { Typewriter } from "@/components/qiuye-ui/typewriter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

const CREATE_COMMAND = "npx qiuye-fe-cli create my-app"

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", duration: 0.7, bounce: 0 },
  },
}

function HeroBackdrop() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 mask-[radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"
    >
      <DotMatrixEffect
        className="size-full"
        color={isDark ? "#78716c" : "#d6d3d1"}
        backgroundColor={null}
        grid={{ mode: "auto", cellSize: 14, maxCells: 9_000 }}
        radiusRange={[0, 2.4]}
        blobOptions={{
          count: 5,
          minRadius: 0.16,
          maxRadius: 0.42,
          speed: 0.25,
          baseValue: 0.05,
          seed: 7,
        }}
        levels={{ contrast: 1.2 }}
        frameRate="auto"
        maxDpr={2}
        pauseWhenOffscreen
        decorative
      />
    </div>
  )
}

export function HeroSection() {
  const { t, i18n } = useTranslation()
  const words = useMemo(
    () => t("home.hero.words", { returnObjects: true }),
    // 切换语言时重新生成词组
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.resolvedLanguage]
  )

  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackdrop />
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-page flex flex-col items-center pt-20 pb-20 text-center md:pt-28 md:pb-28"
      >
        <motion.div variants={item}>
          <Badge
            variant="outline"
            className="h-7 gap-2 rounded-full bg-background/60 px-3 text-xs backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-brand" />
            {t("home.hero.badge")}
          </Badge>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-6 font-heading text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl"
        >
          <span className="block">{t("home.hero.title")}</span>
          <Typewriter
            key={i18n.resolvedLanguage}
            phrases={words}
            typingSpeed={110}
            deletingSpeed={60}
            pauseDuration={2200}
            className="block"
            textClassName="bg-linear-to-r from-brand via-orange-400 to-amber-400 bg-clip-text pb-1 text-transparent"
            cursorClassName="w-0.5 bg-brand opacity-80"
          />
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-base text-pretty text-muted-foreground md:text-lg"
        >
          {t("home.hero.description")}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg" className="h-10 rounded-full px-5" asChild>
            <Link to="/components">
              {t("home.hero.primary")}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-10 rounded-full bg-background/60 px-5 backdrop-blur"
            asChild
          >
            <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
              <GitHubIcon data-icon="inline-start" />
              {t("home.hero.secondary")}
            </a>
          </Button>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-6 flex h-10 items-center gap-1 rounded-full border bg-background/70 py-1 pr-1 pl-4 font-mono text-sm shadow-xs backdrop-blur"
          aria-label={t("home.hero.commandLabel")}
        >
          <span className="text-muted-foreground select-none">$</span>
          <code className="pr-1">{CREATE_COMMAND}</code>
          <CopyButton value={CREATE_COMMAND} className="rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
