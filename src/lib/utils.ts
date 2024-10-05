import { type ClassValue, clsx } from 'clsx'
import jwt from 'jsonwebtoken'
import { UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import { TokenPayload } from '@/types/auth.type'

import { HttpError } from './http'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}

export const handleErrorApi = ({
  error,
  setError
}: {
  error: any
  setError?: UseFormSetError<any>
}) => {
  if (error instanceof HttpError && setError) {
    error.payload.errors.forEach((item: any) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast.error(error?.payload?.message ?? 'Lỗi không xác định')
  }
}