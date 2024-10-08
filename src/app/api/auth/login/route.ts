import { cookies } from 'next/headers'

import AuthService from '@/services/auth.service'

import { LoginBodyType } from '@/schemas'

import { handleSetCookieToken } from '@/lib/handleSetCookieToken'
import { HttpError } from '@/lib/http'

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType
  const deviceInfo = body.deviceInfo
  const cookieStore = cookies()
  try {
    const { payload } = await AuthService.sLogin(body)
    const { accessToken, refreshToken } = payload
    handleSetCookieToken({
      cookieStore,
      accessToken,
      refreshToken,
      deviceInfo
    })
    return Response.json(payload)
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
