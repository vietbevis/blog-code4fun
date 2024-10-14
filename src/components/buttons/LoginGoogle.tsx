import Link from 'next/link'

import { IconGoogle } from '@/components/icons'
import { buttonVariants } from '@/components/ui/button'

import { OAuthConfig } from '@/configs/OAuthConfig'

import { cn } from '@/lib/utils'

export default function LoginGoogle() {
  const { redirectUri, authUri, clientId } = OAuthConfig

  const params = new URLSearchParams({
    redirect_uri: redirectUri,
    response_type: 'code',
    client_id: clientId,
    scope: 'openid email profile'
  })

  const googleLoginUrl = `${authUri}?${params.toString()}`

  return (
    <Link href={googleLoginUrl} className={cn(buttonVariants(), 'w-full gap-2')}>
      <IconGoogle size={28} />
      Login with Google
    </Link>
  )
}
