import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { useLoadingStore } from "@/store/useLoadingStore";
import { authService, type LoginRequest, type RegisterRequest } from "@/services/authService";

export interface AuthError {
  message: string;
  field?: string;
}

export interface UseAuthReturn {
  // 状态
  isLoading: boolean;
  error: AuthError | null;
  
  // 登录相关
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // 工具函数
  clearError: () => void;
  resetState: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setUser, logout: clearUser } = useUserStore();
  const { showLoading, hideLoading } = useLoadingStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  // 清除错误
  const clearError = () => {
    setError(null);
  };

  // 重置状态
  const resetState = () => {
    setIsLoading(false);
    setError(null);
  };

  // 登录
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      showLoading({ text: "正在登录..." });

      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        setUser(response.data.user, response.data.token);
        hideLoading();
        
        // 如果是从受保护的路由重定向过来的，登录后重定向回原页面
        const from = (location.state as any)?.from?.pathname || "/";
        navigate(from, { replace: true });
        return true;
      } else {
        setError({ message: response.error || "登录失败" });
        return false;
      }
    } catch (err) {
      setError({ 
        message: err instanceof Error ? err.message : "网络错误，请稍后重试" 
      });
      return false;
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  // 注册
  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      showLoading({ text: "正在注册..." });

      // 基本验证
      if (userData.password !== userData.confirmPassword) {
        setError({ message: "密码确认不匹配", field: "confirmPassword" });
        return false;
      }

      if (userData.password.length < 6) {
        setError({ message: "密码长度至少6位", field: "password" });
        return false;
      }

      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        setUser(response.data.user, response.data.token);
        hideLoading();
        
        // 如果是从受保护的路由重定向过来的，注册后重定向回原页面
        const from = (location.state as any)?.from?.pathname || "/";
        navigate(from, { replace: true });
        return true;
      } else {
        setError({ message: response.error || "注册失败" });
        return false;
      }
    } catch (err) {
      setError({ 
        message: err instanceof Error ? err.message : "网络错误，请稍后重试" 
      });
      return false;
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  // 登出
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      showLoading({ text: "正在登出..." });
      
      await authService.logout();
      clearUser();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
      // 即使登出API失败，也要清除本地状态
      clearUser();
      navigate("/", { replace: true });
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  };

  return {
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    resetState,
  };
};

// 表单验证hooks
export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string): string | null => {
    if (!email) return "邮箱不能为空";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "邮箱格式不正确";
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return "密码不能为空";
    if (password.length < 6) return "密码长度至少6位";
    return null;
  };

  const validateName = (name: string): string | null => {
    if (!name) return "姓名不能为空";
    if (name.length < 2) return "姓名长度至少2位";
    return null;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return "请确认密码";
    if (password !== confirmPassword) return "密码确认不匹配";
    return null;
  };

  const setFieldError = (field: string, error: string | null) => {
    setErrors(prev => ({
      ...prev,
      [field]: error || "",
    }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const hasErrors = Object.values(errors).some(error => error !== "");

  return {
    errors,
    setFieldError,
    clearErrors,
    hasErrors,
    validateEmail,
    validatePassword,
    validateName,
    validateConfirmPassword,
  };
}; 