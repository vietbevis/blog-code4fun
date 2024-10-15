import Link from 'next/link'
import React from 'react'

import { ButtonFollow } from '@/components/buttons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { AccountType } from '@/types/auth.type'

import { checkImageURL } from '@/lib/utils'

import ProfileSocial from './ProfileSocial'

const CardAuthorDetailPost = ({ createdBy }: { createdBy: AccountType }) => {
  return (
    <Card className='space-y-4 shadow-none'>
      <CardHeader className='space-y-4 p-4 pb-0'>
        <CardTitle className={'flex items-center gap-3'}>
          <Link href={`/${createdBy.userName}`}>
            <Avatar className='size-10 ring-1 ring-slate-200 ring-offset-1'>
              <AvatarImage src={checkImageURL(createdBy.profile?.avatarUrl)} />
              <AvatarFallback className='text-sm'>
                {createdBy.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Link
            href={`/${createdBy.userName}`}
            className={'line-clamp-1 text-lg font-bold capitalize'}
          >
            {createdBy.name}
          </Link>
        </CardTitle>
        <ButtonFollow createdBy={createdBy} />
        {createdBy.profile?.bio && (
          <CardDescription className='line-clamp-5 pb-4'>{createdBy.profile?.bio}</CardDescription>
        )}
      </CardHeader>
      <ProfileSocial profile={createdBy} activeIcon={true} className='p-4 pt-0' />
    </Card>
  )
}

export default CardAuthorDetailPost
