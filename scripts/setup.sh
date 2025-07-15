#!/bin/bash

# Qiuye React Template 快速设置脚本

echo "🚀 开始设置 Qiuye React Template..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js (版本 >= 18.17.0)"
    exit 1
fi

# 检查 Node.js 版本
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.17.0"

# 版本比较函数
version_compare() {
    if [ "$1" = "$2" ]; then
        return 0
    fi
    
    local IFS=.
    local i ver1=($1) ver2=($2)
    
    # 填充缺失的版本号部分
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++)); do
        ver1[i]=0
    done
    for ((i=${#ver2[@]}; i<${#ver1[@]}; i++)); do
        ver2[i]=0
    done
    
    for ((i=0; i<${#ver1[@]}; i++)); do
        if [[ -z ${ver2[i]} ]]; then
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]})); then
            return 1
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]})); then
            return 2
        fi
    done
    return 0
}

version_compare "$NODE_VERSION" "$REQUIRED_VERSION"
if [ $? -eq 2 ]; then
    echo "❌ Node.js 版本过低，请升级到 18.17.0 或更高版本 (当前版本: v$NODE_VERSION)"
    exit 1
fi

# 检查包管理器，优先使用 pnpm
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
elif command -v yarn &> /dev/null; then
    PACKAGE_MANAGER="yarn"
    echo "⚠️  建议使用 pnpm 作为包管理器，运行: npm install -g pnpm"
else
    PACKAGE_MANAGER="npm"
    echo "⚠️  建议使用 pnpm 作为包管理器，运行: npm install -g pnpm"
fi

echo "📦 使用包管理器: $PACKAGE_MANAGER"

# 安装依赖
echo "📥 安装项目依赖..."
$PACKAGE_MANAGER install

# 创建环境变量文件
if [ ! -f .env ]; then
    echo "⚙️ 创建环境变量文件..."
    cat > .env << EOF
# 应用配置
VITE_APP_TITLE=Qiuye React Template
VITE_APP_DESCRIPTION=A modern React template with TypeScript and Vite

# API配置
VITE_API_BASE_URL=http://localhost:3001/api

# 开发环境配置
VITE_NODE_ENV=development
EOF
fi

echo "✅ 设置完成！"
echo ""
echo "🎉 现在你可以运行以下命令："
if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    echo "   pnpm dev         # 启动开发服务器"
    echo "   pnpm build       # 构建项目"
    echo "   pnpm lint        # 代码检查"
else
    echo "   $PACKAGE_MANAGER run dev     # 启动开发服务器"
    echo "   $PACKAGE_MANAGER run build   # 构建项目"
    echo "   $PACKAGE_MANAGER run lint    # 代码检查"
fi
echo ""
echo "🌐 开发服务器地址: http://localhost:3000"
echo ""
if [ "$PACKAGE_MANAGER" != "pnpm" ]; then
    echo "💡 提示: 推荐使用 pnpm 获得更好的性能和体验"
    echo "   安装: npm install -g pnpm"
    echo "   详情: 查看 PNPM_GUIDE.md"
fi 