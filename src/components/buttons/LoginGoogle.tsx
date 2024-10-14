import { Button } from '@/components/ui/button'

import { useGoogleAuth } from '@/hooks/useGoogleAuth'

import { IconGoogle } from '../icons'

export default function LoginGoogle() {
  const { handleGoogleLogin, cancelGoogleLogin, isLoading } = useGoogleAuth()

  return (
    <Button onClick={isLoading ? cancelGoogleLogin : handleGoogleLogin} className='w-full'>
      {isLoading ? (
        'Cancel...'
      ) : (
        <>
          <IconGoogle size={28} />
          Login with Google
        </>
      )}
    </Button>
  )
}
