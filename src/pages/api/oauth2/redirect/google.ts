import type { NextApiRequest, NextApiResponse } from 'next'
import passport from '@/lib/passport'
import { createRouter } from 'next-connect'
import { setCookie } from 'cookies-next'
import {
  accessTokenCookieKey,
  sessionTokenCookieKey,
  accessTokenExpireSeconds,
} from '@/lib/token'
import { SignInResponse } from '@/models/response/sign_in'

interface ExtendedNextApiRequest extends NextApiRequest {
  user?: SignInResponse[]
  isAuthenticated?: () => boolean
}

const router = createRouter<ExtendedNextApiRequest, NextApiResponse>()

/**
 * @swagger
 *  /api/oauth2/redirect/google:
 *    get:
 *      tags:
 *        - Oauth2
 *      description: Redirect URL of the Oauth2
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
 */
router.get(
  passport.authenticate('google', { session: false }),
  (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    if (req.user && req.isAuthenticated && req.isAuthenticated()) {
      const signInResponse = req.user[0]
      setCookie(accessTokenCookieKey, signInResponse.accessToken, {
        req,
        res,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: accessTokenExpireSeconds,
      })
      setCookie(sessionTokenCookieKey, signInResponse.sessionToken, {
        req,
        res,
        httpOnly: true,
        sameSite: 'lax',
      })

      res.redirect('/dashboard').end()
    } else {
      res.status(500).json({ error: 'Something went wrong.' })
    }
  }
)

export const config = {
  api: {
    externalResolver: true,
  },
}

export default router.handler({
  onError: (err: any, _req, res) => {
    res.status(err.statusCode || 500).json({ error: err.message })
  },
})
