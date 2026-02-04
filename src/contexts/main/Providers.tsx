import React from 'react'
import { DialogProvider } from '../alerts/DialogContext'
import { AuthProvider } from '../auth/AuthContext'
import { ConfigI18nProvider } from '../i18n/Configi18nContext'
import { ThemeProvider } from '../theme/ThemeContext'
import { SecureStorageProvider } from '../secure/SecureStorageContext'

export const ProvidersAllApp = ({
  children
}: {
  children: React.ReactNode
}) => {
  // Providers propios de la app que no dependen de la DB
  return (
    <SecureStorageProvider>
      <ConfigI18nProvider>
        <ThemeProvider>
          <DialogProvider>
            <AuthProvider>{children}</AuthProvider>
          </DialogProvider>
        </ThemeProvider>
      </ConfigI18nProvider>
    </SecureStorageProvider>
  )
}
