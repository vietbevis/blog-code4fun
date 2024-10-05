import { cookies } from 'next/headers'

import AuthService from '@/services/auth.service'

import { LoginBodyType } from '@/schemas'

import { handleSetCookieToken } from '@/lib/handleSetCookieToken'
import { HttpError } from '@/lib/http'

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType
  const cookieStore = cookies()
  try {
    const result = await AuthService.sLogin(body)
    const { accessToken, refreshToken } = result.payload.data
    handleSetCookieToken({
      cookieStore,
      accessToken,
      refreshToken
    })
    return Response.json(result.payload)
  } catch (error: any) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status
      })
    } else {
      return Response.json(
        {
          message: 'Có lỗi xảy ra'
        },
        {
          status: 500
        }
      )
    }
  }
}
