'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { useLoginGoogleMutation } from '@/services/queries/auth.query'

import useAuthStore from '@/stores/auth.store'

import ROUTES from '@/constants/route'

import Loading from '@/app/loading'
import { getDeviceInfo } from '@/lib/utils'

function Authenticate({ searchParams }: { searchParams: any }) {
  const { deviceId, deviceType } = getDeviceInfo()
  const { mutateAsync } = useLoginGoogleMutation()
  const { login } = useAuthStore()
  const router = useRouter()

  const authCode: string = decodeURIComponent(searchParams?.code || '')

  const isInitialMount = useRef(false)

  useEffect(() => {
    if (!isInitialMount.current && authCode) {
      isInitialMount.current = true

      const data = {
        code: authCode,
        deviceInfo: {
          deviceId: deviceId,
          deviceType: deviceType
        }
      }

      mutateAsync(data)
        .then((res) => {
          login(res.payload)
          router.push(ROUTES.HOME)
          router.refresh()
        })
        .catch(() => {
          // Handle error, possibly redirect back to login or show error message
          isInitialMount.current = false // Allow retry on error
          router.push(ROUTES.LOGIN)
          router.refresh()
        })
    } else if (!authCode) {
      router.push(ROUTES.LOGIN)
      router.refresh()
    }
  }, [authCode, deviceId, deviceType, mutateAsync, login, router])

  return <Loading />
}

export default Authenticate
