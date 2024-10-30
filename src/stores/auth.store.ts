import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import AuthService from '@/services/auth.service'

import { LoginResponseType, RoleType } from '@/types/auth.type'

import { decodeToken } from '@/lib/decodeToken'

interface AuthState {
  isAuth: boolean
  userId: string | null
  token: LoginResponseType | null
  roles: RoleType[]
  login: (token: LoginResponseType, fcmToken: string | null) => Promise<void>
  logout: () => void
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist<AuthState>(
      (set) => ({
        isAuth: false,
        userId: null,
        token: null,
        roles: [],
        login: async (token: LoginResponseType, fcmToken: string | null) => {
          const decodedToken = decodeToken(token.accessToken)
          set({ isAuth: true, token, roles: decodedToken.roles, userId: decodedToken.userId })
          try {
            if (fcmToken) {
              await AuthService.tokenNotifications({
                deviceToken: fcmToken,
                userId: decodedToken.userId
              })
            }
          } catch (error) {
            console.log('🚀 ~ file: auth.store.ts:43 ~ login: ~ error:', error)
          }
        },
        logout: () => set({ isAuth: false, token: null, roles: [], userId: null })
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage)
      }
    )
  )
)

export default useAuthStore
