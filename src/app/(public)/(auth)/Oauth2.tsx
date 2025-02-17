import React from 'react'

import LoginGoogleV2 from '@/components/buttons/LoginGoogleV2'

const Oauth2 = () => {
  return (
    <>
      <div className='flex items-center justify-center gap-2'>
        <LoginGoogleV2 />
        {/* <Button className='w-full'>Github</Button> */}
      </div>
      <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
        <div className='h-px w-full bg-muted-foreground'></div>
        <p className='shrink-0 uppercase'>Or continue with</p>
        <div className='h-px w-full bg-muted-foreground'></div>
      </div>
    </>
  )
}

export default Oauth2
