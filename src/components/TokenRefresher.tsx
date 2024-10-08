'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import useAuthStore from '@/stores/auth.store'

import ROUTES from '@/constants/route'

import { checkAndRefreshToken } from '@/lib/utils'

const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token']

export default function TokenRefresher() {
  const accessToken = useAuthStore((state) => state.token?.accessToken)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return
    let interval: any = null
    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
    const onRefreshToken = (force?: boolean) => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval)
          router.push(ROUTES.LOGIN)
        },
        force
      })
    }

    onRefreshToken()

    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn access token là 10s thì 1s mình sẽ cho check 1 lần
    const TIMEOUT = 1000
    interval = setInterval(onRefreshToken, TIMEOUT)

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [accessToken, pathname, router])

  return null
}
