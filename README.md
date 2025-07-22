# QiuYe React Template

一个现代化的React项目脚手架，基于React 18 + TypeScript + Vite构建，集成了常用的开发工具和最佳实践。

## ✨ 特性

- 🚀 **极速开发体验** - 基于Vite的极速构建
- 📦 **开箱即用** - 预配置的开发环境
- 🎨 **现代化UI** - 集成shadcn/ui + Tailwind CSS v4
- 🌙 **明暗模式支持** - 完整的主题切换功能，支持系统偏好检测
- 🌍 **国际化支持** - 内置React i18next
- 🔒 **类型安全** - 完整的TypeScript支持
- 📱 **响应式设计** - 移动端适配
- 🎯 **代码规范** - ESLint + Prettier
- 💾 **状态管理** - Zustand轻量级状态管理
- 🔄 **路由管理** - React Router v6
- 📊 **动画支持** - React Spring

## 🛠️ 技术栈

- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite
- **UI库**: shadcn/ui
- **样式**: Tailwind CSS v4
- **状态管理**: Zustand
- **路由**: React Router
- **国际化**: React i18next
- **HTTP请求**: Axios
- **图标**: Heroicons
- **动画**: React Spring
- **工具库**: Lodash, ahooks, react-use

## 📦 安装

### 🚀 快速开始（推荐）

使用我的脚手架工具一键创建项目：

```bash
# 使用脚手架工具创建项目
npx qiuye-fe-cli create my-project

# 进入项目目录
cd my-project

# 安装依赖并启动
pnpm install
pnpm dev
```

### 📋 手动安装

### 环境要求

- Node.js >= 20.19.4
- pnpm >= 8.0.0 (推荐)

```bash
# 克隆项目
git clone <repository-url>

# 进入项目目录
cd qiuye-react-template

# 如果使用 nvm，切换到推荐的 Node.js 版本
nvm use

# 检查环境（可选）
chmod +x scripts/check-env.sh
./scripts/check-env.sh

# 安装 pnpm (如果尚未安装)
npm install -g pnpm

# 安装依赖
pnpm install
```

## 🚀 快速开始

```bash
# 启动开发服务器
pnpm dev

# 构建项目
pnpm build

# 预览构建结果
pnpm preview

# 运行代码检查
pnpm lint

# 运行测试
pnpm test
```

## 📁 项目结构

```
src/
├── components/          # 通用组件
│   ├── Layout/         # 布局组件
│   ├── ThemeProvider.tsx # 主题提供者组件
│   └── ui/             # shadcn/ui 组件库
├── pages/              # 页面组件
│   ├── Home/          # 首页
│   ├── About/         # 关于页面
│   └── NotFound/      # 404页面
├── routes/             # 路由配置
├── store/              # 状态管理
│   ├── useThemeStore.ts # 主题状态管理
│   └── useUserStore.ts
├── utils/              # 工具函数
│   ├── request.ts     # HTTP请求
│   └── storage.ts     # 本地存储
├── lib/                # 工具库
│   └── utils.ts       # 通用工具函数
├── styles/             # 样式文件
│   └── globals.css    # 全局样式和主题变量
├── i18n/               # 国际化
│   ├── index.ts
│   └── locales/
│       ├── zh-CN.json
│       └── en-US.json
├── App.tsx             # 根组件
├── main.tsx            # 入口文件
└── vite-env.d.ts       # Vite 类型定义
```

## 🔧 配置

### 环境变量

在根目录创建 `.env` 文件：

```env
# 应用配置
VITE_APP_TITLE=QiuYe React Template
VITE_APP_DESCRIPTION=A modern React template

# API配置
VITE_API_BASE_URL=http://localhost:3001/api
```

### 主题配置

项目内置完整的明暗模式支持，在 `src/store/useThemeStore.ts` 中配置主题：

```typescript
theme: {
  primaryColor: '#1890ff',
  mode: 'light', // 'light' | 'dark'
}
```

#### 明暗模式特性

- ✅ **自动主题检测** - 检测系统偏好设置并应用对应主题
- ✅ **状态持久化** - 主题选择自动保存到 localStorage
- ✅ **平滑切换** - 带有过渡动画的主题切换体验
- ✅ **CSS 变量系统** - 基于 CSS 变量的主题系统，易于自定义
- ✅ **完整组件支持** - 所有 shadcn/ui 组件都支持明暗模式

#### 主题自定义

在 `src/styles/globals.css` 中定义了完整的主题变量：

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* 更多亮色主题变量... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* 更多暗色主题变量... */
}
```

### 国际化配置

在 `src/i18n/locales/` 目录下添加语言文件。

## 📚 使用指南

### 主题切换

#### 程序化切换主题

```typescript
import { useThemeStore } from '@/store/useThemeStore'

