import { verifyProtectedWebRoute } from '@/lib/token'
import { ProfileResponse } from '@/models/response/profile'
import { headers, cookies } from 'next/headers'
import WebLayout from '@/components/layout/layout'
import { ErrorResponse } from '@/lib/response'
import { redirect } from 'next/navigation'
import { getProfile } from '@/app/get_profile'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerList = headers()
  const cookieStore = cookies()

  let user: ProfileResponse | null = null
  let err: ErrorResponse | null = null
  const userID = await verifyProtectedWebRoute(cookieStore, headerList)
  if (!userID) {
    redirect('/')
  }
  
  [user, err] = await getProfile(userID)
  if (err || !user) {
    redirect('/')
  }

  return (
    <>
      <WebLayout user={user}>{children}</WebLayout>
    </>
  )
}
