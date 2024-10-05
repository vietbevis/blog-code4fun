import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'

import { decodeToken } from './utils'

type Props = {
  cookieStore: ReadonlyRequestCookies
  accessToken?: string
  refreshToken?: string
}

export const handleSetCookieToken = ({
  cookieStore,
  accessToken,
  refreshToken
}: Props): void => {
  const decodeAccessToken = decodeToken(accessToken ?? '')
  const decodeRefreshToken = decodeToken(refreshToken ?? '')

  if (accessToken) {
    cookieStore.set('accessToken', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodeAccessToken.exp * 1000
    })
  }

  if (refreshToken) {
    cookieStore.set('refreshToken', refreshToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      expires: decodeRefreshToken.exp * 1000
    })
  }
}
