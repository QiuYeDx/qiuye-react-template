# PNPM 使用指南

本项目推荐使用 pnpm 作为包管理器，享受更快的安装速度和更高效的磁盘空间利用。

## 🚀 为什么选择 pnpm？

- **快速** - 比 npm/yarn 快 2-3 倍
- **高效** - 使用硬链接和符号链接节省磁盘空间
- **安全** - 严格的依赖管理，避免幽灵依赖
- **兼容** - 完全兼容 npm 的 package.json

## 📦 安装 pnpm

```bash
# 使用 npm 全局安装
npm install -g pnpm

# 使用 Homebrew (macOS)
brew install pnpm

# 使用 winget (Windows)
winget install pnpm

# 使用官方脚本
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## 🛠️ 常用命令对照

| npm                    | pnpm                   | 说明           |
|------------------------|------------------------|----------------|
| `npm install`          | `pnpm install`         | 安装所有依赖   |
| `npm install <pkg>`    | `pnpm add <pkg>`       | 添加生产依赖   |
| `npm install -D <pkg>` | `pnpm add -D <pkg>`    | 添加开发依赖   |
| `npm uninstall <pkg>`  | `pnpm remove <pkg>`    | 移除依赖       |
| `npm run <script>`     | `pnpm <script>`        | 执行脚本       |
| `npm update`           | `pnpm update`          | 更新依赖       |
| `npm list`             | `pnpm list`            | 查看依赖树     |

## 🔧 项目特定配置

### 环境要求

本项目要求：
- Node.js >= 20.19.4
- pnpm >= 8.0.0

### 版本检查

```bash
# 检查 Node.js 版本
node --version

# 检查 pnpm 版本
pnpm --version
```

### 使用 .nvmrc

如果你使用 nvm 管理 Node.js 版本：

```bash
# 使用项目指定的 Node.js 版本
nvm use

# 安装并使用指定版本
nvm install
```

## 📁 pnpm 特有文件

- `pnpm-lock.yaml` - 锁定文件，记录精确版本（需要提交到 git）
- `pnpm-workspace.yaml` - 工作区配置
- `.pnpmrc` - pnpm 配置文件

## ⚡ 加速技巧

### 1. 设置淘宝镜像

```bash
# 设置镜像
pnpm config set registry https://registry.npmmirror.com

# 查看当前镜像
pnpm config get registry
```

### 2. 配置存储目录

```bash
# 设置全局存储目录
pnpm config set store-dir ~/.pnpm-store

# 查看存储目录
pnpm store path
```

### 3. 清理缓存

```bash
# 清理未使用的包
pnpm store prune

# 清理所有缓存
pnpm store path --quiet | xargs rm -rf
```

## 🔍 故障排除

### 依赖安装失败

```bash
# 清理 node_modules 和 lock 文件
rm -rf node_modules pnpm-lock.yaml

# 重新安装
pnpm install
```

### 幽灵依赖问题

pnpm 的严格模式可能会暴露代码中的幽灵依赖问题：

```bash
# 如果遇到模块找不到的错误，显式安装缺失的依赖
pnpm add <missing-package>
```

### 版本冲突

```bash
# 查看依赖冲突
pnpm why <package-name>

# 使用 overrides 解决版本冲突（在 package.json 中配置）
{
  "pnpm": {
    "overrides": {
      "package-name": "^1.0.0"
    }
  }
}
```

## 📚 更多资源

- [pnpm 官方文档](https://pnpm.io/)
- [pnpm vs npm vs yarn 对比](https://pnpm.io/benchmarks)
- [pnpm 工作区](https://pnpm.io/workspaces)

---

💡 **提示**: 如果团队中有人不习惯使用 pnpm，可以在项目根目录添加 `.npmrc` 文件，内容为 `engine-strict=true`，这样使用 npm 时会提示用户使用指定的包管理器。 