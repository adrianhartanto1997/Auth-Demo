import {
  renderAPISuccessResponse,
  renderAPIErrorResponse,
  ApiExceptionHandler,
} from '@/lib/response'
import { authService } from '@/services'
import { NextRequest } from 'next/server'

/**
 * @swagger
 *  /api/auth/email/verify/{userID}/{token}:
 *    post:
 *      tags:
 *        - Auth
 *      description: Verify email address
 *      parameters:
 *        - in: path
 *          name: userID
 *          required: true
 *          schema:
 *            type: integer
 *          description: The user ID
 *        - in: path
 *          name: token
 *          required: true
 *          schema:
 *            type: string
 *          description: The verification token
 *      responses:
 *        '200':
 *          description: Email verified successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: 'boolean'
 *        '404':
 *          description: Token not found
 *        '410':
 *          description: Token is expired
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { userID: string; token: string } }
) {
  try {
    const err = await authService.verifyEmail(params.userID, params.token)
    if (err) {
      return renderAPIErrorResponse(err)
    }

    return renderAPISuccessResponse(true)
  } catch (e: any) {
    return ApiExceptionHandler(e)
  }
}
