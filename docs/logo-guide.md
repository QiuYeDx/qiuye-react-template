# Qiuye React Template Logo 使用指南

## Logo 文件说明

本项目包含了多个版本的 SVG logo 文件，用于不同的使用场景：

### 1. 主 Logo (`src/assets/images/logos/qiuye-logo.svg`)
- **用途**: 适用于亮色背景的完整品牌 logo
- **尺寸**: 200x60px (viewBox)
- **包含**: 秋叶图标 + "Qiuye" 主标题 + "React Template" 副标题
- **使用场景**: 
  - 文档封面
  - 营销材料（亮色背景）
  - 完整logo展示需求

### 2. 深色版 Logo (`src/assets/images/logos/qiuye-logo-dark.svg`)
- **用途**: 适用于深色背景的完整品牌 logo
- **尺寸**: 200x60px (viewBox)
- **特点**: 调整了颜色对比度，适合深色模式
- **使用场景**:
  - 深色背景的设计材料
  - 夜间模式界面
  - 深色主题完整logo展示

### 3. 图标版本 (`src/assets/images/logos/qiuye-icon.svg`)
- **用途**: 独立的图标版本，带背景圆圈
- **尺寸**: 64x64px (viewBox)
- **包含**: 秋叶图标 + 圆形背景
- **使用场景**:
  - 应用图标
  - 社交媒体头像
  - 小尺寸展示

### 4. 纯图标版本 (`src/assets/images/logos/qiuye-leaf-icon.svg`) **推荐**
- **用途**: 纯净的秋叶图标，不含背景和文字
- **尺寸**: 40x40px (viewBox)
- **特点**: 专为与前端文字组合使用而设计，是主要的导航logo方案
- **使用场景**:
  - 网站头部导航（与文字组合）
  - 独立图标使用
  - 灵活布局需求

### 5. Favicon (`public/favicon.svg`)
- **用途**: 浏览器标签页图标
- **尺寸**: 32x32px (viewBox)
- **特点**: 简化版本，专为小尺寸优化，保留在public目录以便HTML直接引用
- **使用场景**:
  - 浏览器标签页
  - 书签图标
  - PWA 应用图标

## 设计元素

### 颜色方案
- **主要渐变**: 橙红色到金黄色 (`#ff6b35` → `#f7931e` → `#ffcc02`)
- **次要渐变**: 深红色到橙色 (`#dc2626` → `#ea580c` → `#f59e0b`)
- **茎部**: 紫色 (`#8b5cf6`)
- **文字**: 深灰色渐变

### 字体
- **主标题**: Inter, 18px, 粗体
- **副标题**: Inter, 12px, 中等粗细

### 寓意
- **秋叶**: 代表季节变化、成长和自然美感
- **渐变色**: 体现温暖、活力和创新
- **重叠设计**: 象征层次和深度

## 在代码中使用

### React 组件中使用

首先导入所需的logo资源：

```tsx
// 导入logo资源
import QiuyeLeafIcon from "@/assets/images/logos/qiuye-leaf-icon.svg";
import QiuyeLogo from "@/assets/images/logos/qiuye-logo.svg";
import QiuyeLogoDark from "@/assets/images/logos/qiuye-logo-dark.svg";
import QiuyeIcon from "@/assets/images/logos/qiuye-icon.svg";
```

然后在组件中使用：

```tsx
// 图标+文字组合（推荐用于导航栏）
<div className="flex items-center space-x-3">
  <img 
    src={QiuyeLeafIcon} 
    alt="Qiuye" 
    className="w-8 h-8" 
  />
  <div className="text-xl font-bold text-foreground">
    Qiuye Template
  </div>
</div>

// 完整 logo（根据主题自动切换）
<img 
  src={theme.mode === "dark" ? QiuyeLogoDark : QiuyeLogo} 
  alt="Qiuye React Template" 
  className="h-8 w-auto" 
/>

// 独立图标版本（带背景圆圈）
<img 
  src={QiuyeIcon} 
  alt="Qiuye" 
  className="w-8 h-8" 
/>

// 纯图标版本（不带背景）
<img 
  src={QiuyeLeafIcon} 
  alt="Qiuye" 
  className="w-8 h-8" 
/>
```

### CSS 中使用
```css
/* 在CSS中使用时，需要使用相对路径 */
.logo {
  background-image: url('@/assets/images/logos/qiuye-leaf-icon.svg');
  background-size: contain;
  background-repeat: no-repeat;
}

/* 或者在CSS Modules中通过导入使用 */
.logo-from-js {
  background-image: var(--logo-url);
}
```

### HTML 中使用
```html
<!-- Favicon（保留在public目录） -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />

<!-- 其他logo需要通过JS/React导入使用，不能直接在HTML中引用 -->
```

## 自定义说明

### 修改颜色
如需修改 logo 颜色，可以编辑 SVG 文件中的渐变定义：

```svg
<linearGradient id="leafGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" style="stop-color:#你的颜色;stop-opacity:1" />
  <stop offset="50%" style="stop-color:#你的颜色;stop-opacity:1" />
  <stop offset="100%" style="stop-color:#你的颜色;stop-opacity:1" />
</linearGradient>
```

### 调整尺寸
SVG 是矢量格式，可以无损缩放。通过修改 `viewBox` 属性可以调整宽高比：

```svg
<!-- 原始比例 -->
<svg viewBox="0 0 200 60">

<!-- 正方形比例 -->
<svg viewBox="0 0 200 200">
```

## 文件清单

```
src/assets/images/logos/
├── qiuye-logo.svg           # 主 logo（亮色背景）
├── qiuye-logo-dark.svg      # 深色版 logo  
├── qiuye-icon.svg           # 图标版本（带背景圆圈）
└── qiuye-leaf-icon.svg      # 纯图标版本（不带背景和文字）

public/
└── favicon.svg              # Favicon（保留在public目录）
```

## 构建后的优化

所有 `src/assets/` 中的资源在构建时会被 Vite 处理：

- **文件名哈希**: 自动添加内容哈希用于缓存控制，如 `qiuye-leaf-icon.abc123.svg`
- **文件优化**: SVG 文件会被压缩和优化
- **按需加载**: 只有被导入的资源才会包含在最终的构建产物中

## 版权信息

这些 logo 文件是 Qiuye React Template 项目的一部分，遵循项目的 MIT 许可证。

---

**创建日期**: 2024年
**设计师**: Qiuye React Template 团队
**格式**: SVG (可缩放矢量图形)
**许可证**: MIT License 