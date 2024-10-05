import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import AuthService from '../auth.service'

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      toast.success(data.payload.message)
      queryClient.refetchQueries({ queryKey: ['account-me'] })
      // queryClient.invalidateQueries({ queryKey: ["account-me"] });
    }
  })
}

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: AuthService.register,
    onSuccess: (data) => {
      toast.success(data.payload.message)
    }
  })
}
