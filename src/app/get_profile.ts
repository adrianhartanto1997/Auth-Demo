import { authService } from '@/services'
import { cache } from 'react'

export const getProfile = cache(async (userID: number) => {
  const data = await authService.getProfile(userID)
  return data
})
