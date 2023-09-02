import { ProfileResponse } from '@/models/response/profile'
import Header from './header'
import HeaderMobile from './header_mobile'
import ContentWrapper from './content-wrapper'

export default function WebLayout({
  children,
  user,
}: {
  children: React.ReactNode
  user: ProfileResponse | null
}) {
  return (
    <>
      <Header user={user} />
      <HeaderMobile user={user} />
      <ContentWrapper>{children}</ContentWrapper>
    </>
  )
}
