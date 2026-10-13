import { queryOptions } from "@tanstack/react-query"

import { http } from "@/lib/http"

export interface GitHubRepo {
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  pushed_at: string
}

/**
 * 推荐的组织方式：接口函数 + queryOptions 放在一起，
 * 组件里通过 `useQuery(repoQueryOptions(owner, name))` 使用，也便于预取与失效。
 */
export const repoQueryOptions = (owner: string, name: string) =>
  queryOptions({
    queryKey: ["github", "repo", owner, name],
    queryFn: ({ signal }) =>
      http.get<GitHubRepo>(`https://api.github.com/repos/${owner}/${name}`, {
        signal,
        headers: { accept: "application/vnd.github+json" },
      }),
    staleTime: 5 * 60_000,
  })
