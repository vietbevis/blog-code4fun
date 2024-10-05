import React, { Suspense } from 'react'

import FormRegister from './FormRegister'

const page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <FormRegister />
    </Suspense>
  )
}

export default page
