import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

import { EKeyToken } from '@/constants/enum'

import { decodeToken } from './utils'

type Props = {
  cookieStore: ReadonlyRequestCookies
  accessToken?: string
  refreshToken?: string
  deviceInfo?: { deviceId: string; deviceType: string }
}

export const handleSetCookieToken = ({
  cookieStore,
  accessToken,
  refreshToken,
  deviceInfo
}: Props): void => {
  const decodeAccessToken = decodeToken(accessToken ?? '')
  const decodeRefreshToken = decodeToken(refreshToken ?? '')

  if (accessToken) {
    cookieStore.set(EKeyToken.ACCESS_TOKEN, accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodeAccessToken.exp * 1000
    })
  }

  if (refreshToken) {
    cookieStore.set(EKeyToken.REFRESH_TOKEN, refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodeRefreshToken.exp * 1000
    })
  }

  if (deviceInfo) {
    cookieStore.set(EKeyToken.DEVICE_INFO, JSON.stringify(deviceInfo), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodeRefreshToken.exp * 1000
    })
  }
}
