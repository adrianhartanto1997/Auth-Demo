import { UpdateProfileRequest } from '@/models/request/update_profile'
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
 *  /api/auth/profile:
 *    get:
 *      tags:
 *        - Auth
 *      description: Get user profile
 *      responses:
 *        '200':
 *          description: Return the user profile object
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserProfile'
 *        '401':
 *          description: Invalid access token
 */
export async function GET(request: NextRequest) {
  try {
    const [userID, resp] = await verifyProtectedAPIRoute(request)
    if (resp) {
      return resp
    }

    const [profile, err] = await authService.getProfile(userID!)
    if (err) {
      return renderAPIErrorResponse(err)
    }

    return renderAPISuccessResponse(profile)
  } catch (e: any) {
    return ApiExceptionHandler(e)
  }
}

/**
 * @swagger
 *  /api/auth/profile:
 *    put:
 *      tags:
 *        - Auth
 *      description: Update user profile
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  description: Name
 *                  type: string
 *                  example: Name
 *      responses:
 *        '200':
 *          description: Profile updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserProfile'
 *        '400':
 *          description: "Bad request (e.g: invalid format)"
 *        '401':
 *          description: Invalid access token
 */
export async function PUT(request: NextRequest) {
  try {
    const [userID, resp] = await verifyProtectedAPIRoute(request)
    if (resp) {
      return resp
    }

    const reqBody = (await request.json()) as UpdateProfileRequest
    const [profile, err] = await authService.updateProfile(userID!, reqBody)
    if (err) {
      return renderAPIErrorResponse(err)
    }

    return renderAPISuccessResponse(profile)
  } catch (e: any) {
    return ApiExceptionHandler(e)
  }
}
