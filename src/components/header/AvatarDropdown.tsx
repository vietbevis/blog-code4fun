'use client'

import Link from 'next/link'
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

import { checkImageURL } from '@/lib/utils'

import Icon from '../ui/icon'

const menuDropdownUser = [
  // {
  //   id: "dashboard",
  //   label: "Dashboard",
  //   icons: <Icon name="LayoutDashboard" strokeWidth={2} />,
  //   url: "/dashboard",
  // },
  {
    id: 'create-post',
    label: 'Create post',
    icons: <Icon name='BadgePlus' strokeWidth={2} />,
    url: ROUTES.NEWS
  },
  {
    id: 'settings',
    label: 'Settings',
    icons: <Icon name='Settings' strokeWidth={2} />,
    url: ROUTES.PROFILE
  }
]

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
        <Avatar className='border border-input'>
          <AvatarImage src={checkImageURL(data?.profile.avatarUrl)} alt='avatar' />
          <AvatarFallback>{data?.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-72 p-2'>
        <DropdownMenuLabel>
          <Link href={ROUTES.PROFILE}>
            <p className='line-clamp-1 text-lg font-semibold'>{data?.name}</p>
            <p className='line-clamp-1 text-muted-foreground'>@{data?.userName}</p>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuDropdownUser.map((item) => (
          <Link href={item.url} key={item.id}>
            <DropdownMenuItem className='flex items-center gap-2'>
              {item.icons}
              {item.label}
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className='flex items-center gap-2'
        >
          <Icon name='LogOut' strokeWidth={2} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarDropdown
