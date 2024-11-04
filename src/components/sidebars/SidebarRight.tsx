'use client'

import Link from 'next/link'
import React from 'react'

import { useTopUsers } from '@/services/queries/account.query'

import { checkImageURL, cn } from '@/lib/utils'

import UnauthenicatedWrapper from '../UnauthenicatedWrapper'
import { IconBook } from '../icons'
import InfoHover from '../ui/InfoHover'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'

const SidebarRight = ({ className }: { className?: string }) => {
  const pinned = true
  const { data: users } = useTopUsers()
  return (
    <div
      className={cn(
        'flex h-auto flex-col space-y-2 overflow-y-auto transition-all duration-300 md:sticky md:left-0 md:space-y-4',
        pinned ? 'md:top-20' : 'md:top-4',
        pinned ? 'md:h-[calc(100dvh-6rem)]' : 'md:h-[calc(100dvh-2rem)]',
        className
      )}
    >
      <div className='flex items-center gap-2 rounded-lg border border-input bg-card p-4'>
        <div className='space-y-2'>
          <h3 className='text-lg font-medium'>Hi, everyone!</h3>
          <p className='text-sm text-muted-foreground'>Share your knowledge with the world</p>
          <UnauthenicatedWrapper>
            <Link href={'/news'} className='mt-2 inline-block'>
              <Button>Create Post</Button>
            </Link>
          </UnauthenicatedWrapper>
        </div>
        <IconBook className='size-20 shrink-0' />
      </div>
      <div className='flex flex-col gap-4 rounded-lg border border-input bg-card p-4'>
        <h3 className='pb-2 text-base font-bold'>People you might be interested</h3>
        {users?.slice(0, 5)?.map((user) => (
          <div key={user.userId} className='flex items-center gap-1 hover:bg-card'>
            <InfoHover data={user.userDetails}>
              <Avatar>
                <AvatarImage src={checkImageURL(user.userDetails.profile?.avatarUrl)} />
                <AvatarFallback>{user.userDetails.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </InfoHover>
            <div className='flex flex-col'>
              <InfoHover
                data={user.userDetails}
                className='cursor-pointer rounded-md px-1 hover:bg-background'
              >
                <h3 className='line-clamp-1 cursor-pointer text-base font-bold'>
                  {user.userDetails.name}
                </h3>
              </InfoHover>
              <span className='px-1 text-xs text-muted-foreground'>
                {user.postCount} posts, {user.totalFavorites} likes
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SidebarRight
