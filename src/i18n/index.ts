import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zhCN from "./locales/zh-CN.json";
import enUS from "./locales/en-US.json";
import {
  getInitialLanguage,
  saveLanguage,
  isSupportedLanguage,
} from "@/utils/language";

const resources = {
  "zh-CN": {
    translation: zhCN,
  },
  "en-US": {
    translation: enUS,
  },
};

const initialLanguage = getInitialLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: "zh-CN",
  interpolation: {
    escapeValue: false,
  },
});

// 监听语言变化并保存到localStorage
i18n.on("languageChanged", (language: string) => {
  if (isSupportedLanguage(language)) {
    saveLanguage(language);
  }
});

export default i18n;
