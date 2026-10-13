import { Minus, Plus, RotateCcw } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { Reveal } from "@/components/reveal"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedNumber } from "@/components/qiuye-ui/animated-number"
import { CodeBlock, CodeBlockPanel } from "@/components/qiuye-ui/code-block"
import { Button } from "@/components/ui/button"
import { useCounterStore } from "@/stores/counter-store"

const structure = {
  "zh-CN": `src/
├── api/            # 接口函数与 queryOptions
├── app/            # 应用入口：Providers 与路由表
├── components/
│   ├── layout/     # 页头、页脚、导航等布局组件
│   ├── qiuye-ui/   # QiuYe UI 组件（shadcn CLI 安装）
│   └── ui/         # shadcn/ui 组件（shadcn CLI 安装）
├── config/         # 站点配置：名称、链接、导航
├── hooks/          # 通用 Hooks
├── i18n/           # 国际化配置与文案
├── lib/            # 工具函数、请求封装、QueryClient
├── pages/          # 页面（按路由懒加载）
├── stores/         # Zustand 状态
└── index.css       # Tailwind 与主题变量`,
  "en-US": `src/
├── api/            # API functions and queryOptions
├── app/            # Entry: providers and the route table
├── components/
│   ├── layout/     # Header, footer, navigation
│   ├── qiuye-ui/   # QiuYe UI components (via shadcn CLI)
│   └── ui/         # shadcn/ui components (via shadcn CLI)
├── config/         # Site config: name, links, navigation
├── hooks/          # Shared hooks
├── i18n/           # i18n setup and messages
├── lib/            # Utilities, HTTP client, QueryClient
├── pages/          # Route pages (lazy loaded)
├── stores/         # Zustand stores
└── index.css       # Tailwind and theme tokens`,
}

function CounterCard() {
  const { t, i18n } = useTranslation()
  const { count, increment, decrement, reset } = useCounterStore()

  return (
    <div className="flex h-full flex-col justify-between gap-8 rounded-xl border bg-card p-5">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">
          {t("home.playground.label")}
        </span>
        <AnimatedNumber
          value={count}
          locales={i18n.resolvedLanguage}
          className="font-heading text-6xl font-semibold tracking-tight tabular-nums"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-lg"
          onClick={decrement}
          aria-label={t("home.playground.decrement")}
        >
          <Minus />
        </Button>
        <Button
          size="icon-lg"
          onClick={increment}
          aria-label={t("home.playground.increment")}
        >
          <Plus />
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="ml-auto"
          disabled={count === 0}
          onClick={() => {
            reset()
            toast.success(t("home.playground.resetToast"))
          }}
        >
          <RotateCcw data-icon="inline-start" />
          {t("home.playground.reset")}
        </Button>
      </div>
    </div>
  )
}

export function PlaygroundSection() {
  const { t, i18n } = useTranslation()
  const { resolvedTheme } = useTheme()
  const code =
    i18n.resolvedLanguage === "en-US" ? structure["en-US"] : structure["zh-CN"]

  return (
    <section className="container-page grid gap-x-6 gap-y-16 py-16 md:py-20 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <Reveal className="flex flex-col">
        <SectionHeading
          title={t("home.playground.title")}
          description={t("home.playground.description")}
        />
        <div className="flex-1">
          <CounterCard />
        </div>
      </Reveal>
      <Reveal delay={0.05} className="flex min-w-0 flex-col">
        <SectionHeading
          title={t("home.structure.title")}
          description={t("home.structure.description")}
        />
        <CodeBlockPanel
          filename="src"
          language="bash"
          code={code}
          isDark={resolvedTheme === "dark"}
        >
          <CodeBlock
            language="bash"
            isDark={resolvedTheme === "dark"}
            showLineNumbers={false}
          >
            {code}
          </CodeBlock>
        </CodeBlockPanel>
      </Reveal>
    </section>
  )
}
