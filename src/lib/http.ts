/**
 * 基于原生 fetch 的轻量请求封装。
 *
 * - 自动拼接 `VITE_API_BASE_URL`（绝对地址不受影响）
 * - 自动序列化 JSON 请求体、解析 JSON 响应
 * - 非 2xx 响应统一抛出 `HttpError`，便于 TanStack Query 处理
 * - 支持超时与外部 AbortSignal（TanStack Query 会传入 signal）
 */

export class HttpError extends Error {
  readonly status: number
  readonly data: unknown

  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.name = "HttpError"
    this.status = status
    this.data = data
  }
}

type QueryValue = string | number | boolean | null | undefined

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** 请求体：普通对象会被序列化为 JSON */
  body?: BodyInit | Record<string, unknown> | unknown[] | null
  /** 查询参数，值为 null / undefined 的项会被忽略 */
  query?: Record<string, QueryValue>
  /** 超时时间（毫秒），默认 15 秒 */
  timeout?: number
  /** 覆盖默认的 baseURL */
  baseURL?: string
}

const DEFAULT_TIMEOUT = 15_000

const isAbsoluteURL = (url: string) => /^[a-z][a-z\d+\-.]*:\/\//i.test(url)

export function buildURL(
  path: string,
  baseURL = import.meta.env.VITE_API_BASE_URL ?? "",
  query?: RequestOptions["query"]
) {
  const joined = isAbsoluteURL(path)
    ? path
    : `${baseURL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`

  if (!query) return joined

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== null && value !== undefined) params.append(key, String(value))
  }
  const search = params.toString()
  if (!search) return joined
  return `${joined}${joined.includes("?") ? "&" : "?"}${search}`
}

const isPlainBody = (
  body: unknown
): body is Record<string, unknown> | unknown[] =>
  Array.isArray(body) ||
  (typeof body === "object" &&
    body !== null &&
    Object.getPrototypeOf(body) === Object.prototype)

async function parseBody(response: Response) {
  if (response.status === 204) return undefined
  const type = response.headers.get("content-type") ?? ""
  if (type.includes("application/json")) return response.json()
  return response.text()
}

export async function request<T = unknown>(
  path: string,
  {
    body,
    query,
    timeout = DEFAULT_TIMEOUT,
    baseURL,
    headers,
    signal,
    ...init
  }: RequestOptions = {}
): Promise<T> {
  const finalHeaders = new Headers(headers)
  let finalBody: BodyInit | null | undefined = body as
    BodyInit | null | undefined

  if (isPlainBody(body)) {
    finalBody = JSON.stringify(body)
    if (!finalHeaders.has("content-type")) {
      finalHeaders.set("content-type", "application/json")
    }
  }
  if (!finalHeaders.has("accept")) {
    finalHeaders.set("accept", "application/json")
  }

  const signals = [AbortSignal.timeout(timeout), signal].filter(
    (item): item is AbortSignal => Boolean(item)
  )

  const response = await fetch(buildURL(path, baseURL, query), {
    ...init,
    headers: finalHeaders,
    body: finalBody,
    signal: AbortSignal.any(signals),
  })

  const data = await parseBody(response)

  if (!response.ok) {
    const message =
      (typeof data === "object" && data && "message" in data
        ? String((data as { message: unknown }).message)
        : undefined) ?? `Request failed with status ${response.status}`
    throw new HttpError(response.status, message, data)
  }

  return data as T
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(
    path: string,
    body?: RequestOptions["body"],
    options?: RequestOptions
  ) => request<T>(path, { ...options, method: "POST", body }),
  put: <T>(
    path: string,
    body?: RequestOptions["body"],
    options?: RequestOptions
  ) => request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(
    path: string,
    body?: RequestOptions["body"],
    options?: RequestOptions
  ) => request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
}
