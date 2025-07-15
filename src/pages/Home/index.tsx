import React from 'react'
import { Card, Row, Col, Button, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSpring, animated } from '@react-spring/web'
import { 
  RocketLaunchIcon, 
  CogIcon, 
  HeartIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline'

const { Title, Paragraph } = Typography

const Home: React.FC = () => {
  const { t } = useTranslation()

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { duration: 500 }
  })

  const features = [
    {
      icon: <RocketLaunchIcon className="w-8 h-8 text-blue-500" />,
      title: '快速开发',
      description: '基于 Vite 的极速构建体验'
    },
    {
      icon: <CogIcon className="w-8 h-8 text-green-500" />,
      title: '完整配置',
      description: '包含 TypeScript、ESLint、Tailwind CSS'
    },
    {
      icon: <HeartIcon className="w-8 h-8 text-red-500" />,
      title: '开箱即用',
      description: '集成常用库和最佳实践'
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8 text-yellow-500" />,
      title: '类型安全',
      description: '完整的 TypeScript 类型定义'
    }
  ]

  return (
    <animated.div style={fadeIn}>
      <div className="text-center mb-12">
        <Title level={1} className="mb-4">
          {t('pages.home.title')}
        </Title>
        <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('pages.home.description')}
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} className="mb-8">
        {features.map((feature, index) => (
          <Col key={index} xs={24} sm={12} lg={6}>
            <Card
              className="h-full hover:shadow-lg transition-shadow"
              bodyStyle={{ textAlign: 'center' }}
            >
              <div className="mb-4">{feature.icon}</div>
              <Title level={4} className="mb-2">
                {feature.title}
              </Title>
              <Paragraph type="secondary">
                {feature.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center">
        <Button type="primary" size="large" className="mr-4">
          开始使用
        </Button>
        <Button size="large">
          查看文档
        </Button>
      </div>
    </animated.div>
  )
}

export default Home 