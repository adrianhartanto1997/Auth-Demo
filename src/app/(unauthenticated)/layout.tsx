import { verifyProtectedWebRoute } from '@/lib/token'
import { ProfileResponse } from '@/models/response/profile'
import { headers, cookies } from 'next/headers'
import { authService } from '@/services'
import WebLayout from '@/components/layout/layout'
import { ErrorResponse } from '@/lib/response'

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
  if (userID) {
    [user, err] = await authService.getProfile(userID)
  }

  return (
    <>
      <WebLayout user={user}>{children}</WebLayout>
    </>
  )
}
