import {
  renderAPISuccessResponse,
  ApiExceptionHandler,
} from '@/lib/response'
import { authService } from '@/services'
import { NextRequest } from 'next/server'
import { validateSessionToken } from '@/lib/token'
import { typeSession } from '@/models/entities'

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionToken: string } }
) {
  try {
    const userID = await validateSessionToken(params.sessionToken)
    if (userID) {
      authService.insertLog(typeSession, userID)
    }

    return renderAPISuccessResponse(true)
  } catch (e: any) {
    return ApiExceptionHandler(e)
  }
}
