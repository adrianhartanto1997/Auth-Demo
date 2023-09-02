import { z } from 'zod'

interface SignInRequest {
  email: string
  password: string
}

const SignInRequestSchema = z.object({
  email: z.string().nonempty({message: 'Required'}).email(),
  password: z.string().nonempty({message: 'Required'}),
})

export type { SignInRequest }
export { SignInRequestSchema }
