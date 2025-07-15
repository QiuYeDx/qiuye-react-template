import React from 'react'
import { Card, Typography, Tag, Space } from 'antd'
import { useTranslation } from 'react-i18next'

const { Title, Paragraph } = Typography

const About: React.FC = () => {
  const { t } = useTranslation()

  const techStack = [
    'React 18',
    'TypeScript',
    'Vite',
    'Tailwind CSS',
    'Ant Design',
    'Zustand',
    'React Router',
    'React i18next',
    'Axios',
    'Heroicons',
    'React Spring',
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <Title level={1} className="text-center mb-8">
        {t('pages.about.title')}
      </Title>

      <Card className="mb-6">
        <Title level={3}>项目介绍</Title>
        <Paragraph className="text-gray-600">
          {t('pages.about.description')}
        </Paragraph>
        <Paragraph className="text-gray-600">
          这个模板包含了现代化前端开发的最佳实践，包括代码规范、类型安全、国际化支持、状态管理等功能。
          旨在帮助开发者快速启动新项目，提高开发效率。
        </Paragraph>
      </Card>

      <Card className="mb-6">
        <Title level={3}>技术栈</Title>
        <Space size={[0, 8]} wrap>
          {techStack.map((tech) => (
            <Tag key={tech} color="blue" className="mb-2">
              {tech}
            </Tag>
          ))}
        </Space>
      </Card>

      <Card>
        <Title level={3}>特性</Title>
        <ul className="text-gray-600 space-y-2">
          <li>• 🚀 基于 Vite 的极速构建体验</li>
          <li>• 📦 开箱即用的开发环境</li>
          <li>• 🎨 现代化的 UI 组件库</li>
          <li>• 🌍 完整的国际化解决方案</li>
          <li>• 🔒 完整的 TypeScript 类型定义</li>
          <li>• 📱 响应式设计支持</li>
          <li>• 🎯 ESLint + Prettier 代码规范</li>
          <li>• 💾 轻量级状态管理</li>
        </ul>
      </Card>
    </div>
  )
}

export default About 