import { useState, useEffect } from 'react'
import { API_CONFIG } from '../config/apis'
import { AuthResponse } from '../db/models/Auth'
import useCustomHttpRequest from './useCustomHttpRequest'
import RNFS from 'react-native-fs'

// Custom hook to fetch the image and save it locally
export const useFetchImage = (imageKey: string | undefined | null) => {
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { get } = useCustomHttpRequest()

  useEffect(() => {
    if (imageKey) {
      checkAndFetchImage()
    }
  }, [imageKey])

  const checkAndFetchImage = async () => {
    try {
      // Create the directory if it doesn't exist
      const pathDirectory = `${RNFS.DocumentDirectoryPath}/data_collector`
      const directoryExists = await RNFS.exists(pathDirectory)
      if (!directoryExists) {
        await RNFS.mkdir(pathDirectory)
      }
      // Create the local path where the image should be saved
      const localImagePath = `${RNFS.DocumentDirectoryPath}/${imageKey}.png`

      // Check if the image already exists locally
      const fileExists = await RNFS.exists(localImagePath)
      if (fileExists) {
        // If exists, use the local path
        setImagePath(`file://${localImagePath}`)
      } else {
        // If not exists, fetch it from the server
        await fetchAndSaveImage(localImagePath)
      }
    } catch (error) {
      console.error('Error processing the image:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAndSaveImage = async (localImagePath: string) => {
    try {
      // Get the URL to download the image
      const urlGetImage = `${API_CONFIG.file.getImage}?key=${imageKey}&is_download=true`
      const response = await get<AuthResponse>(urlGetImage)
      const imageUrl = response?.data?.url_presigned

      if (imageUrl) {
        // Download the image and save it locally
        await RNFS.downloadFile({
          fromUrl: imageUrl,
          toFile: localImagePath
        }).promise

        // Set the local image path
        setImagePath(`file://${localImagePath}`)
      }
    } catch (error) {
      console.error('Error downloading or saving the image:', error)
    }
  }

  return { imagePath, loading }
}
