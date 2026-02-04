import React, { createContext, useState, ReactNode, useContext } from 'react'
import i18n from './i18n'

interface ConfigI18n {
  locale: string
  updateLocale: (newLocale: string) => void
}

export const ConfigI18nContext = createContext<ConfigI18n | undefined>(
  undefined
)

export const ConfigI18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState('ES')

  const updateLocale = (newLocale: string) => {
    setLocale(newLocale)
    i18n.setLocale(newLocale)
  }

  return (
    <ConfigI18nContext.Provider value={{ locale, updateLocale }}>
      {children}
    </ConfigI18nContext.Provider>
  )
}

export const useConfigI18n = () => {
  const context = useContext(ConfigI18nContext)
  if (!context) {
    throw new Error('useAppConfig must be used within an ConfigI18nProvider')
  }
  return context
}
