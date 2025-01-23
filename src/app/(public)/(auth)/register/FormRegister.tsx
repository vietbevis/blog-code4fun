'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import FormFields from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'

import { useRegisterMutation } from '@/services/queries/auth.query'

import useLoadingStore from '@/stores/loading'

import { FormRegisterSchema, RegisterBodyType } from '@/schemas'

import ROUTES from '@/constants/route'

import Oauth2 from '../Oauth2'

const FormRegister = () => {
  const { mutateAsync: register, isPending, error } = useRegisterMutation()
  const { isLoading } = useLoadingStore()

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(FormRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  async function onSubmit(values: RegisterBodyType) {
    if (isLoading || isPending) return
    try {
      await register(values)
    } catch (error) {}
  }
  return (
    <>
      <CardHeader className='space-y-3 pt-0'>
        <CardTitle className='text-center text-2xl'>Register</CardTitle>
        <Oauth2 />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <FormFields
              control={form.control}
              name='name'
              label='Fullname'
              Component={Input}
              autoFocus
              placeholder='Enter your name'
            />
            <FormFields
              control={form.control}
              name='email'
              label='Email'
              Component={Input}
              placeholder='Enter your email'
            />
            <FormFields
              control={form.control}
              name='password'
              label='Password'
              Component={PasswordInput}
              placeholder='Password'
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
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
        <p>You have an account?</p>
        <Link href={ROUTES.LOGIN} className='text-blue-500 hover:underline'>
          Login
        </Link>
      </CardFooter>
    </>
  )
}

export default FormRegister
