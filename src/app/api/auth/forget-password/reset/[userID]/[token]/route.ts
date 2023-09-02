import {
  renderAPISuccessResponse,
  renderAPIErrorResponse,
  ApiExceptionHandler,
} from '@/lib/response'
import { authService } from '@/services'
import { NextRequest } from 'next/server'
import { ResetPasswordRequest } from '@/models/request/reset_password'

/**
 * @swagger
 *  /api/auth/forget-password/reset/{userID}/{token}:
 *    get:
 *      tags:
 *        - Auth
 *      description: Get reset password information
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
 *          description: Return token information
 *        '404':
 *          description: Token not found
 *        '410':
 *          description: Token is expired
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userID: string; token: string } }
) {
  try {
    const [result, err] = await authService.getResetPassword(
      params.userID,
      params.token
    )
    if (err) {
      return renderAPIErrorResponse(err)
    }

    return renderAPISuccessResponse(result)
  } catch (e: any) {
    return ApiExceptionHandler(e)
  }
}

/**
 * @swagger
 *  /api/auth/forget-password/reset/{userID}/{token}:
 *    post:
 *      tags:
 *        - Auth
 *      description: Reset new password
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                password:
 *                  description: Password
 *                  type: string
 *                  example: password
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
 *          description: Password changed successfully
 *        '400':
 *          description: "Bad request (e.g: invalid format)"
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
    const reqBody = (await request.json()) as ResetPasswordRequest
    const err = await authService.resetPassword(
      params.userID,
      params.token,
      reqBody
    )
    if (err) {
      return renderAPIErrorResponse(err)
    }

    return renderAPISuccessResponse(true)
  } catch (e: any) {
    return ApiExceptionHandler(e)
  }
}
