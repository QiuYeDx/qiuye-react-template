# Qiuye React Template

一个现代化的React项目脚手架，基于React 18 + TypeScript + Vite构建，集成了常用的开发工具和最佳实践。

## ✨ 特性

- 🚀 **极速开发体验** - 基于Vite的极速构建
- 📦 **开箱即用** - 预配置的开发环境
- 🎨 **现代化UI** - 集成Ant Design + Tailwind CSS
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
- **UI库**: Ant Design
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **路由**: React Router
- **国际化**: React i18next
- **HTTP请求**: Axios
- **图标**: Heroicons
- **动画**: React Spring
- **工具库**: Lodash, ahooks, react-use

## 📦 安装

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
│   └── Layout/         # 布局组件
├── pages/              # 页面组件
│   ├── Home/          # 首页
│   ├── About/         # 关于页面
│   └── NotFound/      # 404页面
├── routes/             # 路由配置
├── store/              # 状态管理
│   ├── useThemeStore.ts
│   └── useUserStore.ts
├── utils/              # 工具函数
│   ├── request.ts     # HTTP请求
│   └── storage.ts     # 本地存储
├── i18n/               # 国际化
│   ├── index.ts
│   └── locales/
│       ├── zh-CN.json
│       └── en-US.json
├── App.tsx             # 根组件
├── main.tsx            # 入口文件
└── index.css           # 全局样式
```

## 🔧 配置

### 环境变量

在根目录创建 `.env` 文件：

```env
# 应用配置
VITE_APP_TITLE=Qiuye React Template
VITE_APP_DESCRIPTION=A modern React template

# API配置
VITE_API_BASE_URL=http://localhost:3001/api
```

### 主题配置

在 `src/store/useThemeStore.ts` 中配置主题：

```typescript
theme: {
  primaryColor: '#1890ff',
  mode: 'light',
}
```

### 国际化配置

在 `src/i18n/locales/` 目录下添加语言文件。

## 📚 使用指南

### 添加新页面

1. 在 `src/pages/` 目录下创建新页面组件
2. 在 `src/routes/index.tsx` 中添加路由配置
3. 在语言文件中添加相关翻译

### 状态管理

使用Zustand进行状态管理：

```typescript
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  decrement: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))
```

### HTTP请求

使用封装的request工具：

```typescript
import request from '@/utils/request'

// GET请求
const data = await request.get('/users')

// POST请求
const result = await request.post('/users', { name: 'John' })
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

## 🎨 样式

项目使用Tailwind CSS + Ant Design的组合：

- 使用Tailwind CSS进行快速布局和样式
- 使用Ant Design提供完整的组件库
- 自定义CSS类在 `src/index.css` 中定义

## 📱 响应式设计

项目内置响应式设计支持：

- 移动端优先的设计理念
- 使用Tailwind CSS的响应式工具类
- Ant Design组件的内置响应式支持

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

## 🤝 贡献

欢迎提交Pull Request和Issue！

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有开源项目的贡献者们！ 