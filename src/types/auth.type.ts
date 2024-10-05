import { ERole } from '@/constants/enum'

export interface ResponseType {
  status: number
  message: string
  timestamp: string
  data?: unknown
  errors?: unknown
}

export interface EntityErrorPayload extends ResponseType {
  errors: {
    field: string
    message: string
  }[]
}

export interface LoginResponseType extends ResponseType {
  data: {
    accessToken: string
    refreshToken: string
    clientId: string
  }
}

export interface User {
  _id: string
  fullName: string
  email: string
}

export interface UserResponseType extends ResponseType {
  data: User
}

export interface TokenPayload {
  user: UserFromToken
  iat: number
  exp: number
}

export interface UserFromToken {
  _id: string
  email: string
  roles: ERole[]
}
