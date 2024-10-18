'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { useLoginGoogleMutation } from '@/services/queries/auth.query'

import { OAuthConfig } from '@/configs/OAuthConfig'

import ROUTES from '@/constants/route'

import { getDeviceInfo } from '@/lib/utils'

type GoogleAuthState = {
  isLoading: boolean
  isPopupOpen: boolean
}

export function useGoogleAuth() {
  const router = useRouter()
  const { mutateAsync, isPending } = useLoginGoogleMutation(() => {})
  const { deviceId, deviceType } = getDeviceInfo()
  const [state, setState] = useState<GoogleAuthState>({ isLoading: false, isPopupOpen: false })

  const popupRef = useRef<Window | null>(null)
  const checkPopupIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const messageListenerRef = useRef<((event: MessageEvent) => void) | null>(null)

  const cleanup = useCallback(() => {
    if (checkPopupIntervalRef.current) {
      clearInterval(checkPopupIntervalRef.current)
      checkPopupIntervalRef.current = null
    }

    if (messageListenerRef.current) {
      window.removeEventListener('message', messageListenerRef.current)
      messageListenerRef.current = null
    }

    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close()
    }
    popupRef.current = null

    setState((prevState) => ({ ...prevState, isPopupOpen: false, isLoading: false }))
  }, [])

  useEffect(() => cleanup, [cleanup])

  const handleGoogleLogin = useCallback(() => {
    if (state.isPopupOpen) {
      toast.error('Một cửa sổ đăng nhập đã được mở', {
        description: 'Vui lòng đóng cửa sổ hiện tại trước khi thử lại.'
      })
      return
    }

    setState({ isLoading: true, isPopupOpen: true })
    const { redirectUri, authUri, clientId } = OAuthConfig

    const params = new URLSearchParams({
      redirect_uri: redirectUri,
      response_type: 'code',
      client_id: clientId,
      scope: 'openid email profile'
    })
    const googleLoginUrl = `${authUri}?${params.toString()}`

    cleanup()

    popupRef.current = openCenteredPopup(googleLoginUrl)

    if (popupRef.current) {
      messageListenerRef.current = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === 'GOOGLE_AUTH_SUCCESS' && event.data.code) {
          cleanup()
          try {
            await mutateAsync({ code: event.data.code, deviceInfo: { deviceId, deviceType } })
            router.replace(ROUTES.HOME)
          } catch (error) {
            console.error('Google login error:', error)
            toast.error('Đăng nhập thất bại', {
              description: 'Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.'
            })
          }
        }
      }

      window.addEventListener('message', messageListenerRef.current)

      checkPopupIntervalRef.current = setInterval(() => {
        if (popupRef.current?.closed && !isPending) {
          cleanup()
          toast.info('Đăng nhập đã bị hủy 1', {
            description: 'Bạn đã đóng cửa sổ đăng nhập Google.'
          })
        }
      }, 500)

      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (state.isPopupOpen) {
          e.preventDefault()
          e.returnValue = ''
        }
      }
      window.addEventListener('beforeunload', handleBeforeUnload)

      return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    } else {
      setState((prevState) => ({ ...prevState, isLoading: false, isPopupOpen: false }))
      toast.error('Không thể mở cửa sổ đăng nhập', {
        description: 'Vui lòng kiểm tra cài đặt trình duyệt của bạn.'
      })
    }
  }, [cleanup, deviceId, deviceType, isPending, mutateAsync, router, state.isPopupOpen])

  const cancelGoogleLogin = useCallback(() => {
    cleanup()
    toast.info('Đăng nhập đã bị hủy 2', {
      description: 'Bạn đã đóng cửa sổ đăng nhập Google.'
    })
  }, [cleanup])

  return {
    handleGoogleLogin,
    cancelGoogleLogin,
    isLoading: state.isLoading,
    isPopupOpen: state.isPopupOpen
  }
}

const openCenteredPopup = (url: string): Window | null => {
  const width = 500
  const height = 600
  const screenLeft = window.screenLeft ?? window.screenX
  const screenTop = window.screenTop ?? window.screenY
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
