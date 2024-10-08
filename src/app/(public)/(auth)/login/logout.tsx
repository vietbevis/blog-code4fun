'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, memo, useCallback, useEffect } from 'react'

import { useLogoutMutation } from '@/services/queries/auth.query'

import useAuthStore from '@/stores/auth.store'

import { useMounted } from '@/hooks/useMounted'

import { EKeyToken } from '@/constants/enum'
import ROUTES from '@/constants/route'

import Loading from '@/app/loading'

const getAccessTokenFromStore = () =>
  useAuthStore.getState().token?.accessToken || null

const getRefreshTokenFromStore = () =>
  useAuthStore.getState().token?.refreshToken || null

const LogoutComponent = () => {
  const { mutateAsync: logoutMutation } = useLogoutMutation()
  const router = useRouter()
  const { logout } = useAuthStore()
  const searchParams = useSearchParams()
  const accessTokenFromUrl = searchParams.get(EKeyToken.ACCESS_TOKEN)
  const refreshTokenFromUrl = searchParams.get(EKeyToken.REFRESH_TOKEN)
  const mounted = useMounted()

  const handleLogout = useCallback(async () => {
    const accessTokenInStore = getAccessTokenFromStore()
    const refreshTokenInStore = getRefreshTokenFromStore()

    if (
      mounted &&
      ((accessTokenFromUrl && accessTokenFromUrl === accessTokenInStore) ||
        (refreshTokenFromUrl && refreshTokenFromUrl === refreshTokenInStore))
    ) {
      try {
        console.log('Token matches, logging out...')
        await logoutMutation()
        logout()
      } catch (error) {
        console.error('Error during logout:', error)
      }
    } else if (
      accessTokenFromUrl !== accessTokenInStore ||
      refreshTokenFromUrl !== refreshTokenInStore
    ) {
      console.log(
        'Token mismatch or component not mounted, redirecting to home...'
      )
      router.push(ROUTES.HOME)
    }
  }, [
    accessTokenFromUrl,
    logout,
    logoutMutation,
    mounted,
    refreshTokenFromUrl,
    router
  ])

  useEffect(() => {
    handleLogout()
  }, [handleLogout])
  return null
}

const LogoutPage = memo(function LogoutInner() {
  return (
    <Suspense fallback={<Loading />}>
      <LogoutComponent />
    </Suspense>
  )
})

export default LogoutPage
