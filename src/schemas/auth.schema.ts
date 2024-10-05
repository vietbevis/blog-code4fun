import { z } from 'zod'

export const FormRegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: 'Name must be at least 3 characters.' })
      .max(20, { message: 'Name must not exceed 20 characters.' }),
    email: z
      .string()
      .min(3, { message: 'Email must be at least 3 characters.' })
      .max(60, { message: 'Email must not exceed 60 characters.' })
      .email({
        message: 'Invalid email address.'
      }),
    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.'
      })
      .max(20, { message: 'Password must be at most 20 characters.' })
      .regex(/(?=.*[A-Z])/, {
        message: 'At least one uppercase character.'
      })
      .regex(/(?=.*[a-z])/, {
        message: 'At least one lowercase character.'
      })
      .regex(/(?=.*\d)/, {
        message: 'At least one digit.'
      })
      .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, {
        message: 'At least one special character.'
      }),
    confirmPassword: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.'
      })
      .max(20, { message: 'Password must be at most 20 characters.' })
  })
  .strict()
  .strip()
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Confirm password must match password.',
    path: ['confirmPassword']
  })
export type RegisterBodyType = z.infer<typeof FormRegisterSchema>

export const FormLoginSchema = z
  .object({
    email: z.string().email({
      message: 'Invalid email address.'
    }),
    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.'
      })
      .max(20, { message: 'Password must be at most 20 characters.' })
      .regex(/(?=.*[A-Z])/, {
        message: 'At least one uppercase character.'
      })
      .regex(/(?=.*[a-z])/, {
        message: 'At least one lowercase character.'
      })
      .regex(/(?=.*\d)/, {
        message: 'At least one digit.'
      })
      .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, {
        message: 'At least one special character.'
      })
  })
  .strict()
  .strip()
export type LoginBodyType = z.infer<typeof FormLoginSchema>
