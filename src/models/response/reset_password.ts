import { ProfileResponse } from './profile'

interface GetResetPasswordResponse {
  id: number
  type: string
  userID: number
  user: ProfileResponse
  token: string
  createdAt: Date
  expiredAt: Date
}

export type { GetResetPasswordResponse }
