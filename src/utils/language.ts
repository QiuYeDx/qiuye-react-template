// 支持的语言类型
export type SupportedLanguage = "zh-CN" | "en-US";

// 语言设置的localStorage键名
const LANGUAGE_KEY = "qiuye-language";

// 支持的语言列表
const SUPPORTED_LANGUAGES: SupportedLanguage[] = ["zh-CN", "en-US"];

// 默认语言
const DEFAULT_LANGUAGE: SupportedLanguage = "zh-CN";

/**
 * 检查是否为支持的语言
 */
export const isSupportedLanguage = (
  language: string
): language is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
};

/**
 * 获取浏览器语言偏好
 */
export const getBrowserLanguage = (): SupportedLanguage => {
  try {
    const browserLanguage = navigator.language || navigator.languages?.[0];
    if (browserLanguage) {
      // 匹配支持的语言
      if (browserLanguage.startsWith("zh")) {
        return "zh-CN";
      }
      if (browserLanguage.startsWith("en")) {
        return "en-US";
      }
    }
  } catch (error) {
    console.warn("无法获取浏览器语言设置:", error);
  }

  return DEFAULT_LANGUAGE;
};

/**
 * 从localStorage获取保存的语言设置
 */
export const getSavedLanguage = (): SupportedLanguage | null => {
  try {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage && isSupportedLanguage(savedLanguage)) {
      return savedLanguage;
    }
  } catch (error) {
    console.warn("无法读取localStorage中的语言设置:", error);
  }

  return null;
};

/**
 * 保存语言设置到localStorage
 */
export const saveLanguage = (language: SupportedLanguage): boolean => {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
    return true;
  } catch (error) {
    console.warn("无法保存语言设置到localStorage:", error);
    return false;
  }
};

/**
 * 获取初始语言设置
 * 优先级：localStorage > 浏览器语言 > 默认语言
 */
export const getInitialLanguage = (): SupportedLanguage => {
  // 1. 优先使用保存的语言设置
  const savedLanguage = getSavedLanguage();
  if (savedLanguage) {
    return savedLanguage;
  }

  // 2. 使用浏览器语言
  return getBrowserLanguage();
};

/**
 * 移除保存的语言设置
 */
export const clearSavedLanguage = (): boolean => {
  try {
    localStorage.removeItem(LANGUAGE_KEY);
    return true;
  } catch (error) {
    console.warn("无法清除localStorage中的语言设置:", error);
    return false;
  }
};
