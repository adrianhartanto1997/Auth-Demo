import { ErrorResponse } from '@/lib/response'
import { z } from 'zod'

export const validateRequestSchema = (
  schema: z.ZodObject<any>,
  request: any
): ErrorResponse | null => {
  const result = schema.safeParse(request)
  if (!result.success) {
    const errors = result.error.format() || []
    const errorsFormatted: any = {}

    for (const key in errors) {
      if (['_errors'].includes(key)) {
        continue
      }

      if (errors[key]?._errors.length) {
        errorsFormatted[key] = errors[key]?._errors[0]
      }
    }

    const errorResp = {
      statusCode: 400,
      payload: errorsFormatted,
    }

    return errorResp
  }

  return null
}
