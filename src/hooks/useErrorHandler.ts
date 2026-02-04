import { useCallback, useContext } from 'react'
import { AxiosError } from 'axios'
import { DialogContext } from '../contexts/alerts/DialogContext'
import i18n from '../contexts/i18n/i18n'

export type typeMessage = 'error' | 'success' | 'warning' | 'info' | 'default'

// Hook personalizado para manejar errores y mostrar diálogos
const useMessageHandler = () => {
  const { showDialog } = useContext(DialogContext)!
  // Función para manejar los errores
  const handleErrorMessage = useCallback((error: AxiosError) => {
    let title = 'Error'
    let message = 'Ocurrió un error inesperado'
    let onClose = () => {
      console.log('Diálogo cerrado')
    }

    if (error.response) {
      const status = error.response.status

      // Lógica basada en el código de estado HTTP
      switch (status) {
        case 400:
        case 422:
          title = 'Solicitud Incorrecta'
          message = 'Verifica los datos ingresados y vuelve a intentarlo.'
          break
        case 417:
        case 401:
          title = 'Autenticación fallida'
          message = 'Verifica tus credenciales y vuelve a intentarlo.'
          onClose = () => {
            console.log('Redirigiendo al inicio de sesión...')
          }
          break
        case 404:
          title = 'Recurso no encontrado'
          message = 'El recurso que buscas no existe.'
          break
        case 500:
          title = 'Error del servidor'
          message = 'Ocurrió un error en el servidor. Inténtalo más tarde.'
          break
        default:
          title = 'Error desconocido'
          message = `Ocurrió un error con el código: ${status}`
      }
    } else if (error.request) {
      // No se recibió respuesta del servidor
      title = 'Error de conexión'
      message =
        'No se pudo conectar con el servidor. Revisa tu conexión a internet.'
    } else {
      // Error durante la configuración de la solicitud
      title = 'Error en la solicitud'
      message = error.message
    }

    // Mostrar el diálogo con los datos de error
    showDialog({
      type: 'error',
      title,
      message,
      onClose
    })
  }, [])

  const handleMessage = (
    title: typeMessage,
    message: string,
    type?: string
  ) => {
    showDialog({
      type,
      title: i18n.t(title),
      message: i18n.t(message),
      onClose: () => {
        console.log('Diálogo cerrado')
      }
    })
  }

  return { handleErrorMessage, handleMessage }
}

export default useMessageHandler
