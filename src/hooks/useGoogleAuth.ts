'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { useLoginGoogleMutation } from '@/services/queries/auth.query'

import { OAuthConfig } from '@/configs/OAuthConfig'

import useLoadingStore from '@/stores/loading'

import ROUTES from '@/constants/route'

import { getDeviceInfo } from '@/lib/utils'

/* eslint-disable react-hooks/exhaustive-deps */

export function useGoogleAuth() {
  const { isLoading, setIsLoading } = useLoadingStore()
  const router = useRouter()
  const { mutateAsync } = useLoginGoogleMutation()
  const { deviceId, deviceType } = getDeviceInfo()
  const popupRef = useRef<Window | null>(null)
  const checkPopupIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const clearCheckPopupInterval = useCallback(() => {
    if (checkPopupIntervalRef.current) {
      clearInterval(checkPopupIntervalRef.current)
      checkPopupIntervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      clearCheckPopupInterval()
    }
  }, [clearCheckPopupInterval])

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true)
    const { redirectUri, authUri, clientId } = OAuthConfig

    const params = new URLSearchParams({
      redirect_uri: redirectUri,
      response_type: 'code',
      client_id: clientId,
      scope: 'openid email profile'
    })
    const googleLoginUrl = `${authUri}?${params.toString()}`

    popupRef.current = openCenteredPopup(googleLoginUrl)

    if (popupRef.current) {
      const messageListener = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS' && event.data.code) {
          clearCheckPopupInterval()
          popupRef.current?.close()
          try {
            const data = {
              code: event.data.code,
              deviceInfo: { deviceId, deviceType }
            }
            await mutateAsync(data)
            router.push(ROUTES.HOME)
          } catch (error) {
            console.error('Authentication error:', error)
            toast.error('Đăng nhập thất bại', {
              description: 'Vui lòng thử lại sau.'
            })
          } finally {
            setIsLoading(false)
            window.removeEventListener('message', messageListener)
          }
        }
      }

      window.addEventListener('message', messageListener)

      checkPopupIntervalRef.current = setInterval(() => {
        if (popupRef.current?.closed) {
          clearCheckPopupInterval()
          setIsLoading(false)
          window.removeEventListener('message', messageListener)
          toast.info('Đăng nhập đã bị hủy', {
            description: 'Bạn đã đóng cửa sổ đăng nhập Google.'
          })
        }
      }, 1000)
    } else {
      setIsLoading(false)
      toast.error('Không thể mở cửa sổ đăng nhập', {
        description: 'Vui lòng kiểm tra cài đặt trình duyệt của bạn.'
      })
    }
  }, [router, mutateAsync, deviceId, deviceType, clearCheckPopupInterval])

  const cancelGoogleLogin = useCallback(() => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close()
    }
    clearCheckPopupInterval()
    setIsLoading(false)
    toast.info('Đăng nhập đã bị hủy', {
      description: 'Bạn đã hủy quá trình đăng nhập Google.'
    })
  }, [clearCheckPopupInterval])

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

  const popupRef = window.open(
    url,
    '_blank',
    `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
  )

  return popupRef
}
