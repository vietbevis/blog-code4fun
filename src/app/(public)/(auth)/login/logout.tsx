'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

import { useLogoutMutation } from '@/services/queries/auth.query'

import useAuthStore from '@/stores/auth.store'

import { EKeyToken } from '@/constants/enum'
import ROUTES from '@/constants/route'

import Loading from '@/app/loading'

const LogoutComponent: React.FC = () => {
  const { mutate } = useLogoutMutation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { token } = useAuthStore()

  const tokenFromUrl = searchParams.get(EKeyToken.ACCESS_TOKEN)
  const { accessToken, refreshToken } = token || {}

  useEffect(() => {
    const performLogout = async () => {
      if (tokenFromUrl === accessToken || tokenFromUrl === refreshToken) {
        try {
          mutate()
          router.replace(ROUTES.LOGIN)
        } catch (error) {
          console.log('🚀 ~ file: logout.tsx:31 ~ performLogout ~ error:', error)
        }
      } else {
        router.replace(ROUTES.LOGIN)
      }
    }

    performLogout()
  }, [tokenFromUrl, accessToken, refreshToken, router, mutate])

  return null
}

const LogoutPage: React.FC = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <LogoutComponent />
    </React.Suspense>
  )
}

export default LogoutPage
