import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/Layout";
import { LoadingComponent } from "@/components/Loading";
import ProtectedRoute from "@/components/ProtectedRoute";

// 懒加载页面组件
const HomePage = lazy(() => import("@/pages/Home"));
const AboutPage = lazy(() => import("@/pages/About"));
const LoadingDebugPage = lazy(() => import("@/pages/LoadingDebug"));
const LoginPage = lazy(() => import("@/pages/Login"));
const RegisterPage = lazy(() => import("@/pages/Register"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        {/* 认证相关页面 - 独立布局 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 主要应用页面 - 使用Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="loading-debug" element={<LoadingDebugPage />} />
          
          {/* 受保护的页面 - 需要登录 */}
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
