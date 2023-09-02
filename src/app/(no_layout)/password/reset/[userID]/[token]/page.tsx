import { authService } from '@/services'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'
import { GetResetPasswordResponse } from '@/models/response/reset_password'
import ResetPasswordForm from './form'

const statusSuccess = 'success'
const statusNotFound = 'notFound'
const statusExpired = 'expired'
const statusUnknown = 'unknown'

async function getData(
  userID: string,
  token: string
): Promise<[GetResetPasswordResponse | null, string]> {
  const [response, err] = await authService.getResetPassword(userID, token)
  if (response) {
    return [response, statusSuccess]
  }

  if (err) {
    switch (err.statusCode) {
      case 404:
        return [null, statusNotFound]
      case 410:
        return [null, statusExpired]
      default:
        return [null, statusUnknown]
    }
  }

  return [null, statusUnknown]
}

export default async function Page({
  params,
}: {
  params: { userID: string; token: string }
}) {
  const [obj, status] = await getData(params.userID, params.token)
  let content: ReactNode

  if (status == statusNotFound) {
    return notFound()
  } else if (status == statusExpired || status == statusUnknown) {
    content = status == statusExpired ? <h1>This link has expired</h1> : <h1>Something went wrong. Try again later.</h1>
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

  return <ResetPasswordForm userID={params.userID} token={params.token} obj={obj}/>
}
