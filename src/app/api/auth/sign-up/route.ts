import {
  renderAPISuccessResponse,
  renderAPIErrorResponse,
  ApiExceptionHandler,
} from '@/lib/response'
import { authService } from '@/services'
import { NextRequest } from 'next/server'
import { SignUpRequest } from '@/models/request/sign_up'

/**
 * @swagger
 *  /api/auth/sign-up:
 *    post:
 *      tags:
 *        - Auth
 *      description: Sign Up
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
 *                name:
 *                  description: Name
 *                  type: string
 *                  example: Name
 *                password:
 *                  description: Password
 *                  type: string
 *                  example: password
 *      responses:
 *        '200':
 *          description: Return the user profile object
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserProfile'
 *        '400':
 *          description: "Bad request (e.g: invalid format)"
 */
export async function POST(request: NextRequest) {
  try {
    const reqBody = (await request.json()) as SignUpRequest
    const [result, err] = await authService.signUp(reqBody)
    if (err) {
      return renderAPIErrorResponse(err)
    }

    return renderAPISuccessResponse(result)
  } catch (e: any) {
    return ApiExceptionHandler(e)
  }
}
