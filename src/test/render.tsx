import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, type RenderOptions } from "@testing-library/react"
import type { ReactElement, ReactNode } from "react"
import {
  createMemoryRouter,
  RouterProvider,
  type RouteObject,
} from "react-router"

/** 为组件提供测试所需的 Router 与 QueryClient */
export function renderWithProviders(
  ui: ReactElement,
  {
    route = "/",
    routes,
    ...options
  }: RenderOptions & { route?: string; routes?: RouteObject[] } = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createMemoryRouter(routes ?? [{ path: "*", element: ui }], {
    initialEntries: [route],
  })

  const Wrapper = ({ children }: { children?: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return render(<RouterProvider router={router} />, {
    wrapper: Wrapper,
    ...options,
  })
}
