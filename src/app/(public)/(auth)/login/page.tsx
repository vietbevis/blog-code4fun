import React, { Suspense } from 'react'

import FormLogin from './FormLogin'

const page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <FormLogin />
    </Suspense>
  )
}

export default page
