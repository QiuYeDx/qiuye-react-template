import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import AppRoutes from './routes'
import { useThemeStore } from './store/useThemeStore'

function App() {
  const { i18n } = useTranslation()
  const { theme } = useThemeStore()

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: theme.primaryColor,
        },
      }}
    >
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App 