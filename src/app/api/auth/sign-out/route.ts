import {
  renderAPISuccessResponse,
  renderAPIErrorResponse,
  ApiExceptionHandler,
} from '@/lib/response'
import {
  accessTokenCookieKey,
  sessionTokenCookieKey,
  verifyProtectedAPIRoute
} from '@/lib/token'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

/**
 * @swagger
 *  /api/auth/sign-out:
 *    post:
 *      tags:
 *        - Auth
 *      description: Sign Out
 *      responses:
 *        '200':
 *          description: accessToken cookie removed
 *          content:
 *            application/json:
 *              schema:
 *                type: 'boolean'
 */
export async function POST(request: NextRequest) {
  try {
    const [_userID, resp] = await verifyProtectedAPIRoute(request)
    if (resp) {
      return resp
    }

    cookies().set(accessTokenCookieKey, '', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 0,
    })
    cookies().set(sessionTokenCookieKey, '', {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 0
    })

    return renderAPISuccessResponse(true)
  } catch (e: any) {
    return ApiExceptionHandler(e)
  }
}
