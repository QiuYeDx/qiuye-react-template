# Loading Components 加载组件

一套完整的加载组件集合，支持多种场景和自定义配置。

## 组件列表

### 1. LoadingComponent - 主加载组件

全屏遮罩式加载，适用于页面级别的加载场景。

```tsx
import { LoadingComponent } from '@/components/Loading';

// 基础使用
<LoadingComponent />

// 自定义样式
<LoadingComponent className="bg-red-500/20" />
```

**特性：**

- 全屏毛玻璃遮罩效果
- 优雅的动画过渡
- 多层加载动画（旋转环 + 脉冲点）
- 渐变进度指示器
- 支持国际化文本

### 2. SimpleLoadingComponent - 简化加载组件

轻量级加载，适用于组件内部或局部区域。

```tsx
import { SimpleLoadingComponent } from '@/components/Loading';

<SimpleLoadingComponent />
<SimpleLoadingComponent className="h-16" />
```

**特性：**

- 轻量级设计
- 快速淡入动画
- 适合局部区域使用

### 3. InlineLoadingComponent - 内联加载组件

用于按钮等小空间的微型加载指示器。

```tsx
import { InlineLoadingComponent } from '@/components/Loading';

// 不同尺寸
<InlineLoadingComponent size="sm" />
<InlineLoadingComponent size="md" />
<InlineLoadingComponent size="lg" />

// 在按钮中使用
<button disabled>
  <InlineLoadingComponent size="sm" className="mr-2" />
  提交中...
</button>
```

**Props：**

- `size?: 'sm' | 'md' | 'lg'` - 尺寸选择
- `className?: string` - 自定义样式

### 4. LoadingWithText - 带文字加载组件

带有自定义文本的加载组件。

```tsx
import { LoadingWithText } from '@/components/Loading';

<LoadingWithText />
<LoadingWithText text="数据加载中..." />
<LoadingWithText text="上传文件中..." size="lg" />
```

**Props：**

- `text?: string` - 自定义文本（默认使用国际化）
- `size?: 'sm' | 'md' | 'lg'` - 尺寸选择
- `className?: string` - 自定义样式

## 使用场景

### 页面级加载

```tsx
// 在路由 Suspense 中使用
<Suspense fallback={<LoadingComponent />}>
  <Routes>...</Routes>
</Suspense>
```

### 组件内部加载

```tsx
// 在数据加载时显示
{
  isLoading ? <SimpleLoadingComponent /> : <DataComponent data={data} />;
}
```

### 按钮加载状态

```tsx
// 提交按钮加载
<button disabled={isSubmitting}>
  {isSubmitting && <InlineLoadingComponent size="sm" className="mr-2" />}
  {isSubmitting ? "提交中..." : "提交"}
</button>
```

### 局部区域加载

```tsx
// 卡片内容加载
<Card>
  <CardContent>
    {isLoading ? (
      <LoadingWithText text="获取用户信息中..." />
    ) : (
      <UserProfile user={user} />
    )}
  </CardContent>
</Card>
```

## 类型定义

```tsx
export type LoadingSize = "sm" | "md" | "lg";

export interface LoadingComponentProps {
  className?: string;
}

export interface InlineLoadingProps {
  size?: LoadingSize;
  className?: string;
}

export interface LoadingWithTextProps {
  text?: string;
  size?: LoadingSize;
  className?: string;
}
```

## 样式自定义

所有组件都支持通过 `className` 属性进行样式自定义：

```tsx
// 自定义背景色
<LoadingComponent className="bg-primary/10" />

// 自定义高度
<SimpleLoadingComponent className="h-20" />

// 自定义颜色和间距
<InlineLoadingComponent className="text-red-500 mr-3" />
```

## 国际化支持

组件会自动使用 `t("common.loading")` 获取本地化文本，支持中英文切换。

## 性能优化

- 使用 React Spring 实现流畅动画
- 支持懒加载和代码分割
- 轻量级实现，最小化包体积
