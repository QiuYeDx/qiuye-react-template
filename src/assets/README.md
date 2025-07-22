# Assets 资源目录

这个目录用于存放项目中的静态资源文件，所有资源会经过 Vite 的构建处理，包括优化、缓存控制等。

## 目录结构

```
src/assets/
├── images/
│   ├── logos/           # Logo 相关文件
│   │   ├── qiuye-logo.svg           # 主 logo（亮色背景）
│   │   ├── qiuye-logo-dark.svg      # 深色版 logo
│   │   ├── qiuye-leaf-icon.svg      # 纯图标版本（不带背景和文字）
│   │   └── qiuye-icon.svg           # 图标版本（带背景圆圈）
│   ├── icons/           # 其他图标文件
│   ├── banners/         # 横幅图片
│   └── avatars/         # 头像图片
├── fonts/               # 字体文件
├── styles/              # 样式资源（如果需要）
└── README.md           # 本说明文件
```

## 使用方法

### 在 React 组件中使用

```tsx
// 导入图片资源
import QiuyeLeafIcon from "@/assets/images/logos/qiuye-leaf-icon.svg";
import QiuyeLogo from "@/assets/images/logos/qiuye-logo.svg";

function MyComponent() {
  return (
    <div>
      {/* 使用导入的图片 */}
      <img src={QiuyeLeafIcon} alt="Qiuye" className="w-8 h-8" />
      <img src={QiuyeLogo} alt="Qiuye Logo" className="h-8 w-auto" />
    </div>
  );
}
```

### 在 CSS 中使用

```css
.my-component {
  background-image: url("@/assets/images/logos/qiuye-leaf-icon.svg");
  background-size: contain;
  background-repeat: no-repeat;
}
```

## 与 public 目录的区别

| 特性         | `src/assets/`                 | `public/`                                |
| ------------ | ----------------------------- | ---------------------------------------- |
| 构建处理     | ✅ 会被 Vite 处理和优化       | ❌ 原样复制到输出目录                    |
| 缓存控制     | ✅ 自动添加 hash 用于缓存控制 | ❌ 需要手动管理缓存                      |
| 文件大小优化 | ✅ 会被压缩和优化             | ❌ 保持原始大小                          |
| 导入方式     | 需要 import 导入              | 直接通过 URL 访问                        |
| 使用场景     | 组件中使用的图片、图标等      | favicon、robots.txt 等需要固定路径的文件 |

## 最佳实践

1. **命名规范**: 使用 kebab-case 命名文件，如 `qiuye-leaf-icon.svg`
2. **分类存放**: 按用途分类存放资源，便于管理
3. **优化文件**: 在添加到项目前先优化图片（压缩、格式转换等）
4. **类型定义**: 对于特殊格式的资源，确保有对应的类型定义

## 资源类型支持

Vite 默认支持以下资源类型：

- 图片: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`
- 字体: `.woff`, `.woff2`, `.eot`, `.ttf`, `.otf`
- 音频: `.mp3`, `.wav`, `.ogg`
- 视频: `.mp4`, `.webm`, `.ogg`

## 注意事项

- SVG 文件可以作为 URL 导入，也可以作为 React 组件导入（需要配置）
- 大文件会自动转换为 URL，小文件会被内联为 base64
- 资源文件的路径在构建后会包含 hash，不要依赖固定的文件名
