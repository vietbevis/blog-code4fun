import Link from 'next/link'
import React from 'react'

import { AccountType } from '@/types/auth.type'

import { checkImageURL } from '@/lib/utils'

import { ProfileSocial } from '../author'
import { ButtonFollow } from '../buttons'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card'

const InfoHover = ({
  data,
  children,
  className
}: {
  data: AccountType
  children: React.ReactNode
  className?: string
}) => {
  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger className={className} asChild>
        <Link href={`/${data.userName}`}>{children}</Link>
      </HoverCardTrigger>
      <HoverCardContent
        align='start'
        className='relative flex min-w-72 max-w-96 flex-col gap-4 overflow-hidden shadow-lg'
      >
        <div className='absolute left-0 top-0 h-7 w-full bg-black'></div>
        <Link href={`/${data.userName}`} className='flex items-end gap-2'>
          <Avatar className='ring-1 ring-slate-200 ring-offset-1'>
            <AvatarImage src={checkImageURL(data.profile?.avatarUrl)} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h3 className='line-clamp-1 text-lg font-bold'>{data.name}</h3>
        </Link>
        <ButtonFollow createdBy={data} />
        <ProfileSocial profile={data} className='p-0' activeIcon={false} />
      </HoverCardContent>
    </HoverCard>
  )
}

export default InfoHover
