import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import useAuthStore from '@/stores/auth.store'

import { AccountResponseType } from '@/types/auth.type'

import { EKeyQuery } from '@/constants/enum'

import AccountService from '../account.service'
import AuthService from '../auth.service'
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

export const useAccountUser = (username: string) => {
  return useQuery({
    queryKey: [EKeyQuery.ACCOUNT_USER, username],
    queryFn: () => AccountService.getUser(username),
    select: (data) => data.payload.details
  })
}

export const useNotifications = () => {
  const { data } = useAccountMe()
  const userId = data?.id || ''
  return useQuery({
    queryKey: [EKeyQuery.NOTIFICATIONS],
    queryFn: () => AccountService.getNotifications(userId),
    enabled: !!userId,
    select: (data) => data.payload.details,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 5 // 5s re new data
  })
}

export const useNotificationTokenMutation = () => {
  return useMutation({
    mutationFn: AuthService.tokenNotifications
  })
}

export const useTopUsers = () => {
  return useQuery({
    queryKey: [EKeyQuery.TOP_USERS],
    queryFn: () => AccountService.getTopUsers(),
    select: (data) => data.payload.details
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: AccountService.updateProfile,
    onSuccess: async (data) => {
      const queryKey: QueryKey = [EKeyQuery.ACCOUNT_ME]

      await queryClient.cancelQueries({ queryKey })

      queryClient.setQueryData(queryKey, data)

      queryClient.invalidateQueries({
        queryKey
      })

      await Promise.all([
        revalidateApiRequest(EKeyQuery.ACCOUNT_ME),
        revalidateApiRequest(data.payload.details.userName)
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

export const useFollowUser = ({ username }: { username: string }) => {
  const queryClient = useQueryClient()
  const queryKey: QueryKey = [EKeyQuery.ACCOUNT_USER, username]
  return useMutation({
    mutationFn: AccountService.followUser,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
      const previousState = queryClient.getQueryData<{
        status: number
        payload: AccountResponseType
      }>(queryKey)
      queryClient.setQueryData(queryKey, () => {
        if (!previousState) return previousState
        return {
          ...previousState,
          payload: {
            ...previousState.payload,
            details: {
              ...previousState.payload.details,
              followType:
                previousState.payload.details.followType === 'FOLLOW' ? 'UNFOLLOW' : 'FOLLOW'
            }
          }
        }
      })
      return { previousState }
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousState)
      toast.error('Error', {
        description: error.message
      })
    }
  })
}
