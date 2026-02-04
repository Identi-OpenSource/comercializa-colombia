import { useEffect, useState, useCallback } from 'react'
import {
  check,
  request,
  Permission,
  PermissionStatus
} from 'react-native-permissions'

interface UsePermissionsResult {
  statuses: { [key: string]: PermissionStatus }
  checkPermissions: () => void
  requestPermissions: () => void
}

const usePermissions = (permissions: Permission[]): UsePermissionsResult => {
  const [statuses, setStatuses] = useState<{ [key: string]: PermissionStatus }>(
    {}
  )

  const checkPermissions = useCallback(async () => {
    const statusResults: { [key: string]: PermissionStatus } = {}
    for (const permission of permissions) {
      const result = await check(permission)
      statusResults[permission] = result
    }
    setStatuses(statusResults)
  }, [permissions])

  const requestPermissions = useCallback(async () => {
    const statusResults: { [key: string]: PermissionStatus } = {}
    for (const permission of permissions) {
      const result = await request(permission)
      statusResults[permission] = result
    }
    setStatuses(statusResults)
  }, [permissions])

  useEffect(() => {
    checkPermissions()
  }, [checkPermissions])

  return {
    statuses,
    checkPermissions,
    requestPermissions
  }
}

export default usePermissions
