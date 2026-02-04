import Config from 'react-native-config'

const API_IDENTI = Config?.API_IDENTI || ''
const API_IDENTI_COLLECTOR = `${API_IDENTI}/identi-collector-backend`

export const API_CONFIG = {
  Auth: {
    login: `${API_IDENTI_COLLECTOR}/entities/login`,
    refresh: `${API_IDENTI_COLLECTOR}/entities/refresh`,
    changePassword: `${API_IDENTI_COLLECTOR}/entities/change_password`,
    resetPass: `${API_IDENTI_COLLECTOR}/entities/reset_password`,
    resetPassword: `${API_IDENTI_COLLECTOR}/entities/reset_change_password`
  },
  user: {
    me: `${API_IDENTI_COLLECTOR}/entities/me`
  },
  file: {
    getImage: `${API_IDENTI_COLLECTOR}/medias/url-presigned-get`
  }
}
