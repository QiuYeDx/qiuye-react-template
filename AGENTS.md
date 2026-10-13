# AGENTS.md

面向在本项目中工作的 AI Agent 的约定。人类开发者请先阅读 [README.md](./README.md)。

## 技术栈

Vite 8 · React 19 · TypeScript 6（strict）· Tailwind CSS 4 · shadcn/ui 4（`radix-nova` 风格，`radix-ui` 单包）· React Router 7（数据路由）· TanStack Query 5 · Zustand 5 · i18next · next-themes · Motion · Vitest 4。

## 常用命令

```bash
pnpm dev          # 开发服务器
pnpm check        # typecheck + lint + test，提交前必须通过
pnpm build        # 生产构建
pnpm format       # Prettier
```

## 约定

- **路径别名**：一律使用 `@/` 导入 `src` 下的模块。
- **页面**：放在 `src/pages/<name>/index.tsx`，导出 `Component`，在 `src/app/router.tsx` 中以 `lazy: () => import(...)` 注册。导航项在 `src/config/site.ts`。
- **组件**：
  - `src/components/ui`：shadcn/ui 组件，通过 `pnpm dlx shadcn@latest add <name>` 安装，可按需修改。
  - `src/components/qiuye-ui`：QiuYe UI registry 组件（`@qiuye-ui/<name>`），保留原始代码风格，不参与 Prettier 格式化。
  - 其余通用组件直接放在 `src/components`，布局组件放在 `src/components/layout`。
- **样式**：只使用 Tailwind 类名与 `src/index.css` 中的主题变量（`bg-background`、`text-muted-foreground` 等），不要硬编码颜色；合并类名使用 `cn()`。页面内容容器使用 `container-page`。
- **文案**：所有用户可见文案都要进入 `src/i18n/locales`。先改 `zh-CN.ts`（类型基准），再同步 `en-US.ts`，否则类型检查会失败。
- **数据请求**：接口函数与 `queryOptions` 放在 `src/api`，通过 `src/lib/http.ts` 发起请求，组件中使用 `useQuery` / `useMutation`。
- **状态**：服务端状态交给 TanStack Query；跨页面的客户端状态使用 `src/stores` 中的 Zustand store；其余优先使用组件本地状态。
- **动效**：使用 `motion/react`。全局已配置 `MotionConfig reducedMotion="user"`。
- **主题**：使用 `next-themes` 的 `useTheme()`；首屏主题由 `index.html` 中的内联脚本设置，修改 storageKey 时两处要同步。
- **测试**：与源码同目录的 `*.test.ts(x)`；需要路由或 Query 时使用 `src/test/render.tsx` 中的 `renderWithProviders`。

## 已知坑位

- 用 shadcn CLI 安装 `@qiuye-ui/*` 多文件组件时，文件可能被拍平到 `src/components/` 根目录（registry 未声明 `target`）。安装后检查文件是否位于 `src/components/qiuye-ui/<name>/`，以及 `animated-number` 等组件的导入路径是否被改写。
- radix-nova 的 `TabsList` / `TabsTrigger` 使用 `group-data-horizontal/tabs:h-8`、`data-active:*` 等变体类名。覆盖这些样式时必须使用相同的变体（例如 `group-data-horizontal/tabs:h-auto`），普通的 `h-auto` 不会生效。
- i18next 的 `supportedLngs` 使用完整语言代码（`zh-CN` / `en-US`），不要开启 `nonExplicitSupportedLngs`，否则 `en-US` 会被判定为不受支持；浏览器语言映射在 `detection.convertDetectedLanguage` 中处理。
