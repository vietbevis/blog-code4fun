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
  tokenNotifications: string | null
  login: (token: LoginResponseType) => Promise<void>
  logout: () => void
  setTokenNotifications: (token: string) => void
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist<AuthState>(
      (set, get) => ({
        isAuth: false,
        userId: null,
        token: null,
        tokenNotifications: null,
        roles: [],
        setTokenNotifications: (token) => set({ tokenNotifications: token }),
        login: async (token: LoginResponseType) => {
          const decodedToken = decodeToken(token.accessToken)
          set({ isAuth: true, token, roles: decodedToken.roles, userId: decodedToken.userId })
          const tokenNotifications = get().tokenNotifications
          try {
            if (tokenNotifications !== null) {
              await AuthService.tokenNotifications({
                deviceToken: tokenNotifications,
                userId: decodedToken.userId
              })
            }
          } catch (error) {}
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
