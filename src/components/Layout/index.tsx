import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Layout as AntdLayout, Menu, Button, Dropdown } from 'antd'
import { useTranslation } from 'react-i18next'
import { MoonIcon, SunIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { useThemeStore } from '@/store/useThemeStore'

const { Header, Content, Footer } = AntdLayout

const Layout: React.FC = () => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const { theme, setMode } = useThemeStore()

  const menuItems = [
    {
      key: '/',
      label: <Link to="/">{t('nav.home')}</Link>,
    },
    {
      key: '/about',
      label: <Link to="/about">{t('nav.about')}</Link>,
    },
  ]

  const languageItems = [
    {
      key: 'zh-CN',
      label: '中文',
      onClick: () => i18n.changeLanguage('zh-CN'),
    },
    {
      key: 'en-US',
      label: 'English',
      onClick: () => i18n.changeLanguage('en-US'),
    },
  ]

  const toggleTheme = () => {
    setMode(theme.mode === 'light' ? 'dark' : 'light')
  }

  return (
    <AntdLayout className="min-h-screen">
      <Header className="flex items-center justify-between bg-white border-b border-gray-200">
        <div className="flex items-center">
          <div className="text-xl font-bold text-gray-800 mr-8">
            Qiuye Template
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            className="border-none"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Button
            type="text"
            icon={theme.mode === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            onClick={toggleTheme}
          />
          <Dropdown menu={{ items: languageItems }} placement="bottomRight">
            <Button type="text" icon={<GlobeAltIcon className="w-5 h-5" />} />
          </Dropdown>
        </div>
      </Header>
      <Content className="px-6 py-4">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </Content>
      <Footer className="text-center bg-gray-50">
        Qiuye React Template ©2024 Created by Qiuye
      </Footer>
    </AntdLayout>
  )
}

export default Layout 