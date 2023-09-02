import {
  renderAPISuccessResponse,
  renderAPIErrorResponse,
  ApiExceptionHandler,
} from '@/lib/response'
import { authService } from '@/services'
import { NextRequest } from 'next/server'
import { ForgetPasswordRequest } from '@/models/request/reset_password'

/**
 * @swagger
 *  /api/auth/forget-password/send-request:
 *    post:
 *      tags:
 *        - Auth
 *      description: Send Reset Password Request
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  description: Email address
 *                  type: string
 *                  example: example@email.com
 *      responses:
 *        '200':
 *          description: Request created
 *          content:
 *            application/json:
 *              schema:
 *                type: 'boolean'
 *        '400':
 *          description: "Bad request (e.g: invalid format)"
 *        '404':
 *          description: User not found
 */
export async function POST(request: NextRequest) {
  try {
    const reqBody = (await request.json()) as ForgetPasswordRequest
    const err = await authService.requestForgetPassword(reqBody)
    if (err) {
      return renderAPIErrorResponse(err)
    }

    return renderAPISuccessResponse(true)
  } catch (e: any) {
    return ApiExceptionHandler(e)
  }
}
