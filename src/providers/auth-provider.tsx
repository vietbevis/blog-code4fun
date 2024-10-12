'use client'

import React from 'react'

import TokenRefresher from '@/components/TokenRefresher'
import CustomDialog from '@/components/custom-dialog'

const AuthProvider = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      {children}
      <TokenRefresher />
      <CustomDialog />
    </>
  )
}

export default AuthProvider
