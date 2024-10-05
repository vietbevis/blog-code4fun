'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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

import { useRegisterMutation } from '@/services/queries/auth.query'

import { FormRegisterSchema, RegisterBodyType } from '@/schemas'

import ROUTES from '@/constants/route'

import { handleErrorApi } from '@/lib/utils'

const FormRegister = () => {
  const { mutateAsync: registerMutation, isPending } = useRegisterMutation()
  const router = useRouter()

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(FormRegisterSchema),
    defaultValues: {
      fullName: 'Nguyen Van Viet',
      email: 'nguyenvanviet@gmail.com',
      password: 'Vietviet@150204',
      confirmPassword: 'Vietviet@150204'
    }
  })

  async function onSubmit(values: RegisterBodyType) {
    try {
      await registerMutation(values)
      router.push(ROUTES.LOGIN)
    } catch (error) {
      handleErrorApi({ error, setError: form.setError })
    }
  }
  return (
    <>
      <CardHeader>
        <CardTitle className='text-center text-2xl'>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <FormFields
              control={form.control}
              name='fullName'
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
            <FormFields
              control={form.control}
              name='confirmPassword'
              label='Confirm Password'
              Component={PasswordInput}
              placeholder='Confirm Password'
            />
            <p className='cursor-pointer text-right text-sm text-muted-foreground transition-colors hover:text-white hover:underline'>
              Forgot password?
            </p>
            <Button type='submit' className='w-full' loading={isPending}>
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
