import React, { useMemo } from 'react'
import { ConfigProvider } from 'antd'
let localeMap

if (window.antd?.locale) {
  localeMap = window.antd.locale
}

const LocaleProvider = ({
  locale = 'zh-cn',
  children,
}: {
  locale?: keyof typeof localeMap
  children: React.ReactNode
}) => {
  if (window.moment) {
    window.moment.locale(locale as string)
  }
  const antdLocaleKey = useMemo(() => {
    const localeArr = locale.split('-')
    const lang = localeArr.pop()?.toUpperCase()
    return localeArr.concat(['_', lang as string]).join('')
  }, [locale])

  return (
    <>
      {localeMap ? (
        <ConfigProvider locale={localeMap?.[antdLocaleKey]?.default}>
          {children}
        </ConfigProvider>
      ) : (
        children
      )}
    </>
  )
}

export default LocaleProvider
