import {
  BarChart3,
  Bell,
  FileText,
  LayoutGrid,
  Pause,
  Play,
  Settings,
  Shuffle,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { LogoMark } from "@/components/logo"
import { AnimatedNumber } from "@/components/qiuye-ui/animated-number"
import {
  ClipPathTabs,
  ClipPathTabsContent,
} from "@/components/qiuye-ui/clip-path-tabs"
import { CodeBlock, CodeBlockPanel } from "@/components/qiuye-ui/code-block"
import { ColorPicker } from "@/components/qiuye-ui/color-picker"
import { DotGlass } from "@/components/qiuye-ui/dot-glass"
import { DualStateToggle } from "@/components/qiuye-ui/dual-state-toggle"
import { ExpandableCard } from "@/components/qiuye-ui/expandable-card"
import { ImageViewer } from "@/components/qiuye-ui/image-viewer"
import { DotMatrixEffect } from "@/components/qiuye-ui/matrix-effect"
import { ResponsiveTabs } from "@/components/qiuye-ui/responsive-tabs"
import {
  DialogDescription,
  DialogTitle,
  ScrollableDialog,
  ScrollableDialogContent,
  ScrollableDialogFooter,
  ScrollableDialogHeader,
} from "@/components/qiuye-ui/scrollable-dialog"
import { SegmentedControl } from "@/components/qiuye-ui/segmented-control"
import { SmoothCorners } from "@/components/qiuye-ui/smooth-corners"
import { Tour, type TourStep } from "@/components/qiuye-ui/tour"
import { Typewriter } from "@/components/qiuye-ui/typewriter"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

const useIsDark = () => useTheme().resolvedTheme === "dark"

export function SegmentedControlDemo() {
  const { t } = useTranslation()
  const [range, setRange] = useState("week")
  const items = (["day", "week", "month", "year"] as const).map((value) => ({
    value,
    label: t(`components.demos.segmentedControl.${value}`),
  }))

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <SegmentedControl
        aria-label="Range"
        items={items}
        value={range}
        onValueChange={setRange}
        fullWidth
      />
      <SegmentedControl
        aria-label="Range"
        variant="floating"
        size="sm"
        fullWidth
        items={items}
        value={range}
        onValueChange={setRange}
      />
    </div>
  )
}

export function ResponsiveTabsDemo() {
  const { t } = useTranslation()
  const [value, setValue] = useState("overview")
  const items = [
    {
      value: "overview",
      label: t("components.demos.responsiveTabs.overview"),
      icon: <LayoutGrid />,
    },
    {
      value: "analytics",
      label: t("components.demos.responsiveTabs.analytics"),
      icon: <BarChart3 />,
    },
    {
      value: "reports",
      label: t("components.demos.responsiveTabs.reports"),
      icon: <FileText />,
    },
    {
      value: "notifications",
      label: t("components.demos.responsiveTabs.notifications"),
      icon: <Bell />,
      badge: 3,
    },
    {
      value: "settings",
      label: t("components.demos.responsiveTabs.settings"),
      icon: <Settings />,
    },
  ]

  return (
    <ResponsiveTabs
      value={value}
      onValueChange={setValue}
      items={items}
      className="w-full"
    >
      <p className="py-4 text-center text-sm text-muted-foreground">
        {t("components.demos.responsiveTabs.current", {
          label: items.find((item) => item.value === value)?.label,
        })}
      </p>
    </ResponsiveTabs>
  )
}

export function ClipPathTabsDemo() {
  const { t } = useTranslation()
  const [value, setValue] = useState("preview")
  const items = (["preview", "code", "docs"] as const).map((key) => ({
    value: key,
    label: t(`components.demos.clipPathTabs.${key}`),
  }))

  return (
    <ClipPathTabs
      ariaLabel="Views"
      value={value}
      onValueChange={setValue}
      items={items}
      className="items-center"
    >
      {items.map((item) => (
        <ClipPathTabsContent
          key={item.value}
          value={item.value}
          className="pt-4 text-center text-sm text-muted-foreground"
        >
          {t("components.demos.clipPathTabs.content", { label: item.label })}
        </ClipPathTabsContent>
      ))}
    </ClipPathTabs>
  )
}

