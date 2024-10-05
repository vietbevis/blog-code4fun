import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { LoginResponseType, UserFromToken } from '@/types/auth.type'

import { decodeToken } from '@/lib/utils'

interface AuthState {
  isAuth: boolean
  token: LoginResponseType['data'] | null
  user: UserFromToken | null
  login: (token: LoginResponseType['data']) => void
  logout: () => void
}

const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get) => ({
      isAuth: false,
      token: null,
      user: null,
      login: (token: LoginResponseType['data']) => {
        try {
          const decodedToken = decodeToken(token.accessToken)
          const user = decodedToken.user

          // Nếu token hợp lệ và có user, thiết lập trạng thái đăng nhập
          if (user) {
            set({ isAuth: true, token, user })
          } else {
            console.error('Invalid token structure')
          }
        } catch (error) {
          console.error('Login failed:', error)
          get().logout() // Logout nếu có lỗi trong quá trình xử lý token
        }
      },
      logout: () => set({ isAuth: false, token: null, user: null })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default useAuthStore
