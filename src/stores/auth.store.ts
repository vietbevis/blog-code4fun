import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import { LoginResponseType, RoleType } from '@/types/auth.type'

import { decodeToken } from '@/lib/decodeToken'

interface AuthState {
  isAuth: boolean
  userId: string | null
  token: LoginResponseType | null
  roles: RoleType[]
  login: (token: LoginResponseType) => void
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
        login: (token: LoginResponseType) => {
          const decodedToken = decodeToken(token.accessToken)
          set({ isAuth: true, token, roles: decodedToken.roles, userId: decodedToken.userId })
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
