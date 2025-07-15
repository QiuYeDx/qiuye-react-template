# Qiuye React Template - 快速开始指南

## 🚀 一键启动

```bash
# 1. 克隆项目
git clone <your-repo-url> my-react-app
cd my-react-app

# 2. 运行设置脚本
chmod +x scripts/setup.sh
./scripts/setup.sh

# 3. 启动开发服务器
pnpm dev
```

## 📋 主要功能清单

### ✅ 已集成的功能

- [x] **React 18** - 最新版本的React
- [x] **TypeScript** - 完整的类型支持
- [x] **Vite** - 极速构建工具
- [x] **Ant Design** - 企业级UI组件库
- [x] **Tailwind CSS** - 原子化CSS框架
- [x] **React Router v7** - 路由管理
- [x] **Zustand** - 轻量级状态管理
- [x] **React i18next** - 国际化支持
- [x] **Axios** - HTTP请求库
- [x] **React Spring** - 动画库
- [x] **Heroicons** - 图标库
- [x] **ESLint + Prettier** - 代码规范
- [x] **响应式设计** - 移动端适配

### 🎯 核心特性

1. **开箱即用的开发环境**
   - 预配置的构建工具
   - 代码热重载
   - TypeScript支持

2. **完整的项目结构**
   - 组件化开发
   - 路由配置
   - 状态管理
   - 工具函数

3. **国际化支持**
   - 中英文语言切换
   - 易于扩展新语言

4. **现代化UI**
   - Ant Design组件
   - Tailwind CSS样式
   - 响应式布局

## 📁 项目结构说明

```
qiuye-react-template/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 通用组件
│   │   └── Layout/        # 布局组件
│   ├── pages/             # 页面组件
│   │   ├── Home/         # 首页
│   │   ├── About/        # 关于页面
│   │   └── NotFound/     # 404页面
│   ├── routes/            # 路由配置
│   ├── store/             # 状态管理
│   ├── utils/             # 工具函数
│   ├── i18n/              # 国际化
│   ├── types/             # 类型定义
│   ├── App.tsx            # 根组件
│   ├── main.tsx           # 入口文件
│   └── index.css          # 全局样式
├── scripts/               # 脚本文件
├── package.json           # 依赖配置
├── tsconfig.json          # TypeScript配置
├── vite.config.ts         # Vite配置
├── tailwind.config.js     # Tailwind配置
└── README.md              # 项目说明
```

## 🛠️ 常用命令

```bash
# 开发
pnpm dev             # 启动开发服务器
pnpm build           # 构建生产版本
pnpm preview         # 预览构建结果

# 代码质量
pnpm lint            # 运行ESLint检查
pnpm test            # 运行测试

# 其他
pnpm type-check      # TypeScript类型检查
```

## 🎨 自定义配置

### 修改主题色

在 `src/store/useThemeStore.ts` 中修改：

```typescript
theme: {
  primaryColor: '#1890ff', // 修改为你的主题色
  mode: 'light',
}
```

### 添加新页面

1. 在 `src/pages/` 创建新页面组件
2. 在 `src/routes/index.tsx` 添加路由
3. 在语言文件中添加翻译

### 配置API地址

在 `.env` 文件中修改：

```env
VITE_API_BASE_URL=你的API地址
```

## 📚 学习资源

- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Ant Design 官方文档](https://ant.design/)
- [Tailwind CSS 官方文档](https://tailwindcss.com/)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## ❓ 常见问题

### Q: 如何添加新的依赖？
A: 使用 `pnpm add <package-name>` 安装，TypeScript类型使用 `pnpm add -D @types/<package-name>`

### Q: 如何自定义Tailwind样式？
A: 在 `tailwind.config.js` 中扩展配置，或在 `src/index.css` 中添加自定义样式

### Q: 如何部署项目？
A: 运行 `pnpm build`，然后将 `dist` 目录部署到静态服务器

---

🎉 现在你已经可以开始使用这个模板开发你的React项目了！ 