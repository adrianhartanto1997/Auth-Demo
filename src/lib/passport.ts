import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import passport from 'passport'
import { authService } from '@/services'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env['GOOGLE_CLIENT_ID']!,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
      callbackURL: '/api/oauth2/redirect/google', // callback url on our app to verify authentication.
    },
    async (_accessToken, _refreshToken, profile, cb: any) => {
      try {
        const signInResponse = await authService.oauthSignIn(profile)
        return cb(null, signInResponse)
      } catch (e: any) {
        throw new Error(e)
      }
    }
  )
)

export default passport
