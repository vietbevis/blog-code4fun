import React from 'react'

import FormLogin from './FormLogin'
import LogoutComponent from './logout'

const page = ({
  searchParams
}: {
  searchParams: {
    redirect?: string
    accessToken?: string
    refreshToken?: string
    [key: string]: string | undefined
  }
}) => {
  return (
    <>
      <FormLogin searchParams={searchParams} />
      <LogoutComponent searchParams={searchParams} />
    </>
  )
}

export default page
