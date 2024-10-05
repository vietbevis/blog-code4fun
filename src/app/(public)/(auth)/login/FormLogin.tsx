'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import FormFields from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'

import { useLoginMutation } from '@/services/queries/auth.query'

import useAuthStore from '@/stores/auth.store'

import { FormLoginSchema, LoginBodyType } from '@/schemas'

import ROUTES from '@/constants/route'

import { handleErrorApi } from '@/lib/utils'

const FormLogin = () => {
  const { mutateAsync: loginMutation, isPending } = useLoginMutation()
  const login = useAuthStore((state) => state.login)

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(FormLoginSchema),
    defaultValues: {
      email: 'nguyenvanviet@gmail.com',
      password: 'Vietviet@150204'
    }
  })

  async function onSubmit(values: LoginBodyType) {
    try {
      const result = await loginMutation(values)
      login(result.payload.data)
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }
  return (
    <>
      <CardHeader>
        <CardTitle className='text-center text-2xl'>Login</CardTitle>
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
            <p className='cursor-pointer text-right text-sm text-muted-foreground transition-colors hover:text-white hover:underline'>
              Forgot password?
            </p>
            <Button type='submit' className='w-full' loading={isPending}>
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
