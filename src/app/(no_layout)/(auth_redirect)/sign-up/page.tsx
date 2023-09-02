'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/pages/auth_page'
import TextField from '@/components/ui/textfield'
import Button from '@/components/ui/button'
import OauthButtons from '@/components/pages/oauth_login_buttons'
import Link from 'next/link'
import { z } from 'zod'
import { SignUpRequestSchema } from '@/models/request/sign_up'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { errorKey } from '@/lib/response'
import { toast } from 'react-toastify'
import { defaultToastOptions } from '@/components/toast_provider'

export default function Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const signUpSchema = SignUpRequestSchema.setKey(
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
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    const res = await fetch('/api/auth/sign-up/', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    setIsLoading(false)

    if (res.ok) {
      router.refresh()
      toast.success('Sign Up successful', defaultToastOptions)
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
        <div className="title">Sign Up</div>
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
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  type="text"
                  disabled={isLoading}
                  placeholder="Name"
                  errors={errors}
                  inputAttr={field}
                />
              )}
            />
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
              Sign Up
            </Button>
          </div>
        </form>
        <OauthButtons />
        <div className="other-links">
          <Link href="/sign-in">Sign In</Link>
        </div>
      </div>
    </PageWrapper>
  )
}
