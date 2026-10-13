import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import i18n from "@/i18n"
import { Component as NotFound } from "@/pages/not-found"
import { renderWithProviders } from "@/test/render"

describe("NotFound page", () => {
  beforeEach(() => i18n.changeLanguage("zh-CN"))

  it("renders the localized message", () => {
    renderWithProviders(<NotFound />, { route: "/missing" })

    expect(screen.getByText("页面不存在")).toBeInTheDocument()
  })

  it("follows the language setting", async () => {
    await i18n.changeLanguage("en-US")
    renderWithProviders(<NotFound />, { route: "/missing" })

    expect(screen.getByText("Page not found")).toBeInTheDocument()
  })

  it("navigates back home", async () => {
    renderWithProviders(<NotFound />, {
      route: "/missing",
      routes: [
        { path: "/", element: <p>home page</p> },
        { path: "*", element: <NotFound /> },
      ],
    })

    await userEvent.click(screen.getByRole("link", { name: "返回首页" }))
    expect(screen.getByText("home page")).toBeInTheDocument()
  })
})
