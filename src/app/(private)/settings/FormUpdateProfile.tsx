'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'

import { AvatarUploader } from '@/components/AvatarUploader'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFields from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { useUpdateProfile } from '@/services/queries/account.query'

import { AccountType } from '@/types/auth.type'

import { UpdateProfileSchema, UpdateProfileType } from '@/schemas/auth.schema'

import { cn } from '@/lib/utils'

const FormUpdateProfile = ({ profile }: { profile: AccountType }) => {
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile()
  const router = useRouter()

  const form = useForm<UpdateProfileType>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: profile?.name || '',
      bio: profile?.profile?.bio || '',
      website: profile?.profile?.website || '',
      twitter: profile?.profile?.social?.twitter || '',
      github: profile?.profile?.social?.github || '',
      linkedin: profile?.profile?.social?.linkedin || '',
      location: profile?.profile?.location || '',
      avatarUrl: profile?.profile?.avatarUrl || ''
    },
    mode: 'onSubmit'
  })

  const isChanged = form.formState.isDirty

  async function onSubmit(values: UpdateProfileType) {
    if (isPending) return
    await updateProfile(values)
    form.reset(values)
    router.refresh()
  }

  const handleAvatarChange = (newAvatarUrl: string) => {
    form.setValue('avatarUrl', newAvatarUrl, { shouldDirty: true })
  }

  return (
    <div className='relative mb-10'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <div className='relative flex flex-col gap-4 overflow-hidden rounded-lg border border-input bg-card p-4'>
            <div className='absolute inset-x-0 top-0 h-20 bg-cyan-300'></div>
            <div className='mb-4 flex flex-col items-center justify-center gap-4'>
              <AvatarUploader
                currentAvatar={form.watch('avatarUrl')}
                onAvatarChange={handleAvatarChange}
              />
              <h2 className='text-2xl font-bold'>{profile?.name}</h2>
            </div>
            <FormFields control={form.control} name='name' label='Full name' Component={Input} />
            <Label htmlFor='email'>Email</Label>
            <Input
              className='text-base'
              disabled={true}
              id='email'
              name='email'
              defaultValue={profile?.email}
            />
            <Label htmlFor='username'>Username</Label>
            <Input
              className='text-base'
              disabled={true}
              id='username'
              name='username'
              defaultValue={profile?.userName}
            />
          </div>
          <div className='relative flex flex-col gap-4 overflow-hidden rounded-lg border border-input bg-card p-4'>
            <h3 className='mb-2 text-2xl font-bold'>Social</h3>
            <FormFields
              control={form.control}
              name='bio'
              label='Bio'
              Component={Textarea}
              maxLength={300}
            />
            <FormFields
              control={form.control}
              name='website'
              label='Website'
              Component={Input}
              placeholder='https://website.com/'
            />
            <FormFields
              control={form.control}
              name='twitter'
              label='Twitter'
              Component={Input}
              placeholder='https://twitter.com/'
            />
            <FormFields
              control={form.control}
              name='github'
              label='Github'
              Component={Input}
              placeholder='https://github.com/'
            />
            <FormFields
              control={form.control}
              name='linkedin'
              label='Linkedin'
              Component={Input}
              placeholder='https://linkedin.com/'
            />
            <FormFields
              control={form.control}
              name='location'
              label='Location'
              Component={Input}
              placeholder='Location'
              maxLength={100}
            />
          </div>
          <div
            className={cn(
              'flex h-16 items-center justify-end gap-2 rounded-lg border border-input bg-card px-4',
              isChanged && 'sticky inset-x-0 bottom-0 z-20'
            )}
          >
            <p className='mr-auto'>Are you sure you want to change?</p>
            <Button type='reset' onClick={() => form.reset()} variant={'destructive'}>
              Cancel
            </Button>
            <Button
              type='submit'
              aria-disabled={!isChanged}
              disabled={!isChanged}
              loading={isPending}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default FormUpdateProfile
