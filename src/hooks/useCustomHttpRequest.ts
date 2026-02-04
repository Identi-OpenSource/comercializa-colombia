import { useEffect } from 'react'
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { useNavigation } from '@react-navigation/native'
import { KEYS_MMKV } from '../db/mmkv'
import { useSecureStorage } from '../contexts/secure/SecureStorageContext'

// Manejador de errores de Axios
const handleAxiosError = (error: AxiosError) => {
  const { response } = error as AxiosError
  if (response) {
    const errorMessage = (response.data as { message?: string })?.message || ''
    if (response.status === 404) {
      console.error('Recurso no encontrado')
    } else {
      console.error(`Error ${response.status}: ${errorMessage}`)
    }
  } else if (error.request) {
    console.error('No se recibió respuesta del servidor')
  } else {
    console.error('Error al configurar la petición:', error.message)
  }
}

// Manejador de respuestas de Axios
const handleResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data
}

// Función general para las solicitudes HTTP
const handleRequest = async <T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios({
      method,
      url,
      data,
      ...config
    })
    return handleResponse(response)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error)
    } else {
      console.error('Error inesperado:', error)
    }
    throw error
  }
}

// Hook personalizado para manejar peticiones HTTP
const useCustomHttpRequest = () => {
  const { getItem, clearMMKV } = useSecureStorage()
  const navigation = useNavigation()

  // Interceptor de solicitud
  const setupRequestInterceptor = () => {
    return axios.interceptors.request.use(
      async config => {
        const token = getItem(KEYS_MMKV.ACCESS_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      error => Promise.reject(error)
    )
  }

  // Interceptor de respuesta
  const setupResponseInterceptor = () => {
    return axios.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const errorRsp = error.response
        const isLogout = errorRsp?.status === 401 || errorRsp?.status === 417
        if (isLogout && getItem(KEYS_MMKV.ACCESS_TOKEN)) {
          // clearMMKV()
          // navigation.navigate('LoginScreen' as never)
        }
        return Promise.reject(error)
      }
    )
  }

  useEffect(() => {
    const requestInterceptor = setupRequestInterceptor()
    const responseInterceptor = setupResponseInterceptor()

    // Limpieza de interceptores cuando el componente se desmonte
    return () => {
      axios.interceptors.request.eject(requestInterceptor)
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [getItem, clearMMKV, navigation])

  // Métodos HTTP reutilizables
  return {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      handleRequest<T>('get', url, undefined, config),
    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      handleRequest<T>('post', url, data, config),
    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      handleRequest<T>('put', url, data, config),
    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      handleRequest<T>('patch', url, data, config),
    delete: <T>(url: string, config?: AxiosRequestConfig) =>
      handleRequest<T>('delete', url, undefined, config)
  }
}

export default useCustomHttpRequest
