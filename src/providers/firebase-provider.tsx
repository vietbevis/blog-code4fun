'use client'

import { Unsubscribe, onMessage } from 'firebase/messaging'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import envConfig from '@/configs/envConfig'
import { fetchToken, messaging } from '@/configs/firebaseConfig'

import useAuthStore from '@/stores/auth.store'

import { EKeyQuery } from '@/constants/enum'

import { getQueryClient } from '@/lib/getQueryClient'

/* eslint-disable react-hooks/exhaustive-deps */

async function getNotificationPermissionAndToken() {
  // Step 1: Check if Notifications are supported in the browser.
  if (!('Notification' in window)) {
    console.info('This browser does not support desktop notification')
    return null
  }

  // Step 2: Check if permission is already granted.
  if (Notification.permission === 'granted') {
    return await fetchToken()
  }

  // Step 3: If permission is not denied, request permission from the user.
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      return await fetchToken()
    }
  }

  return null
}

const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const retryLoadToken = useRef(0)
  const isLoading = useRef(false)
  const setTokenNotifications = useAuthStore((state) => state.setTokenNotifications)
  const queryClient = getQueryClient()

  const loadToken = async () => {
    if (isLoading.current) return

    isLoading.current = true
    const token = await getNotificationPermissionAndToken()

    if (Notification.permission === 'denied') {
      console.info(
        '%cPush Notifications issue - permission denied',
        'color: green; background: #c7c7c7; padding: 8px; font-size: 20px'
      )
      isLoading.current = false
      return
    }

    if (!token) {
      if (retryLoadToken.current >= 3) {
        // alert('Unable to load token, refresh the browser')
        console.info(
          '%cPush Notifications issue - unable to load token after 3 retries',
          'color: green; background: #c7c7c7; padding: 8px; font-size: 20px'
        )
        isLoading.current = false
        return
      }

      retryLoadToken.current += 1
      console.error('An error occurred while retrieving token. Retrying...')
      isLoading.current = false
      await loadToken()
      return
    }

    setToken(token)
    setTokenNotifications(token)
    isLoading.current = false
  }

  useEffect(() => {
    if ('Notification' in window) {
      loadToken()
    }
  }, [])

  useEffect(() => {}, [token])

  useEffect(() => {
    const setupListener = async () => {
      if (!token) return

      const m = await messaging()
      if (!m) return

      const unsubscribe = onMessage(m, async (payload) => {
        if (Notification.permission !== 'granted') return

        await queryClient.invalidateQueries({ queryKey: [EKeyQuery.NOTIFICATIONS] })

        const userName = payload.data?.userName
        const postSlug = payload.data?.postSlug

        const link = `${envConfig.NEXT_PUBLIC_API_URL}/${userName}/${postSlug}`

        if (link) {
          toast.info(
            `${payload.notification?.title || payload.notification?.body || 'New message'}`,
            {
              action: {
                label: 'Visit',
                onClick: () => router.push(link)
              },
              position: 'top-right'
            }
          )
        } else {
          toast.info(
            `${payload.notification?.title || payload.notification?.body || 'New message'}`,
            {
              position: 'top-right'
            }
          )
        }

        // --------------------------------------------
        // Disable this if you only want toast notifications.
        // const n = new Notification(payload.notification?.title || 'New message', {
        //   body: payload.notification?.body || 'This is a new message',
        //   data: { url: `${envConfig.NEXT_PUBLIC_API_URL}/${userName}/${postSlug}` }
        // })

        // n.onclick = (event) => {
        //   event.preventDefault()
        //   // const link = (event.target as any)?.data?.url
        //   if (link) {
        //     router.push(link)
        //   } else {
        //     console.log('No link found in the notification payload')
        //   }
        // }
      })

      return unsubscribe
    }

    let unsubscribe: Unsubscribe | null = null

    setupListener().then((unsub) => {
      if (unsub) {
        unsubscribe = unsub
      }
    })

    // Step 11: Cleanup the listener when the component unmounts.
    return () => unsubscribe?.()
  }, [token, router, toast])

  return children
}

export default FirebaseProvider
