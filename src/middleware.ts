import { NextResponse, type NextRequest } from 'next/server'
import {
  generateSessionToken,
  sessionTokenCookieKey,
  validateSessionToken,
  getSessionToken,
  verifyProtectedAPIRoute,
} from '@/lib/token'

async function createSessionLog(
  response: NextResponse,
  userID: number
): Promise<NextResponse> {
  const token = await generateSessionToken(userID)

  // Send request to internal API route, because Prisma currently can't work with middleware as it runs on V8 environment / edge runtime
  const sessionURL = `${process.env['APP_HOST']}/api/session/${token}`
  await fetch(sessionURL, { method: 'POST' })

  response.cookies.set(sessionTokenCookieKey, token, {
    httpOnly: true,
    sameSite: 'lax',
  })
  return response
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Skip special/internal API route
  if (request.nextUrl.pathname.startsWith('/api/session')) {
    return response
  }

  const [userID, err] = await verifyProtectedAPIRoute(request)
  if (!userID || err) {
    return response
  }

  const sessionToken = getSessionToken(request)
  if (!sessionToken) {
    return createSessionLog(response, userID)
  }

  const sessionUserID = validateSessionToken(sessionToken)
  if (!sessionUserID) {
    return createSessionLog(response, userID)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
