import {
  renderAPISuccessResponse,
  renderAPIErrorResponse,
  ApiExceptionHandler,
} from '@/lib/response'
import {
  accessTokenCookieKey,
  sessionTokenCookieKey,
  accessTokenExpireSeconds,
} from '@/lib/token'
import { authService } from '@/services'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { SignInRequest } from '@/models/request/sign_in'

/**
 * @swagger
 *  /api/auth/sign-in:
 *    post:
 *      tags:
 *        - Auth
 *      description: Sign In by email & password
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
 *                password:
 *                  description: Password
 *                  type: string
 *                  example: password
 *      responses:
 *        '200':
 *          description: Return the access token & session token
 *          headers:
 *            Set-Cookie:
 *              schema:
 *                type: string
 *                example: accessToken=abcde12345; Path=/; HttpOnly; Max-Age=2592000
 *            "\0Set-Cookie":
 *              schema:
 *                type: string
 *                example: sessionToken=abcde12345; Path=/; HttpOnly; Max-Age=3600
 *        '400':
 *          description: "Bad request (e.g: invalid format)"
 *        '401':
 *          description: Invalid credential
 */
export async function POST(request: NextRequest) {
  try {
    const reqBody = (await request.json()) as SignInRequest
    const [result, err] = await authService.signIn(reqBody)
    if (err) {
      return renderAPIErrorResponse(err)
    }

    cookies().set(accessTokenCookieKey, result?.accessToken!, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: accessTokenExpireSeconds,
    })
    cookies().set(sessionTokenCookieKey, result?.sessionToken!, {
      httpOnly: true,
      sameSite: 'lax',
    })

    return renderAPISuccessResponse(result)
  } catch (e: any) {
    return ApiExceptionHandler(e)
  }
}
