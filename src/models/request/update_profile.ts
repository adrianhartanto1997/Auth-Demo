import { z } from 'zod'

interface UpdateProfileRequest {
  name: string
}

const UpdateProfileRequestSchema = z.object({
  name: z.string().min(2),
})

export type { UpdateProfileRequest }
export { UpdateProfileRequestSchema }
