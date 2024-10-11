/* eslint-disable unused-imports/no-unused-vars */
import { cookies } from 'next/headers'

import AuthService from '@/services/auth.service'

import { EKeyToken } from '@/constants/enum'

export async function PUT(_request: Request) {
  const cookieStore = cookies()
  const token = cookieStore.get(EKeyToken.ACCESS_TOKEN)?.value || ''
  const deviceInfo = JSON.parse(cookieStore.get(EKeyToken.DEVICE_INFO)?.value || '{}')

  cookieStore.delete(EKeyToken.ACCESS_TOKEN)
  cookieStore.delete(EKeyToken.REFRESH_TOKEN)
  cookieStore.delete(EKeyToken.DEVICE_INFO)

  if (!token || !deviceInfo) {
    return Response.json(
      {
        message: 'Không nhận được token or deviceInfo từ client'
      },
      {
        status: 200
      }
    )
  }

  try {
    const result = await AuthService.sLogout(token, { deviceInfo, token })
    return Response.json(result.payload)
  } catch (error) {
    return Response.json(
      {
        message: 'Lỗi khi gọi API đến server backend'
      },
      {
        status: 200
      }
    )
  }
}
