import { useState, useEffect } from 'react'
import NetInfo, { NetInfoState } from '@react-native-community/netinfo'

const useNetInfo = () => {
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      if (state.isConnected && state.isInternetReachable) {
        if (state.type === 'wifi' && state.details) {
          const wifiDetails = state.details as any

          // Consideramos la conexión buena si la intensidad de señal (strength) es alta.
          const isGood =
            wifiDetails.strength !== null && wifiDetails.strength > 20

          setConnectionStatus(isGood)
        } else if (state.type === 'cellular' && state.details) {
          // Para conexión celular, se podría usar la generación de red (4G, 5G) como criterio.
          const cellularGeneration = state.details.cellularGeneration
          const isGood =
            cellularGeneration === '4g' || cellularGeneration === '5g'

          setConnectionStatus(isGood)
        } else {
          setConnectionStatus(false)
        }
      } else {
        setConnectionStatus(false)
      }
    })

    // Cleanup function
    return () => unsubscribe()
  }, [])

  return connectionStatus
}

export default useNetInfo
