import { notFound } from 'next/navigation'
import React from 'react'

import { ProfileSocial } from '@/components/author'
import { ButtonFollow } from '@/components/buttons'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import AccountService from '@/services/account.service'

import { AccountType } from '@/types/auth.type'

import { checkImageURL } from '@/lib/utils'

async function getUserDetails(username: string): Promise<AccountType> {
  const data = await AccountService.getUser(username)
  if (!data || !data.payload || !data.payload.details) {
    throw new Error('Failed to fetch user details')
  }
  return data.payload.details
}

const AuthorPage = async ({
  params,
  children
}: {
  params: { username: string }
  children: React.ReactNode
}) => {
  let user: AccountType
  try {
    user = await getUserDetails(params.username)
  } catch (error) {
    console.error('Error fetching data:', error)
    notFound()
  }

  return (
    <>
      <section className='rounded-b-lg border-b border-input bg-card px-4'>
        <div className='relative mx-auto w-full max-w-[1200px]'>
          <div className='absolute inset-x-0 top-0 h-36 w-full rounded-b-lg bg-input'></div>
          <div className='flex flex-1 flex-col items-center justify-between pb-5 md:flex-row md:items-end md:gap-6'>
            <Avatar className='group mx-auto mt-16 size-40 cursor-pointer bg-card ring-2 ring-input ring-offset-2 md:ml-16'>
              <AvatarImage
                src={checkImageURL(user.profile?.avatarUrl)}
                alt='avatar'
                className='object-cover'
              />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='flex flex-1 flex-col items-center gap-4 md:flex-row'>
              <div className='text-center md:text-left'>
                <h1 className='text-3xl font-bold text-primary'>{user.name}</h1>
                <p>@{user.userName}</p>
              </div>
              <div className='flex items-center gap-2 md:ml-auto md:mr-4'>
                <ButtonFollow createdBy={user} className='w-auto' />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className='mx-auto mt-4 flex w-full max-w-[1232px] flex-col items-start gap-4 md:flex-row md:px-4'>
        <div className='flex w-full shrink-0 flex-col gap-4 md:w-[28%]'>
          <div className='rounded-lg border border-input bg-card'>
            <h4 className='border-b border-input px-4 py-2 text-base font-bold'>Profile</h4>
            <ProfileSocial profile={user} className='p-4' />
          </div>
        </div>
        {children}
      </div>
    </>
  )
}

export default AuthorPage
