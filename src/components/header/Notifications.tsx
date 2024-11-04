'use client'

import Link from 'next/link'
import React, { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useNotifications } from '@/services/queries/account.query'

import { NotificationType } from '@/types/auth.type'

import { ENotification } from '@/constants/enum'

import { useFormatDate } from '@/lib/format'
import { checkImageURL } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import Icon from '../ui/icon'

const Notifications = React.memo(() => {
  const { data, isPending } = useNotifications()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='rounded-full' asChild>
        <Button className='relative shrink-0 rounded-full' size={'icon'} variant={'outline'}>
          <Icon name='Bell' />
          {data && data.length > 0 && (
            <span className='absolute -right-0 -top-0 flex size-2'>
              <span className='absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75'></span>
              <span className='relative inline-flex size-2 rounded-full bg-red-500'></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='max-h-[30rem] w-[28rem] overflow-y-auto p-2'>
        <DropdownMenuLabel className='text-base font-bold'>
          Notifications ({data?.length})
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isPending && (
          <DropdownMenuItem className='justify-center py-4 text-center' disabled>
            Loading...
          </DropdownMenuItem>
        )}
        {data?.length === 0 && !isPending && (
          <DropdownMenuItem className='justify-center py-4 text-center' disabled>
            No new notifications
          </DropdownMenuItem>
        )}
        <div className='mt-2 flex flex-col gap-2'>
          {data?.map((notification) => (
            <CardNotifications key={uuidv4()} notification={notification} />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

Notifications.displayName = 'Notifications'

export default Notifications

const getDescriptionAndLink = (notification: NotificationType) => {
  switch (notification.notificationType) {
    case ENotification.NEW_POST:
      return {
        description: 'just posted a new post',
        link: `/${notification.data.userName}/${notification.data.postSlug}`
      }
    default:
      return {
        description: '',
        link: '#'
      }
  }
}

const CardNotifications = React.memo(({ notification }: { notification: NotificationType }) => {
  const { description, link } = useMemo(() => getDescriptionAndLink(notification), [notification])
  const date = useFormatDate(notification.data.createdDate)

  return (
    <Link href={link}>
      <DropdownMenuItem className='gap-2'>
        <Avatar className='size-12 border border-input'>
          <AvatarImage src={checkImageURL(notification.data?.userAvatar)} alt='avatar' />
          <AvatarFallback>{notification.data.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className='line-clamp-2 overflow-hidden text-base'>
            <strong>{notification.data.name} </strong>
            <span>{description} </span>
            <strong>{notification.data.postTitle}</strong>
          </p>
          <p className='text-sm text-blue-500'>{date}</p>
        </div>
      </DropdownMenuItem>
    </Link>
  )
})

CardNotifications.displayName = 'CardNotifications'
