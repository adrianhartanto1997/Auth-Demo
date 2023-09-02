import type { NextApiRequest, NextApiResponse } from 'next'
import passport from '@/lib/passport'
import { createRouter } from 'next-connect'

const router = createRouter<NextApiRequest, NextApiResponse>()

/**
 * @swagger
 *  /api/auth/sign-in/google:
 *    get:
 *      tags:
 *        - Oauth2
 *      description: Sign In with Google Oauth2
 *      responses:
 *        '302':
 *          description: Redirect to Google login page
 */
router.get(
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

export default router.handler({
  onError: (err: any, _req, res) => {
    res.status(err.statusCode || 500).end(err.message)
  },
})
