import { cookies } from 'next/headers'

import AuthService from '@/services/auth.service'

import { EKeyToken } from '@/constants/enum'

import { handleSetCookieToken } from '@/lib/handleSetCookieToken'

export async function POST() {
  const cookieStore = cookies()
  const refresh_Token = cookieStore.get(EKeyToken.REFRESH_TOKEN)?.value
  if (!refresh_Token) {
    return Response.json(
      {
        message: 'Không tìm thấy refreshToken'
      },
      {
        status: 401
      }
    )
  }
  try {
    const { payload } = await AuthService.sRefreshToken(refresh_Token)
    const { accessToken, refreshToken } = payload
    handleSetCookieToken({
      cookieStore,
      accessToken,
      refreshToken
    })
    return Response.json(payload)
  } catch (error: any) {
    console.log(error)
    return Response.json(
      {
        message: error.message ?? 'Có lỗi xảy ra'
      },
      {
        status: 401
      }
    )
  }
}
