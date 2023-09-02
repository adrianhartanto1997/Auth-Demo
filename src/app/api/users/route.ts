import { ChangePasswordRequest } from '@/models/request/change_password'
import {
  renderAPISuccessResponse,
  renderAPIErrorResponse,
  ApiExceptionHandler,
} from '@/lib/response'
import { verifyProtectedAPIRoute } from '@/lib/token'
import { adminService } from '@/services'
import { NextRequest } from 'next/server'

/**
 * @swagger
 *  /api/users:
 *    get:
 *      tags:
 *        - Dashboard
 *      description: Get Users View (for Dashboard)
 *      responses:
 *        200:
 *          description: user list
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    description: User ID
 *                    type: integer
 *                  email:
 *                    description: Email address
 *                    type: string
 *                    example: example@email.com
 *                  name:
 *                    description: User name
 *                    type: string
 *                  hasVerifiedEmail:
 *                    type: boolean
 *                  signUpDate:
 *                    type: string
 *                    format: date-time
 *                  numLogin:
 *                    type: integer
 *                  lastSession:
 *                    type: string
 *                    format: date-time
 *        401:
 *          description: Invalid access token
 *        403:
 *          description: Permission denied
 */
export async function GET(request: NextRequest) {
  try {
    const [userID, resp] = await verifyProtectedAPIRoute(request)
    if (resp) {
      return resp
    }

    const [data, err] = await adminService.getUsersView(userID!)
    if (err) {
      return renderAPIErrorResponse(err)
    }

    return renderAPISuccessResponse(data)
  } catch (e: any) {
    return ApiExceptionHandler(e)
  }
}
