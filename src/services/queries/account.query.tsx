import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import useAuthStore from '@/stores/auth.store'

import { EKeyQuery } from '@/constants/enum'

import AccountService from '../account.service'
import revalidateApiRequest from '../revalidate'

export const useAccountMe = () => {
  const { isAuth } = useAuthStore()
  return useQuery({
    queryKey: [EKeyQuery.ACCOUNT_ME],
    queryFn: AccountService.getAccount,
    enabled: !!isAuth,
    select: (data) => data.payload.details,
    refetchOnMount: false,
    retry: false
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: AccountService.updateProfile,
    onSuccess: async (data) => {
      const queryKey: QueryKey = ['account-me']

      await queryClient.cancelQueries({ queryKey })

      queryClient.setQueryData(queryKey, data)

      queryClient.invalidateQueries({
        queryKey
      })

      await Promise.all([
        // revalidateApiRequest('posts-feed'),
        revalidateApiRequest(EKeyQuery.ACCOUNT_ME)
        // revalidateApiRequest(data.payload.details.userName)
      ])
      toast.success('Profile updated successfully.')
    },
    onError: (error: any) => {
      toast.error('Error', {
        description: error.message
      })
    }
  })
}
