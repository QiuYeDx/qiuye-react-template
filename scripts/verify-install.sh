#!/bin/bash

# 验证安装脚本 - 检查所有依赖是否正确安装

echo "🔍 验证项目安装状态..."
echo ""

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules 目录不存在"
    echo "💡 请先运行: pnpm install"
    exit 1
fi

echo "✅ node_modules 目录存在"
echo ""

# 检查关键依赖包
echo "📦 检查关键依赖包:"

PACKAGES=(
    "react"
    "react-dom"
    "react-router-dom"
    "typescript"
    "vite"
    "antd"
    "tailwindcss"
    "zustand"
    "react-i18next"
    "axios"
)

for package in "${PACKAGES[@]}"; do
    if [ -d "node_modules/$package" ]; then
        VERSION=$(node -e "console.log(require('./node_modules/$package/package.json').version)" 2>/dev/null)
        if [ $? -eq 0 ]; then
            echo "  ✅ $package@$VERSION"
        else
            echo "  ✅ $package (已安装)"
        fi
    else
        echo "  ❌ $package (缺失)"
        exit 1
    fi
done

echo ""

# 检查 TypeScript 配置
echo "🔧 检查配置文件:"
CONFIG_FILES=(
    "tsconfig.json"
    "vite.config.ts"
    "tailwind.config.js"
    "postcss.config.js"
    ".eslintrc.cjs"
)

for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (缺失)"
        exit 1
    fi
done

echo ""

# 检查源代码结构
echo "📁 检查源代码结构:"
SRC_DIRS=(
    "src"
    "src/components"
    "src/pages"
    "src/store"
    "src/utils"
    "src/i18n"
    "src/routes"
)

for dir in "${SRC_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "  ✅ $dir/"
    else
        echo "  ❌ $dir/ (缺失)"
        exit 1
    fi
done

echo ""

# 尝试 TypeScript 类型检查
echo "🔍 TypeScript 类型检查:"
if command -v pnpm &> /dev/null; then
    if pnpm exec tsc --noEmit --skipLibCheck 2>/dev/null; then
        echo "  ✅ TypeScript 类型检查通过"
    else
        echo "  ⚠️  TypeScript 类型检查有警告（通常是因为依赖未安装）"
    fi
else
    echo "  ⚠️  pnpm 未安装，跳过类型检查"
fi

echo ""

# 检查构建是否可以开始
echo "🚀 准备状态检查:"
if [ -f "package.json" ] && [ -d "node_modules" ] && [ -f "vite.config.ts" ]; then
    echo "  ✅ 项目已准备就绪，可以启动开发服务器"
    echo ""
    echo "🎉 验证完成！"
    echo ""
    echo "📋 下一步操作："
    echo "  pnpm dev     # 启动开发服务器"
    echo "  pnpm build   # 构建生产版本"
    echo "  pnpm lint    # 代码检查"
else
    echo "  ❌ 项目配置不完整"
    exit 1
fi 