export function DualStateToggleDemo() {
  const { t } = useTranslation()
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  return (
    <div className="flex items-center gap-3">
      <DualStateToggle
        active={playing}
        onToggle={setPlaying}
        activeIcon={<Pause />}
        inactiveIcon={<Play />}
        activeLabel={t("components.demos.dualStateToggle.pause")}
        inactiveLabel={t("components.demos.dualStateToggle.play")}
        shape="circle"
        size="icon-lg"
      />
      <DualStateToggle
        active={muted}
        onToggle={setMuted}
        activeIcon={<VolumeX />}
        inactiveIcon={<Volume2 />}
        activeLabel={t("components.demos.dualStateToggle.unmute")}
        inactiveLabel={t("components.demos.dualStateToggle.mute")}
        variant="outline"
        size="icon-lg"
        effect="rotate"
      />
    </div>
  )
}

export function ThemeToggleDemo() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center gap-3">
      <ThemeToggle variant="outline" size="icon-lg" buttonShape="circle" />
      <p className="text-sm text-muted-foreground">
        {t("components.demos.themeToggle.hint")}
      </p>
    </div>
  )
}

export function AnimatedNumberDemo() {
  const { t, i18n } = useTranslation()
  const [value, setValue] = useState(12_345.67)
  const currency = i18n.resolvedLanguage === "en-US" ? "USD" : "CNY"

  return (
    <div className="flex flex-col items-center gap-4">
      <AnimatedNumber
        value={value}
        locales={i18n.resolvedLanguage}
        format={{ style: "currency", currency }}
        className="text-4xl font-semibold tracking-tight tabular-nums"
      />
      <Button
        variant="outline"
        onClick={() => setValue(Math.round(Math.random() * 10_000_000) / 100)}
      >
        <Shuffle data-icon="inline-start" />
        {t("components.demos.animatedNumber.random")}
      </Button>
    </div>
  )
}

export function TypewriterDemo() {
  const { t, i18n } = useTranslation()
  const phrases = useMemo(
    () => t("components.demos.typewriter.phrases", { returnObjects: true }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.resolvedLanguage]
  )

  return (
    <Typewriter
      key={i18n.resolvedLanguage}
      phrases={phrases}
      className="text-2xl font-semibold tracking-tight"
    />
  )
}

export function ColorPickerDemo() {
  const [color, setColor] = useState("#F97316")

  return (
    <div className="flex items-center gap-4">
      <ColorPicker value={color} onChange={setColor} showAlpha />
      <div className="flex flex-col">
        <span className="font-mono text-sm">{color.toUpperCase()}</span>
        <span
          className="h-1.5 w-24 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export function SmoothCornersDemo() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <figure className="flex flex-col items-center gap-2">
        <SmoothCorners
          radius={32}
          smoothing={0.8}
          className="flex size-28 items-center justify-center bg-linear-to-br from-orange-400 to-rose-500"
        >
          <LogoMark className="size-12 brightness-0 invert" />
        </SmoothCorners>
        <figcaption className="text-xs text-muted-foreground">
          {t("components.demos.smoothCorners.smooth")}
        </figcaption>
      </figure>
      <figure className="flex flex-col items-center gap-2">
        <div className="flex size-28 items-center justify-center rounded-[32px] bg-linear-to-br from-orange-400 to-rose-500">
          <LogoMark className="size-12 brightness-0 invert" />
        </div>
        <figcaption className="text-xs text-muted-foreground">
          {t("components.demos.smoothCorners.regular")}
        </figcaption>
      </figure>
    </div>
  )
}

export function DotGlassDemo() {
  const isDark = useIsDark()

  return (
    <div className="relative h-44 w-full overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,#fb923c,transparent_45%),radial-gradient(circle_at_75%_65%,#f43f5e,transparent_45%),radial-gradient(circle_at_60%_20%,#facc15,transparent_40%)]" />
      <DotGlass
        className="absolute inset-y-0 right-0 left-1/2"
        dotSize={3}
        dotGap={6}
        blur={6}
        saturation={140}
        glassAlpha={0.45}
        coverColor={isDark ? "#171717" : "#ffffff"}
      />
    </div>
  )
}

export function ImageViewerDemo() {
  const { t } = useTranslation()

  return (
    <ImageViewer
      src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80"
      alt={t("components.demos.imageViewer.alt")}
      maxHeight={220}
      rounded="xl"
      lightboxRounded="2xl"
      smoothCorners
      className="w-full"
      wrapperClassName="flex w-full justify-center"
    />
  )
}

