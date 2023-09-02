'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/pages/default_page'
import Button from '@/components/ui/button'
import TextField from '@/components/ui/textfield'
import { ProfileResponse } from '@/models/response/profile'
import { UpdateProfileRequestSchema } from '@/models/request/update_profile'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { errorKey } from '@/lib/response'
import { toast } from 'react-toastify'
import { defaultToastOptions } from '@/components/toast_provider'

const component = ({ user }: { user: ProfileResponse }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UpdateProfileRequestSchema),
  })

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    const res = await fetch('/api/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    setIsLoading(false)

    if (res.ok) {
      router.refresh()
      toast.success('Profile updated', defaultToastOptions)
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
      <div className="title mb-4">Update Profile</div>
      <form className="default-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <div className="label">Name</div>
          <div className="form-input">
            <Controller
              name="name"
              defaultValue={user.name}
              control={control}
              render={({ field }) => (
                <TextField
                  type="text"
                  disabled={isLoading}
                  errors={errors}
                  inputAttr={field}
                />
              )}
            />
          </div>
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
