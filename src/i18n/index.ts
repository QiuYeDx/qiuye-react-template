import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import enUS from "./locales/en-US"
import zhCN from "./locales/zh-CN"

export const resources = {
  "zh-CN": { translation: zhCN },
  "en-US": { translation: enUS },
} as const

export type Language = keyof typeof resources

export const languages = Object.keys(resources) as Language[]

export const defaultLanguage: Language = "zh-CN"

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // 文案随代码打包，同步初始化，避免首屏短暂显示 key
    initAsync: false,
    fallbackLng: defaultLanguage,
    supportedLngs: languages,
    load: "currentOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "language",
      caches: ["localStorage"],
      // 浏览器语言可能是 "zh" / "zh-TW" / "en-GB"，统一映射到受支持的语言
      convertDetectedLanguage: (lng) => {
        if (lng.startsWith("zh")) return "zh-CN"
        if (lng.startsWith("en")) return "en-US"
        return lng
      },
    },
  })

const syncDocumentLanguage = (lng: string) => {
  document.documentElement.lang = lng
}

syncDocumentLanguage(i18n.resolvedLanguage ?? defaultLanguage)
i18n.on("languageChanged", syncDocumentLanguage)

export default i18n
