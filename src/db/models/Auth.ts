export type Auth = {
  access_token: string
  refresh_token: string
  expires: number
  token_type: string
}

export type AuthResponse = {
  data: any
  message: string
  status_code: number
}
