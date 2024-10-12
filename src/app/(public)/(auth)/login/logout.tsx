'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useLogoutMutation } from '@/services/queries/auth.query'

import useAuthStore from '@/stores/auth.store'

import ROUTES from '@/constants/route'

const LogoutComponent = ({
  searchParams
}: {
  searchParams: {
    redirect?: string
    accessToken?: string
    refreshToken?: string
    [key: string]: string | undefined
  }
}) => {
  const { mutate } = useLogoutMutation()
  const router = useRouter()
  const { token } = useAuthStore()

  const tokenFromUrl = searchParams.accessToken || null
  const { accessToken, refreshToken } = token || {}

  useEffect(() => {
    const performLogout = async () => {
      if (tokenFromUrl === accessToken || tokenFromUrl === refreshToken) {
        try {
          mutate()
          location.reload()
        } catch (error) {
          console.log('🚀 ~ file: logout.tsx:31 ~ performLogout ~ error:', error)
        }
      } else {
        if (!searchParams.redirect) {
          router.replace(ROUTES.LOGIN)
        }
      }
    }

    performLogout()
  }, [tokenFromUrl, accessToken, refreshToken, router, mutate, searchParams.redirect])

  return null
}

export default LogoutComponent
