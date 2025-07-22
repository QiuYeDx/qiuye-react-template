#!/bin/bash

echo "🔧 安装ESLint相关依赖..."

# 检查Node版本
node_version=$(node -v | cut -d'v' -f2)
required_version="18.17.0"

if [ "$(printf '%s\n' "$required_version" "$node_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Node.js版本不符合要求"
    echo "   当前版本: v$node_version"
    echo "   需要版本: >= v$required_version"
    echo "   请升级Node.js版本后重新运行此脚本"
    exit 1
fi

echo "✅ Node.js版本检查通过: v$node_version"

# 安装依赖
echo "📦 安装eslint-plugin-import..."
pnpm add -D eslint-plugin-import

echo "📦 安装eslint-plugin-unused-imports..."
pnpm add -D eslint-plugin-unused-imports

echo "📦 安装prettier (如果尚未安装)..."
pnpm add -D prettier

echo "✅ 所有依赖安装完成！"
echo ""
echo "🎉 现在你可以使用以下命令："
echo "   pnpm lint:fix        - 自动修复ESLint错误（包括删除未使用的import）"
echo "   pnpm format          - 格式化代码"
echo "   pnpm clean:imports   - 专门清理未使用的import"
echo ""
echo "💡 在VS Code中保存文件时会自动执行这些修复操作！" 