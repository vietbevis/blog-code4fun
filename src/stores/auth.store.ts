import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { LoginResponseType, RoleType } from '@/types/auth.type'

import { decodeToken } from '@/lib/utils'

interface AuthState {
  isAuth: boolean
  token: LoginResponseType | null
  roles: RoleType[]
  login: (token: LoginResponseType) => void
  logout: () => void
}

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      isAuth: false,
      token: null,
      roles: [],
      login: (token: LoginResponseType) => {
        const decodedToken = decodeToken(token.accessToken)
        set({ isAuth: true, token, roles: decodedToken.roles })
      },
      logout: () => set({ isAuth: false, token: null, roles: [] })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default useAuthStore
