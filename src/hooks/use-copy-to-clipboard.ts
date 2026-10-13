import { useCallback, useEffect, useRef, useState } from "react"

/**
 * 复制文本到剪贴板，并在 `resetAfter` 毫秒内保持 `copied` 状态。
 */
export function useCopyToClipboard(resetAfter = 2000) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setCopied(false), resetAfter)
        return true
      } catch {
        setCopied(false)
        return false
      }
    },
    [resetAfter]
  )

  return { copied, copy }
}
