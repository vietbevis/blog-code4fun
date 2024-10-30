import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import useAuthStore from '@/stores/auth.store'

import useFcmToken from '@/hooks/useFcmToken'

import { EKeyQuery } from '@/constants/enum'
import ROUTES from '@/constants/route'

import AuthService from '../auth.service'

export const useLoginMutation = () => {
  const login = useAuthStore((state) => state.login)
  const { token } = useFcmToken()
  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: async (data) => {
      login(data.payload, token)
      toast.success('Login successfully!')
    }
  })
}

export const useNotificationTokenMutation = () => {
  return useMutation({
    mutationFn: AuthService.tokenNotifications
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
  const { token } = useFcmToken()
  return useMutation({
    mutationFn: AuthService.loginGoogle,
    onSuccess: (data) => {
      login(data.payload, token)
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
