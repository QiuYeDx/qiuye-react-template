import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Spin } from 'antd'
import Layout from '@/components/Layout'

// 懒加载页面组件
const HomePage = lazy(() => import('@/pages/Home'))
const AboutPage = lazy(() => import('@/pages/About'))
const NotFoundPage = lazy(() => import('@/pages/NotFound'))

// 加载组件
const LoadingComponent = () => (
  <div className="flex justify-center items-center h-64">
    <Spin size="large" />
  </div>
)

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes 