'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'
import { colors } from './variable'

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color='#26a7de'
        options={{ showSpinner: true }}
        shallowRouting
      />
    </>
  )
}

export default Provider