function MyComponent() {
  const { theme, setMode } = useThemeStore()

  const toggleTheme = () => {
    setMode(theme.mode === 'light' ? 'dark' : 'light')
  }

  return (
    <button onClick={toggleTheme}>
      当前主题: {theme.mode}
    </button>
  )
}
```

#### 在组件中使用暗色模式样式

```tsx
function Card() {
  return (
    <div className="bg-background text-foreground border border-border rounded-lg p-4">
      <h2 className="text-lg font-bold text-foreground">卡片标题</h2>
      <p className="text-muted-foreground">这个卡片在明暗模式下都很好看</p>
    </div>
  );
}
```

#### 条件渲染基于主题

```tsx
import { useThemeStore } from "@/store/useThemeStore";

function ThemedIcon() {
  const { theme } = useThemeStore();

  return (
    <div>
      {theme.mode === "dark" ? (
        <MoonIcon className="w-6 h-6" />
      ) : (
        <SunIcon className="w-6 h-6" />
      )}
    </div>
  );
}
```

### 添加新页面

1. 在 `src/pages/` 目录下创建新页面组件
2. 在 `src/routes/index.tsx` 中添加路由配置
3. 在语言文件中添加相关翻译

### 状态管理

使用Zustand进行状态管理：

```typescript
import { create } from "zustand";

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```

### HTTP请求

使用封装的request工具：

```typescript
import request from "@/utils/request";

// GET请求
const data = await request.get("/users");

// POST请求
const result = await request.post("/users", { name: "John" });
```

### 添加新依赖

```bash
# 生产依赖
pnpm add <package-name>

# 开发依赖
pnpm add -D <package-name>

# TypeScript 类型定义
pnpm add -D @types/<package-name>
```

## 🎨 样式系统

项目使用 shadcn/ui + Tailwind CSS v4 的现代化样式系统：

### 设计系统特点

- **shadcn/ui 组件** - 现代化、可访问性友好的 UI 组件库
- **Tailwind CSS v4** - 最新版本的原子化 CSS 框架
- **CSS 变量系统** - 基于 CSS 变量的主题系统，支持明暗模式
- **语义化颜色** - 使用语义化的颜色名称，如 `bg-background`、`text-foreground`

### 推荐的样式使用方法

```tsx
// ✅ 推荐：使用语义化颜色
<div className="bg-background text-foreground border border-border">
  <h1 className="text-primary">标题</h1>
  <p className="text-muted-foreground">描述文本</p>
</div>

// ✅ 推荐：使用 dark: 前缀适配暗色模式
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
  内容
</div>

// ❌ 不推荐：硬编码颜色值
<div style={{ backgroundColor: '#ffffff', color: '#000000' }}>
  内容
</div>
```

### 自定义组件样式

```tsx
import { cn } from "@/lib/utils";

function CustomButton({ className, ...props }) {
  return (
    <button
      className={cn(
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "rounded-md px-4 py-2 transition-colors",
        className
      )}
      {...props}
    />
  );
}
```

## 📱 响应式设计

项目内置响应式设计支持：

- 移动端优先的设计理念
- 使用Tailwind CSS的响应式工具类
- shadcn/ui 组件的内置响应式支持

## 🔍 代码规范

项目使用ESLint + Prettier确保代码质量：

```bash
# 检查代码
pnpm lint

# 自动修复
pnpm lint --fix
```

## 🚀 部署

```bash
# 构建项目
pnpm build

# 部署到静态服务器
# 将dist目录上传到服务器
```

## 📋 相关文档

- [`README.md`](./README.md) - 项目完整说明
- [`QUICK_START.md`](./QUICK_START.md) - 快速开始指南
- [`PNPM_GUIDE.md`](./PNPM_GUIDE.md) - pnpm 使用指南
- [`scripts/setup.sh`](./scripts/setup.sh) - 一键设置脚本
- [`scripts/check-env.sh`](./scripts/check-env.sh) - 环境检查脚本
- [`scripts/verify-install.sh`](./scripts/verify-install.sh) - 安装验证脚本
- [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) - 故障排除指南

## 🎨 主题最佳实践

### 1. 优先使用语义化颜色

```tsx
// ✅ 好的做法
<Card className="bg-card text-card-foreground border-border">
  <CardHeader>
    <CardTitle className="text-primary">标题</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">内容</p>
  </CardContent>
</Card>
```

### 2. 为图片和媒体内容适配暗色模式

```tsx
function Logo() {
  const { theme } = useThemeStore();

  return (
    <img
      src={theme.mode === "dark" ? "/logo-dark.png" : "/logo-light.png"}
      alt="Logo"
      className="h-8 w-auto"
    />
  );
}
```

### 3. 测试明暗模式兼容性

确保在两种模式下都测试你的组件：

- 文本对比度是否足够
- 边框和分隔线是否清晰可见
- 交互状态（hover、focus）是否正常

## 🤝 贡献

欢迎提交Pull Request和Issue！

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有开源项目的贡献者们！
