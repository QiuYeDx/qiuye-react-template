import React from "react";
import { useNavigate } from "react-router-dom";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useUserStore } from "@/store/useUserStore";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();

  // 如果已登录，重定向到首页
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegisterSuccess = () => {
    // 注册成功后的处理，useAuth hook已经处理了重定向
    console.log("Registration successful");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </div>
    </div>
  );
};

export default RegisterPage; 