import React from 'react'
import { LoginScreen } from '../screens/public/login/LoginScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS } from '../contexts/theme/neutralTheme'
import { ResetPassScreen } from '../screens/public/reset-pass/ResetPassScreen'
import { ChangeResetPassScreen } from '../screens/public/reset-pass/ChangeResetPassScreen'

const Stack = createNativeStackNavigator()

const PublicStack = () => {
  const insets = useSafeAreaInsets()
  const screenOptions = {
    headerShown: false,
    contentStyle: {
      backgroundColor: COLORS.background,
      paddingTop: insets.top
    }
  }
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={LoginScreen} />
      <Stack.Screen name="ResetPass" component={ResetPassScreen} />
      <Stack.Screen name="ChangePass" component={ChangeResetPassScreen} />
    </Stack.Navigator>
  )
}

export default PublicStack
