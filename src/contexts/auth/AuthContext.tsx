import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect
} from 'react'
import { KEYS_MMKV } from '../../db/mmkv'
import { getDataFromJWT } from '../../utils/jwt'
import { useAuth } from '@realm/react'
import { useSecureStorage } from '../secure/SecureStorageContext'
interface AuthContextType {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { getItem, storageMMKV /* clearMMKV */ } = useSecureStorage()
  const { logInWithJWT /* logOut */ } = useAuth()

  useEffect(() => {
    if (storageMMKV !== null) {
      const token = getItem(KEYS_MMKV.ACCESS_TOKEN) as string
      // const tokenRefresh = getItem(KEYS_MMKV.REFRESH_TOKEN) as string
      const decoded = token && getDataFromJWT(token)
      // const decodedRefresh = tokenRefresh && getDataFromJWT(tokenRefresh)
      if (decoded?.isDateValid /* || decodedRefresh?.isDateValid */) {
        login(token)
      } else {
        // logout() // Para que no se cierre la sesión
      }
    }
  }, [storageMMKV])

  const login = async (token: string) => {
    try {
      setIsAuthenticated(true)
      // login realm y atlas, esto cambia si se usa otra base de datos
      await logInWithJWT(token)
    } catch (error) {
      console.error('Error al inicializar realm:', error)
    }
  }

  const logout = () => {
    // clearMMKV()
    // setIsAuthenticated(false)
    // logout realm y atlas, esto cambia si se usa otra base de datos
    // logOut()
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthLocal = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
