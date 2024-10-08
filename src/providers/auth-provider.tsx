'use client'

import React from 'react'

import TokenRefresher from '@/components/TokenRefresher'

const AuthProvider = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      {children}
      <TokenRefresher />
    </>
  )
}

export default AuthProvider
