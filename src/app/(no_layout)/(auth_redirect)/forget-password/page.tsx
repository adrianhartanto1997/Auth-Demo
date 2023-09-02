'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/pages/auth_page'
import TextField from '@/components/ui/textfield'
import Button from '@/components/ui/button'
import Link from 'next/link'
import { ForgetPasswordRequestSchema } from '@/models/request/reset_password'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { errorKey } from '@/lib/response'
import { toast } from 'react-toastify'
import { defaultToastOptions } from '@/components/toast_provider'

export default function Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ForgetPasswordRequestSchema),
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    const res = await fetch('/api/auth/forget-password/send-request', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    setIsLoading(false)

    if (res.ok) {
      toast.success('Please check your email', defaultToastOptions)
      return router.replace('/')
    } else {
      const statusCode = res.status
      const errData = (await res.json())[errorKey]

      if (statusCode == 400) {
        for( var key in errData ) {
          var value = errData[key];
          setError(key, { type: "custom", message: value }, { shouldFocus: true });
        }
      } else {
        toast.error(errData, defaultToastOptions)
      }
    }
  }

  return (
    <PageWrapper>
      <div className="box-wrapper">
        <div className="title">Forgot Password</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  type="email"
                  disabled={isLoading}
                  placeholder="Email"
                  errors={errors}
                  inputAttr={field}
                />
              )}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              theme={{ name: 'primary' }}
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              Submit
            </Button>
          </div>
        </form>
        <div className="other-links">
          <Link href="/sign-in">Sign In</Link>
          <Link href="/sign-up">Create an account</Link>
        </div>
      </div>
    </PageWrapper>
  )
}
