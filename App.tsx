import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { ProvidersAllApp } from './src/contexts/main/Providers'
import { AppProvider, UserProvider } from '@realm/react'
import PublicStack from './src/router/public'
import Config from 'react-native-config'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { RealmAuth } from './src/db/RealmAuth'
import PrivateStack from './src/router/private'

const App = () => {
  // Configuración para realm de mongo Atlas
  return (
    <SafeAreaProvider>
      <AppProvider id={Config.ATLAS_APP || ''}>
        <ProvidersAllApp>
          <NavigationContainer>
            <UserProvider fallback={<PublicStack />}>
              <RealmAuth>
                <PrivateStack />
              </RealmAuth>
            </UserProvider>
          </NavigationContainer>
        </ProvidersAllApp>
      </AppProvider>
    </SafeAreaProvider>
  )
}

export default App
