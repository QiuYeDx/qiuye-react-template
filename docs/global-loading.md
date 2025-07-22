# 全局Loading系统使用指南

全局Loading系统提供了一个单例化的加载组件，可以在应用的任何地方通过简单的API调用来显示和隐藏Loading效果。

## 🚀 快速开始

### 基础用法

```typescript
import { LoadingController } from "@/store/useLoadingStore";

// 显示Loading
LoadingController.show();

// 隐藏Loading
LoadingController.hide();
```

### 自定义文本

```typescript
LoadingController.show({
  text: "数据加载中...",
});
```

### 异步操作包装

```typescript
// 自动在异步操作期间显示Loading
const result = await LoadingController.withLoading(
  async () => {
    const response = await fetch("/api/data");
    return response.json();
  },
  { text: "获取数据中..." }
);
```

## 📚 API参考

### LoadingController 类方法

- `show(config?)` - 显示Loading
- `hide()` - 隐藏Loading
- `showFor(duration, config?)` - 显示指定时间后自动隐藏
- `showWithDelay(delay, config?)` - 延迟显示Loading
- `withLoading(asyncFn, config?)` - 异步操作包装器

### 便捷函数

```typescript
import {
  showGlobalLoading,
  hideGlobalLoading,
  withGlobalLoading,
} from "@/store/useLoadingStore";
```

## 🎯 实际使用场景

### API请求

```typescript
const fetchData = () =>
  LoadingController.withLoading(() => api.get("/data"), {
    text: "获取数据中...",
  });
```

### 表单提交

```typescript
const handleSubmit = () =>
  LoadingController.withLoading(() => api.post("/form", data), {
    text: "提交中...",
  });
```

## 🛠️ 调试

访问 `/loading-debug` 页面可以测试各种Loading效果和API用法。

---

更多详细信息请参考源码中的注释和类型定义。
