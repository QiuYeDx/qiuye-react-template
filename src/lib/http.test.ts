import { buildURL, http, HttpError } from "@/lib/http"

const jsonResponse = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    ...init,
  })

describe("buildURL", () => {
  it("joins base URL and path without duplicate slashes", () => {
    expect(buildURL("/users", "/api/")).toBe("/api/users")
  })

  it("keeps absolute URLs untouched", () => {
    expect(buildURL("https://example.com/a", "/api")).toBe(
      "https://example.com/a"
    )
  })

  it("serializes query params and skips empty values", () => {
    expect(
      buildURL("/users", "/api", { page: 2, q: "a b", empty: undefined })
    ).toBe("/api/users?page=2&q=a+b")
  })
})

describe("http", () => {
  it("sends JSON bodies and parses JSON responses", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse({ id: 1 }))

    const data = await http.post<{ id: number }>(
      "/users",
      { name: "QiuYe" },
      { baseURL: "/api" }
    )

    expect(data).toEqual({ id: 1 })
    const [url, init] = fetchMock.mock.calls[0]!
    expect(url).toBe("/api/users")
    expect(init?.method).toBe("POST")
    expect(init?.body).toBe(JSON.stringify({ name: "QiuYe" }))
    expect(new Headers(init?.headers).get("content-type")).toBe(
      "application/json"
    )
  })

  it("throws HttpError with status and server message on failure", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ message: "Not allowed" }, { status: 403 })
    )

    const error = await http
      .get("/secret", { baseURL: "/api" })
      .catch((e: unknown) => e)

    expect(error).toBeInstanceOf(HttpError)
    expect(error).toMatchObject({ status: 403, message: "Not allowed" })
  })
})
