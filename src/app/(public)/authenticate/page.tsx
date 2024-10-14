/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { useLoginGoogleMutation } from '@/services/queries/auth.query'

import ROUTES from '@/constants/route'

import Loading from '@/app/loading'
import { getDeviceInfo } from '@/lib/utils'

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react-hooks/exhaustive-deps */

export default function Authenticate({ searchParams }: { searchParams: { code?: string } }) {
  const { deviceId, deviceType } = getDeviceInfo()
  const { mutateAsync } = useLoginGoogleMutation()
  const router = useRouter()
  const isAuthenticating = useRef(false)

  useEffect(() => {
    const authCode = searchParams?.code

    if (!authCode) {
      router.replace(ROUTES.LOGIN)
      return
    }

    const handleAuthentication = async () => {
      if (isAuthenticating.current) return
      isAuthenticating.current = true

      try {
        const data = {
          code: authCode,
          deviceInfo: { deviceId, deviceType }
        }

        await mutateAsync(data)
        router.replace(ROUTES.HOME)
      } catch (error) {
        console.error('Authentication error:', error)
        toast.error('Đăng nhập thất bại', {
          description: 'Vui lòng thử lại sau.'
        })
        router.replace(ROUTES.LOGIN)
      } finally {
        isAuthenticating.current = false
      }
    }

    handleAuthentication()
  }, [searchParams?.code])

  return <Loading />
}
