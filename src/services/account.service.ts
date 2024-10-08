import { AccountResponseType, ResponseMainType } from '@/types/auth.type'

import { UpdateProfileType } from '@/schemas/auth.schema'

import ROUTES from '@/constants/route'

import http from '@/lib/http'

const AccountService = {
  sGetAccount: (accessToken: string) =>
    http.get<AccountResponseType>(ROUTES.BACKEND.PROFILE, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }),
  getAccount: () => http.get<AccountResponseType>(ROUTES.BACKEND.PROFILE),
  followUser: (userId: string) =>
    http.put<ResponseMainType>(`${ROUTES.BACKEND.FOLLOW_USER}/${userId}`, null),
  getUser: (username: string) =>
    http.get<AccountResponseType>(`${ROUTES.BACKEND.GET_USER}/${username}`, {
      next: {
        tags: [username]
      }
    }),
  updateProfile: (data: UpdateProfileType) =>
    http.put<AccountResponseType>(ROUTES.BACKEND.UPDATE_PROFILE, data)
}

export default AccountService
