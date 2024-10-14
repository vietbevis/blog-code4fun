import { cookies } from 'next/headers'

import AuthService from '@/services/auth.service'

import { LoginGoogleBodyType } from '@/schemas/auth.schema'

import { handleSetCookieToken } from '@/lib/handleSetCookieToken'
import { HttpError } from '@/lib/http'

export async function POST(request: Request) {
  const body = (await request.json()) as LoginGoogleBodyType
  const cookieStore = cookies()
  try {
    const { payload } = await AuthService.sLoginGoogle(body)
    const { accessToken, refreshToken } = payload
    handleSetCookieToken({
      cookieStore,
      accessToken,
      refreshToken,
      deviceInfo: body.deviceInfo
    })
    return Response.json(payload)
  } catch (error) {
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
