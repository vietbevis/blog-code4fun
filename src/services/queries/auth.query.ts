import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import useAuthStore from '@/stores/auth.store'

import { EKeyQuery } from '@/constants/enum'
import ROUTES from '@/constants/route'

import AuthService from '../auth.service'

export const useLoginMutation = () => {
  const login = useAuthStore((state) => state.login)
  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      login(data.payload)
      toast.success('Login successfully!')
    }
  })
}

export const useRegisterMutation = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: AuthService.register,
    onSuccess: () => {
      router.push(ROUTES.LOGIN)
      toast.success('Register successfully!', {
        description: 'Please check your email to verify your account'
      })
    }
  })
}

export const useLogoutMutation = () => {
  const { logout } = useAuthStore()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      logout()
      queryClient.removeQueries({ queryKey: [EKeyQuery.ACCOUNT_ME] })
      toast.success('Logout successfully!')
    }
  })
}

export const useLoginGoogleMutation = (onSuccess?: () => void) => {
  const login = useAuthStore((state) => state.login)
  return useMutation({
    mutationFn: AuthService.loginGoogle,
    onSuccess: (data) => {
      login(data.payload)
      if (onSuccess) {
        onSuccess()
      }
      toast.success('Login successfully!')
    }
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: AuthService.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully')
    }
  })
}
