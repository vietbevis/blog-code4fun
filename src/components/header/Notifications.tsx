'use client'

import Link from 'next/link'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useNotifications } from '@/services/queries/account.query'

import { NotificationType } from '@/types/auth.type'

import { ENotification } from '@/constants/enum'

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

const Notifications = () => {
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
      <DropdownMenuContent align='end' className='max-h-[30rem] w-96 overflow-y-auto p-2'>
        <DropdownMenuLabel>Notifications ({data?.length})</DropdownMenuLabel>
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
        {data?.map((notification) => (
          <CardNotifications key={uuidv4()} notification={notification} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Notifications

const getDescriptionAndLink = (notification: NotificationType) => {
  switch (notification.notificationType) {
    case ENotification.NEW_POST:
      return {
        description: 'just posted a new post',
        link: `/${notification.data.userName}/${notification.data.postSlug}`
      }
  }
}

const CardNotifications = ({ notification }: { notification: NotificationType }) => {
  const { description, link } = getDescriptionAndLink(notification)
  return (
    <Link href={link}>
      <DropdownMenuItem key={uuidv4()} className='block'>
        <strong>{notification.data.name} </strong>
        <span>{description} </span>
        <strong>{notification.data.postTitle}</strong>
      </DropdownMenuItem>
    </Link>
  )
}
