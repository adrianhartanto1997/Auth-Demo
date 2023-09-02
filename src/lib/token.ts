import { SignJWT, jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { ErrorResponse, renderAPIErrorResponse } from './response'
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies'
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

export const userIDKey = 'userID'
export const accessTokenCookieKey = 'accessToken'
export const sessionTokenCookieKey = 'sessionToken'
export const accessTokenExpireSeconds = 30 * 24 * 60 * 60
export const sessionTokenExpireSeconds = 1 * 60 *60

const generateToken = async (userID: number, expires: number): Promise<string> => {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + expires

  return new SignJWT({ [userIDKey]: userID })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env['SECRET_KEY']))
}

export const generateAccessToken = async (userID: number): Promise<string> => {
  return generateToken(userID, accessTokenExpireSeconds)
}

export const generateSessionToken = async (userID: number): Promise<string> => {
  return generateToken(userID, sessionTokenExpireSeconds)
}

const getAccessToken = (
  cookies: RequestCookies | ReadonlyRequestCookies,
  headers: Headers | ReadonlyHeaders
): string | null => {
  let accessToken: string

  // find access token in cookie
  accessToken = cookies.get(accessTokenCookieKey)?.value as string

  // find access token in authorization bearer header
  if (!accessToken) {
    accessToken = (headers.get('authorization') || '')
      .split('Bearer ')
      .at(1) as string
  }

  return accessToken
}

export const getSessionToken = (
  request: NextRequest): string | null => {
    return request.cookies.get(sessionTokenCookieKey)?.value as string
  }

export const verifyProtectedAPIRoute = async (
  request: NextRequest
): Promise<[number | null, NextResponse | null]> => {
  const unauthorizedErrorResponse: ErrorResponse = {
    statusCode: 401,
    payload: 'Invalid access token',
  }
  const accessToken = getAccessToken(request.cookies, request.headers)

  // verify if access token is valid
  try {
    if (!accessToken) {
      return [null, renderAPIErrorResponse(unauthorizedErrorResponse)]
    }
    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env['SECRET_KEY'])
    )

    return [payload[userIDKey] as number, null]
  } catch (err) {
    return [null, renderAPIErrorResponse(unauthorizedErrorResponse)]
  }
}

export const verifyProtectedWebRoute = async (
  cookies: ReadonlyRequestCookies,
  headers: ReadonlyHeaders
): Promise<number | null> => {
  const accessToken = getAccessToken(cookies, headers)

  // verify if access token is valid
  try {
    if (!accessToken) {
      return null
    }
    const { payload } = await jwtVerify(
      accessToken,
      new TextEncoder().encode(process.env['SECRET_KEY'])
    )

    return payload[userIDKey] as number
  } catch (err) {
    return null
  }
}

export const validateSessionToken = async (sessionToken: string): Promise<number | null> => {
  try {
    if (!sessionToken) {
      return null
    }
    const { payload } = await jwtVerify(
      sessionToken,
      new TextEncoder().encode(process.env['SECRET_KEY'])
    )

    return payload[userIDKey] as number
  } catch (err) {
    return null
  }
}
