'use client'

import { useState } from 'react'
import { defaultToastOptions } from '@/components/toast_provider'
import Button from '@/components/ui/button'
import { toast } from 'react-toastify'

const verification = () => {
  const [isLoading, setIsLoading] = useState(false)

  const sendEmailHandler = async () => {
    setIsLoading(true)
    const res = await fetch('/api/auth/email/send-verification/', {
      method: 'POST',
    })
    setIsLoading(false)

    if (res.ok) {
      toast.success('Email sent', defaultToastOptions)
    } else {
      toast.error('Something went wrong. Try again later.', defaultToastOptions)
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Button
          theme={{ name: 'primary' }}
          disabled={isLoading}
          onClick={sendEmailHandler}
        >
          Resend email verification
        </Button>
      </div>
    </div>
  )
}

export default verification
