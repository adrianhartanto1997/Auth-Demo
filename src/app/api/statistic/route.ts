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
 *  /api/statistic:
 *    get:
 *      tags:
 *        - Dashboard
 *      description: Get statistic information (for Dashboard)
 *      responses:
 *        200:
 *          description: statistic information
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  usersCount:
 *                    description: Total number of users who have signed up
 *                    type: integer
 *                  todayActiveSessionCount:
 *                    description: Total number of users with active sessions today
 *                    type: integer
 *                  last7DaysActiveSessionAvg:
 *                    description: Average number of active session users in the last 7 days rolling
 *                    type: number
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

    const [data, err] = await adminService.getStatistic(userID!)
    if (err) {
      return renderAPIErrorResponse(err)
    }

    return renderAPISuccessResponse(data)
  } catch (e: any) {
    return ApiExceptionHandler(e)
  }
}
