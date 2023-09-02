import {
  renderAPISuccessResponse,
  renderAPIErrorResponse,
  ApiExceptionHandler,
} from '@/lib/response'
import { verifyProtectedAPIRoute } from '@/lib/token'
import { authService } from '@/services'
import { NextRequest } from 'next/server'

/**
 * @swagger
 *  /api/auth/email/send-verification:
 *    post:
 *      tags:
 *        - Auth
 *      description: Send Email Verification
 *      responses:
 *        '200':
 *          description: Email sent
 *          content:
 *            application/json:
 *              schema:
 *                type: 'boolean'
 *        '401':
 *          description: Invalid access token
 *        '403':
 *          description: Email already verified
 */
export async function POST(request: NextRequest) {
  try {
    const [userID, resp] = await verifyProtectedAPIRoute(request)
    if (resp) {
      return resp
    }

    const err = await authService.requestEmailVerification(userID!)
    if (err) {
      return renderAPIErrorResponse(err)
    }

    return renderAPISuccessResponse(true)
  } catch (e: any) {
    return ApiExceptionHandler(e)
  }
}
