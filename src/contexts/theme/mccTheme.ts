import { TextStyle, ViewStyle } from 'react-native'
import { ThemePros } from './defaultTheme'

export const SPACING = {
  tiny: 2,
  xSmall: 5,
  small: 10,
  medium: 15,
  large: 20,
  xLarge: 25,
  xxLarge: 30,
  xxxLarge: 40,
  hitSlop: { top: 60, bottom: 60, left: 10, right: 10 },
  hitSlopCorto: { top: 20, bottom: 20, left: 10, right: 10 }
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

export const BTN_STYLES = {
  primary: {
    buttonContainer: {
      width: '100%',
      marginTop: SPACING.xLarge,
      paddingHorizontal: SPACING.small
    } as ViewStyle,
    buttonTitle: {
      fontWeight: '700',
      fontFamily: FONTS.bold
    } as TextStyle,
    buttonStyle: {
      backgroundColor: COLORS.primary,
      borderRadius: 5,
      paddingVertical: 10,
      height: 60
    } as ViewStyle
  }
}

export const DIALOG_STYLES = {
  actionStyle: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: SPACING.xLarge
  } as ViewStyle,
  buttonStylePrimary: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    paddingVertical: 10
  } as ViewStyle,
  dialog: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    width: '85%',
    borderWidth: 1,
    borderColor: COLORS.primary
  } as ViewStyle,
  dialogError: {
    borderColor: 'red'
  },
  backdropStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  title: {
    textAlign: 'center',
    fontFamily: FONTS.bold,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary
  } as TextStyle,
  message: {
    marginVertical: SPACING.small,
    fontSize: 16,
    fontFamily: FONTS.regular,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.primary
  } as TextStyle
}

export const INPUTS_STYLES = {
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 10
  } as TextStyle,
  error: {
    fontSize: 14,
    fontWeight: 'normal',
    color: 'red'
  } as TextStyle,
  description: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.text
  },
  inp: {
    height: 60,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    opacity: 0.6
  } as TextStyle,
  impContainer: {
    borderColor: COLORS.primary,
    borderBottomWidth: 1
  } as ViewStyle,
  inpOpt: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    opacity: 0.6
  } as TextStyle
}

const mccTheme = {
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

export default mccTheme
