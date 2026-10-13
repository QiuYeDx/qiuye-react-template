// 中文文案是 i18n 的类型基准：其它语言必须提供完全相同的 key 结构。
const zhCN = {
  common: {
    copy: "复制",
    copied: "已复制",
    copyFailed: "复制失败，请手动复制",
    backHome: "返回首页",
    retry: "重试",
    learnMore: "了解更多",
    github: "GitHub",
    openMenu: "打开导航菜单",
    skipToContent: "跳到主要内容",
    loading: "加载中…",
  },
  nav: {
    home: "首页",
    components: "组件",
    about: "关于",
  },
  theme: {
    toLight: "切换到浅色模式",
    toDark: "切换到深色模式",
  },
  language: {
    label: "切换语言",
    "zh-CN": "简体中文",
    "en-US": "English",
  },
  footer: {
    license: "基于 MIT 协议开源",
    builtWith: "使用 shadcn/ui 与 QiuYe UI 构建",
  },
  home: {
    hero: {
      badge: "v3 · 基于 shadcn/ui 4 全新重写",
      title: "构建更好的 React 应用",
      words: ["更现代。", "更优雅。", "更规范。", "更通用。"],
      description:
        "Vite 8、React 19、TypeScript 与 Tailwind CSS 4，以官方 shadcn/ui 为基础，预置路由、数据请求、状态管理、国际化、主题与动效，并兼容 QiuYe UI 组件库。",
      primary: "浏览组件",
      secondary: "查看源码",
      commandLabel: "快速创建项目",
    },
    stack: {
      title: "技术栈",
      description:
        "依赖均为当前稳定版本，下面的版本号直接读取自 package.json。",
      items: {
        vite: "下一代前端构建工具，基于 Rolldown 的极速开发与构建",
        react: "并发渲染、Actions 与全新的 Hooks",
        typescript: "严格模式与 bundler 模块解析",
        tailwind: "CSS-first 配置，原生级别的构建速度",
        shadcn: "radix-nova 风格，组件源码完全归你所有",
        router: "数据路由与路由级懒加载",
        query: "服务端状态的缓存、重试与同步",
        zustand: "极简的客户端状态管理",
        motion: "声明式动画与布局过渡",
        i18next: "类型安全的国际化方案",
        vitest: "与 Vite 共享配置的单元测试",
        qiuye: "17 个扩展组件，与官方主题无缝兼容",
      },
    },
    features: {
      title: "开箱即用的工程约定",
      description: "不是组件的堆砌，而是一套可以直接写业务的项目骨架。",
      items: {
        routing: {
          title: "路由级代码分割",
          description:
            "React Router 数据路由配合 lazy 加载，导航时显示顶部进度条，并统一处理错误边界与 404。",
        },
        data: {
          title: "数据请求",
          description:
            "基于原生 fetch 的轻量请求封装，搭配 TanStack Query 管理缓存、重试与加载状态。",
        },
        theme: {
          title: "主题与深色模式",
          description:
            "next-themes 与 CSS 变量驱动，首屏无闪烁，切换主题时带有视图过渡动画。",
        },
        i18n: {
          title: "类型安全的国际化",
          description:
            "以中文文案为基准推导 key 类型，拼错 key 或漏翻译都会在编译期报错。",
        },
        motion: {
          title: "统一的动效",
          description:
            "所有动画基于 Motion，并自动遵循系统的「减少动态效果」设置。",
        },
        quality: {
          title: "代码质量",
          description:
            "ESLint Flat Config、Prettier（含 Tailwind 类名排序）、Vitest 与 Testing Library。",
        },
      },
    },
    playground: {
      title: "试一试",
      description:
        "计数由 Zustand 管理并持久化到 localStorage，刷新页面后依然保留；数字过渡来自 QiuYe UI 的 AnimatedNumber。",
      label: "点击次数",
      increment: "加一",
      decrement: "减一",
      reset: "重置",
      resetToast: "计数已重置",
    },
    structure: {
      title: "目录结构",
      description: "按职责划分目录，新增页面只需要两步：写页面、注册路由。",
    },
  },
  components: {
    title: "组件",
    description:
      "官方 shadcn/ui 基础组件与 QiuYe UI 扩展组件在同一套主题下的实际效果。所有组件都可以通过 shadcn CLI 按需安装。",
    filter: {
      label: "组件来源",
      all: "全部",
      shadcn: "shadcn/ui",
      qiuye: "QiuYe UI",
    },
    install: "安装命令",
    demos: {
      button: {
        title: "Button 按钮",
        description: "六种变体与多种尺寸，支持图标与 asChild。",
        default: "默认",
        secondary: "次要",
        outline: "描边",
        ghost: "幽灵",
        destructive: "危险",
        link: "链接",
      },
      form: {
        title: "表单控件",
        description: "Input、Textarea、Switch 与 Label 的组合。",
        name: "项目名称",
        namePlaceholder: "my-awesome-app",
        intro: "简介",
        introPlaceholder: "一句话介绍你的项目…",
        notify: "构建完成后通知我",
      },
      overlay: {
        title: "浮层",
        description: "Dialog、Popover、Tooltip 与 DropdownMenu。",
        dialog: "对话框",
        dialogTitle: "发布新版本",
        dialogDescription: "发布后，所有用户都会在下一次访问时获得更新。",
        cancel: "取消",
        confirm: "发布",
        popover: "弹出层",
        popoverText: "Popover 适合放置轻量的补充信息或快捷操作。",
        tooltip: "提示",
        tooltipText: "这是一个 Tooltip",
        menu: "菜单",
        menuProfile: "个人资料",
        menuSettings: "设置",
        menuSignOut: "退出登录",
      },
      feedback: {
        title: "反馈",
        description: "Badge、Skeleton、Spinner 与 Sonner Toast。",
        toast: "显示通知",
        toastTitle: "保存成功",
        toastDescription: "你的修改已同步到云端。",
        loading: "处理中",
      },
      segmentedControl: {
        title: "SegmentedControl 分段控件",
        description: "ChatGPT 风格的分段单选控件，滑块使用 spring 过渡。",
        day: "日",
        week: "周",
        month: "月",
        year: "年",
      },
      responsiveTabs: {
        title: "ResponsiveTabs 响应式标签页",
        description: "空间不足时自动切换为可滚动布局，并带有边缘渐隐。",
        overview: "概览",
        analytics: "分析",
        reports: "报告",
        notifications: "通知",
        settings: "设置",
        current: "当前标签：{{label}}",
      },
      clipPathTabs: {
        title: "ClipPathTabs 裁剪标签",
        description: "通过 clip-path 平滑切换背景与文字颜色。",
        preview: "预览",
        code: "代码",
        docs: "文档",
        content: "「{{label}}」面板内容",
      },
      dualStateToggle: {
        title: "DualStateToggle 双态切换",
        description: "在两个图标之间带模糊与旋转效果地切换。",
        play: "播放",
        pause: "暂停",
        mute: "静音",
        unmute: "取消静音",
      },
      themeToggle: {
        title: "ThemeTransitionToggle 主题切换",
        description:
          "基于 View Transitions 的圆形扩散主题切换，页头使用的就是它。",
        hint: "点击按钮切换主题",
      },
      animatedNumber: {
        title: "AnimatedNumber 动态数字",
        description: "按数位独立过渡，支持 Intl 格式化。",
        random: "随机金额",
      },
      typewriter: {
        title: "Typewriter 打字机",
        description: "逐字输入与删除的循环文字效果。",
        phrases: ["你好，世界", "Hello, World", "Bonjour le monde"],
      },
      colorPicker: {
        title: "ColorPicker 颜色选择器",
        description: "支持透明度、预设色与最近使用颜色。",
      },
      smoothCorners: {
        title: "SmoothCorners 平滑圆角",
        description: "Figma / iOS 风格的超椭圆圆角，不支持时回退为普通圆角。",
        smooth: "平滑圆角",
        regular: "普通圆角",
      },
      dotGlass: {
        title: "DotGlass 点阵玻璃",
        description: "点阵镂空的毛玻璃表面，常用于导航栏与浮层背景。",
      },
      imageViewer: {
        title: "ImageViewer 图片查看器",
        description: "点击图片以连续放大的方式进入全屏预览。",
        alt: "清晨的山谷",
      },
      expandableCard: {
        title: "ExpandableCard 展开卡片",
        description: "App Store 风格：从原位置连续放大为居中详情浮层。",
        eyebrow: "精选模板",
        cardTitle: "从一个干净的\n起点开始",
        name: "QiuYe React Template",
        subtitle: "Vite · React · shadcn/ui",
        action: "获取",
        open: "查看",
        close: "关闭",
        body1:
          "这个卡片演示了容器变形过渡：卡片从列表中的位置连续放大为居中的详情浮层，关闭时再精确地回到原位。",
        body2:
          "浮层内的内容可以独立滚动，不会引起页面重排；在窄屏上可以向下拖动来关闭。",
      },
      scrollableDialog: {
        title: "ScrollableDialog 可滚动对话框",
        description: "头部与底部固定，只有中间内容滚动。",
        open: "查看服务条款",
        dialogTitle: "服务条款",
        dialogDescription: "请在继续之前阅读以下条款。",
        section: "第 {{index}} 条",
        paragraph:
          "这是用于演示滚动效果的占位文本。对话框的头部和底部始终可见，只有中间的内容区域可以滚动，长内容也不会把操作按钮挤出屏幕。",
        accept: "我已阅读并同意",
      },
      tour: {
        title: "Tour 引导",
        description: "聚光灯式的分步功能引导。",
        start: "开始引导",
        step1Title: "筛选组件",
        step1Content: "通过这里按来源筛选 shadcn/ui 或 QiuYe UI 组件。",
        step2Title: "复制安装命令",
        step2Content: "每个组件都附带了可以直接复制的 shadcn CLI 安装命令。",
        step3Title: "切换主题",
        step3Content: "所有组件都会跟随主题，试试深色模式下的效果。",
      },
      codeBlock: {
        title: "CodeBlock 代码块",
        description: "语法高亮、行号、行高亮与一键复制。",
      },
      markdownRenderer: {
        title: "MarkdownRenderer Markdown 渲染",
        description: "支持 GFM、代码块、表格与 Mermaid 图表，按需懒加载。",
      },
      matrixEffect: {
        title: "MatrixEffect 点阵效果",
        description: "基于 Canvas 的流动光团点阵，离开视口时自动暂停。",
        label: "流动的柔和光团点阵",
      },
    },
  },
  about: {
    title: "关于",
    description:
      "QiuYe React Template 是一个面向真实项目的 React + Vite 起点：尽量贴近官方约定，同时把常用的工程能力准备好。",
    repo: {
      title: "仓库动态",
      description:
        "通过 TanStack Query 实时获取 GitHub 数据，演示加载、错误与重试状态。",
      stars: "Star",
      forks: "Fork",
      issues: "Issue",
      updated: "最近更新",
      error: "暂时无法获取 GitHub 数据",
      errorHint: "可能是网络问题或触发了接口频率限制。",
    },
    start: {
      title: "从模板开始",
      description: "拿到模板后，通常只需要这几步就能进入业务开发。",
      steps: {
        env: {
          title: "修改应用信息",
          description: "在 .env 中设置应用名称、描述与接口地址。",
        },
        nav: {
          title: "配置导航",
          description: "在 src/config/site.ts 中维护站点链接与导航项。",
        },
        page: {
          title: "新增页面",
          description:
            "在 src/pages 下创建页面，并在 src/app/router.tsx 注册懒加载路由。",
        },
        components: {
          title: "按需添加组件",
          description:
            "使用 shadcn CLI 添加组件；不需要的演示页面与 QiuYe UI 组件可以直接删除。",
        },
      },
    },
  },
  notFound: {
    title: "页面不存在",
    description: "你访问的页面可能已被移动、删除，或者地址输入有误。",
  },
  error: {
    title: "页面出错了",
    description: "渲染页面时发生了意外错误，你可以重试或返回首页。",
  },
}

export default zhCN

type DeepStringify<T> = T extends readonly string[]
  ? string[]
  : T extends string
    ? string
    : { [K in keyof T]: DeepStringify<T[K]> }

/** 其它语言需要满足的文案结构 */
export type LocaleMessages = DeepStringify<typeof zhCN>
