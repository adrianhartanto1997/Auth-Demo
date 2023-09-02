import { User } from '@/models/entities'
import { dataKey } from '@/lib/response'
import { SignInResponse } from '@/models/response/sign_in'
import { headers, cookies } from 'next/headers'
import { verifyProtectedWebRoute } from '@/lib/token'
import Image from 'next/image'

// export const revalidate = 0

async function getData(): Promise<SignInResponse> {
  const host = process.env['APP_HOST']
  const res = await fetch(`${host}/api/auth/profile`, { next: { revalidate: 0 }})

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  const result = await res.json()
  return result[dataKey]
}

export default async function Page(props: any) {
  return (
    <div style={{width: '100%', height: '100%', position: 'relative'}}>
      <Image src={'/wallpaper.jpg'} alt='wallpaper' fill={true} style={{objectFit: 'cover'}}/>
    </div>
  )
}
