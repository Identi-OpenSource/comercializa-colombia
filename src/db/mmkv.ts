import { MMKV } from 'react-native-mmkv'
import * as Keychain from 'react-native-keychain'
import { Platform } from 'react-native'
import Config from 'react-native-config'

export const KEYS_MMKV = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  POST_GATHER_STACK: 'postGatherStack'
}

const ENCRYPTION_KEY_ID = Config?.ENCRYPTION_KEY_ID || ''
async function getEncryptionKey(): Promise<string> {
  try {
    if (Platform.OS === 'ios') {
      const result = await Keychain.getGenericPassword({
        service: ENCRYPTION_KEY_ID
      })
      if (result) {
        return result.password
      }
    } else {
      const result = await Keychain.getInternetCredentials(ENCRYPTION_KEY_ID)
      if (result) {
        return result.password
      }
    }

    // Si no existe una clave, generamos una nueva
    const newKey =
      Math.random().toString(36).slice(2, 10) +
      Math.random().toString(36).slice(2, 10)

    if (Platform.OS === 'ios') {
      await Keychain.setGenericPassword(ENCRYPTION_KEY_ID, newKey, {
        service: ENCRYPTION_KEY_ID
      })
    } else {
      await Keychain.setInternetCredentials(
        ENCRYPTION_KEY_ID,
        ENCRYPTION_KEY_ID,
        newKey
      )
    }
    return newKey
  } catch (error) {
    console.error('Error al obtener/generar la clave de encriptación:', error)
    throw error
  }
}

let storage: MMKV | null = null

export async function getSecureStorage(): Promise<MMKV> {
  if (!storage) {
    const encryptionKey = await getEncryptionKey()
    storage = new MMKV({
      id: Config?.MMKV_ID || 'mi-app-storage',
      encryptionKey
    })
  }

  console.log('Instance storage created')
  return storage
}
