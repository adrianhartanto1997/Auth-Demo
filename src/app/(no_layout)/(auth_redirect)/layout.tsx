import { verifyProtectedWebRoute } from '@/lib/token'
import { ProfileResponse } from '@/models/response/profile'
import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ErrorResponse } from '@/lib/response'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerList = headers()
  const cookieStore = cookies()

  const userID = await verifyProtectedWebRoute(cookieStore, headerList)
  if (userID) {
    redirect('/')
  }

  return (
    <>
      {children}
    </>
  )
}
