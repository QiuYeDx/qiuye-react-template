# ESLint 自动清理未使用 Import 配置说明

## 📋 概述

本项目已配置 ESLint 规则来自动检测和删除未使用的 import 语句，提高代码质量和减少冗余代码。

## 🚀 快速开始

### 1. 安装依赖

由于项目需要 Node.js >= 18.17.0，请先确保你的 Node 版本符合要求：

```bash
node -v  # 检查当前版本
```

如果版本不符合要求，请升级 Node.js，然后运行：

```bash
# 运行我们准备的安装脚本
./scripts/install-eslint-deps.sh

# 或者手动安装
pnpm add -D eslint-plugin-import eslint-plugin-unused-imports prettier
```

### 2. VS Code 配置

项目已配置`.vscode/settings.json`，确保你安装了以下 VS Code 扩展：

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier** (`esbenp.prettier-vscode`)

安装后重启 VS Code，保存文件时会自动：

- 删除未使用的 import
- 整理 import 顺序
- 格式化代码

## 🛠️ 可用命令

| 命令                 | 说明                             |
| -------------------- | -------------------------------- |
| `pnpm lint`          | 检查代码问题（不修复）           |
| `pnpm lint:fix`      | 自动修复所有可修复的 ESLint 问题 |
| `pnpm format`        | 使用 Prettier 格式化代码         |
| `pnpm format:check`  | 检查代码格式是否符合规范         |
| `pnpm clean:imports` | 专门清理未使用的 import          |

## 📝 配置的 ESLint 规则

### 核心规则

- **`unused-imports/no-unused-imports`**: 自动删除未使用的 import
- **`unused-imports/no-unused-vars`**: 检测未使用的变量
- **`@typescript-eslint/no-unused-vars`**: TypeScript 未使用变量检测

### Import 整理规则

- **`import/order`**: 自动排序和分组 import 语句
- **`import/first`**: 确保 import 在文件顶部
- **`import/no-duplicates`**: 避免重复 import

### 变量命名约定

以下划线`_`开头的变量/参数会被忽略：

```typescript
// ✅ 这些不会报错
const _unusedVar = "ignored";
function handler(_unusedParam: string) {}
```

## 🎯 Import 分组和排序

配置会自动将 import 按以下顺序分组：

1. **内置模块** (`fs`, `path`等)
2. **外部包** (`react`, `lodash`等)
3. **内部模块** (绝对路径导入)
4. **父级目录** (`../`)
5. **同级目录** (`./`)
6. **索引文件** (`./index`)
7. **对象导入**
8. **类型导入**

示例：

```typescript
// ✅ 自动整理后的import顺序
import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "../Button";
import { utils } from "./utils";
```

## 🔧 自定义配置

### 修改规则严格程度

在`.eslintrc.cjs`中调整：

```javascript
rules: {
  // 将错误改为警告
  'unused-imports/no-unused-imports': 'warn',

  // 添加更多忽略模式
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_|^props$',  // 也忽略props参数
      varsIgnorePattern: '^_|^React$',  // 也忽略React变量
    },
  ],
}
```

### 调整 Import 排序

修改`import/order`规则的`groups`配置：

```javascript
'import/order': [
  'error',
  {
    groups: [
      'builtin',
      'external',
      'internal',
      ['parent', 'sibling', 'index'],  // 合并这些组
    ],
    'newlines-between': 'always',  // 组之间添加空行
  },
],
```

## 🐛 常见问题

### Q: VS Code 保存时没有自动修复

**A:** 检查以下步骤：

1. 确保安装了 ESLint 和 Prettier 扩展
2. 重启 VS Code
3. 检查`.vscode/settings.json`配置是否正确
4. 确保依赖已正确安装

### Q: 某些 import 被错误删除

**A:** 可能是 side-effect 导入，使用以下语法：

```typescript
// ✅ 明确标记为side-effect
import "./styles.css";
import "some-polyfill";
```

### Q: 想要禁用某个文件的自动清理

**A:** 在文件顶部添加：

```typescript
/* eslint-disable unused-imports/no-unused-imports */
```

## 💡 最佳实践

1. **定期运行清理命令**：`pnpm clean:imports`
2. **提交前检查**：`pnpm lint && pnpm format:check`
3. **合理使用忽略规则**：只在必要时使用 eslint-disable
4. **保持配置同步**：团队成员使用相同的 VS Code 配置

## 📚 相关资源

- [ESLint 官方文档](https://eslint.org/)
- [eslint-plugin-unused-imports](https://github.com/sweepline/eslint-plugin-unused-imports)
- [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import)
- [Prettier 配置指南](https://prettier.io/docs/en/configuration.html)
