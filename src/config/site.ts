import type { ParseKeys } from "i18next"

export interface NavItem {
  /** 路由路径 */
  to: string
  /** 导航文案的 i18n key */
  labelKey: ParseKeys
  /** 是否只在路径完全匹配时高亮 */
  end?: boolean
}

export const siteConfig = {
  name: import.meta.env.VITE_APP_TITLE || "QiuYe React Template",
  description: import.meta.env.VITE_APP_DESCRIPTION,
  author: "QiuYeDx",
  links: {
    github: "https://github.com/QiuYeDx/qiuye-react-template",
    qiuyeUi: "https://ui.qiuyedx.com",
    shadcn: "https://ui.shadcn.com",
  },
  repo: {
    owner: "QiuYeDx",
    name: "qiuye-react-template",
  },
  nav: [
    { to: "/", labelKey: "nav.home", end: true },
    { to: "/components", labelKey: "nav.components" },
    { to: "/about", labelKey: "nav.about" },
  ] satisfies NavItem[],
} as const
