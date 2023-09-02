import type { Metadata } from 'next'
import { getApiDocs } from '@/lib/swagger'
import ReactSwagger from './react_swagger'

export const metadata: Metadata = {
  title: 'API Docs'
}

export default async function IndexPage() {
  const spec = await getApiDocs()
  return (
    <ReactSwagger spec={spec} />
  )
}
