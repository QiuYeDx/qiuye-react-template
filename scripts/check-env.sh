#!/bin/bash

# 环境检查脚本 - 检查Node.js和pnpm版本

echo "🔍 检查开发环境..."
echo ""

# 检查 Node.js
echo "📦 Node.js:"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "   ✅ 已安装: $NODE_VERSION"
    
    # 检查版本是否满足要求
    CURRENT_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2)
    REQUIRED_VERSION="18.17.0"
    
    # 简单的版本比较（适用于大多数情况）
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$CURRENT_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        echo "   ✅ 版本满足要求 (>= 18.17.0)"
    else
        echo "   ❌ 版本过低，需要 >= 18.17.0"
        exit 1
    fi
else
    echo "   ❌ 未安装 Node.js"
    echo "   💡 请访问 https://nodejs.org 下载安装"
    exit 1
fi

echo ""

# 检查 pnpm
echo "📦 pnpm:"
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    echo "   ✅ 已安装: v$PNPM_VERSION"
    
    # 检查版本是否满足要求
    REQUIRED_PNPM="8.0.0"
    if [ "$(printf '%s\n' "$REQUIRED_PNPM" "$PNPM_VERSION" | sort -V | head -n1)" = "$REQUIRED_PNPM" ]; then
        echo "   ✅ 版本满足要求 (>= 8.0.0)"
    else
        echo "   ⚠️  版本可能过低，建议 >= 8.0.0"
    fi
else
    echo "   ❌ 未安装 pnpm"
    echo "   💡 安装命令: npm install -g pnpm"
    exit 1
fi

echo ""

# 检查项目配置
echo "📦 项目配置:"
if [ -f "package.json" ]; then
    echo "   ✅ package.json 存在"
    
    # 检查 engines 配置
    if grep -q '"engines"' package.json; then
        echo "   ✅ engines 配置已设置"
    else
        echo "   ⚠️  未设置 engines 配置"
    fi
    
    # 检查 packageManager 配置
    if grep -q '"packageManager"' package.json; then
        echo "   ✅ packageManager 配置已设置"
    else
        echo "   ⚠️  未设置 packageManager 配置"
    fi
else
    echo "   ❌ package.json 不存在"
    exit 1
fi

echo ""

# 检查依赖安装状态
echo "📦 依赖状态:"
if [ -d "node_modules" ]; then
    echo "   ✅ 依赖已安装"
else
    echo "   ⚠️  依赖未安装"
    echo "   💡 运行: pnpm install"
fi

echo ""
echo "🎉 环境检查完成！"

# 如果依赖未安装，询问是否自动安装
if [ ! -d "node_modules" ]; then
    echo ""
    read -p "❓ 是否现在安装依赖？(y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📥 正在安装依赖..."
        pnpm install
        echo "✅ 依赖安装完成！"
    fi
fi 