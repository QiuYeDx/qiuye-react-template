import React from 'react'
import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFound: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleBackHome = () => {
    navigate('/')
  }

  return (
    <Result
      status="404"
      title={t('pages.notFound.title')}
      subTitle={t('pages.notFound.description')}
      extra={
        <Button type="primary" onClick={handleBackHome}>
          {t('pages.notFound.backHome')}
        </Button>
      }
    />
  )
}

export default NotFound 