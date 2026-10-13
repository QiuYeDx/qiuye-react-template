import { QueryClient } from "@tanstack/react-query"

import { HttpError } from "@/lib/http"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      // 4xx 属于确定性错误，重试没有意义
      retry: (failureCount, error) => {
        if (
          error instanceof HttpError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false
        }
        return failureCount < 2
      },
    },
  },
})
