interface ProfileResponse {
  id: number
  email: string
  name: string
  hasVerifiedEmail: boolean
  createdAt: Date
  updatedAt: Date
}

export type { ProfileResponse }
