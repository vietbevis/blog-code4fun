'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { useLoginGoogleMutation } from '@/services/queries/auth.query'

import { OAuthConfig } from '@/configs/OAuthConfig'

import useLoadingStore from '@/stores/loading'

import ROUTES from '@/constants/route'

import { getDeviceInfo } from '@/lib/utils'

export function useGoogleAuth() {
  const { isLoading, setIsLoading } = useLoadingStore()
  const router = useRouter()
  const { mutateAsync } = useLoginGoogleMutation()
  const { deviceId, deviceType } = getDeviceInfo()
  const popupRef = useRef<Window | null>(null)
  const checkPopupIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const messageListenerRef = useRef<((event: MessageEvent) => void) | null>(null)

  const clearCheckPopupInterval = useCallback(() => {
    if (checkPopupIntervalRef.current) {
      clearInterval(checkPopupIntervalRef.current)
      checkPopupIntervalRef.current = null
    }
  }, [])

  const removeMessageListener = useCallback(() => {
    if (messageListenerRef.current) {
      window.removeEventListener('message', messageListenerRef.current)
      messageListenerRef.current = null
    }
  }, [])

  const cleanup = useCallback(() => {
    clearCheckPopupInterval()
    removeMessageListener()
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close()
    }
    popupRef.current = null
  }, [clearCheckPopupInterval, removeMessageListener])

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  const handleGoogleLogin = useCallback(() => {
    setIsLoading(true)
    const { redirectUri, authUri, clientId } = OAuthConfig

    const params = new URLSearchParams({
      redirect_uri: redirectUri,
      response_type: 'code',
      client_id: clientId,
      scope: 'openid email profile'
    })
    const googleLoginUrl = `${authUri}?${params.toString()}`

    cleanup() // Ensure any previous state is cleared

    popupRef.current = openCenteredPopup(googleLoginUrl)

    if (popupRef.current) {
      messageListenerRef.current = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS' && event.data.code) {
          cleanup()
          const data = {
            code: event.data.code,
            deviceInfo: { deviceId, deviceType }
          }
          try {
            await mutateAsync(data)
            router.replace(ROUTES.HOME)
            setIsLoading(false)
          } catch (error) {
            setIsLoading(false)
            console.log(
              '🚀 ~ file: useGoogleAuth.ts:84 ~ messageListenerRef.current= ~ error:',
              error
            )
          }
        }
      }

      window.addEventListener('message', messageListenerRef.current)

      checkPopupIntervalRef.current = setInterval(() => {
        if (popupRef.current?.closed) {
          cleanup()
          toast.info('Đăng nhập đã bị hủy', {
            description: 'Bạn đã đóng cửa sổ đăng nhập Google.'
          })
        }
      }, 500)
    } else {
      setIsLoading(false)
      toast.error('Không thể mở cửa sổ đăng nhập', {
        description: 'Vui lòng kiểm tra cài đặt trình duyệt của bạn.'
      })
    }
  }, [cleanup, deviceId, deviceType, mutateAsync, router, setIsLoading])

  const cancelGoogleLogin = useCallback(() => {
    cleanup()
    toast.info('Đăng nhập đã bị hủy', {
      description: 'Bạn đã đóng cửa sổ đăng nhập Google.'
    })
    setIsLoading(false)
  }, [cleanup, setIsLoading])

  return { handleGoogleLogin, cancelGoogleLogin, isLoading }
}

const openCenteredPopup = (url: string) => {
  const width = 500
  const height = 600
  const screenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX
  const screenTop = window.screenTop !== undefined ? window.screenTop : window.screenY
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || screen.width
  const screenHeight = window.innerHeight || document.documentElement.clientHeight || screen.height
  const left = screenLeft + (screenWidth - width) / 2
  const top = screenTop + (screenHeight - height) / 2

  return window.open(
    url,
    '_blank',
    `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
  )
}
