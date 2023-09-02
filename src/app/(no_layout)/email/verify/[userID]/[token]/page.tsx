import { authService } from '@/services'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

const statusSuccess = 'success'
const statusNotFound = 'notFound'
const statusExpired = 'expired'
const statusUnknown = 'unknown'

async function getData(userID: string, token: string): Promise<string> {
  const err = await authService.verifyEmail(userID, token)
  if (!err) {
    return statusSuccess
  }
  switch (err.statusCode) {
    case 404:
      return statusNotFound
    case 410:
      return statusExpired
    default:
      return statusUnknown
  }
}

export default async function Page({
  params,
}: {
  params: { userID: string; token: string }
}) {
  const status = await getData(params.userID, params.token)
  let content: ReactNode

  if (status == statusNotFound) {
    return notFound()
  }

  if (status == statusSuccess) {
    content = (
      <>
        <h1 style={{ marginBottom: '24px' }}>
          Thank you for verifying your email !
        </h1>
        <div style={{ display: 'flex' }}>
          <a href="/">go to homepage</a>
        </div>
      </>
    )
  } else if (status == statusExpired) {
    content = <h1>This link has expired</h1>
  } else {
    content = <h1>Something went wrong. Try again later.</h1>
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      {content}
    </div>
  )
}
