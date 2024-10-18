'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import { Button } from '@/components/ui/button'

import { OAuthConfig } from '@/configs/OAuthConfig'

import { IconGoogle } from '../icons'

const LoginGoogleV2 = () => {
  const { redirectUri, authUri, clientId } = OAuthConfig
  const router = useRouter()

  const params = new URLSearchParams({
    redirect_uri: redirectUri,
    response_type: 'code',
    client_id: clientId,
    scope: 'openid email profile'
  })
  const googleLoginUrl = `${authUri}?${params.toString()}`

  return (
    <Button className={'mb-4 w-full gap-2'} onClick={() => router.push(googleLoginUrl)}>
      <IconGoogle size={28} />
      Login with Google
    </Button>
  )
}

export default LoginGoogleV2
