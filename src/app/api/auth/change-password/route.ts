import { ChangePasswordRequest } from '@/models/request/change_password'
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
 *  /api/auth/change-password:
 *    post:
 *      tags:
 *        - Auth
 *      description: Change Password
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                currentPassword:
 *                  description: Current (old) password
 *                  type: string
 *                  example: oldpassword
 *                newPassword:
 *                  description: New password
 *                  type: string
 *                  example: newpassword
 *      responses:
 *        '200':
 *          description: Password changed successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: 'boolean'
 *        '400':
 *          description: "Bad request (e.g: invalid format)"
 *        '401':
 *          description: Invalid access token / current password is wrong
 */
export async function POST(request: NextRequest) {
  try {
    const [userID, resp] = await verifyProtectedAPIRoute(request)
    if (resp) {
      return resp
    }

    const reqBody = (await request.json()) as ChangePasswordRequest
    const err = await authService.changePassword(userID!, reqBody)
    if (err) {
      return renderAPIErrorResponse(err)
    }

    return renderAPISuccessResponse(true)
  } catch (e: any) {
    return ApiExceptionHandler(e)
  }
}
