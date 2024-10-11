'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { useAccountMe } from '@/services/queries/account.query'
import { useLogoutMutation } from '@/services/queries/auth.query'

import ROUTES from '@/constants/route'

const AvatarDropdown = () => {
  const { data } = useAccountMe()
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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='rounded-full'>
        <Avatar>
          <AvatarImage
            src={`http://code4fun.xyz:9000/commons/${data?.profile.avatarUrl}`}
            alt='@shadcn'
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarDropdown
