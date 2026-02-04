import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { MMKV } from 'react-native-mmkv'
import { getSecureStorage, KEYS_MMKV } from '../../db/mmkv'
import { getDataFromJWT } from '../../utils/jwt'

type StorageValueType = string | number | boolean | null

interface SecureStorageContextType {
  storageMMKV: MMKV | null
  errorMMKV: Error | null
  getItem: (key: string) => StorageValueType
  getDataJWT: () => any
  setItem: (key: string, value: StorageValueType) => void
  removeItem: (key: string) => void
  clearMMKV: () => void
}

const SecureStorageContext = createContext<SecureStorageContextType | null>(
  null
)

interface SecureStorageProps {
  children: ReactNode
}

export const SecureStorageProvider = ({ children }: SecureStorageProps) => {
  const [storage, setStorage] = useState<MMKV | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        const secureStorage = await getSecureStorage()
        setStorage(secureStorage)
      } catch (err) {
        setError(err as Error)
      }
    }

    initializeStorage()
  }, [])

  const getItem = (key: string): StorageValueType => {
    if (!storage) {
      throw new Error('Storage is not initialized')
    }
    return (storage.getString(key) as StorageValueType) ?? null
  }

  const getDataJWT = (): any => {
    const token = getItem(KEYS_MMKV.ACCESS_TOKEN) as string
    return getDataFromJWT(token) || {}
  }

  const setItem = (key: string, value: StorageValueType): void => {
    if (!storage) {
      throw new Error('Storage is not initialized')
    }
    if (value) {
      storage.set(key, value)
    } else {
      storage.delete(key)
    }
  }

  const removeItem = (key: string): void => {
    if (!storage) {
      throw new Error('Storage is not initialized')
    }
    storage.delete(key)
  }

  const clear = (): void => {
    if (!storage) {
      throw new Error('Storage is not initialized')
    }
    storage.clearAll()
  }

  return (
    <SecureStorageContext.Provider
      value={{
        storageMMKV: storage,
        errorMMKV: error,
        getItem,
        getDataJWT,
        setItem,
        removeItem,
        clearMMKV: clear
      }}>
      {children}
    </SecureStorageContext.Provider>
  )
}

export const useSecureStorage = (): SecureStorageContextType => {
  const context = useContext(SecureStorageContext)
  if (!context) {
    throw new Error(
      'useSecureStorage must be used within a SecureStorageProvider'
    )
  }
  return context
}
