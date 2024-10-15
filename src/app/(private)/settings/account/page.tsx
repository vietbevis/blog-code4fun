'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { notFound } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFields from '@/components/ui/form-field'
import { PasswordInput } from '@/components/ui/password-input'

import { useChangePasswordMutation } from '@/services/queries/auth.query'

import { UpdatePasswordSchema, UpdatePasswordType } from '@/schemas/auth.schema'

import { cn } from '@/lib/utils'

const AccountPage = () => {
  const defaultValues: UpdatePasswordType = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  const form = useForm<UpdatePasswordType>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues,
    mode: 'onSubmit'
  })

  const { mutateAsync: changePassword, isPending } = useChangePasswordMutation()

  async function onSubmit(values: UpdatePasswordType) {
    if (isPending) return
    try {
      await changePassword(values)
      form.reset()
    } catch (error: any) {
      toast.error(error?.payload?.message ?? 'An error occurred')
    }
  }

  const isChanged = form.formState.isDirty

  return notFound()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='mb-10 space-y-2'>
        <div className='flex flex-col gap-4 overflow-hidden rounded-lg border border-input bg-card p-4'>
          <h2 className='text-2xl font-bold'>Set new password</h2>
          <p className='text-muted-foreground'>
            If your account was created using social account authentication, you may prefer to add
            an email log in. If you signed up with a social media account, please reset the password
            for your primary email address{' '}
            <span className='cursor-pointer font-bold text-accent-foreground'>
              (nguyenvanviet.150204@gmail.com)
            </span>{' '}
            in order to enable this. Please note that email login is in addition to social login
            rather than a replacement for it, so your authenticated social account will continue to
            be linked to your account.
          </p>
          <FormFields
            control={form.control}
            name='oldPassword'
            label='Current Password'
            Component={PasswordInput}
          />
          <FormFields
            control={form.control}
            name='newPassword'
            label='New Password'
            Component={PasswordInput}
          />
          <FormFields
            control={form.control}
            name='confirmPassword'
            label='Confirm New Password'
            Component={PasswordInput}
          />
          {/* <Link
            href={'/forgot-password'}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'sm' }),
              'ml-auto hover:underline'
            )}
          >
            Forgot password
          </Link> */}
        </div>
        <div
          className={cn(
            'flex items-center justify-end gap-2 rounded-lg border border-input bg-card px-4 py-3',
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
        <div className='space-y-1 p-4'>
          <h3 className='text-base font-bold'>Password Requirement</h3>
          <p className='text-muted-foreground'>Please follow this guide for a strong password</p>
          <ul className='list-inside list-disc'>
            <li>One special characters (!@#$%^&*()-_=+)</li>
            <li>Min 8 characters</li>
            <li>One number (2 are recommended)</li>
            <li>Change it often</li>
          </ul>
        </div>
      </form>
    </Form>
  )
}

export default AccountPage
