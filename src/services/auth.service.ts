import {
  LoginResponseType,
  LogoutBodyType,
  LogoutResponseType,
  RegisterResponseType
} from '@/types/auth.type'

import { LoginBodyType, RegisterBodyType } from '@/schemas'
import { LoginGoogleBodyType, UpdatePasswordType } from '@/schemas/auth.schema'

import ROUTES from '@/constants/route'

import http from '@/lib/http'

const AuthService = {
  refreshTokenRequest: null as Promise<{
    status: number
    payload: LoginResponseType
  }> | null,
  sLogin: (body: LoginBodyType) => http.post<LoginResponseType>(ROUTES.BACKEND.LOGIN, body),
  login: (body: LoginBodyType) =>
    http.post<LoginResponseType>(ROUTES.HANDLER.LOGIN, body, {
      baseUrl: ''
    }),
  loginGoogle: (body: LoginGoogleBodyType) =>
    http.post<LoginResponseType>(ROUTES.HANDLER.LOGIN_GOOGLE, body, {
      baseUrl: ''
    }),
  sLoginGoogle: (body: LoginGoogleBodyType) =>
    http.post<LoginResponseType>(ROUTES.BACKEND.LOGIN_GOOGLE, body),
  sRegister: (body: RegisterBodyType) =>
    http.post<RegisterResponseType>(ROUTES.BACKEND.REGISTER, body),
  register: (body: RegisterBodyType) =>
    http.post<RegisterResponseType>(ROUTES.HANDLER.REGISTER, body, {
      baseUrl: ''
    }),
  sLogout: (accessToken: string, body: LogoutBodyType) =>
    http.put<LogoutResponseType>(ROUTES.BACKEND.LOGOUT, body, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }),
  logout: () =>
    http.put<LogoutResponseType>(ROUTES.HANDLER.LOGOUT, null, {
      baseUrl: ''
    }),
  sRefreshToken: (accessToken: string, refreshToken: string) =>
    http.post<LoginResponseType>(
      ROUTES.BACKEND.REFRESH_TOKEN,
      {
        refreshToken
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    ),
  changePassword: (body: UpdatePasswordType) => http.put(ROUTES.BACKEND.CHANGE_PASSWORD, body),

  // xử lý trường hợp duplicate request lúc reload page hoặc vào page lần đầu hay chuyển page
  async refreshToken() {
    if (this.refreshTokenRequest) return this.refreshTokenRequest
    this.refreshTokenRequest = http.post<LoginResponseType>(ROUTES.HANDLER.REFRESH_TOKEN, null, {
      baseUrl: ''
    })
    const result = await this.refreshTokenRequest
    this.refreshTokenRequest = null
    return result
  }
}

export default AuthService
