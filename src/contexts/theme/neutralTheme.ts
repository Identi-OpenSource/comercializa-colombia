import { ThemePros } from './defaultTheme'

export const SPACING = {
  tiny: 2,
  xSmall: 5,
  small: 10,
  medium: 15,
  large: 20,
  xLarge: 25,
  xxLarge: 30,
  xxxLarge: 40
}

export const COLORS = {
  white: '#ffffff',
  primary: '#09304F',
  background: '#ffffff',
  text: '#333333',
  buttonBackground: '#666666',
  buttonText: '#ffffff',
  inputBackground: '#e0e0e0',
  inputText: '#333333',
  grayOpacity: 'rgba(0, 0, 0, 0.3)'
}

export const FONTS = {
  regular: 'Roboto-Regular',
  bold: 'Roboto-Bold'
}

export const INPUTS_STYLES = {
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 10
  },
  description: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.text
  },
  inp: {
    fontSize: 18,
    fontWeight: 'normal',
    color: COLORS.text
  }
}

const neutralTheme = {
  spacing: SPACING,
  colors: COLORS,
  fonts: FONTS,
  statusBar: {
    backgroundColor: 'transparent',
    hidden: false,
    translucent: true,
    barStyle: 'dark-content',
    overlayColor: 'transparent'
  },
  inputs: {
    styles: INPUTS_STYLES
  }
} as ThemePros

export default neutralTheme
