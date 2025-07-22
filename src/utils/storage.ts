/**
 * 本地存储工具类
 */
class Storage {
  /**
   * 设置localStorage
   */
  static setLocal(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("localStorage设置失败:", error);
    }
  }

  /**
   * 获取localStorage
   */
  static getLocal<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("localStorage获取失败:", error);
      return null;
    }
  }

  /**
   * 删除localStorage
   */
  static removeLocal(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("localStorage删除失败:", error);
    }
  }

  /**
   * 清空localStorage
   */
  static clearLocal(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("localStorage清空失败:", error);
    }
  }

  /**
   * 设置sessionStorage
   */
  static setSession(key: string, value: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("sessionStorage设置失败:", error);
    }
  }

  /**
   * 获取sessionStorage
   */
  static getSession<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("sessionStorage获取失败:", error);
      return null;
    }
  }

  /**
   * 删除sessionStorage
   */
  static removeSession(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error("sessionStorage删除失败:", error);
    }
  }

  /**
   * 清空sessionStorage
   */
  static clearSession(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error("sessionStorage清空失败:", error);
    }
  }
}

export default Storage;
