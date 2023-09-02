'use client'

import { useState } from 'react'
import PageWrapper from '@/components/pages/default_page'
import Button from '@/components/ui/button'
import TextField from '@/components/ui/textfield'
import { z } from 'zod'
import { ChangePasswordRequestSchema } from '@/models/request/change_password'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { errorKey } from '@/lib/response'
import { toast } from 'react-toastify'
import { defaultToastOptions } from '@/components/toast_provider'

const component = () => {
  const [isLoading, setIsLoading] = useState(false)

  const schema = ChangePasswordRequestSchema.setKey(
    'confirmPassword',
    z.string()
  ).superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
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
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    const res = await fetch('/api/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    setIsLoading(false)

    if (res.ok) {
      reset()
      toast.success('Password changed', defaultToastOptions)
    } else {
      const statusCode = res.status
      const errData = (await res.json())[errorKey]

      if ([400, 401].includes(statusCode)) {
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
      <div className="title mb-4">Change Password</div>
      <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Controller
            name="currentPassword"
            defaultValue={''}
            control={control}
            render={({ field }) => (
              <TextField
                placeholder="Current Password"
                type="password"
                disabled={isLoading}
                errors={errors}
                inputAttr={field}
              />
            )}
          />
        </div>
        <div className="mb-3">
          <Controller
            name="newPassword"
            defaultValue={''}
            control={control}
            render={({ field }) => (
              <TextField
                placeholder="New Password"
                type="password"
                disabled={isLoading}
                errors={errors}
                inputAttr={field}
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="confirmPassword"
            defaultValue={''}
            control={control}
            render={({ field }) => (
              <TextField
                placeholder="Confirm New Password"
                type="password"
                disabled={isLoading}
                errors={errors}
                inputAttr={field}
              />
            )}
          />
        </div>
        <div className="mt-4">
          <Button
            theme={{ name: 'primary' }}
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            Save
          </Button>
        </div>
      </form>
    </PageWrapper>
  )
}

export default component
