import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useFormValidation } from "@/hooks/useAuth";
import type { LoginRequest } from "@/services/authService";

interface LoginFormProps {
  className?: string;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  className, 
  onSuccess 
}) => {
  const { t } = useTranslation();
  const { login, error: authError, isLoading, clearError } = useAuth();
  const { 
    errors, 
    setFieldError, 
    clearErrors, 
    validateEmail, 
    validatePassword 
  } = useFormValidation();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // 清除错误当表单数据改变时
  useEffect(() => {
    if (authError) {
      clearError();
    }
    clearErrors();
  }, [formData, authError, clearError, clearErrors]);

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 实时验证
    if (field === "email") {
      const error = validateEmail(value);
      setFieldError(field, error);
    } else if (field === "password") {
      const error = validatePassword(value);
      setFieldError(field, error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError || passwordError) {
      setFieldError("email", emailError);
      setFieldError("password", passwordError);
      return;
    }

    // 提交登录
    const success = await login(formData);
    if (success) {
      onSuccess?.();
    }
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: 实现社交登录
    console.log(`Login with ${provider}`);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{t("auth.login.title")}</h1>
                <p className="text-muted-foreground text-balance">
                  {t("auth.login.subtitle")}
                </p>
              </div>

              {/* 全局错误提示 */}
              {authError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/20">
                  {authError.message}
                </div>
              )}

              {/* 邮箱输入 */}
              <div className="grid gap-3">
                <Label htmlFor="email">{t("auth.login.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={cn(
                    errors.email && "border-red-500 focus:ring-red-500"
                  )}
                  disabled={isLoading}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* 密码输入 */}
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("auth.login.password")}</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto text-sm text-primary hover:underline underline-offset-2"
                  >
                    {t("auth.login.forgotPassword")}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={cn(
                      "pr-10",
                      errors.password && "border-red-500 focus:ring-red-500"
                    )}
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* 登录按钮 */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? t("auth.messages.loggingIn") : t("auth.login.loginButton")}
              </Button>

              {/* 分割线 */}
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  {t("auth.login.orContinueWith")}
                </span>
              </div>

              {/* 社交登录按钮 */}
              <div className="grid grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full"
                  onClick={() => handleSocialLogin("apple")}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">{t("auth.login.loginWithApple")}</span>
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">{t("auth.login.loginWithGoogle")}</span>
                </Button>
                <Button 
                  variant="outline" 
                  type="button" 
                  className="w-full"
                  onClick={() => handleSocialLogin("github")}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                      d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">{t("auth.login.loginWithGithub")}</span>
                </Button>
              </div>

              {/* 注册链接 */}
              <div className="text-center text-sm">
                {t("auth.login.noAccount")}{" "}
                <Link 
                  to="/register" 
                  className="text-primary hover:underline underline-offset-4"
                >
                  {t("auth.login.signUp")}
                </Link>
              </div>
            </div>
          </form>

          {/* 右侧装饰图片 */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?w=600&h=800&fit=crop&crop=center"
              alt="Login illustration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      {/* 服务条款 */}
      <div className="text-muted-foreground text-center text-xs text-balance">
        {t("auth.terms.agreeToTerms")} <Link to="/terms" className="hover:text-primary underline underline-offset-4">{t("auth.terms.termsOfService")}</Link>{" "}
        {t("auth.terms.and")} <Link to="/privacy" className="hover:text-primary underline underline-offset-4">{t("auth.terms.privacyPolicy")}</Link>.
      </div>
    </div>
  );
}; 