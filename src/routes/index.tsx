import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/Layout";
import { LoadingComponent } from "@/components/Loading";

// 懒加载页面组件
const HomePage = lazy(() => import("@/pages/Home"));
const AboutPage = lazy(() => import("@/pages/About"));
const LoadingDebugPage = lazy(() => import("@/pages/LoadingDebug"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="loading-debug" element={<LoadingDebugPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
