import { useQuery } from "@tanstack/react-query"
import type { ParseKeys } from "i18next"
import {
  ArrowUpRight,
  CircleAlert,
  CircleDot,
  GitFork,
  RotateCw,
  Star,
} from "lucide-react"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"

import { repoQueryOptions } from "@/api/github"
import { GitHubIcon } from "@/components/icons"
import { PageHeader } from "@/components/page-header"
import { Reveal } from "@/components/reveal"
import { AnimatedNumber } from "@/components/qiuye-ui/animated-number"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { siteConfig } from "@/config/site"

function Stat({
  icon,
  label,
  value,
  loading,
}: {
  icon: ReactNode
  label: string
  value?: number
  loading: boolean
}) {
  const { i18n } = useTranslation()

  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-muted/60 p-3">
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground [&_svg]:size-3.5">
        {icon}
        {label}
      </span>
      {loading ? (
        <Skeleton className="h-7 w-12" />
      ) : (
        <AnimatedNumber
          value={value ?? 0}
          locales={i18n.resolvedLanguage}
          className="text-xl leading-7 font-semibold tabular-nums"
        />
      )}
    </div>
  )
}

function RepoCard() {
  const { t, i18n } = useTranslation()
  const { data, isPending, isError, refetch, isFetching } = useQuery(
    repoQueryOptions(siteConfig.repo.owner, siteConfig.repo.name)
  )

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <GitHubIcon className="size-4" />
          {t("about.repo.title")}
        </CardTitle>
        <CardDescription>{t("about.repo.description")}</CardDescription>
        <CardAction>
          <Button variant="outline" size="icon-sm" asChild>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`${siteConfig.repo.owner}/${siteConfig.repo.name}`}
              title={`${siteConfig.repo.owner}/${siteConfig.repo.name}`}
            >
              <ArrowUpRight />
            </a>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6 text-center">
            <CircleAlert className="size-5 text-muted-foreground" />
            <div className="flex flex-col gap-1">
              <p className="font-medium">{t("about.repo.error")}</p>
              <p className="text-muted-foreground">
                {t("about.repo.errorHint")}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RotateCw
                data-icon="inline-start"
                className={isFetching ? "animate-spin" : ""}
              />
              {t("common.retry")}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              <Stat
                icon={<Star />}
                label={t("about.repo.stars")}
                value={data?.stargazers_count}
                loading={isPending}
              />
              <Stat
                icon={<GitFork />}
                label={t("about.repo.forks")}
                value={data?.forks_count}
                loading={isPending}
              />
              <Stat
                icon={<CircleDot />}
                label={t("about.repo.issues")}
                value={data?.open_issues_count}
                loading={isPending}
              />
            </div>
            {isPending ? (
              <Skeleton className="h-4 w-2/3" />
            ) : (
              data.description && (
                <p className="text-pretty text-muted-foreground">
                  {data.description}
                </p>
              )
            )}
            <p className="mt-auto flex items-center justify-between gap-3 border-t pt-3 text-muted-foreground">
              <span>{t("about.repo.updated")}</span>
              {isPending ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <time
                  dateTime={data.pushed_at}
                  className="text-foreground tabular-nums"
                >
                  {new Intl.DateTimeFormat(i18n.resolvedLanguage, {
                    dateStyle: "medium",
                  }).format(new Date(data.pushed_at))}
                </time>
              )}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

const steps = ["env", "nav", "page", "components"] as const

function StartCard() {
  const { t } = useTranslation()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">{t("about.start.title")}</CardTitle>
        <CardDescription>{t("about.start.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-medium">
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <p className="font-medium">
                  {t(`about.start.steps.${step}.title` satisfies ParseKeys)}
                </p>
                <p className="text-pretty text-muted-foreground">
                  {t(
                    `about.start.steps.${step}.description` satisfies ParseKeys
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}

export function Component() {
  const { t } = useTranslation()

  return (
    <div className="container-page pb-20">
      <PageHeader
        title={t("about.title")}
        description={t("about.description")}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal>
          <RepoCard />
        </Reveal>
        <Reveal delay={0.05}>
          <StartCard />
        </Reveal>
      </div>
    </div>
  )
}
