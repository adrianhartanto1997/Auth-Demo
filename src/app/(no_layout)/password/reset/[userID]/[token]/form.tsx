'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/pages/auth_page'
import TextField from '@/components/ui/textfield'
import Button from '@/components/ui/button'
import { z } from 'zod'
import { ResetPasswordRequestSchema } from '@/models/request/reset_password'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { errorKey } from '@/lib/response'
import { toast } from 'react-toastify'
import { defaultToastOptions } from '@/components/toast_provider'
import { GetResetPasswordResponse } from '@/models/response/reset_password'

export default function ResetPasswordForm({userID, token, obj}: {userID: string, token: string, obj: GetResetPasswordResponse | null}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const resetPasswordSchema = ResetPasswordRequestSchema.setKey(
    'confirmPassword',
    z.string()
  ).superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: 'custom',
        message: 'The passwords did not match',
      })
    }
  })

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    const res = await fetch(`/api/auth/forget-password/reset/${userID}/${token}`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    setIsLoading(false)

    if (res.ok) {
      router.refresh()
      toast.success('Password changed', defaultToastOptions)
      return router.replace('/sign-in')
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
        <div className="title">Reset Password</div>
        <div className='mb-3'>Hi {obj?.user.name}, reset your password now !</div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  type="password"
                  disabled={isLoading}
                  placeholder="Password"
                  errors={errors}
                  inputAttr={field}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  type="password"
                  disabled={isLoading}
                  placeholder="Confirm Password"
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
      </div>
    </PageWrapper>
  )
}
