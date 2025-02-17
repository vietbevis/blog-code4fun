'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import FormFields from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'

import { useLoginMutation } from '@/services/queries/auth.query'

import useLoadingStore from '@/stores/loading'

import { FormLoginSchema, LoginBodyType } from '@/schemas'

import ROUTES from '@/constants/route'

import { getDeviceInfo } from '@/lib/utils'

import Oauth2 from '../Oauth2'

const FormLogin = ({
  searchParams
}: {
  searchParams: {
    redirect?: string
    accessToken?: string
    refreshToken?: string
    [key: string]: string | undefined
  }
}) => {
  const { mutateAsync: login, isPending, error } = useLoginMutation()
  const { isLoading } = useLoadingStore()
  const deviceInfo = getDeviceInfo()
  const router = useRouter()

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(FormLoginSchema),
    defaultValues: {
      email: '',
      password: '',
      deviceInfo
    }
  })

  async function onSubmit(values: LoginBodyType) {
    if (isLoading || isPending) return
    try {
      await login(values)

      if (searchParams.redirect) {
        location.href = decodeURIComponent(searchParams.redirect)
      } else {
        router.replace(ROUTES.HOME)
        router.refresh()
      }
    } catch (error) {}
  }

  return (
    <>
      <CardHeader className='space-y-3 pt-0'>
        <CardTitle className='text-center text-2xl'>Login</CardTitle>
        <Oauth2 />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <FormFields
              control={form.control}
              name='email'
              label='Email'
              Component={Input}
              autoFocus
              placeholder='Enter your email'
            />
            <FormFields
              control={form.control}
              name='password'
              label='Password'
              Component={PasswordInput}
              placeholder='Enter your email'
            />
            {error && (
              <Alert variant='destructive'>
                <AlertDescription>
                  {(error as any).payload?.message ||
                    (error as any).payload?.error ||
                    'Something went wrong'}
                </AlertDescription>
              </Alert>
            )}
            <p className='cursor-pointer text-right text-sm text-muted-foreground transition-colors hover:text-black hover:underline dark:hover:text-white'>
              Forgot password?
            </p>
            <Button type='submit' className='w-full' loading={isLoading || isPending}>
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
        <p>Don&apos;t have an account?</p>
        <Link href={ROUTES.REGISTER} className='text-blue-500 hover:underline'>
          Register
        </Link>
      </CardFooter>
    </>
  )
}

export default FormLogin
