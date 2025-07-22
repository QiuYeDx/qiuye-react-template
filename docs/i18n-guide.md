# 国际化 (i18n) 使用指南

## 概述

项目使用 `react-i18next` 提供完整的国际化支持，目前支持中文（简体）和英文两种语言，并提供了持久化的语言选择功能。

## 支持的语言

- **中文（简体）**: `zh-CN`
- **英文**: `en-US`

## 核心特性

### 🔄 自动持久化
- 用户选择的语言会自动保存到 `localStorage`
- 页面刷新后会保持用户的语言选择
- 支持多标签页同步语言设置

### 🌐 智能语言检测
语言选择的优先级：
1. **localStorage 中保存的语言** (最高优先级)
2. **浏览器语言设置** 
3. **默认语言 (zh-CN)** (兜底)

### 🛡️ 类型安全
- 完整的 TypeScript 支持
- 严格的类型检查防止无效语言设置
- 错误处理和降级策略

## 使用方法

### 在组件中使用翻译

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('pages.home.title')}</h1>
      <p>{t('pages.home.subtitle')}</p>
    </div>
  )
}
```

### 切换语言

```tsx
import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const switchToEnglish = () => {
    i18n.changeLanguage('en-US')
  }

  const switchToChinese = () => {
    i18n.changeLanguage('zh-CN')
  }

  return (
    <div>
      <button onClick={switchToChinese}>中文</button>
      <button onClick={switchToEnglish}>English</button>
    </div>
  )
}
```

### 获取当前语言

```tsx
import { useTranslation } from 'react-i18next'

function CurrentLanguageDisplay() {
  const { i18n } = useTranslation()

  return (
    <div>
      当前语言: {i18n.language}
    </div>
  )
}
```

## 语言文件结构

```
src/i18n/
├── locales/
│   ├── zh-CN.json    # 中文翻译
│   └── en-US.json    # 英文翻译
└── index.ts          # i18n 配置
```

### 翻译文件示例

**zh-CN.json**:
```json
{
  "common": {
    "confirm": "确认",
    "cancel": "取消"
  },
  "nav": {
    "home": "首页",
    "about": "关于"
  },
  "pages": {
    "home": {
      "title": "现代化 React 模板",
      "subtitle": "基于 React 18 + TypeScript + Vite 构建"
    }
  }
}
```

**en-US.json**:
```json
{
  "common": {
    "confirm": "Confirm",
    "cancel": "Cancel"
  },
  "nav": {
    "home": "Home",
    "about": "About"
  },
  "pages": {
    "home": {
      "title": "Modern React Template",
      "subtitle": "Built with React 18 + TypeScript + Vite"
    }
  }
}
```

## 工具函数

项目提供了一套工具函数来管理语言设置：

```tsx
import {
  getInitialLanguage,
  getSavedLanguage,
  saveLanguage,
  getBrowserLanguage,
  isSupportedLanguage,
  clearSavedLanguage,
  type SupportedLanguage
} from '@/utils/language'

// 获取初始语言（考虑所有优先级）
const language = getInitialLanguage()

// 检查是否为支持的语言
if (isSupportedLanguage('zh-CN')) {
  // 安全的语言操作
}

// 手动保存语言设置
saveLanguage('en-US')

// 清除保存的语言设置
clearSavedLanguage()
```

## 最佳实践

### 1. 使用语义化的翻译键

```tsx
// ✅ 好的做法
t('pages.home.welcome.title')
t('components.header.navigation.home')

// ❌ 避免的做法
t('text1')
t('button_click_here')
```

### 2. 为长文本提供上下文

```json
{
  "pages": {
    "about": {
      "description": "这是一个详细的描述..."
    }
  }
}
```

### 3. 处理复数形式

```tsx
// 使用 i18next 的复数功能
t('items', { count: 5 }) // "5 items" 或 "5 个项目"
```

### 4. 动态插值

```tsx
t('welcome.user', { name: 'John' }) // "欢迎, John!" 或 "Welcome, John!"
```

翻译文件中：
```json
{
  "welcome": {
    "user": "欢迎, {{name}}!"
  }
}
```

## 故障排除

### 1. 语言设置不生效

检查：
- 翻译键是否正确
- 语言代码是否为支持的格式 (`zh-CN` 或 `en-US`)
- 浏览器控制台是否有错误信息

### 2. 刷新后语言重置

检查：
- 浏览器是否支持 localStorage
- 是否在隐私模式下浏览
- 控制台是否有 localStorage 相关错误

### 3. 添加新语言

1. 在 `src/utils/language.ts` 中添加新的语言类型：
```tsx
export type SupportedLanguage = 'zh-CN' | 'en-US' | 'ja-JP'
```

2. 在 `SUPPORTED_LANGUAGES` 数组中添加新语言

3. 创建对应的翻译文件 `src/i18n/locales/ja-JP.json`

4. 在 `src/i18n/index.ts` 中导入并配置新语言

## 技术细节

### localStorage 存储

- **键名**: `qiuye-language`
- **值**: 支持的语言代码 (`zh-CN` | `en-US`)
- **错误处理**: 自动降级到浏览器语言或默认语言

### 事件监听

当语言发生变化时，会自动触发：
1. `i18n.on('languageChanged')` 事件
2. 自动保存到 localStorage
3. 重新渲染所有使用翻译的组件

### 类型安全

项目使用 TypeScript 严格类型检查：
- `SupportedLanguage` 类型确保只能使用支持的语言
- 运行时类型检查防止无效的语言设置
- 完整的错误处理和降级策略 