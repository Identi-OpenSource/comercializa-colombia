import React, { createContext, useState, useContext } from 'react'
import { Appearance, StatusBar } from 'react-native'
import neutralTheme from './neutralTheme'
import defaultTheme from './defaultTheme' // Tema por defecto

const themes = {
  neutral: neutralTheme,
  default: defaultTheme
} as const

type themesList = keyof typeof themes

const ThemeContext = createContext({
  theme: defaultTheme,
  changeTheme: () => {}
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = Appearance.getColorScheme()
  const [theme, setTheme] = useState(themes.default)

  const changeTheme = (themeName?: themesList) => {
    setTheme(themes[themeName || 'default'])
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      <StatusBar
        {...theme.statusBar}
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within an ThemeProvider')
  }
  return context
}
