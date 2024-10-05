import { LoginResponseType, ResponseType } from '@/types/auth.type'

import { LoginBodyType, RegisterBodyType } from '@/schemas'

import ROUTES from '@/constants/route'

import http from '@/lib/http'

const AuthService = {
  sLogin: (body: LoginBodyType) =>
    http.post<LoginResponseType>(ROUTES.BACKEND.LOGIN, body),
  login: (body: LoginBodyType) =>
    http.post<LoginResponseType>(ROUTES.HANDLER.LOGIN, body, {
      baseUrl: ''
    }),
  sRegister: (body: RegisterBodyType) =>
    http.post<ResponseType>(ROUTES.BACKEND.REGISTER, body),
  register: (body: RegisterBodyType) =>
    http.post<ResponseType>(ROUTES.HANDLER.REGISTER, body, {
      baseUrl: ''
    })
}

export default AuthService
