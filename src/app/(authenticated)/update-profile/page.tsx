import type { Metadata } from 'next'
import { verifyProtectedWebRoute } from '@/lib/token'
import { ProfileResponse } from '@/models/response/profile'
import { headers, cookies } from 'next/headers'
import { authService } from '@/services'
import { ErrorResponse } from '@/lib/response'
import { redirect } from 'next/navigation'
import Form from './form'

export const metadata: Metadata = {
  title: 'Update Profile'
}

const getData = async(): Promise<ProfileResponse> => {
  const headerList = headers()
  const cookieStore = cookies()

  let user: ProfileResponse | null = null
  let err: ErrorResponse | null = null
  const userID = await verifyProtectedWebRoute(cookieStore, headerList)
  if (!userID) {
    redirect('/')
  }
  
  [user, err] = await authService.getProfile(userID)
  if (err || !user) {
    redirect('/')
  }

  return user
}

export default async function Page(props: any) {
  const user = await getData()

  return <Form user={user}/>
}
