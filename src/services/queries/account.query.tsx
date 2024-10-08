import { useQuery } from '@tanstack/react-query'

import useAuthStore from '@/stores/auth.store'

import { EKeyQuery } from '@/constants/enum'

import AccountService from '../account.service'

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
