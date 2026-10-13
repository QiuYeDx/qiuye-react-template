# QiuYe React Template

一个基于 **官方最新 shadcn/ui** 的 React + Vite 项目模板：尽量贴近官方约定，同时把真实项目中每次都要搭的工程能力提前准备好，并内置 [QiuYe UI](https://ui.qiuyedx.com) 组件库的兼容支持。

> v3 是一次彻底重写。旧版本（React Spring、shadcn/ui 旧版 new-york 风格等）保留在 `v1`、`v2.0.0` 分支。

## 特性

- ⚡️ **Vite 8 + React 19 + TypeScript 6**：严格模式、`bundler` 模块解析、`@/` 路径别名
- 🎨 **shadcn/ui 4（radix-nova）+ Tailwind CSS 4**：CSS-first 主题，OKLCH 颜色变量，Geist 字体（含中文字体回退）
- 🍂 **QiuYe UI**：已安装全部 17 个扩展组件，与官方主题共用同一套 token
- 🧭 **React Router 7 数据路由**：页面级懒加载、顶部导航进度条、统一错误边界与 404
- 🔄 **TanStack Query 5 + 轻量 fetch 封装**：缓存、重试、取消与统一的 `HttpError`
- 🐻 **Zustand 5**：带持久化中间件的示例 store
- 🌏 **i18next**：以中文文案为基准自动推导 key 类型，缺失翻译在编译期报错
- 🌗 **next-themes**：跟随系统 / 手动切换，首屏无闪烁，切换时带 View Transitions 揭幕动画
- 🎞️ **Motion**：统一动效，自动遵循系统的「减少动态效果」设置
- ✅ **ESLint 10 Flat Config + Prettier（Tailwind 类名排序）+ Vitest 4 + Testing Library**

## 快速开始

环境要求：Node.js `^20.19.0 || >=22.12.0`，pnpm `>=8`（推荐 pnpm 10+）。

```bash
# 使用脚手架创建
npx qiuye-fe-cli create my-app

# 或者直接克隆
git clone https://github.com/QiuYeDx/qiuye-react-template.git my-app

cd my-app
pnpm install
pnpm dev
```

## 常用命令

| 命令                                | 说明                                         |
| ----------------------------------- | -------------------------------------------- |
| `pnpm dev`                          | 启动开发服务器（默认 http://localhost:5173） |
| `pnpm build`                        | 类型检查并构建生产版本                       |
| `pnpm preview`                      | 本地预览构建产物                             |
| `pnpm typecheck`                    | 仅执行 TypeScript 类型检查                   |
| `pnpm lint` / `pnpm lint:fix`       | ESLint 检查 / 自动修复                       |
| `pnpm format` / `pnpm format:check` | Prettier 格式化 / 检查                       |
| `pnpm test` / `pnpm test:run`       | Vitest 监听模式 / 单次运行                   |
| `pnpm check`                        | 类型检查 + Lint + 测试，适合提交前与 CI      |

## 目录结构

```text
src/
├── api/            # 接口函数与 queryOptions
├── app/            # 应用入口：Providers 与路由表
├── components/
│   ├── layout/     # 页头、页脚、导航等布局组件
│   ├── qiuye-ui/   # QiuYe UI 组件（shadcn CLI 安装）
│   └── ui/         # shadcn/ui 组件（shadcn CLI 安装）
├── config/         # 站点配置：名称、链接、导航
├── hooks/          # 通用 Hooks
├── i18n/           # 国际化配置与文案
├── lib/            # 工具函数、请求封装、QueryClient
├── pages/          # 页面（按路由懒加载）
├── stores/         # Zustand 状态
├── test/           # 测试初始化与渲染工具
├── types/          # 全局类型声明
└── index.css       # Tailwind 与主题变量
```

## 开发指南

### 新增页面

1. 在 `src/pages/<name>/index.tsx` 中导出 `Component`（也可以导出 `loader`、`ErrorBoundary` 等路由模块字段）：

   ```tsx
   export function Component() {
     return <div className="container-page py-12">Hello</div>
   }
   ```

2. 在 `src/app/router.tsx` 中注册懒加载路由：

   ```ts
   { path: "settings", lazy: () => import("@/pages/settings") }
   ```

3. 需要出现在导航中时，在 `src/config/site.ts` 的 `nav` 中添加一项，并补充对应文案。

### 添加组件

```bash
# 官方 shadcn/ui 组件
pnpm dlx shadcn@latest add accordion

# QiuYe UI 组件（registry 已在 components.json 中配置）
pnpm dlx shadcn@latest add @qiuye-ui/segmented-control
```

### 数据请求

接口函数与 `queryOptions` 放在 `src/api` 中，组件里直接使用：

```ts
// src/api/user.ts
export const userQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["user", id],
    queryFn: ({ signal }) => http.get<User>(`/users/${id}`, { signal }),
  })

// 组件中
const { data, isPending } = useQuery(userQueryOptions(id))
```

`http` 会自动拼接 `VITE_API_BASE_URL`、序列化 JSON，并在非 2xx 响应时抛出 `HttpError`；4xx 错误默认不会重试。联调后端时可以打开 `vite.config.ts` 中的 `server.proxy`。

### 国际化

文案位于 `src/i18n/locales`。`zh-CN.ts` 是类型基准，`en-US.ts` 必须提供完全相同的结构，否则无法通过类型检查；`t()` 的 key 同样有自动补全与校验。

### 主题

颜色变量位于 `src/index.css`，可以直接替换为 [shadcn/ui 主题编辑器](https://ui.shadcn.com/create) 生成的变量。`--brand` 是模板额外提供的品牌强调色，只用于 Logo、高亮等点缀位置。

### 环境变量

| 变量                   | 说明                                    |
| ---------------------- | --------------------------------------- |
| `VITE_APP_TITLE`       | 应用名称（页面标题与页头）              |
| `VITE_APP_DESCRIPTION` | 应用描述（`<meta name="description">`） |
| `VITE_API_BASE_URL`    | 接口基础地址                            |

本地覆盖请新建 `.env.local`。所有 `VITE_` 开头的变量都会被打包进前端代码，**不要放置任何密钥**。

## 精简模板

演示内容都是可以直接删除的独立模块：

- 删除 `src/pages/components` 及路由、导航中的对应项，即可移除组件展示页；
- 删除 `src/components/qiuye-ui` 中不需要的组件（注意组件之间的依赖，例如多个组件依赖 `smooth-corners`），然后移除不再使用的依赖（如 `mermaid`、`react-markdown` 等仅被 `markdown-renderer` 使用）；
- `src/stores/counter-store.ts` 与 `src/api/github.ts` 仅用于示例。

## QiuYe UI 兼容性说明

QiuYe UI 的 registry 与 shadcn/ui 4 在主题层面完全兼容（共用 CSS 变量与 `radix-ui`）。但用当前版本的 shadcn CLI 安装时存在以下问题，本模板中已修复安装后的代码，后续建议在 registry 侧统一修复：

1. **多文件组件被拍平**：registry 文件未声明 `target`，shadcn CLI 4 会把 `code-block/`、`markdown-renderer/`、`matrix-effect/` 等多文件组件全部放到 `src/components/` 根目录，导致 `index.ts`、`types.ts` 互相覆盖、相对导入失效。为每个文件写上与 `path` 相同的 `target` 即可解决。
2. **同名文件的导入被改写**：`animated-number` 中 `@/lib/animated-number` 被 CLI 改写成了组件自身路径，造成循环导入。建议将 lib 文件改名（如 `animated-number-tokens.ts`）。
3. **Next.js 专有写法**：`code-block` 使用了 styled-jsx 的 `<style jsx global>`，在 Vite 中应改为普通 `<style>`。
4. **严格 TS 配置下的告警**：部分文件存在未使用的 `import React`；`matrix-effect`、`markdown-renderer` 使用了 `process.env.NODE_ENV`，Vite 项目需要额外的类型声明（见 `src/types/process-env.d.ts`）。

## License

MIT © QiuYeDx
