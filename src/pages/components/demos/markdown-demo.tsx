import { MarkdownRenderer } from "@/components/qiuye-ui/markdown-renderer"

const content = `## Hello, QiuYe UI 👋

支持 **GFM**、~~删除线~~、\`行内代码\`、任务列表与表格：

- [x] shadcn/ui 4 + Vite 8
- [x] QiuYe UI 组件
- [ ] 你的业务代码

| 能力 | 方案 |
| --- | --- |
| 路由 | React Router |
| 数据 | TanStack Query |

\`\`\`ts title="router.ts" {2}
export const router = createBrowserRouter([
  { path: "/", lazy: () => import("@/pages/home") },
])
\`\`\`

\`\`\`mermaid
flowchart LR
  A[pnpm dev] --> B{Vite}
  B --> C[React]
  B --> D[Tailwind CSS]
\`\`\`
`

/** 单独成文件以便懒加载：MarkdownRenderer 依赖 mermaid 等较大的包 */
export default function MarkdownDemo() {
  return <MarkdownRenderer content={content} className="w-full" />
}
