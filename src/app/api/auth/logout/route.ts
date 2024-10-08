import { cookies } from 'next/headers'

import AuthService from '@/services/auth.service'

import { EKeyToken } from '@/constants/enum'

export async function PUT() {
  const cookieStore = cookies()
  const token = cookieStore.get(EKeyToken.ACCESS_TOKEN)?.value || ''
  const deviceInfo = JSON.parse(
    cookieStore.get(EKeyToken.DEVICE_INFO)?.value || '{}'
  )

  try {
    await AuthService.sLogout({ deviceInfo, token })
  } catch (error) {
    return Response.json(
      {
        message: error
      },
      {
        status: 200
      }
    )
  } finally {
    cookieStore.delete(EKeyToken.ACCESS_TOKEN)
    cookieStore.delete(EKeyToken.REFRESH_TOKEN)
    cookieStore.delete(EKeyToken.DEVICE_INFO)
    return Response.json({ message: 'Đăng xuất thành công!' })
  }
}
