# 故障排除指南

本文档包含了在使用 QiuYe React Template 时可能遇到的常见问题和解决方案。

## 🔧 环境问题

### Node.js 版本不兼容

**错误信息：**

```
Your Node version is incompatible with "...".
Expected version: >=20.19.4
Got: vX.X.X
```

**原因：** 系统当前的 Node.js 版本低于项目要求的最低版本 20.19.4。

**解决方案：**

#### 方案 1: 使用 NVM 管理 Node.js 版本（推荐）

```bash
# 安装 nvm (如果尚未安装)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载终端配置
source ~/.bashrc  # 或 source ~/.zshrc

# 安装并使用项目推荐的 Node.js 版本
nvm install 20.19.4
nvm use 20.19.4

# 设置为默认版本（可选）
nvm alias default 20.19.4

# 验证版本
node --version  # 应该显示 v20.19.4
```

#### 方案 2: 直接安装 Node.js 20+

访问 [Node.js 官网](https://nodejs.org/) 下载并安装 20.19.4 或更高版本。

#### 方案 3: 使用项目的 .nvmrc 文件

```bash
# 如果已安装 nvm
nvm use  # 自动使用 .nvmrc 中指定的版本
```

### pnpm 版本问题

**错误信息：**

```
Unsupported environment (bad pnpm version)
```

**解决方案：**

```bash
# 更新 pnpm 到最新版本
npm install -g pnpm@latest

# 验证版本
pnpm --version
```

### 依赖版本兼容性

**错误信息：**

```
Your Node version is incompatible with "registry.npmjs.org/@typescript-eslint/eslint-plugin/7.18.0".
Expected version: ^18.18.0 || >=20.0.0
Got: v18.17.0
```

**原因：** 某些依赖的最新版本要求更高的 Node.js 版本。

**解决方案：**

项目已针对 Node.js 20.19.4+ 优化了依赖版本：

- **React Router DOM**: 使用 v6.28.0 (兼容 Node.js 20.19.4+)
- **TypeScript ESLint**: 使用 v6.21.0 (兼容 Node.js 20.19.4+)

如果遇到类似错误，请确保：

1. 删除已有的依赖：

   ```bash
   rm -rf node_modules pnpm-lock.yaml
   ```

2. 重新安装：

   ```bash
   pnpm install
   ```

3. 如果问题持续，检查是否有其他依赖要求更高版本的 Node.js：
   ```bash
   pnpm why [package-name]
   ```

## 📦 依赖安装问题

### 依赖安装失败

**解决方案：**

```bash
# 清理缓存和依赖
rm -rf node_modules pnpm-lock.yaml

# 重新安装
pnpm install
```

### 网络问题导致安装缓慢

**解决方案：**

```bash
# 设置淘宝镜像
pnpm config set registry https://registry.npmmirror.com

# 重新安装
pnpm install
```

## 🚀 开发服务器问题

### 端口被占用

**错误信息：**

```
Port 3000 is already in use
```

**解决方案：**

```bash
# 方案 1: 杀死占用端口的进程
lsof -ti:3000 | xargs kill -9

# 方案 2: 使用其他端口
pnpm dev --port 3001
```

### TypeScript 类型错误

**解决方案：**

```bash
# 重新安装类型定义
pnpm add -D @types/react @types/react-dom @types/node

# 清理 TypeScript 缓存
rm -rf .tsbuildinfo
```

## 🎨 样式问题

### Tailwind CSS 样式不生效

**解决方案：**

```bash
# 确保 Tailwind 配置正确
pnpm exec tailwindcss -i ./src/index.css -o ./dist/output.css --watch

# 重启开发服务器
pnpm dev
```

### Ant Design 样式冲突

**解决方案：**

在 `src/index.css` 中调整样式优先级：

```css
/* 确保 Ant Design 样式优先级 */
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

/* 你的自定义样式 */
```

## 🔍 构建问题

### 构建失败

**解决方案：**

```bash
# 检查 TypeScript 错误
pnpm exec tsc --noEmit

# 检查 ESLint 错误
pnpm lint

# 清理并重新构建
rm -rf dist
pnpm build
```

### 内存不足

**解决方案：**

```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

## 🛠️ 开发工具问题

### VSCode 提示 TypeScript 错误

**解决方案：**

1. 确保安装了以下 VSCode 扩展：
   - TypeScript and JavaScript Language Features
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense

2. 重启 TypeScript 服务：
   - 按 `Cmd/Ctrl + Shift + P`
   - 输入 "TypeScript: Restart TS Server"

### Git 提交失败

**解决方案：**

```bash
# 检查 ESLint 规则
pnpm lint --fix

# 检查提交信息格式
git commit -m "feat: 添加新功能"
```

## 💡 常见配置问题

### 环境变量不生效

**解决方案：**

1. 确保环境变量以 `VITE_` 开头
2. 重启开发服务器
3. 检查 `.env` 文件位置是否正确（项目根目录）

### 路径别名不工作

**解决方案：**

确保 `tsconfig.json` 和 `vite.config.ts` 中的路径配置一致：

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

```ts
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
```

## 🆘 获取帮助

如果以上解决方案都无法解决您的问题，请：

1. 运行诊断脚本：

   ```bash
   ./scripts/check-env.sh
   ./scripts/verify-install.sh
   ```

2. 查看详细错误信息：

   ```bash
   pnpm install --verbose
   ```

3. 提交 Issue 时请包含：
   - 操作系统信息
   - Node.js 和 pnpm 版本
   - 完整的错误信息
   - 复现步骤

---

💡 **提示：** 大部分问题都可以通过运行 `./scripts/setup.sh` 脚本来自动解决。
