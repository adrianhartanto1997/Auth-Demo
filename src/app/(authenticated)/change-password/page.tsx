import type { Metadata } from 'next'
import Form from './form'

export const metadata: Metadata = {
  title: 'Change Password'
}

export default async function Page(props: any) {
  return <Form/>
}
