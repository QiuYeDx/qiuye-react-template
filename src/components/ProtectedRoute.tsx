import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const { isAuthenticated } = useUserStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // 保存当前路径，登录成功后可以重定向回来
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 