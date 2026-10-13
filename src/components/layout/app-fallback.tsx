import { LogoMark } from "@/components/logo"

/**
 * 首次进入时、页面代码尚未加载完成前显示。
 * 延迟 300ms 才淡入，网络较快时用户不会看到闪烁。
 */
export function AppFallback() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 flex items-center justify-center bg-background"
    >
      <LogoMark className="size-10 animate-in duration-500 [animation-delay:300ms] [animation-fill-mode:both] fade-in" />
    </div>
  )
}
