import { z } from 'zod'

interface SignUpRequest {
  email: string
  name: string
  password: string
}

const SignUpRequestSchema = z.object({
  email: z.string().nonempty({message: 'Required'}).email(),
  name: z.string().nonempty({message: 'Required'}),
  password: z
    .string()
    .min(8, { message: 'Should contain at least 8 characters' })
    .refine((val) => /[a-z]/.test(val), {
      message: 'Should contain at least one lower character',
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: 'Should contain at least one upper character',
    })
    .refine((val) => /\d/.test(val), {
      message: 'Should contain at least one digit character',
    })
    .refine((val) => /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(val), {
      message: 'Should contain at least one special character',
    }),
})

export type { SignUpRequest }
export { SignUpRequestSchema }
