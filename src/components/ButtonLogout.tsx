'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import { useLogoutMutation } from '@/services/queries/auth.query'

import ROUTES from '@/constants/route'

import { Button } from './ui/button'

const ButtonLogout = ({ className }: { className?: string }) => {
  const { mutateAsync, isPending } = useLogoutMutation()
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await mutateAsync()
      router.push(ROUTES.HOME)
      router.refresh()
    } catch (error) {
      console.log('🚀 ~ file: ButtonLogout.tsx:11 ~ handleLogout ~ error:', error)
    }
  }
  return (
    <Button onClick={handleLogout} loading={isPending} className={className}>
      Logout
    </Button>
  )
}

export default ButtonLogout