export function ExpandableCardDemo() {
  const { t } = useTranslation()

  return (
    <ExpandableCard
      className="h-80 w-full max-w-sm"
      tone="dark"
      cover={
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#fdba74,transparent_50%),radial-gradient(circle_at_80%_30%,#fb7185,transparent_45%),linear-gradient(135deg,#ea580c,#9f1239)]" />
      }
      eyebrow={t("components.demos.expandableCard.eyebrow")}
      title={t("components.demos.expandableCard.cardTitle")}
      icon={
        <span className="flex size-full items-center justify-center bg-white">
          <LogoMark className="size-3/5" />
        </span>
      }
      name={t("components.demos.expandableCard.name")}
      subtitle={t("components.demos.expandableCard.subtitle")}
      actionLabel={t("components.demos.expandableCard.open")}
      closeLabel={t("components.demos.expandableCard.close")}
      actions={
        <Button size="sm" variant="secondary" className="rounded-full px-4">
          {t("components.demos.expandableCard.action")}
        </Button>
      }
    >
      <div className="flex flex-col gap-4 text-pretty">
        <p>{t("components.demos.expandableCard.body1")}</p>
        <p>{t("components.demos.expandableCard.body2")}</p>
      </div>
    </ExpandableCard>
  )
}

export function ScrollableDialogDemo() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        {t("components.demos.scrollableDialog.open")}
      </Button>
      <ScrollableDialog open={open} onOpenChange={setOpen}>
        <ScrollableDialogHeader>
          <DialogTitle>
            {t("components.demos.scrollableDialog.dialogTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("components.demos.scrollableDialog.dialogDescription")}
          </DialogDescription>
        </ScrollableDialogHeader>
        <ScrollableDialogContent>
          <div className="flex flex-col gap-4 text-sm">
            {Array.from({ length: 10 }, (_, index) => (
              <section key={index} className="flex flex-col gap-1">
                <h3 className="font-medium">
                  {t("components.demos.scrollableDialog.section", {
                    index: index + 1,
                  })}
                </h3>
                <p className="text-muted-foreground">
                  {t("components.demos.scrollableDialog.paragraph")}
                </p>
              </section>
            ))}
          </div>
        </ScrollableDialogContent>
        <ScrollableDialogFooter className="flex justify-end">
          <Button onClick={() => setOpen(false)}>
            {t("components.demos.scrollableDialog.accept")}
          </Button>
        </ScrollableDialogFooter>
      </ScrollableDialog>
    </>
  )
}

export function TourDemo() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const steps: TourStep[] = [
    {
      target: "#components-filter",
      title: t("components.demos.tour.step1Title"),
      content: t("components.demos.tour.step1Content"),
      placement: "bottom",
    },
    {
      target: "#demo-install",
      title: t("components.demos.tour.step2Title"),
      content: t("components.demos.tour.step2Content"),
      placement: "top",
    },
    {
      target: "#theme-toggle",
      title: t("components.demos.tour.step3Title"),
      content: t("components.demos.tour.step3Content"),
      placement: "bottom",
      align: "end",
    },
  ]

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        {t("components.demos.tour.start")}
      </Button>
      <Tour open={open} onOpenChange={setOpen} steps={steps} />
    </>
  )
}

const sampleCode = `import { useQuery } from "@tanstack/react-query"
import { repoQueryOptions } from "@/api/github"

export function Stars() {
  const { data, isPending } = useQuery(repoQueryOptions("QiuYeDx", "qiuye-react-template"))

  if (isPending) return <Skeleton className="h-4 w-12" />
  return <span>{data.stargazers_count} ★</span>
}`

export function CodeBlockDemo() {
  const isDark = useIsDark()

  return (
    <CodeBlockPanel
      filename="stars.tsx"
      language="tsx"
      code={sampleCode}
      isDark={isDark}
      className="w-full"
    >
      <CodeBlock
        language="tsx"
        isDark={isDark}
        highlightLines={[5, 7]}
        showLineNumbers
      >
        {sampleCode}
      </CodeBlock>
    </CodeBlockPanel>
  )
}

export function MatrixEffectDemo() {
  const { t } = useTranslation()
  const isDark = useIsDark()

  return (
    <DotMatrixEffect
      className="aspect-[21/9] w-full overflow-hidden rounded-lg"
      color={isDark ? "#a8a29e" : "#78716c"}
      backgroundColor={isDark ? "#1c1917" : "#f5f5f4"}
      grid={{ mode: "auto", cellSize: 10, maxCells: 9_000 }}
      radiusRange={[0, 3]}
      blobOptions={{
        count: 4,
        minRadius: 0.18,
        maxRadius: 0.48,
        speed: 0.4,
        baseValue: 0.025,
        seed: 17,
      }}
      levels={{ contrast: 1.25 }}
      frameRate="auto"
      maxDpr={2}
      pauseWhenOffscreen
      ariaLabel={t("components.demos.matrixEffect.label")}
    />
  )
}
